"""
Threshold Service for VAYA Authorize (Module D).
Tracks de minimis threshold (50 tonnes) and determines ACD authorization requirement.
"""

from typing import Optional, List, Dict, Any, Tuple
from datetime import datetime, date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from decimal import Decimal

from app.models.document import CBAMReport
from app.models.authorization import ImportThresholdTracking, ThresholdStatus
from app.models.hs_code import CNCode, CBAMCategory


# De minimis threshold constants
DE_MINIMIS_THRESHOLD = 50.0  # tonnes per quarter
ALERT_THRESHOLD_YELLOW = 40.0  # 80% of limit
ALERT_THRESHOLD_ORANGE = 47.0  # 94% of limit

# Commodities always requiring authorization
ALWAYS_REQUIRE_ACD = [
    CBAMCategory.ELECTRICITY,
    CBAMCategory.HYDROGEN,
]


class ThresholdService:
    """Service for tracking de minimis threshold and eligibility."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def check_eligibility(
        self,
        user_id: str,
        organization_id: Optional[str] = None,
        include_projections: bool = True
    ) -> Dict[str, Any]:
        """
        Check if user needs ACD authorization.
        
        Returns:
            Dict with eligibility status, threshold info, and recommendations.
        """
        # Get current quarter
        current_quarter = self._get_current_quarter()
        
        # Get quarterly import data
        quarterly_data = await self._get_quarterly_imports(
            user_id, organization_id, current_quarter
        )
        
        # Calculate current tonnage
        current_tonnage = quarterly_data.get("cbam_tonnage", 0)
        
        # Check for always-requiring commodities
        has_electricity_hydrogen = await self._check_always_requiring_commodities(
            user_id, organization_id, current_quarter
        )
        
        # Determine status
        status, alert_level, message = self._determine_status(
            current_tonnage, has_electricity_hydrogen
        )
        
        # Get commodity breakdown
        covered_goods, non_covered_goods = await self._get_commodity_breakdown(
            user_id, organization_id, current_quarter
        )
        
        # Get quarterly history
        quarterly_history = await self._get_quarterly_history(user_id, organization_id)
        
        # Determine if authorization is needed
        needs_authorization = (
            status == ThresholdStatus.REQUIRES_AUTHORIZATION or
            has_electricity_hydrogen
        )
        
        # Project breach date if approaching
        projected_breach_date = None
        if include_projections and status in [ThresholdStatus.APPROACHING, ThresholdStatus.CRITICAL]:
            projected_breach_date = self._project_breach_date(quarterly_history, current_tonnage)
        
        return {
            "needs_authorization": needs_authorization,
            "reason": self._get_reason(needs_authorization, has_electricity_hydrogen, status),
            "threshold_status": {
                "status": status.value,
                "current_tonnage": float(current_tonnage),
                "threshold": DE_MINIMIS_THRESHOLD,
                "remaining_buffer": max(0, DE_MINIMIS_THRESHOLD - current_tonnage),
                "projected_breach_date": projected_breach_date,
                "alert_level": alert_level,
                "message": message,
                "covered_goods": covered_goods,
                "non_covered_goods": non_covered_goods,
                "quarterly_history": quarterly_history,
            },
            "recommendation": self._get_recommendation(status, needs_authorization),
        }
    
    async def update_threshold_tracking(
        self,
        user_id: str,
        organization_id: Optional[str] = None
    ) -> ImportThresholdTracking:
        """
        Update threshold tracking record for current quarter.
        Called after new CBAM reports are created.
        """
        current_quarter = self._get_current_quarter()
        
        # Get or create tracking record
        query = select(ImportThresholdTracking).where(
            ImportThresholdTracking.user_id == user_id,
            ImportThresholdTracking.quarter_label == current_quarter["label"]
        )
        result = await self.db.execute(query)
        tracking = result.scalar_one_or_none()
        
        if not tracking:
            tracking = ImportThresholdTracking(
                user_id=user_id,
                organization_id=organization_id,
                year=current_quarter["year"],
                quarter=current_quarter["quarter"],
                quarter_label=current_quarter["label"]
            )
            self.db.add(tracking)
        
        # Calculate current tonnage
        quarterly_data = await self._get_quarterly_imports(
            user_id, organization_id, current_quarter
        )
        
        tracking.total_tonnage = Decimal(str(quarterly_data.get("total_tonnage", 0)))
        tracking.cbam_tonnage = Decimal(str(quarterly_data.get("cbam_tonnage", 0)))
        tracking.commodity_breakdown = quarterly_data.get("breakdown", {})
        
        # Update status
        cbam_tonnage = float(tracking.cbam_tonnage)
        tracking.remaining_buffer = Decimal(str(max(0, DE_MINIMIS_THRESHOLD - cbam_tonnage)))
        
        if cbam_tonnage >= DE_MINIMIS_THRESHOLD:
            tracking.status = ThresholdStatus.REQUIRES_AUTHORIZATION
        elif cbam_tonnage >= ALERT_THRESHOLD_ORANGE:
            tracking.status = ThresholdStatus.CRITICAL
        elif cbam_tonnage >= ALERT_THRESHOLD_YELLOW:
            tracking.status = ThresholdStatus.APPROACHING
        else:
            tracking.status = ThresholdStatus.EXEMPT
        
        await self.db.commit()
        await self.db.refresh(tracking)
        
        return tracking
    
    async def send_alerts_if_needed(
        self,
        tracking: ImportThresholdTracking
    ) -> List[str]:
        """
        Check if alerts should be sent and return alert messages.
        """
        alerts_to_send = []
        cbam_tonnage = float(tracking.cbam_tonnage)
        
        # 40 tonne alert
        if cbam_tonnage >= ALERT_THRESHOLD_YELLOW and not tracking.alert_40t_sent:
            alerts_to_send.append(
                f"⚠️ You've imported {cbam_tonnage:.1f} tonnes of CBAM goods this quarter. "
                f"10 more will require ACD authorization. Prepare now to avoid delays."
            )
            tracking.alert_40t_sent = True
        
        # 47 tonne alert
        if cbam_tonnage >= ALERT_THRESHOLD_ORANGE and not tracking.alert_47t_sent:
            alerts_to_send.append(
                f"🔶 URGENT: You've imported {cbam_tonnage:.1f} tonnes. "
                f"Only {DE_MINIMIS_THRESHOLD - cbam_tonnage:.1f} tonnes remaining before ACD is mandatory."
            )
            tracking.alert_47t_sent = True
        
        # 50 tonne alert
        if cbam_tonnage >= DE_MINIMIS_THRESHOLD and not tracking.alert_50t_sent:
            alerts_to_send.append(
                f"🚨 MANDATORY: You've exceeded 50 tonnes ({cbam_tonnage:.1f}t). "
                f"ACD authorization is now REQUIRED. Start application immediately."
            )
            tracking.alert_50t_sent = True
        
        if alerts_to_send:
            await self.db.commit()
        
        return alerts_to_send
    
    # =========================================================================
    # Private helper methods
    # =========================================================================
    
    def _get_current_quarter(self) -> Dict[str, Any]:
        """Get current quarter info."""
        now = datetime.now()
        quarter = (now.month - 1) // 3 + 1
        return {
            "year": now.year,
            "quarter": quarter,
            "label": f"{now.year}-Q{quarter}",
            "start_date": date(now.year, (quarter - 1) * 3 + 1, 1),
        }
    
    async def _get_quarterly_imports(
        self,
        user_id: str,
        organization_id: Optional[str],
        quarter_info: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Get import tonnage for a quarter from CBAM reports."""
        quarter_label = quarter_info["label"]
        
        # Query CBAM reports for this quarter
        query = select(CBAMReport).where(
            CBAMReport.user_id == user_id,
            CBAMReport.reporting_period == quarter_label
        )
        
        if organization_id:
            query = query.where(CBAMReport.organization_id == organization_id)
        
        result = await self.db.execute(query)
        reports = result.scalars().all()
        
        total_tonnage = 0
        cbam_tonnage = 0
        breakdown = {}
        
        for report in reports:
            weight_tonnes = (report.net_weight_kg or 0) / 1000
            total_tonnage += weight_tonnes
            
            # Check if CN code is CBAM-covered
            if report.cn_code:
                cn_query = select(CNCode).where(
                    CNCode.cn_code == report.cn_code,
                    CNCode.is_cbam_covered == True
                )
                cn_result = await self.db.execute(cn_query)
                cn_code = cn_result.scalar_one_or_none()
                
                if cn_code:
                    cbam_tonnage += weight_tonnes
                    if report.cn_code not in breakdown:
                        breakdown[report.cn_code] = {
                            "description": report.product_description or "",
                            "tonnage": 0
                        }
                    breakdown[report.cn_code]["tonnage"] += weight_tonnes
        
        return {
            "total_tonnage": total_tonnage,
            "cbam_tonnage": cbam_tonnage,
            "breakdown": breakdown
        }
    
    async def _check_always_requiring_commodities(
        self,
        user_id: str,
        organization_id: Optional[str],
        quarter_info: Dict[str, Any]
    ) -> bool:
        """Check if user imports electricity or hydrogen."""
        quarter_label = quarter_info["label"]
        
        # Get CN codes for electricity and hydrogen
        always_require_query = select(CNCode.cn_code).where(
            CNCode.cbam_category.in_(ALWAYS_REQUIRE_ACD)
        )
        result = await self.db.execute(always_require_query)
        always_require_codes = [row[0] for row in result.fetchall()]
        
        if not always_require_codes:
            return False
        
        # Check if any CBAM reports use these codes
        report_query = select(CBAMReport).where(
            CBAMReport.user_id == user_id,
            CBAMReport.cn_code.in_(always_require_codes)
        )
        
        result = await self.db.execute(report_query)
        return result.scalar_one_or_none() is not None
    
    async def _get_commodity_breakdown(
        self,
        user_id: str,
        organization_id: Optional[str],
        quarter_info: Dict[str, Any]
    ) -> Tuple[List[Dict], List[Dict]]:
        """Get breakdown of covered vs non-covered goods."""
        # Simplified - would be more detailed in production
        quarterly_data = await self._get_quarterly_imports(user_id, organization_id, quarter_info)
        
        covered_goods = []
        non_covered_goods = []
        
        total = quarterly_data.get("cbam_tonnage", 0) or 1  # Avoid division by zero
        
        for cn_code, data in quarterly_data.get("breakdown", {}).items():
            tonnage = data.get("tonnage", 0)
            covered_goods.append({
                "cn_code": cn_code,
                "description": data.get("description", ""),
                "quarterly_tonnage": tonnage,
                "percentage_of_total": round((tonnage / total) * 100, 1) if total > 0 else 0,
                "is_cbam_covered": True,
                "requires_authorization_always": False
            })
        
        return covered_goods, non_covered_goods
    
    async def _get_quarterly_history(
        self,
        user_id: str,
        organization_id: Optional[str]
    ) -> List[Dict]:
        """Get last 4 quarters of threshold tracking."""
        query = select(ImportThresholdTracking).where(
            ImportThresholdTracking.user_id == user_id
        ).order_by(ImportThresholdTracking.quarter_label.desc()).limit(4)
        
        result = await self.db.execute(query)
        records = result.scalars().all()
        
        return [
            {
                "quarter": r.quarter_label,
                "cbam_tonnage": float(r.cbam_tonnage),
                "status": r.status.value
            }
            for r in records
        ]
    
    def _determine_status(
        self,
        current_tonnage: float,
        has_electricity_hydrogen: bool
    ) -> Tuple[ThresholdStatus, str, str]:
        """Determine threshold status, alert level, and message."""
        if has_electricity_hydrogen:
            return (
                ThresholdStatus.REQUIRES_AUTHORIZATION,
                "red",
                "You import electricity or hydrogen which always requires ACD authorization."
            )
        
        if current_tonnage >= DE_MINIMIS_THRESHOLD:
            return (
                ThresholdStatus.REQUIRES_AUTHORIZATION,
                "red",
                f"You've imported {current_tonnage:.1f}t, exceeding the 50t threshold. ACD is mandatory."
            )
        
        if current_tonnage >= ALERT_THRESHOLD_ORANGE:
            return (
                ThresholdStatus.CRITICAL,
                "orange",
                f"Only {DE_MINIMIS_THRESHOLD - current_tonnage:.1f}t remaining before ACD is required."
            )
        
        if current_tonnage >= ALERT_THRESHOLD_YELLOW:
            return (
                ThresholdStatus.APPROACHING,
                "yellow",
                f"You've imported {current_tonnage:.1f}t. Consider starting ACD application proactively."
            )
        
        return (
            ThresholdStatus.EXEMPT,
            "green",
            f"Your current imports ({current_tonnage:.1f}t) are below the 50t de minimis threshold."
        )
    
    def _get_reason(
        self,
        needs_authorization: bool,
        has_electricity_hydrogen: bool,
        status: ThresholdStatus
    ) -> str:
        """Get human-readable reason for authorization requirement."""
        if has_electricity_hydrogen:
            return "Electricity and hydrogen imports always require ACD authorization under EU CBAM regulation."
        
        if needs_authorization:
            return "Your quarterly CBAM imports exceed the 50 tonne de minimis threshold."
        
        if status == ThresholdStatus.APPROACHING:
            return "You're approaching the de minimis threshold. Consider proactive authorization."
        
        return "Your imports are below the de minimis threshold. No authorization currently required."
    
    def _get_recommendation(self, status: ThresholdStatus, needs_authorization: bool) -> str:
        """Get actionable recommendation."""
        if needs_authorization:
            return "Start your ACD application immediately. Allow 3-6 months for NCA processing."
        
        if status == ThresholdStatus.CRITICAL:
            return "Begin ACD application now. You'll likely exceed the threshold soon."
        
        if status == ThresholdStatus.APPROACHING:
            return "Monitor your imports closely. Prepare ACD documentation proactively."
        
        return "Continue monitoring. No action required at this time."
    
    def _project_breach_date(
        self,
        quarterly_history: List[Dict],
        current_tonnage: float
    ) -> Optional[str]:
        """Project when threshold will be breached based on import velocity."""
        if len(quarterly_history) < 2 or current_tonnage >= DE_MINIMIS_THRESHOLD:
            return None
        
        # Calculate average growth rate
        tonnages = [q.get("cbam_tonnage", 0) for q in quarterly_history]
        if len(tonnages) < 2:
            return None
        
        avg_growth = sum(
            tonnages[i] - tonnages[i+1] 
            for i in range(len(tonnages)-1)
        ) / (len(tonnages) - 1)
        
        if avg_growth <= 0:
            return None
        
        remaining = DE_MINIMIS_THRESHOLD - current_tonnage
        quarters_until_breach = remaining / avg_growth
        
        # Calculate projected date
        now = datetime.now()
        months_until_breach = int(quarters_until_breach * 3)
        projected_month = now.month + months_until_breach
        projected_year = now.year + (projected_month - 1) // 12
        projected_month = ((projected_month - 1) % 12) + 1
        
        projected_quarter = (projected_month - 1) // 3 + 1
        
        return f"{projected_year}-Q{projected_quarter}"

"""
Solvency Service for VAYA Authorize (Module D).
Calculates financial ratios and determines solvency assessment for ACD authorization.
"""

from typing import Optional, List, Dict, Any, Tuple
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.authorization import (
    FinancialStatement,
    SolvencyAssessment,
    SolvencyStatus,
    AuthorizationApplication
)


# NCA threshold guidelines (based on EU CBAM implementing regulation)
THRESHOLDS = {
    "debt_to_equity": {
        "excellent": 0.5,
        "good": 1.0,
        "acceptable": 2.0,
        "concerning": 3.0,
        # Above 3.0 = high_risk
    },
    "current_ratio": {
        "high_risk": 1.0,
        "concerning": 1.2,
        "acceptable": 1.5,
        "good": 2.0,
        # Above 2.0 = excellent
    },
    "operating_margin": {
        "high_risk": 0,
        "concerning": 5,
        "acceptable": 5,
        "good": 10,
        # Above 15% = excellent
    }
}


class SolvencyService:
    """Service for calculating financial ratios and solvency assessment."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def calculate_solvency(
        self,
        application_id: str
    ) -> Dict[str, Any]:
        """
        Calculate solvency ratios and assessment for an application.
        Fetches data from DB and saves result.
        """
        # Get financial statements
        statements = await self._get_financial_statements(application_id)
        
        # Use the stateless calculation logic
        result = self.calculate_solvency_from_data(statements)
        
        if result["success"]:
            # Save assessment to database
            await self._save_assessment(application_id, result)
        
        return result

    def calculate_solvency_from_data(
        self,
        statements: List[FinancialStatement]
    ) -> Dict[str, Any]:
        """
        Calculate solvency ratios from a list of statement objects (Stateless).
        Useful for simulations or when DB is not yet populated.
        """
        if len(statements) < 3:
            return {
                "success": False,
                "error": f"Need 3 years of financial data. Currently have {len(statements)} year(s).",
                "solvency_status": SolvencyStatus.PENDING_ASSESSMENT.value
            }
        
        # Sort by fiscal year (most recent last)
        statements = sorted(statements, key=lambda s: s.fiscal_year)
        
        # Calculate ratios for each year
        debt_to_equity = []
        current_ratios = []
        operating_margins = []
        fiscal_years = []
        
        for stmt in statements[-3:]:  # Last 3 years
            fiscal_years.append(stmt.fiscal_year)
            
            # Debt-to-Equity
            d2e = self._calculate_debt_to_equity(stmt)
            debt_to_equity.append(d2e)
            
            # Current Ratio
            cr = self._calculate_current_ratio(stmt)
            current_ratios.append(cr)
            
            # Operating Margin
            om = self._calculate_operating_margin(stmt)
            operating_margins.append(om)
        
        # Analyze trends
        d2e_trend = self._analyze_trend(debt_to_equity, lower_is_better=True)
        cr_trend = self._analyze_trend(current_ratios, lower_is_better=False)
        om_trend = self._analyze_trend(operating_margins, lower_is_better=False)
        
        # Determine overall trend
        trends = [d2e_trend, cr_trend, om_trend]
        if trends.count("improving") >= 2:
            overall_trend = "improving"
        elif trends.count("declining") >= 2:
            overall_trend = "declining"
        else:
            overall_trend = "stable"
        
        # Get latest ratio interpretations
        latest_d2e = self._interpret_debt_to_equity(debt_to_equity[-1])
        latest_cr = self._interpret_current_ratio(current_ratios[-1])
        latest_om = self._interpret_operating_margin(operating_margins[-1])
        
        # Determine solvency status
        solvency_status, guarantee_required = self._determine_solvency_status(
            latest_d2e, latest_cr, latest_om, overall_trend
        )
        
        # Build result
        return {
            "success": True,
            "solvency_status": solvency_status.value,
            "debt_to_equity": {
                "fiscal_years": fiscal_years,
                "values": [round(v, 2) if v else None for v in debt_to_equity],
                "latest": latest_d2e,
                "trend": d2e_trend
            },
            "current_ratio": {
                "fiscal_years": fiscal_years,
                "values": [round(v, 2) if v else None for v in current_ratios],
                "latest": latest_cr,
                "trend": cr_trend
            },
            "operating_margin": {
                "fiscal_years": fiscal_years,
                "values": [round(v, 2) if v else None for v in operating_margins],
                "latest": latest_om,
                "trend": om_trend
            },
            "overall_trend": overall_trend,
            "guarantee_required": guarantee_required,
            "recommendation": self._get_recommendation(solvency_status, guarantee_required, overall_trend),
            "action_items": self._get_action_items(solvency_status, latest_d2e, latest_cr, latest_om)
        }
    
    async def get_solvency_status(
        self,
        application_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get existing solvency assessment for an application."""
        query = select(SolvencyAssessment).where(
            SolvencyAssessment.application_id == application_id
        )
        result = await self.db.execute(query)
        assessment = result.scalar_one_or_none()
        
        if not assessment:
            return None
        
        return {
            "solvency_status": assessment.solvency_status.value,
            "debt_to_equity_ratios": assessment.debt_to_equity_ratios,
            "current_ratios": assessment.current_ratios,
            "operating_margins": assessment.operating_margins,
            "trend": assessment.trend,
            "guarantee_required": assessment.guarantee_required,
            "guarantee_amount_eur": float(assessment.guarantee_amount_eur) if assessment.guarantee_amount_eur else None,
            "guarantee_amount_local": float(assessment.guarantee_amount_local) if assessment.guarantee_amount_local else None,
            "recommendation": assessment.recommendation,
            "calculated_at": assessment.calculated_at.isoformat()
        }

    # =========================================================================
    # Phase B: The Brain (User Specific Requirements)
    # =========================================================================

    def calculate_financial_health(self, data: Dict[str, float]) -> Dict[str, Any]:
        """
        Phase B: Solvency Calculation Engine.
        Checks if the company is "Rich enough" to be trusted by the EU.
        """
        # Data validation handles division by zero
        total_equity = data.get('total_equity', 0)
        short_term_liabilities = data.get('short_term_liabilities', 0)
        
        # Guard clauses for zero denominators
        if total_equity == 0:
            debt_to_equity = 999.0 # High risk if no equity
        else:
            debt_to_equity = data.get('total_liabilities', 0) / total_equity
            
        if short_term_liabilities == 0:
            current_ratio = 999.0 # Excellent liquidity (no short term liabilities)
        else:
            current_ratio = data.get('current_assets', 0) / short_term_liabilities
        
        # User defined thresholds
        if debt_to_equity > 5.0:
            status = "RED"
        elif debt_to_equity > 3.0:
            status = "AMBER"
        else:
            status = "GREEN"
            
        return {
            "d_e": round(debt_to_equity, 2),
            "cr": round(current_ratio, 2), 
            "status": status
        }

    async def check_de_minimis(self, user_id: str) -> Dict[str, Any]:
        """
        Phase B: Threshold & De Minimis Check.
        Queries Module B to see if the user has crossed the 50-tonne mandatory limit.
        """
        from app.services.threshold_service import ThresholdService
        threshold_service = ThresholdService(self.db)
        
        # Re-use existing robust logic
        eligibility = await threshold_service.check_eligibility(user_id, include_projections=False)
        current_tonnage = eligibility["threshold_status"]["current_tonnage"]
        
        # 50 Tonnes is the definitive threshold for 2026
        is_mandatory = current_tonnage >= 50.0
        
        return {
            "total": current_tonnage,
            "mandatory": is_mandatory,
            "details": eligibility
        }

    def estimate_bank_guarantee(
        self, 
        tonnage: float, 
        emissions_factor: float = 2.0, 
        carbon_price: float = 85.0
    ) -> float:
        """
        Phase B: Bank Guarantee (Security) Estimation.
        The EU requires 1.5x the carbon cost as a deposit.
        """
        raw_cost = tonnage * emissions_factor * carbon_price
        # 1.5x multiplier is the statutory requirement for the security deposit
        return raw_cost * 1.5

    
    # =========================================================================
    # Ratio Calculation Methods
    # =========================================================================
    
    def _calculate_debt_to_equity(self, stmt: FinancialStatement) -> Optional[float]:
        """
        Calculate Debt-to-Equity ratio.
        Formula: Total Liabilities / Total Equity
        Lower is better. < 2.0 is generally acceptable for NCA.
        """
        if not stmt.total_liabilities or not stmt.total_equity:
            return None
        
        if float(stmt.total_equity) == 0:
            return None
        
        return float(stmt.total_liabilities) / float(stmt.total_equity)
    
    def _calculate_current_ratio(self, stmt: FinancialStatement) -> Optional[float]:
        """
        Calculate Current Ratio.
        Formula: Current Assets / Current Liabilities
        Higher is better. > 1.5 is preferred.
        """
        if not stmt.current_assets or not stmt.current_liabilities:
            return None
        
        if float(stmt.current_liabilities) == 0:
            return None
        
        return float(stmt.current_assets) / float(stmt.current_liabilities)
    
    def _calculate_operating_margin(self, stmt: FinancialStatement) -> Optional[float]:
        """
        Calculate Operating Profit Margin.
        Formula: (Operating Profit / Revenue) × 100
        Higher is better. > 5% is a positive indicator.
        """
        if not stmt.operating_profit or not stmt.revenue:
            return None
        
        if float(stmt.revenue) == 0:
            return None
        
        return (float(stmt.operating_profit) / float(stmt.revenue)) * 100
    
    # =========================================================================
    # Interpretation Methods
    # =========================================================================
    
    def _interpret_debt_to_equity(self, value: Optional[float]) -> Dict[str, Any]:
        """Interpret Debt-to-Equity ratio."""
        if value is None:
            return {
                "value": None,
                "interpretation": "unknown",
                "threshold": "< 2.0 acceptable",
                "meets_threshold": False
            }
        
        if value < 0.5:
            interpretation = "excellent"
        elif value < 1.0:
            interpretation = "good"
        elif value < 2.0:
            interpretation = "acceptable"
        elif value < 3.0:
            interpretation = "concerning"
        else:
            interpretation = "high_risk"
        
        return {
            "value": round(value, 2),
            "interpretation": interpretation,
            "threshold": "< 2.0 acceptable",
            "meets_threshold": value < 2.0
        }
    
    def _interpret_current_ratio(self, value: Optional[float]) -> Dict[str, Any]:
        """Interpret Current Ratio."""
        if value is None:
            return {
                "value": None,
                "interpretation": "unknown",
                "threshold": "> 1.5 preferred",
                "meets_threshold": False
            }
        
        if value > 2.0:
            interpretation = "excellent"
        elif value > 1.5:
            interpretation = "good"
        elif value > 1.2:
            interpretation = "acceptable"
        elif value > 1.0:
            interpretation = "concerning"
        else:
            interpretation = "high_risk"
        
        return {
            "value": round(value, 2),
            "interpretation": interpretation,
            "threshold": "> 1.5 preferred",
            "meets_threshold": value > 1.5
        }
    
    def _interpret_operating_margin(self, value: Optional[float]) -> Dict[str, Any]:
        """Interpret Operating Margin."""
        if value is None:
            return {
                "value": None,
                "interpretation": "unknown",
                "threshold": "> 5% positive",
                "meets_threshold": False
            }
        
        if value > 15:
            interpretation = "excellent"
        elif value > 10:
            interpretation = "good"
        elif value > 5:
            interpretation = "acceptable"
        elif value > 0:
            interpretation = "concerning"
        else:
            interpretation = "high_risk"
        
        return {
            "value": round(value, 2),
            "interpretation": interpretation,
            "threshold": "> 5% positive",
            "meets_threshold": value > 5
        }
    
    # =========================================================================
    # Trend Analysis
    # =========================================================================
    
    def _analyze_trend(
        self,
        values: List[Optional[float]],
        lower_is_better: bool = False
    ) -> str:
        """
        Analyze 3-year trend.
        Returns: 'improving', 'stable', or 'declining'
        """
        valid_values = [v for v in values if v is not None]
        
        if len(valid_values) < 2:
            return "stable"
        
        # Calculate year-over-year changes
        changes = []
        for i in range(1, len(valid_values)):
            change = valid_values[i] - valid_values[i-1]
            if lower_is_better:
                change = -change  # Invert for lower-is-better metrics
            changes.append(change)
        
        avg_change = sum(changes) / len(changes)
        
        # Determine trend based on average change
        threshold = 0.05 * abs(valid_values[-1]) if valid_values[-1] else 0.05
        
        if avg_change > threshold:
            return "improving"
        elif avg_change < -threshold:
            return "declining"
        else:
            return "stable"
    
    # =========================================================================
    # Status Determination
    # =========================================================================
    
    def _determine_solvency_status(
        self,
        d2e: Dict,
        cr: Dict,
        om: Dict,
        overall_trend: str
    ) -> Tuple[SolvencyStatus, bool]:
        """
        Determine overall solvency status and whether bank guarantee is required.
        """
        # Count how many ratios meet threshold
        meets_count = sum([
            d2e.get("meets_threshold", False),
            cr.get("meets_threshold", False),
            om.get("meets_threshold", False)
        ])
        
        # Check for high-risk indicators
        high_risk_count = sum([
            d2e.get("interpretation") == "high_risk",
            cr.get("interpretation") == "high_risk",
            om.get("interpretation") == "high_risk"
        ])
        
        # Determine status
        if high_risk_count >= 2:
            return SolvencyStatus.REJECTION_RISK, True
        
        if meets_count >= 2 and high_risk_count == 0:
            if overall_trend == "declining":
                return SolvencyStatus.GUARANTEE_REQUIRED, True
            return SolvencyStatus.APPROVED_LIKELY, False
        
        if meets_count >= 1:
            return SolvencyStatus.GUARANTEE_REQUIRED, True
        
        return SolvencyStatus.REJECTION_RISK, True
    
    def _get_recommendation(
        self,
        status: SolvencyStatus,
        guarantee_required: bool,
        trend: str
    ) -> str:
        """Get recommendation based on solvency assessment."""
        if status == SolvencyStatus.APPROVED_LIKELY:
            if trend == "improving":
                return "Your financial health is strong with improving trends. High likelihood of approval without bank guarantee."
            return "Your financial ratios meet NCA thresholds. Proceed with application."
        
        if status == SolvencyStatus.GUARANTEE_REQUIRED:
            return "Some ratios are below thresholds. NCA will likely require a bank guarantee. Prepare guarantee documentation."
        
        return "Financial indicators show significant risk. Consider improving ratios before applying or consult with financial advisor."
    
    def _get_action_items(
        self,
        status: SolvencyStatus,
        d2e: Dict,
        cr: Dict,
        om: Dict
    ) -> List[str]:
        """Generate action items based on assessment."""
        actions = []
        
        if not d2e.get("meets_threshold"):
            actions.append("Reduce debt or increase equity to improve Debt-to-Equity ratio below 2.0")
        
        if not cr.get("meets_threshold"):
            actions.append("Improve liquidity by reducing current liabilities or increasing current assets")
        
        if not om.get("meets_threshold"):
            actions.append("Focus on operational efficiency to improve operating margin above 5%")
        
        if status == SolvencyStatus.GUARANTEE_REQUIRED:
            actions.append("Prepare bank guarantee documentation (estimate will be provided)")
        
        if status == SolvencyStatus.REJECTION_RISK:
            actions.append("Consider waiting until financial position improves")
            actions.append("Consult with financial advisor regarding NCA requirements")
        
        return actions
    
    # =========================================================================
    # Database Operations
    # =========================================================================
    
    async def _get_financial_statements(
        self,
        application_id: str
    ) -> List[FinancialStatement]:
        """Get all financial statements for an application."""
        query = select(FinancialStatement).where(
            FinancialStatement.application_id == application_id
        ).order_by(FinancialStatement.fiscal_year)
        
        result = await self.db.execute(query)
        return list(result.scalars().all())
    
    async def _save_assessment(
        self,
        application_id: str,
        result: Dict[str, Any]
    ) -> SolvencyAssessment:
        """Save solvency assessment to database."""
        # Check for existing assessment
        query = select(SolvencyAssessment).where(
            SolvencyAssessment.application_id == application_id
        )
        existing = await self.db.execute(query)
        assessment = existing.scalar_one_or_none()
        
        if not assessment:
            assessment = SolvencyAssessment(application_id=application_id)
            self.db.add(assessment)
        
        # Update values
        assessment.debt_to_equity_ratios = result["debt_to_equity"]["values"]
        assessment.current_ratios = result["current_ratio"]["values"]
        assessment.operating_margins = result["operating_margin"]["values"]
        assessment.latest_debt_to_equity = result["debt_to_equity"]["latest"]["value"]
        assessment.latest_current_ratio = result["current_ratio"]["latest"]["value"]
        assessment.latest_operating_margin = result["operating_margin"]["latest"]["value"]
        assessment.trend = result["overall_trend"]
        assessment.solvency_status = SolvencyStatus(result["solvency_status"])
        assessment.guarantee_required = result["guarantee_required"]
        assessment.recommendation = result["recommendation"]
        
        # Update parent application
        app_query = select(AuthorizationApplication).where(
            AuthorizationApplication.id == application_id
        )
        app_result = await self.db.execute(app_query)
        application = app_result.scalar_one_or_none()
        
        if application:
            application.solvency_status = SolvencyStatus(result["solvency_status"])
            application.guarantee_required = result["guarantee_required"]
        
        await self.db.commit()
        return assessment

"""
Bank Guarantee Service for VAYA Authorize (Module D).
Calculates required bank guarantee amount based on expected CBAM certificate costs.
"""

from typing import Optional, Dict, Any
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.hs_code import CNCode, CBAMCategory
from app.models.authorization import AuthorizationApplication, SolvencyAssessment


# Default values
DEFAULT_CARBON_PRICE_EUR = 85.0  # EUR per tonne CO2e (conservative EU ETS estimate)
SAFETY_FACTOR = 1.5  # 150% buffer for price volatility
EUR_INR_RATE = 91.0  # Default exchange rate (should be fetched live in production)

# Default emission factors by CBAM category (tCO2e per tonne of product)
DEFAULT_EMISSION_FACTORS = {
    CBAMCategory.IRON_STEEL: 2.0,
    CBAMCategory.ALUMINIUM: 8.0,
    CBAMCategory.CEMENT: 0.7,
    CBAMCategory.FERTILISERS: 2.5,
    CBAMCategory.HYDROGEN: 9.0,
    CBAMCategory.ELECTRICITY: 0.5,  # Per MWh, not tonne
}


class BankGuaranteeService:
    """Service for calculating bank guarantee requirements."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def calculate_guarantee(
        self,
        annual_tonnage: float,
        cn_code: str,
        carbon_price_override: Optional[float] = None,
        local_currency: str = "INR"
    ) -> Dict[str, Any]:
        """
        Calculate required bank guarantee amount.
        
        Formula: (Annual_Tonnage × Default_EF × EU_Carbon_Price) × Safety_Factor
        
        Args:
            annual_tonnage: Expected annual import tonnage
            cn_code: Primary commodity CN code
            carbon_price_override: Optional override for EU carbon price
            local_currency: Local currency for conversion
            
        Returns:
            Dict with detailed calculation breakdown
        """
        # Get emission factor for commodity
        emission_factor, commodity_info = await self._get_emission_factor(cn_code)
        
        # Get carbon price
        carbon_price = carbon_price_override or await self._get_carbon_price()
        
        # Calculate total emissions
        total_emissions = annual_tonnage * emission_factor
        
        # Calculate base CBAM certificate cost
        base_cost = total_emissions * carbon_price
        
        # Apply safety factor
        guarantee_amount_eur = base_cost * SAFETY_FACTOR
        
        # Convert to local currency
        exchange_rate = await self._get_exchange_rate("EUR", local_currency)
        guarantee_amount_local = guarantee_amount_eur * exchange_rate
        
        return {
            "annual_tonnage": annual_tonnage,
            "commodity": commodity_info.get("description", "Unknown"),
            "cn_code": cn_code,
            "cbam_category": commodity_info.get("category", "unknown"),
            
            # Emission factor
            "default_emission_factor": emission_factor,
            "emission_factor_unit": "tCO2e per tonne product",
            "total_emissions": round(total_emissions, 2),
            
            # Pricing
            "carbon_price_eur": carbon_price,
            "carbon_price_source": "EU ETS reference price",
            "base_cost_eur": round(base_cost, 2),
            
            # Safety factor
            "safety_factor": SAFETY_FACTOR,
            "safety_factor_rationale": "150% buffer to cover price volatility and quantity variations",
            
            # Final amounts
            "guarantee_amount_eur": round(guarantee_amount_eur, 2),
            "guarantee_amount_local": round(guarantee_amount_local, 2),
            "local_currency": local_currency,
            
            # Exchange rate
            "exchange_rate": exchange_rate,
            "exchange_rate_pair": f"EUR/{local_currency}",
            
            # Comparison
            "annual_cbam_certificate_cost_eur": round(base_cost, 2),
            "guarantee_as_percentage": round((SAFETY_FACTOR - 1) * 100),
            
            # Calculation breakdown (for display)
            "calculation_steps": self._get_calculation_steps(
                annual_tonnage, emission_factor, carbon_price,
                total_emissions, base_cost, guarantee_amount_eur,
                guarantee_amount_local, exchange_rate, local_currency
            )
        }
    
    async def update_application_guarantee(
        self,
        application_id: str,
        guarantee_amount_eur: float,
        guarantee_amount_local: float,
        calculation: Dict[str, Any]
    ) -> None:
        """Update application with calculated guarantee amount."""
        # Update solvency assessment
        query = select(SolvencyAssessment).where(
            SolvencyAssessment.application_id == application_id
        )
        result = await self.db.execute(query)
        assessment = result.scalar_one_or_none()
        
        if assessment:
            assessment.guarantee_amount_eur = Decimal(str(guarantee_amount_eur))
            assessment.guarantee_amount_local = Decimal(str(guarantee_amount_local))
            assessment.guarantee_calculation = calculation
        
        # Update application
        app_query = select(AuthorizationApplication).where(
            AuthorizationApplication.id == application_id
        )
        app_result = await self.db.execute(app_query)
        application = app_result.scalar_one_or_none()
        
        if application:
            application.guarantee_amount_eur = Decimal(str(guarantee_amount_eur))
            application.guarantee_amount_local = Decimal(str(guarantee_amount_local))
        
        await self.db.commit()
    
    async def estimate_annual_tonnage(
        self,
        user_id: str,
        organization_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Estimate annual tonnage based on historical CBAM reports.
        Uses the higher of (last year actual, current year projected).
        """
        # This would query CBAM reports and calculate actual tonnage
        # Simplified implementation
        return {
            "last_year_actual": 0,
            "current_year_projected": 0,
            "recommended_for_calculation": 0,
            "source": "No historical data available"
        }
    
    # =========================================================================
    # Private helper methods
    # =========================================================================
    
    async def _get_emission_factor(
        self,
        cn_code: str
    ) -> tuple[float, Dict[str, Any]]:
        """Get default emission factor for a CN code."""
        query = select(CNCode).where(CNCode.cn_code == cn_code)
        result = await self.db.execute(query)
        cn = result.scalar_one_or_none()
        
        if cn:
            # Use stored default emission factor
            if cn.default_direct_emission:
                ef = float(cn.default_direct_emission) + float(cn.default_indirect_emission or 0)
            else:
                # Fall back to category default
                ef = DEFAULT_EMISSION_FACTORS.get(cn.cbam_category, 2.0)
            
            return ef, {
                "description": cn.description,
                "category": cn.cbam_category.value if cn.cbam_category else "unknown",
                "is_cbam_covered": cn.is_cbam_covered
            }
        
        # Default if CN code not found
        return 2.0, {
            "description": "Unknown product",
            "category": "unknown",
            "is_cbam_covered": True
        }
    
    async def _get_carbon_price(self) -> float:
        """
        Get current EU ETS carbon price.
        In production, this would fetch from an API like ember-climate.org.
        """
        # TODO: Integrate with live carbon price API
        # For now, return default conservative estimate
        return DEFAULT_CARBON_PRICE_EUR
    
    async def _get_exchange_rate(
        self,
        from_currency: str,
        to_currency: str
    ) -> float:
        """
        Get exchange rate.
        In production, this would fetch from a forex API.
        """
        # TODO: Integrate with live forex API
        if from_currency == "EUR" and to_currency == "INR":
            return EUR_INR_RATE
        return 1.0
    
    def _get_calculation_steps(
        self,
        tonnage: float,
        ef: float,
        carbon_price: float,
        emissions: float,
        base_cost: float,
        guarantee_eur: float,
        guarantee_local: float,
        exchange_rate: float,
        local_currency: str
    ) -> list[Dict[str, str]]:
        """Generate human-readable calculation steps."""
        return [
            {
                "step": 1,
                "description": "Calculate total embedded emissions",
                "formula": f"{tonnage:,.0f} tonnes × {ef} tCO2e/t",
                "result": f"{emissions:,.2f} tCO2e"
            },
            {
                "step": 2,
                "description": "Calculate base CBAM certificate cost",
                "formula": f"{emissions:,.2f} tCO2e × €{carbon_price}",
                "result": f"€{base_cost:,.2f}"
            },
            {
                "step": 3,
                "description": "Apply safety factor (150% buffer)",
                "formula": f"€{base_cost:,.2f} × {SAFETY_FACTOR}",
                "result": f"€{guarantee_eur:,.2f}"
            },
            {
                "step": 4,
                "description": f"Convert to {local_currency}",
                "formula": f"€{guarantee_eur:,.2f} × {exchange_rate}",
                "result": f"{local_currency} {guarantee_local:,.2f}"
            }
        ]


class GuaranteeScenarioCalculator:
    """Helper class for interactive guarantee calculations with different scenarios."""
    
    @staticmethod
    def calculate_scenarios(
        base_tonnage: float,
        emission_factor: float,
        carbon_price: float = DEFAULT_CARBON_PRICE_EUR,
        exchange_rate: float = EUR_INR_RATE
    ) -> Dict[str, Any]:
        """
        Calculate guarantee for multiple scenarios.
        Useful for the interactive calculator widget.
        """
        scenarios = []
        
        # Low scenario (-20%)
        low_tonnage = base_tonnage * 0.8
        low_guarantee = low_tonnage * emission_factor * carbon_price * SAFETY_FACTOR
        scenarios.append({
            "name": "Conservative",
            "tonnage": low_tonnage,
            "guarantee_eur": round(low_guarantee, 2),
            "guarantee_inr": round(low_guarantee * exchange_rate, 2)
        })
        
        # Base scenario
        base_guarantee = base_tonnage * emission_factor * carbon_price * SAFETY_FACTOR
        scenarios.append({
            "name": "Expected",
            "tonnage": base_tonnage,
            "guarantee_eur": round(base_guarantee, 2),
            "guarantee_inr": round(base_guarantee * exchange_rate, 2)
        })
        
        # High scenario (+20%)
        high_tonnage = base_tonnage * 1.2
        high_guarantee = high_tonnage * emission_factor * carbon_price * SAFETY_FACTOR
        scenarios.append({
            "name": "Growth",
            "tonnage": high_tonnage,
            "guarantee_eur": round(high_guarantee, 2),
            "guarantee_inr": round(high_guarantee * exchange_rate, 2)
        })
        
        # Carbon price sensitivity
        price_sensitivity = []
        for price_adj in [0.8, 1.0, 1.2, 1.5]:
            adj_price = carbon_price * price_adj
            adj_guarantee = base_tonnage * emission_factor * adj_price * SAFETY_FACTOR
            price_sensitivity.append({
                "carbon_price": round(adj_price, 2),
                "guarantee_eur": round(adj_guarantee, 2),
                "guarantee_inr": round(adj_guarantee * exchange_rate, 2)
            })
        
        return {
            "tonnage_scenarios": scenarios,
            "price_sensitivity": price_sensitivity,
            "base_params": {
                "tonnage": base_tonnage,
                "emission_factor": emission_factor,
                "carbon_price": carbon_price,
                "safety_factor": SAFETY_FACTOR,
                "exchange_rate": exchange_rate
            }
        }

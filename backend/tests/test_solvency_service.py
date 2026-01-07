
import pytest
from unittest.mock import MagicMock, AsyncMock
from app.services.solvency_service import SolvencyService
from app.models.authorization import FinancialStatement, SolvencyStatus

@pytest.mark.asyncio
async def test_solvency_calculation_healthy():
    """Test solvency calculation with healthy financial data."""
    # Mock database session
    db = MagicMock()
    service = SolvencyService(db)
    
    # Mock financial statements
    statements = [
        FinancialStatement(
            fiscal_year="2021-2022",
            total_liabilities=100000,
            total_equity=200000,  # D/E = 0.5 (Excellent)
            current_assets=150000,
            current_liabilities=50000, # CR = 3.0 (Excellent)
            operating_profit=20000,
            revenue=100000 # OM = 20% (Excellent)
        ),
        FinancialStatement(
            fiscal_year="2022-2023",
            total_liabilities=100000,
            total_equity=210000,
            current_assets=160000,
            current_liabilities=50000,
            operating_profit=22000,
            revenue=110000
        ),
        FinancialStatement(
            fiscal_year="2023-2024",
            total_liabilities=100000,
            total_equity=220000,
            current_assets=170000,
            current_liabilities=50000,
            operating_profit=25000,
            revenue=120000
        )
    ]
    
    # Mock _get_financial_statements
    service._get_financial_statements = AsyncMock(return_value=statements)
    service._save_assessment = AsyncMock() # Don't actually save
    
    # Run calculation
    result = await service.calculate_solvency("test-app-id")
    
    assert result["success"] is True
    assert result["solvency_status"] == SolvencyStatus.APPROVED_LIKELY.value
    assert result["guarantee_required"] is False
    assert result["overall_trend"] == "stable" or result["overall_trend"] == "improving"

@pytest.mark.asyncio
async def test_solvency_calculation_risky():
    """Test solvency calculation with risky financial data."""
    db = MagicMock()
    service = SolvencyService(db)
    
    statements = [
        FinancialStatement(
            fiscal_year="2023-2024",
            total_liabilities=300000,
            total_equity=50000,  # D/E = 6.0 (High Risk)
            current_assets=50000,
            current_liabilities=100000, # CR = 0.5 (High Risk)
            operating_profit=-10000,
            revenue=100000 # OM = -10% (High Risk)
        )
    ] * 3 # Same bad data for 3 years
    
    service._get_financial_statements = AsyncMock(return_value=statements)
    service._save_assessment = AsyncMock()
    
    result = await service.calculate_solvency("test-app-id")
    
    assert result["success"] is True
    # Should likely require guarantee or be high risk
    assert result["solvency_status"] in [SolvencyStatus.REJECTION_RISK.value, SolvencyStatus.GUARANTEE_REQUIRED.value]
    assert result["guarantee_required"] is True

@pytest.mark.asyncio
async def test_insufficient_data():
    """Test with less than 3 years of data."""
    db = MagicMock()
    service = SolvencyService(db)
    
    statements = [FinancialStatement(fiscal_year="2023-2024")]
    service._get_financial_statements = AsyncMock(return_value=statements)
    
    result = await service.calculate_solvency("test-app-id")
    
    assert result["success"] is False
    assert "Need 3 years" in result["error"]

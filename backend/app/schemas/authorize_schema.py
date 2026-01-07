"""
Pydantic schemas for VAYA Authorize (Module D).
Request/response validation for ACD application workflow.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator
from enum import Enum


# ============================================================================
# Enums (matching database enums)
# ============================================================================

class ApplicationStatusEnum(str, Enum):
    DRAFT = "draft"
    DOCUMENTS_PENDING = "documents_pending"
    FINANCIAL_REVIEW = "financial_review"
    CONDUCT_REVIEW = "conduct_review"
    PACKET_GENERATING = "packet_generating"
    READY_FOR_SUBMISSION = "ready_for_submission"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    CONDITIONAL = "conditional"


class SolvencyStatusEnum(str, Enum):
    APPROVED_LIKELY = "approved_likely"
    GUARANTEE_REQUIRED = "guarantee_required"
    REJECTION_RISK = "rejection_risk"
    PENDING_ASSESSMENT = "pending_assessment"


class ThresholdStatusEnum(str, Enum):
    EXEMPT = "exempt"
    APPROACHING = "approaching"
    CRITICAL = "critical"
    REQUIRES_AUTHORIZATION = "requires_authorization"


class TrendEnum(str, Enum):
    IMPROVING = "improving"
    STABLE = "stable"
    DECLINING = "declining"


# ============================================================================
# Eligibility & Threshold Schemas
# ============================================================================

class EligibilityCheckRequest(BaseModel):
    """Request to check ACD authorization eligibility."""
    user_id: Optional[str] = None
    include_projections: bool = True


class CommodityBreakdown(BaseModel):
    """Breakdown of CBAM goods by commodity."""
    cn_code: str
    description: str
    quarterly_tonnage: float
    percentage_of_total: float
    is_cbam_covered: bool
    requires_authorization_always: bool = False  # True for electricity/hydrogen


class ThresholdStatusResponse(BaseModel):
    """Response with de minimis threshold status."""
    status: ThresholdStatusEnum
    current_tonnage: float = Field(description="Tonnes imported this quarter")
    threshold: float = Field(default=50.0, description="De minimis threshold in tonnes")
    remaining_buffer: float = Field(description="Tonnes until threshold breach")
    projected_breach_date: Optional[str] = None
    
    # Alert levels
    alert_level: str = Field(description="green, yellow, orange, or red")
    message: str
    
    # Breakdown
    covered_goods: List[CommodityBreakdown] = []
    non_covered_goods: List[CommodityBreakdown] = []
    
    # Quarterly history
    quarterly_history: List[Dict[str, Any]] = []


class EligibilityCheckResponse(BaseModel):
    """Response for eligibility check."""
    needs_authorization: bool
    reason: str
    threshold_status: ThresholdStatusResponse
    recommendation: str


# ============================================================================
# Financial Document & Solvency Schemas
# ============================================================================

class BalanceSheetExtract(BaseModel):
    """Extracted balance sheet data."""
    fiscal_year: str = Field(description="e.g., 'FY 2023-24'")
    currency: str = "INR"
    
    # Assets
    current_assets: Optional[float] = None
    fixed_assets: Optional[float] = None
    total_assets: Optional[float] = None
    
    # Liabilities
    current_liabilities: Optional[float] = None
    long_term_liabilities: Optional[float] = None
    total_liabilities: Optional[float] = None
    
    # Equity
    share_capital: Optional[float] = None
    retained_earnings: Optional[float] = None
    total_equity: Optional[float] = None
    
    # Validation
    balance_verified: bool = False
    balance_difference: Optional[float] = None


class ProfitLossExtract(BaseModel):
    """Extracted P&L data."""
    fiscal_year: str
    currency: str = "INR"
    
    revenue: Optional[float] = None
    cost_of_goods_sold: Optional[float] = None
    gross_profit: Optional[float] = None
    operating_expenses: Optional[float] = None
    operating_profit: Optional[float] = None
    net_profit: Optional[float] = None


class FinancialDocUploadResponse(BaseModel):
    """Response after uploading financial documents."""
    success: bool
    fiscal_year: str
    balance_sheet: Optional[BalanceSheetExtract] = None
    profit_loss: Optional[ProfitLossExtract] = None
    extraction_confidence: float = Field(ge=0, le=1)
    extraction_errors: List[str] = []
    warnings: List[str] = []
    auditor_name: Optional[str] = None


class RatioDetail(BaseModel):
    """Detail for a single financial ratio."""
    value: float
    interpretation: str  # excellent, good, acceptable, concerning, high_risk
    threshold: str
    meets_threshold: bool


class SolvencyRatioResult(BaseModel):
    """Three-year ratio results with trend."""
    fiscal_years: List[str]  # ["FY 2021-22", "FY 2022-23", "FY 2023-24"]
    values: List[float]
    latest: RatioDetail
    trend: TrendEnum


class SolvencyResultResponse(BaseModel):
    """Complete solvency assessment response."""
    solvency_status: SolvencyStatusEnum
    
    # Ratios
    debt_to_equity: SolvencyRatioResult
    current_ratio: SolvencyRatioResult
    operating_margin: SolvencyRatioResult
    
    # Overall trend
    overall_trend: TrendEnum
    
    # Bank guarantee
    guarantee_required: bool
    guarantee_amount_eur: Optional[float] = None
    guarantee_amount_inr: Optional[float] = None
    
    # Recommendations
    recommendation: str
    action_items: List[str] = []


# ============================================================================
# Bank Guarantee Calculator Schemas
# ============================================================================

class BankGuaranteeRequest(BaseModel):
    """Request to calculate bank guarantee amount."""
    annual_tonnage: float = Field(description="Expected annual import tonnage")
    primary_cn_code: str = Field(description="Primary commodity CN code")
    carbon_price_override: Optional[float] = None  # EUR per tonne CO2e


class BankGuaranteeCalculation(BaseModel):
    """Detailed bank guarantee calculation breakdown."""
    annual_tonnage: float
    commodity: str
    cn_code: str
    
    # Emission factor
    default_emission_factor: float = Field(description="tCO2e per tonne product")
    total_emissions: float = Field(description="Annual tCO2e")
    
    # Pricing
    carbon_price_eur: float = Field(description="EUR per tonne CO2e")
    base_cost_eur: float
    
    # Safety factor
    safety_factor: float = 1.5
    guarantee_amount_eur: float
    guarantee_amount_inr: float
    
    # Exchange rate
    eur_inr_rate: float
    
    # Comparison
    annual_cbam_certificate_cost_eur: float
    guarantee_as_percentage: float


# ============================================================================
# Conduct Declaration Schemas
# ============================================================================

class ConductQuestion(BaseModel):
    """Single conduct questionnaire question."""
    id: str
    text: str
    is_critical: bool
    if_yes_guidance: str


class ConductAnswer(BaseModel):
    """Answer to a conduct question."""
    question_id: str
    answer: bool  # True = "Yes" (potential issue)
    explanation: Optional[str] = None


class ConductQuestionnaireRequest(BaseModel):
    """Submit conduct questionnaire answers."""
    answers: List[ConductAnswer]


class ConductQuestionnaireResponse(BaseModel):
    """Conduct assessment result."""
    status: str  # clean, yellow_flag, red_flag
    score: int  # Number of "No" answers (higher is better)
    critical_issues: List[str]
    warnings: List[str]
    next_steps: List[str]
    can_proceed: bool


# ============================================================================
# Application & Packet Schemas
# ============================================================================

class ApplicationCreateRequest(BaseModel):
    """Start a new authorization application."""
    nca_country: str = Field(description="Target NCA country code (DE, FR, IT, etc.)")
    eori_number: Optional[str] = None
    application_type: str = "initial"


class ApplicationStatusResponse(BaseModel):
    """Authorization application status."""
    id: str
    application_number: Optional[str] = None
    status: ApplicationStatusEnum
    
    # Progress
    documents_uploaded: int
    documents_required: int
    financial_years_submitted: int
    financial_years_required: int = 3
    conduct_completed: bool
    
    # Assessment results
    solvency_status: Optional[SolvencyStatusEnum] = None
    conduct_status: Optional[str] = None
    
    # Packet
    packet_ready: bool
    packet_download_url: Optional[str] = None
    packet_expires_at: Optional[datetime] = None
    
    # Action items
    pending_actions: List[str] = []
    
    # Timestamps
    created_at: datetime
    updated_at: datetime


class PacketGenerateRequest(BaseModel):
    """Request to generate submission packet."""
    include_original_documents: bool = True
    password_protect: bool = True


class PacketGenerateResponse(BaseModel):
    """Response after generating packet."""
    success: bool
    packet_id: str
    download_url: str
    password: Optional[str] = None
    expires_at: datetime
    
    # Contents
    files_included: List[str]
    total_size_mb: float


# ============================================================================
# Dashboard Summary Schema
# ============================================================================

class AuthorizeDashboardSummary(BaseModel):
    """Summary data for authorization dashboard."""
    # Eligibility
    threshold_status: ThresholdStatusResponse
    
    # Current application
    has_active_application: bool
    application: Optional[ApplicationStatusResponse] = None
    
    # Quick stats
    documents_uploaded: int
    solvency_assessed: bool
    conduct_completed: bool
    
    # Recommendations
    next_step: str
    urgency_level: str  # low, medium, high, critical

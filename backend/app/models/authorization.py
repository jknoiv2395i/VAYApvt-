"""
Authorization models for VAYA Authorize (Module D).
Implements Authorized CBAM Declarant (ACD) application workflow.
"""

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Enum, Float, JSON, Boolean, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
import uuid

from app.core.database import Base


class ApplicationStatus(str, enum.Enum):
    """Authorization application status."""
    DRAFT = "draft"
    DOCUMENTS_PENDING = "documents_pending"
    FINANCIAL_REVIEW = "financial_review"
    CONDUCT_REVIEW = "conduct_review"
    PACKET_GENERATING = "packet_generating"
    READY_FOR_SUBMISSION = "ready_for_submission"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    CONDITIONAL = "conditional"  # Approved with bank guarantee


class ApplicationType(str, enum.Enum):
    """Type of authorization application."""
    INITIAL = "initial"
    RENEWAL = "renewal"
    AMENDMENT = "amendment"


class SolvencyStatus(str, enum.Enum):
    """Financial solvency assessment result."""
    APPROVED_LIKELY = "approved_likely"
    GUARANTEE_REQUIRED = "guarantee_required"
    REJECTION_RISK = "rejection_risk"
    PENDING_ASSESSMENT = "pending_assessment"


class ThresholdStatus(str, enum.Enum):
    """De minimis threshold status."""
    EXEMPT = "exempt"                    # < 40 tonnes
    APPROACHING = "approaching"          # 40-47 tonnes
    CRITICAL = "critical"                # 47-50 tonnes
    REQUIRES_AUTHORIZATION = "requires_authorization"  # 50+ tonnes


class AuthorizationApplication(Base):
    """Main authorization application record."""
    
    __tablename__ = "authorization_applications"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Ownership
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=True)
    
    # Application details
    application_number = Column(String(50), unique=True, nullable=True)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.DRAFT)
    application_type = Column(Enum(ApplicationType), default=ApplicationType.INITIAL)
    
    # Target NCA (National Competent Authority)
    nca_country = Column(String(5), nullable=True)  # ISO country code (DE, FR, IT, etc.)
    nca_submission_portal = Column(String(255), nullable=True)
    
    # EORI details
    eori_number = Column(String(30), nullable=True)
    eori_verified = Column(Boolean, default=False)
    
    # Solvency assessment results
    solvency_status = Column(Enum(SolvencyStatus), default=SolvencyStatus.PENDING_ASSESSMENT)
    guarantee_required = Column(Boolean, default=False)
    guarantee_amount_eur = Column(Numeric(15, 2), nullable=True)
    guarantee_amount_local = Column(Numeric(15, 2), nullable=True)
    local_currency = Column(String(5), default="INR")
    
    # Conduct record
    conduct_status = Column(String(30), default="pending")  # clean, yellow_flag, red_flag
    
    # Generated packet
    packet_storage_path = Column(String(500), nullable=True)
    packet_generated_at = Column(DateTime, nullable=True)
    packet_expires_at = Column(DateTime, nullable=True)
    packet_download_url = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    submitted_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)  # Authorization expiry (5 years from approval)
    
    # Relationships
    user = relationship("User", back_populates="authorization_applications")
    financial_statements = relationship("FinancialStatement", back_populates="application", cascade="all, delete-orphan")
    solvency_assessment = relationship("SolvencyAssessment", back_populates="application", uselist=False, cascade="all, delete-orphan")
    conduct_declarations = relationship("ConductDeclaration", back_populates="application", cascade="all, delete-orphan")


class FinancialStatement(Base):
    """Extracted financial statement data per fiscal year."""
    
    __tablename__ = "financial_statements"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("authorization_applications.id"), nullable=False)
    
    # Fiscal year info
    fiscal_year = Column(String(20), nullable=False)  # e.g., "FY 2023-24"
    currency = Column(String(10), default="INR")
    
    # Balance Sheet - Assets
    total_assets = Column(Numeric(18, 2), nullable=True)
    current_assets = Column(Numeric(18, 2), nullable=True)
    fixed_assets = Column(Numeric(18, 2), nullable=True)
    
    # Balance Sheet - Liabilities
    total_liabilities = Column(Numeric(18, 2), nullable=True)
    current_liabilities = Column(Numeric(18, 2), nullable=True)
    long_term_liabilities = Column(Numeric(18, 2), nullable=True)
    
    # Balance Sheet - Equity
    total_equity = Column(Numeric(18, 2), nullable=True)
    share_capital = Column(Numeric(18, 2), nullable=True)
    retained_earnings = Column(Numeric(18, 2), nullable=True)
    
    # Profit & Loss
    revenue = Column(Numeric(18, 2), nullable=True)
    cost_of_goods_sold = Column(Numeric(18, 2), nullable=True)
    gross_profit = Column(Numeric(18, 2), nullable=True)
    operating_expenses = Column(Numeric(18, 2), nullable=True)
    operating_profit = Column(Numeric(18, 2), nullable=True)
    net_profit = Column(Numeric(18, 2), nullable=True)
    
    # OCR metadata
    document_path = Column(String(500), nullable=True)
    extraction_confidence = Column(Float, nullable=True)
    extraction_errors = Column(JSON, nullable=True)
    auditor_name = Column(String(255), nullable=True)
    
    # Validation
    balance_verified = Column(Boolean, default=False)  # Assets = Liabilities + Equity
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    application = relationship("AuthorizationApplication", back_populates="financial_statements")


class SolvencyAssessment(Base):
    """Calculated solvency ratios and assessment."""
    
    __tablename__ = "solvency_assessments"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("authorization_applications.id"), nullable=False, unique=True)
    
    # Ratios (stored as JSON arrays for 3-year trend)
    debt_to_equity_ratios = Column(JSON, nullable=True)  # [year1, year2, year3]
    current_ratios = Column(JSON, nullable=True)
    operating_margins = Column(JSON, nullable=True)
    
    # Latest values for quick access
    latest_debt_to_equity = Column(Float, nullable=True)
    latest_current_ratio = Column(Float, nullable=True)
    latest_operating_margin = Column(Float, nullable=True)
    
    # Trend analysis
    trend = Column(String(20), default="stable")  # improving, stable, declining
    
    # Assessment result
    solvency_status = Column(Enum(SolvencyStatus), default=SolvencyStatus.PENDING_ASSESSMENT)
    
    # Bank guarantee
    guarantee_required = Column(Boolean, default=False)
    guarantee_amount_eur = Column(Numeric(15, 2), nullable=True)
    guarantee_amount_local = Column(Numeric(15, 2), nullable=True)
    guarantee_calculation = Column(JSON, nullable=True)  # Detailed breakdown
    
    # Recommendations
    recommendation = Column(Text, nullable=True)
    
    # Timestamps
    calculated_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    application = relationship("AuthorizationApplication", back_populates="solvency_assessment")


class ConductDeclaration(Base):
    """5-year conduct record declaration answers."""
    
    __tablename__ = "conduct_declarations"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("authorization_applications.id"), nullable=False)
    
    # Question and answer
    question_id = Column(String(10), nullable=False)  # Q1, Q2, etc.
    question_text = Column(Text, nullable=False)
    answer = Column(Boolean, nullable=False)  # True = "Yes" (potential issue)
    
    # If answer is Yes, explanation required
    explanation = Column(Text, nullable=True)
    supporting_document_path = Column(String(500), nullable=True)
    
    # Risk assessment
    is_critical = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    application = relationship("AuthorizationApplication", back_populates="conduct_declarations")


class ImportThresholdTracking(Base):
    """De minimis threshold tracking for quarterly imports."""
    
    __tablename__ = "import_threshold_tracking"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=True)
    
    # Quarter identification
    year = Column(Integer, nullable=False)
    quarter = Column(Integer, nullable=False)  # 1, 2, 3, 4
    quarter_label = Column(String(10), nullable=False)  # e.g., "2026-Q1"
    
    # Tonnage tracking
    total_tonnage = Column(Numeric(12, 2), default=0)
    cbam_tonnage = Column(Numeric(12, 2), default=0)  # Only CBAM-covered goods
    
    # Commodity breakdown
    commodity_breakdown = Column(JSON, nullable=True)  # {cn_code: tonnage}
    
    # Threshold status
    status = Column(Enum(ThresholdStatus), default=ThresholdStatus.EXEMPT)
    remaining_buffer = Column(Numeric(10, 2), default=50)  # Tonnes until threshold
    
    # Alert tracking
    alert_40t_sent = Column(Boolean, default=False)
    alert_47t_sent = Column(Boolean, default=False)
    alert_50t_sent = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="threshold_tracking")

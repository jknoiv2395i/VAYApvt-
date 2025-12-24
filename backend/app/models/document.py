"""
Document model for uploaded invoices and reports.
"""

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Enum, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
import uuid

from app.core.database import Base


class DocumentType(str, enum.Enum):
    """Types of documents."""
    INVOICE = "invoice"
    PACKING_LIST = "packing_list"
    BILL_OF_LADING = "bill_of_lading"
    CERTIFICATE_OF_ORIGIN = "certificate_of_origin"
    OTHER = "other"


class DocumentStatus(str, enum.Enum):
    """Document processing status."""
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    EXTRACTED = "extracted"
    VALIDATED = "validated"
    ERROR = "error"


class Document(Base):
    """Document model for uploaded files."""
    
    __tablename__ = "documents"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Ownership
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=True)
    
    # File info
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)  # pdf, png, jpg, etc.
    file_size = Column(Integer, nullable=False)  # bytes
    storage_path = Column(String(500), nullable=False)  # S3/Supabase path
    
    # Document metadata
    document_type = Column(Enum(DocumentType), default=DocumentType.INVOICE)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.UPLOADED)
    
    # Extracted data (JSON)
    extracted_data = Column(JSON, nullable=True)
    extraction_confidence = Column(Float, nullable=True)
    
    # Invoice-specific fields (denormalized for quick access)
    invoice_number = Column(String(100), nullable=True)
    invoice_date = Column(DateTime, nullable=True)
    supplier_name = Column(String(255), nullable=True)
    buyer_name = Column(String(255), nullable=True)
    total_value = Column(Float, nullable=True)
    currency = Column(String(10), nullable=True)
    
    # HS Code extracted
    hs_code = Column(String(20), nullable=True)
    product_description = Column(Text, nullable=True)
    quantity = Column(Float, nullable=True)
    quantity_unit = Column(String(20), nullable=True)
    net_weight_kg = Column(Float, nullable=True)
    
    # Processing
    ocr_text = Column(Text, nullable=True)  # Raw OCR text
    processing_error = Column(Text, nullable=True)
    processed_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="documents")
    cbam_reports = relationship("CBAMReport", back_populates="document")


class CBAMReport(Base):
    """CBAM (Carbon Border Adjustment Mechanism) report."""
    
    __tablename__ = "cbam_reports"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Ownership
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=True)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=True)
    
    # Report identification
    report_number = Column(String(50), unique=True, nullable=False)
    reporting_period = Column(String(20), nullable=False)  # e.g., "2024-Q1"
    
    # Product info
    hs_code = Column(String(20), nullable=False)
    cn_code = Column(String(20), nullable=True)
    product_description = Column(Text, nullable=False)
    cbam_category = Column(String(50), nullable=False)  # iron_steel, aluminium, cement, fertilisers
    
    # Quantities
    quantity = Column(Float, nullable=False)
    quantity_unit = Column(String(20), nullable=False)
    net_weight_kg = Column(Float, nullable=False)
    
    # Emissions data
    direct_emissions = Column(Float, nullable=False)  # kg CO2e
    indirect_emissions = Column(Float, nullable=False)  # kg CO2e
    total_emissions = Column(Float, nullable=False)  # kg CO2e
    emission_factor_source = Column(String(50), nullable=True)  # "default", "actual", "verified"
    
    # Country/origin
    country_of_origin = Column(String(5), nullable=False)  # ISO country code
    installation_name = Column(String(255), nullable=True)
    installation_country = Column(String(5), nullable=True)
    
    # Pricing (for carbon cost)
    carbon_price_per_ton = Column(Float, nullable=True)  # EUR
    estimated_cbam_cost = Column(Float, nullable=True)  # EUR
    
    # Status
    status = Column(String(20), default="draft")  # draft, generated, submitted, validated
    xml_path = Column(String(500), nullable=True)  # Path to generated XML
    
    # Validation
    validation_errors = Column(JSON, nullable=True)
    validated_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    submitted_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="cbam_reports")
    document = relationship("Document", back_populates="cbam_reports")

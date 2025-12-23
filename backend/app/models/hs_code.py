from datetime import date
from typing import Optional, List
from sqlalchemy import String, Text, Numeric, Boolean, Date, Enum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import ARRAY
import enum

from app.core.database import Base


class CBAMCategory(str, enum.Enum):
    CEMENT = "cement"
    ELECTRICITY = "electricity"
    FERTILISERS = "fertilisers"
    IRON_STEEL = "iron_steel"
    ALUMINIUM = "aluminium"
    HYDROGEN = "hydrogen"


class HSCode(Base):
    """Indian ITC-HS Codes (master reference)."""
    
    __tablename__ = "hs_codes"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    hs_code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    unit_of_measurement: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    basic_duty_rate: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), nullable=True)
    igst_rate: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), nullable=True)
    
    is_restricted: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # For fuzzy search
    synonyms: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String), nullable=True)
    
    # First 2 digits for grouping
    chapter: Mapped[str] = mapped_column(String(2), nullable=False, index=True)
    
    updated_at: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    
    def __repr__(self) -> str:
        return f"<HSCode {self.hs_code}>"


class CNCode(Base):
    """EU Combined Nomenclature codes (for CBAM mapping)."""
    
    __tablename__ = "cn_codes"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    cn_code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    is_cbam_covered: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    cbam_category: Mapped[Optional[CBAMCategory]] = mapped_column(
        Enum(CBAMCategory), 
        nullable=True,
        index=True
    )
    
    # Default emission factors stored as JSON in production
    # For simplicity, storing direct/indirect as separate columns
    default_direct_emission: Mapped[Optional[float]] = mapped_column(Numeric(10, 4), nullable=True)
    default_indirect_emission: Mapped[Optional[float]] = mapped_column(Numeric(10, 4), nullable=True)
    
    updated_at: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    
    def __repr__(self) -> str:
        return f"<CNCode {self.cn_code}>"


class HSCNMapping(Base):
    """Mapping between Indian HS codes and EU CN codes."""
    
    __tablename__ = "hs_cn_mapping"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    hs_code: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    cn_code: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    
    mapping_confidence: Mapped[str] = mapped_column(
        String(20), 
        default="probable"
    )  # exact, probable, ambiguous
    
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    
    def __repr__(self) -> str:
        return f"<HSCNMapping {self.hs_code} -> {self.cn_code}>"

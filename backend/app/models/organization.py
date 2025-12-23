import uuid
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, BigInteger, Enum, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import enum

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class BusinessType(str, enum.Enum):
    MANUFACTURER = "manufacturer"
    TRADER = "trader"
    CHA = "cha"
    FREIGHT_FORWARDER = "freight_forwarder"


class Organization(Base):
    """Companies/entities (factories, CHA firms)."""
    
    __tablename__ = "organizations"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    legal_name: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Indian Identifiers
    gstin: Mapped[Optional[str]] = mapped_column(String(15), unique=True, nullable=True, index=True)
    iec_code: Mapped[Optional[str]] = mapped_column(String(10), unique=True, nullable=True, index=True)
    
    # EU Identifiers
    eori_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    
    business_type: Mapped[BusinessType] = mapped_column(
        Enum(BusinessType), 
        nullable=False
    )
    
    # Address
    address_line1: Mapped[str] = mapped_column(Text, nullable=False)
    address_line2: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(10), nullable=False)
    country: Mapped[str] = mapped_column(String(2), default="IN")
    
    # Business Info
    primary_industry: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    annual_export_volume: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now()
    )
    
    # Relationships
    users: Mapped[List["User"]] = relationship(back_populates="organization")
    
    def __repr__(self) -> str:
        return f"<Organization {self.name}>"

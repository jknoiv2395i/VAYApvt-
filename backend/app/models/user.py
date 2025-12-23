import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Boolean, Enum, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import enum

from app.core.database import Base


class UserRole(str, enum.Enum):
    EXPORTER = "exporter"
    CHA = "cha"
    ADMIN = "admin"
    VERIFIER = "verifier"


class KYCStatus(str, enum.Enum):
    PENDING = "pending"
    SUBMITTED = "submitted"
    VERIFIED = "verified"
    REJECTED = "rejected"


class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class User(Base):
    """Core user accounts (exporters, CHAs, admin)."""
    
    __tablename__ = "users"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    phone: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    whatsapp_number: Mapped[Optional[str]] = mapped_column(String(20), unique=True, nullable=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole), 
        default=UserRole.EXPORTER, 
        nullable=False
    )
    organization_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("organizations.id"), 
        nullable=True
    )
    
    language_preference: Mapped[str] = mapped_column(String(10), default="en")
    onboarding_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    kyc_status: Mapped[KYCStatus] = mapped_column(
        Enum(KYCStatus), 
        default=KYCStatus.PENDING
    )
    subscription_tier: Mapped[SubscriptionTier] = mapped_column(
        Enum(SubscriptionTier), 
        default=SubscriptionTier.FREE
    )
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now()
    )
    last_active_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), 
        nullable=True
    )
    
    # Relationships
    organization: Mapped[Optional["Organization"]] = relationship(
        back_populates="users"
    )
    
    def __repr__(self) -> str:
        return f"<User {self.email}>"

import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole, KYCStatus, SubscriptionTier


# --- Auth Schemas ---

class UserRegister(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    phone: str = Field(..., pattern=r"^\+[1-9]\d{1,14}$", description="E.164 format")
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2, max_length=255)
    role: UserRole = UserRole.EXPORTER


class UserLogin(BaseModel):
    """Schema for user login."""
    identifier: str  # email or phone
    password: str


class Token(BaseModel):
    """Token response schema."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    """Token refresh request."""
    refresh_token: str


# --- User Response Schemas ---

class UserBase(BaseModel):
    """Base user schema."""
    id: uuid.UUID
    email: EmailStr
    phone: str
    full_name: str
    role: UserRole
    language_preference: str
    onboarding_completed: bool
    kyc_status: KYCStatus
    subscription_tier: SubscriptionTier
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    """User response with token."""
    user: UserBase
    access_token: str
    refresh_token: str


class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    language_preference: Optional[str] = None

import enum
import re
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class AccountStatus(str, enum.Enum):
    active = "active"
    suspended = "suspended"
    deleted = "deleted"

class SubscriptionPlan(str, enum.Enum):
    free = "free"
    pro = "pro"
    enterprise = "enterprise"

def validate_strong_password(value: str) -> str:
    if not re.search(r"[A-Z]", value):
        raise ValueError("Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", value):
        raise ValueError("Password must contain at least one lowercase letter")
    if not re.search(r"\d", value):
        raise ValueError("Password must contain at least one number")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
        raise ValueError("Password must contain at least one special character")
    return value

class CompanyBase(BaseModel):
    company_email: EmailStr
    company_name: str
    industry: Optional[str] = None
    company_website: Optional[str] = None
    country: Optional[str] = None
    linkedin_company_page: Optional[str] = None
    
    services_description: Optional[str] = None
    target_industries: Optional[List[str]] = None
    preferred_company_size: Optional[str] = None
    
    brand_voice: Optional[str] = None
    default_cta: Optional[str] = None
    email_signature: Optional[str] = None
    preferred_tone: Optional[str] = None

class CompanyCreate(CompanyBase):
    owner_id: UUID
    company_password: str = Field(..., min_length=8)

    @field_validator("company_password")
    @classmethod
    def check_company_password_strength(cls, v: str) -> str:
        return validate_strong_password(v)

class CompanyUpdate(BaseModel):
    company_email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    industry: Optional[str] = None
    company_website: Optional[str] = None
    country: Optional[str] = None
    linkedin_company_page: Optional[str] = None
    subscription_plan: Optional[SubscriptionPlan] = None
    account_status: Optional[AccountStatus] = None
    
    services_description: Optional[str] = None
    target_industries: Optional[List[str]] = None
    preferred_company_size: Optional[str] = None
    
    brand_voice: Optional[str] = None
    default_cta: Optional[str] = None
    email_signature: Optional[str] = None
    preferred_tone: Optional[str] = None

class CompanyResponse(CompanyBase):
    company_id: UUID
    owner_id: UUID
    subscription_plan: SubscriptionPlan
    account_status: AccountStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# --- Authentication & Login Schemas ---

class CompanyLogin(BaseModel):
    company_email: EmailStr
    company_password: str = Field(..., description="The company's raw password")

class CompanyTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    # Optional: Included so the frontend can immediately load the company's profile upon login
    company: Optional[CompanyResponse] = None


class CompanyListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    company_id: UUID
    company_name: str
    company_email: EmailStr
    industry: str | None = None
    company_website: str | None = None
    country: str | None = None
    subscription_plan: str
    account_status: str
    created_at: datetime
    updated_at: datetime | None = None


class CompanyMeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    company_email: EmailStr
    company_name: str
    industry: str | None = None
    company_website: str | None = None
    country: str | None = None
    linkedin_company_page: str | None = None
    services_description: str | None = None
    target_industries: list[str] | None = None
    preferred_company_size: str | None = None
    brand_voice: str | None = None
    default_cta: str | None = None
    email_signature: str | None = None
    preferred_tone: str | None = None
    company_id: UUID
    owner_id: UUID
    subscription_plan: str
    account_status: str
    created_at: datetime
    updated_at: datetime | None = None
import enum
import re
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from typing import Optional
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

class UserBase(BaseModel):
    full_name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Must be at least 8 characters")

    @field_validator("password")
    @classmethod
    def check_password_strength(cls, v: str) -> str:
        return validate_strong_password(v)

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    account_status: Optional[AccountStatus] = None

class UserResponse(UserBase):
    user_id: UUID
    account_status: AccountStatus
    email_verification_status: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# --- Authentication & Login Schemas ---

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., description="The user's raw password")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    # Optional: Included so the frontend can immediately load the user's profile
    user: Optional[UserResponse] = None



class OwnerMeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    full_name: str
    email: EmailStr
    user_id: UUID
    account_status: str
    email_verification_status: bool
    created_at: datetime
    updated_at: datetime | None = None
    last_login: datetime | None = None
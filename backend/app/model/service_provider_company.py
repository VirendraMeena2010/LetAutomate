import uuid
import enum
from sqlalchemy import Column, String, Boolean, Text, DateTime, Enum, ForeignKey, func
from sqlalchemy.types import Uuid
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from app.core.database import Base

# --- Enums ---
class AccountStatus(str, enum.Enum):
    active = "active"
    suspended = "suspended"
    deleted = "deleted"

class SubscriptionPlan(str, enum.Enum):
    free = "free"
    pro = "pro"
    enterprise = "enterprise"

# --- 1. 

# --- 2. Service Provider Company Model (Sub-Account) ---
class ServiceProviderCompany(Base):
    __tablename__ = "service_provider_companies" 

    company_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(Uuid(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)

    # Dedicated Company Login Credentials
    company_email = Column(String(255), unique=True, index=True, nullable=False)
    company_password_hash = Column(String(255), nullable=False)

    # Core Company Info
    company_name = Column(String(255), nullable=False, index=True)
    industry = Column(String(255), nullable=True)
    company_website = Column(String(255), nullable=True)
    country = Column(String(100), nullable=True)
    linkedin_company_page = Column(String(255), nullable=True)
    
    # --- Billing & Subscription tied to the Company ---
    subscription_plan = Column(Enum(SubscriptionPlan), default=SubscriptionPlan.free, nullable=False)
    account_status = Column(Enum(AccountStatus), default=AccountStatus.active, nullable=False)
    # Targeting & Offerings
    services_description = Column(Text, nullable=True)
    target_industries = Column(ARRAY(String), nullable=True)
    preferred_company_size = Column(String(100), nullable=True)
    
    # AI Branding & Outreach Settings
    brand_voice = Column(String(255), nullable=True)
    default_cta = Column(String(255), nullable=True)
    email_signature = Column(Text, nullable=True)
    preferred_tone = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    owner = relationship("User", back_populates="companies")

    def __repr__(self):
        return f"<ServiceProviderCompany(name='{self.company_name}', plan='{self.subscription_plan}')>"
import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Enum, func
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship
from app.core.database import Base

# Define Enums for choice fields
class AccountStatus(str, enum.Enum):
    active = "active"
    suspended = "suspended"
    deleted = "deleted"

class User(Base):
    __tablename__ = "users"

    user_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Personal Login Credentials
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    # Account Management
    account_status = Column(Enum(AccountStatus), default=AccountStatus.active, nullable=False)
    email_verification_status = Column(Boolean, default=False, nullable=False)

    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationship
    companies = relationship("ServiceProviderCompany", back_populates="owner", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(email='{self.email}')>"

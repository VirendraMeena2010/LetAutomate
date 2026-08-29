import uuid
from sqlalchemy import Column, String, Integer, Text, DateTime, func
from sqlalchemy.types import Uuid

from app.core.database import Base

class Company(Base):
    __tablename__ = "companies"

    # Primary Key
    company_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Core Company Info
    company_name = Column(String(255), index=True, nullable=False)
    website = Column(String(255), nullable=True)
    industry = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    headquarters = Column(String(255), nullable=True)
    
    # Metrics & Firmographics
    employee_count = Column(String(100), nullable=True) 
    revenue_estimate = Column(String(100), nullable=True)
    growth_stage = Column(String(100), nullable=True)
    founded_year = Column(Integer, nullable=True)
    
    # Timestamps
    # Combines both creation default and update triggers into a single field
    last_updated = Column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(), 
        nullable=False
    )

    def __repr__(self):
        return f"<Company(name='{self.company_name}')>"
import uuid
from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship

from app.core.database import Base

class BusinessSignal(Base):
    __tablename__ = "business_signals"

    signal_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(Uuid(as_uuid=True), ForeignKey("companies.company_id", ondelete="CASCADE"), nullable=False)
    
    signal_type = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    source = Column(String(255), nullable=True)
    published_date = Column(DateTime(timezone=True), nullable=True)
    confidence_score = Column(Float, nullable=True)

    company = relationship("Company", backref="business_signals")

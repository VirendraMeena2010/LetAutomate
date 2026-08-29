import uuid
from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship

from app.core.database import Base

class DecisionMaker(Base):
    __tablename__ = "decision_makers"

    decision_maker_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(Uuid(as_uuid=True), ForeignKey("companies.company_id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    position = Column(String(255), nullable=True)
    department = Column(String(100), nullable=True)
    seniority = Column(String(100), nullable=True)
    confidence_score = Column(Float, nullable=True)

    company = relationship("Company", backref="decision_makers")

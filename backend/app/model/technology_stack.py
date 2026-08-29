import uuid
from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship

from app.core.database import Base

class TechnologyStack(Base):
    __tablename__ = "technology_stack"

    technology_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(Uuid(as_uuid=True), ForeignKey("companies.company_id", ondelete="CASCADE"), nullable=False)
    
    category = Column(String(100), nullable=True)
    technology_name = Column(String(255), nullable=False)
    confidence_score = Column(Float, nullable=True)
    detection_source = Column(String(255), nullable=True)
    
    company = relationship("Company", backref="technologies")

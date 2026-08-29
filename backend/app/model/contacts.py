import uuid
from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship

from app.core.database import Base

class Contact(Base):
    __tablename__ = "contacts"

    contact_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    decision_maker_id = Column(Uuid(as_uuid=True), ForeignKey("decision_makers.decision_maker_id", ondelete="CASCADE"), nullable=False, unique=True)
    
    email = Column(String(255), nullable=True)
    linkedin = Column(String(255), nullable=True)
    twitter_x = Column(String(255), nullable=True)
    company_phone = Column(String(100), nullable=True)
    contact_confidence = Column(Float, nullable=True)

    decision_maker = relationship("DecisionMaker", backref="contact_info")

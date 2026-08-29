import uuid
import enum
from sqlalchemy import Column, Enum, DateTime, ForeignKey, func
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship

from app.core.database import Base

class EventType(str, enum.Enum):
    sent = "sent"
    delivered = "delivered"
    opened = "opened"
    clicked = "clicked"
    replied = "replied"
    failed = "failed"

class CampaignEvent(Base):
    __tablename__ = "campaign_events"

    event_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = Column(Uuid(as_uuid=True), ForeignKey("campaigns.campaign_id", ondelete="CASCADE"), nullable=False)
    email_id = Column(Uuid(as_uuid=True), ForeignKey("generated_emails.email_id", ondelete="SET NULL"), nullable=True)
    
    event_type = Column(Enum(EventType), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    campaign = relationship("Campaign", backref="events")
    email = relationship("GeneratedEmail")

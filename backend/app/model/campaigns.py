import uuid
import enum
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, func
from sqlalchemy.types import Uuid
from sqlalchemy.orm import relationship

from app.core.database import Base

class CampaignStatus(str, enum.Enum):
    draft = "draft"
    scheduled = "scheduled"
    running = "running"
    paused = "paused"
    completed = "completed"

class Campaign(Base):
    __tablename__ = "campaigns"

    campaign_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    
    campaign_name = Column(String(255), nullable=False)
    campaign_status = Column(Enum(CampaignStatus), default=CampaignStatus.draft, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    user = relationship("User", backref="campaigns")

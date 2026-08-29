import uuid
from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.types import Uuid
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base

class UserSetting(Base):
    __tablename__ = "user_settings"

    setting_id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, unique=True)
    
    brand_voice = Column(String(255), nullable=True)
    default_cta = Column(String(255), nullable=True)
    email_signature = Column(Text, nullable=True)
    preferred_tone = Column(String(100), nullable=True)
    preferred_outreach_style = Column(String(100), nullable=True)
    
    # Store JSON format preferences
    notification_preferences = Column(JSONB, nullable=True, default={})

    user = relationship("User", backref="settings")

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.sqlite import CHAR
from sqlalchemy.orm import relationship
from app.database.db import Base


def generate_uuid():
    return str(uuid.uuid4())


class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(CHAR(36), primary_key=True, default=generate_uuid)
    entry_id = Column(CHAR(36), ForeignKey("diary_entries.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(String(20), nullable=False, default="0")
    created_at = Column(DateTime, default=datetime.utcnow)

    entry = relationship("DiaryEntry", back_populates="attachments")

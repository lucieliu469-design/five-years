import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.sqlite import CHAR
from sqlalchemy.orm import relationship
from app.database.db import Base


def generate_uuid():
    return str(uuid.uuid4())


class DiaryEntry(Base):
    __tablename__ = "diary_entries"

    id = Column(CHAR(36), primary_key=True, default=generate_uuid)
    date = Column(String(10), nullable=False, index=True)
    year = Column(Integer, nullable=False, index=True)
    month = Column(Integer, nullable=False)
    day = Column(Integer, nullable=False)
    title = Column(String(200), nullable=False, default="")
    weather = Column(String(50), nullable=False, default="")
    mood = Column(String(50), nullable=False, default="")
    content = Column(Text, nullable=False, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    attachments = relationship("Attachment", back_populates="entry", cascade="all, delete-orphan")

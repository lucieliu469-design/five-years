from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import Base


class ProustQuestion(Base):
    __tablename__ = "proust_questions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    question_cn = Column(Text, nullable=False)
    question_en = Column(Text, nullable=False)
    order_index = Column(Integer, nullable=False)

    answers = relationship("ProustAnswer", back_populates="question", cascade="all, delete-orphan")


class ProustAnswer(Base):
    __tablename__ = "proust_answers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    question_id = Column(Integer, ForeignKey("proust_questions.id", ondelete="CASCADE"), nullable=False)
    year = Column(Integer, nullable=False)
    answer = Column(Text, nullable=False, default="")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    question = relationship("ProustQuestion", back_populates="answers")

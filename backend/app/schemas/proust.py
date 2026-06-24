from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProustQuestionOut(BaseModel):
    id: int
    question_cn: str
    question_en: str
    order_index: int

    class Config:
        from_attributes = True


class ProustAnswerCreate(BaseModel):
    question_id: int
    year: int
    answer: str


class ProustAnswerUpdate(BaseModel):
    answer: str


class ProustAnswerOut(BaseModel):
    id: int
    question_id: int
    year: int
    answer: str
    updated_at: datetime

    class Config:
        from_attributes = True


class ProustQuestionWithAnswers(BaseModel):
    id: int
    question_cn: str
    question_en: str
    order_index: int
    answers: List[ProustAnswerOut] = []

    class Config:
        from_attributes = True

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class AttachmentOut(BaseModel):
    id: str
    file_name: str
    file_type: str
    file_path: str
    file_size: str
    created_at: datetime

    class Config:
        from_attributes = True


class DiaryCreate(BaseModel):
    date: str = Field(..., description="YYYY-MM-DD")
    year: Optional[int] = None
    month: Optional[int] = None
    day: Optional[int] = None
    title: str = ""
    weather: str = ""
    mood: str = ""
    content: str = ""


class DiaryUpdate(BaseModel):
    title: Optional[str] = None
    weather: Optional[str] = None
    mood: Optional[str] = None
    content: Optional[str] = None


class DiaryOut(BaseModel):
    id: str
    date: str
    year: int
    month: int
    day: int
    title: str
    weather: str
    mood: str
    content: str
    created_at: datetime
    updated_at: datetime
    attachments: List[AttachmentOut] = []

    class Config:
        from_attributes = True


class CalendarDayOut(BaseModel):
    date: str
    year: int
    month: int
    day: int
    has_entry: bool
    entry_id: Optional[str] = None


class MonthStatsOut(BaseModel):
    year: int
    month: int
    total_days: int
    days_with_entries: int
    entries: List[CalendarDayOut]

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.db import get_db
from app.models.diary import DiaryEntry
from app.models.attachment import Attachment
from app.schemas.diary import DiaryCreate, DiaryUpdate, DiaryOut, CalendarDayOut
from app.schemas.attachment import AttachmentOut
from datetime import datetime

router = APIRouter(prefix="/entries", tags=["entries"])


@router.post("", response_model=DiaryOut)
def create_entry(data: DiaryCreate, db: Session = Depends(get_db)):
    # Parse year/month/day from date string if not provided
    parts = data.date.split("-")
    year = data.year if data.year is not None else int(parts[0])
    month = data.month if data.month is not None else int(parts[1])
    day = data.day if data.day is not None else int(parts[2])

    existing = db.query(DiaryEntry).filter(DiaryEntry.date == data.date).first()
    if existing:
        raise HTTPException(status_code=409, detail="Entry for this date already exists")

    entry = DiaryEntry(
        date=data.date,
        year=year,
        month=month,
        day=day,
        title=data.title,
        weather=data.weather,
        mood=data.mood,
        content=data.content,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("", response_model=List[DiaryOut])
def list_entries(
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    day: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(DiaryEntry)
    if year is not None:
        q = q.filter(DiaryEntry.year == year)
    if month is not None:
        q = q.filter(DiaryEntry.month == month)
    if day is not None:
        q = q.filter(DiaryEntry.day == day)
    return q.order_by(DiaryEntry.date.desc()).all()


@router.get("/dates", response_model=List[CalendarDayOut])
def list_entry_dates(
    year: int = Query(...),
    month: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(DiaryEntry)
    q = q.filter(DiaryEntry.year == year)
    if month is not None:
        q = q.filter(DiaryEntry.month == month)
    entries = q.all()
    return [
        CalendarDayOut(date=e.date, year=e.year, month=e.month, day=e.day, has_entry=True, entry_id=e.id)
        for e in entries
    ]


@router.get("/{entry_id}", response_model=DiaryOut)
def get_entry(entry_id: str, db: Session = Depends(get_db)):
    entry = db.query(DiaryEntry).filter(DiaryEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


@router.put("/{entry_id}", response_model=DiaryOut)
def update_entry(entry_id: str, data: DiaryUpdate, db: Session = Depends(get_db)):
    entry = db.query(DiaryEntry).filter(DiaryEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(entry, key, value)
    entry.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}")
def delete_entry(entry_id: str, db: Session = Depends(get_db)):
    entry = db.query(DiaryEntry).filter(DiaryEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
    return {"ok": True}

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database.db import get_db
from app.models.diary import DiaryEntry
from app.schemas.diary import CalendarDayOut
from calendar import monthrange

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.get("/year/{year}", response_model=List[CalendarDayOut])
def year_calendar(year: int, db: Session = Depends(get_db)):
    entries = db.query(DiaryEntry).filter(DiaryEntry.year == year).all()
    entry_map = {e.date: e.id for e in entries}
    result = []
    for month in range(1, 13):
        days_in_month = monthrange(year, month)[1]
        for day in range(1, days_in_month + 1):
            date_str = f"{year}-{month:02d}-{day:02d}"
            has_entry = date_str in entry_map
            result.append(CalendarDayOut(
                date=date_str,
                year=year,
                month=month,
                day=day,
                has_entry=has_entry,
                entry_id=entry_map.get(date_str),
            ))
    return result


@router.get("/month/{year}/{month}", response_model=List[CalendarDayOut])
def month_calendar(year: int, month: int, db: Session = Depends(get_db)):
    entries = db.query(DiaryEntry).filter(
        DiaryEntry.year == year,
        DiaryEntry.month == month,
    ).all()
    entry_map = {e.date: e.id for e in entries}
    days_in_month = monthrange(year, month)[1]
    result = []
    for day in range(1, days_in_month + 1):
        date_str = f"{year}-{month:02d}-{day:02d}"
        has_entry = date_str in entry_map
        result.append(CalendarDayOut(
            date=date_str,
            year=year,
            month=month,
            day=day,
            has_entry=has_entry,
            entry_id=entry_map.get(date_str),
        ))
    return result


@router.get("/stats")
def calendar_stats(
    year: int = Query(...),
    month: int = Query(...),
    db: Session = Depends(get_db),
):
    total_days = monthrange(year, month)[1]
    entries_count = db.query(DiaryEntry).filter(
        DiaryEntry.year == year,
        DiaryEntry.month == month,
    ).count()
    return {
        "year": year,
        "month": month,
        "total_days": total_days,
        "days_with_entries": entries_count,
    }

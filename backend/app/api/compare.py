from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database.db import get_db
from app.models.diary import DiaryEntry
from app.schemas.diary import DiaryOut

router = APIRouter(prefix="/comparison", tags=["comparison"])


@router.get("/{month}/{day}")
def compare_entries(
    month: int,
    day: int,
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    years_to_check = [2026, 2027, 2028, 2029, 2030]
    if year is not None:
        years_to_check = [year]

    years = []
    for y in years_to_check:
        date_str = f"{y}-{month:02d}-{day:02d}"
        entry = db.query(DiaryEntry).filter(DiaryEntry.date == date_str).first()
        if entry:
            years.append({
                "year": y,
                "entry": {
                    "id": entry.id,
                    "date": entry.date,
                    "year": entry.year,
                    "month": entry.month,
                    "day": entry.day,
                    "title": entry.title,
                    "weather": entry.weather,
                    "mood": entry.mood,
                    "content": entry.content,
                    "created_at": entry.created_at.isoformat() if entry.created_at else None,
                    "updated_at": entry.updated_at.isoformat() if entry.updated_at else None,
                    "attachments": [
                        {
                            "id": a.id,
                            "file_name": a.file_name,
                            "file_type": a.file_type,
                            "file_path": a.file_path,
                            "file_size": a.file_size,
                            "created_at": a.created_at.isoformat() if a.created_at else None,
                        }
                        for a in entry.attachments
                    ],
                },
            })
        else:
            years.append({"year": y, "entry": None})
    return {"month": month, "day": day, "years": years}

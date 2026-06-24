import os
import uuid
import shutil
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.diary import DiaryEntry
from app.models.attachment import Attachment
from app.schemas.attachment import AttachmentOut, UploadResponse

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA_BASE = os.path.join(BACKEND_DIR, "media")
ALLOWED_EXTENSIONS = {
    "image": {"jpg", "jpeg", "png", "gif", "webp"},
    "video": {"mp4", "mov"},
    "audio": {"mp3", "wav", "m4a"},
    "pdf": {"pdf"},
}

router = APIRouter(prefix="/attachments", tags=["attachments"])


def get_media_type(ext: str) -> str:
    ext = ext.lower().lstrip(".")
    for media_type, exts in ALLOWED_EXTENSIONS.items():
        if ext in exts:
            return media_type
    return "other"


@router.post("/upload/{entry_id}", response_model=UploadResponse)
async def upload_file(entry_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    entry = db.query(DiaryEntry).filter(DiaryEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    media_type = get_media_type(ext)
    if media_type == "other":
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")

    subdir = os.path.join(MEDIA_BASE, f"{media_type}s")
    os.makedirs(subdir, exist_ok=True)

    file_id = str(uuid.uuid4())
    stored_name = f"{file_id}.{ext}" if ext else file_id
    file_path_full = os.path.join(subdir, stored_name)

    with open(file_path_full, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path_full)
    size_str = format_file_size(file_size)

    attachment = Attachment(
        entry_id=entry_id,
        file_name=file.filename,
        file_type=media_type,
        file_path=f"media/{media_type}s/{stored_name}",
        file_size=size_str,
    )
    db.add(attachment)
    db.commit()
    db.refresh(attachment)

    return UploadResponse(
        id=attachment.id,
        file_name=attachment.file_name,
        file_type=attachment.file_type,
        file_path=attachment.file_path,
        file_size=attachment.file_size,
    )


@router.get("/entry/{entry_id}", response_model=List[AttachmentOut])
def list_attachments(entry_id: str, db: Session = Depends(get_db)):
    return db.query(Attachment).filter(Attachment.entry_id == entry_id).all()


@router.delete("/{attachment_id}")
def delete_attachment(attachment_id: str, db: Session = Depends(get_db)):
    attachment = db.query(Attachment).filter(Attachment.id == attachment_id).first()
    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")

    full_path = os.path.join(BACKEND_DIR, attachment.file_path)
    if os.path.exists(full_path):
        os.remove(full_path)

    db.delete(attachment)
    db.commit()
    return {"ok": True}


def format_file_size(size: int) -> str:
    for unit in ["B", "KB", "MB", "GB"]:
        if size < 1024:
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{size:.1f} TB"

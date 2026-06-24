from pydantic import BaseModel
from datetime import datetime


class AttachmentOut(BaseModel):
    id: str
    entry_id: str
    file_name: str
    file_type: str
    file_path: str
    file_size: str
    created_at: datetime

    class Config:
        from_attributes = True


class UploadResponse(BaseModel):
    id: str
    file_name: str
    file_type: str
    file_path: str
    file_size: str

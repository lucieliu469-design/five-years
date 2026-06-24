from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database.db import engine, Base
from app.database.seed_proust import seed_proust_questions
from app.api.diary import router as diary_router
from app.api.calendar import router as calendar_router
from app.api.upload import router as upload_router
from app.api.proust import router as proust_router
from app.api.compare import router as compare_router

Base.metadata.create_all(bind=engine)
seed_proust_questions()

app = FastAPI(title="Five Years Journal API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MEDIA_DIR = os.path.join(os.path.dirname(__file__), "media")
os.makedirs(MEDIA_DIR, exist_ok=True)
for sub in ["images", "videos", "audio", "pdf"]:
    os.makedirs(os.path.join(MEDIA_DIR, sub), exist_ok=True)

if os.path.isdir(MEDIA_DIR):
    app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")

app.include_router(diary_router, prefix="/api")
app.include_router(calendar_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(proust_router, prefix="/api")
app.include_router(compare_router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok", "app": "Five Years Journal"}




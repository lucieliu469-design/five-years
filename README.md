# Five Years Journal

A local-first personal diary application to record daily experiences from 2026 to 2030, with the ability to compare entries from the same calendar day across all five years.

## Features

- **Year & Month Calendar Views** — Navigate through 2026–2030, see which days have entries
- **Rich Text Diary Editor** — Bold, italic, underline, headings, and colored text with uploads
- **Five-Year Comparison** — View entries for the same month/day across all five years side-by-side
- **Proust Questionnaire** — 35 predefined questions with edit and comparison modes
- **Media Attachments** — Drag-and-drop upload for images, videos, audio, and PDFs
- **Warm Minimalist UI** — A cozy, journal-like color palette (#FFF8F0, #F5E8D8, #D6A77A, #8E6E53)

## Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | React, TypeScript, Vite, Tailwind |
| Backend  | FastAPI, SQLAlchemy, Pydantic     |
| Database | SQLite                            |
| Storage  | Local File System                 |

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- pip

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs on **http://127.0.0.1:8000**.  
The database is created automatically at `data/journal.db`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on **http://localhost:5173** with API proxy to the backend.

### Verify

Open **http://localhost:5173** in your browser.

## Project Structure

```
five-years-journal/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/              # API client functions
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Calendar/     # MonthCalendar, YearCalendar
│   │   │   ├── Diary/        # DiaryCard, CompareColumn
│   │   │   ├── Editor/       # RichTextEditor (Tiptap)
│   │   │   ├── Attachment/   # UploadZone, AttachmentList
│   │   │   ├── Proust/       # ProustCard, ProustCompare
│   │   │   ├── Layout/       # App layout with navigation
│   │   │   └── ui/           # Shadcn-style primitives
│   │   ├── hooks/            # React Query hooks
│   │   ├── pages/            # Dashboard, DiaryEditor, CompareView, Proust
│   │   ├── routes/           # React Router config
│   │   ├── store/            # App state context
│   │   ├── types/            # TypeScript interfaces
│   │   └── styles/           # Tailwind globals
│   └── ...
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/              # REST endpoints
│   │   ├── database/         # DB connection, seed data
│   │   ├── models/           # SQLAlchemy models
│   │   └── schemas/          # Pydantic schemas
│   │   ├── media/           # Uploaded files storage
│   │   │   ├── images/
│   │   │   ├── videos/
│   │   │   ├── audio/
│   │   │   └── pdf/
│   └── ...
└── data/                     # SQLite database file
    └── journal.db
```

## API Endpoints

| Method   | Endpoint                          | Description              |
| -------- | --------------------------------- | ------------------------ |
| GET      | /api/calendar/year/{year}         | Year calendar with dots  |
| GET      | /api/calendar/month/{year}/{month}| Month calendar with dots |
| GET      | /api/calendar/stats?year=&month=  | Calendar statistics      |
| GET      | /api/entries                      | List diary entries       |
| POST     | /api/entries                      | Create diary entry       |
| GET      | /api/entries/{id}                 | Get diary entry          |
| PUT      | /api/entries/{id}                 | Update diary entry       |
| DELETE   | /api/entries/{id}                 | Delete diary entry       |
| GET      | /api/entries/dates?year=&month=   | Entry date list          |
| POST     | /api/attachments/upload/{id}      | Upload attachment        |
| GET      | /api/attachments/entry/{id}       | List entry attachments   |
| DELETE   | /api/attachments/{id}             | Delete attachment        |
| GET      | /api/proust/questions             | List Proust questions    |
| GET      | /api/proust/questions/with-answers| Questions with answers   |
| POST     | /api/proust/answers               | Upsert Proust answer     |
| GET      | /api/proust/answers/{question_id} | Get answers for question |
| GET      | /api/comparison/{month}/{day}     | Five-year comparison     |
| GET      | /api/health                       | Health check             |

## Color Palette

- Background: `#FFF8F0`
- Light accent: `#F5E8D8`
- Primary: `#D6A77A`
- Text: `#8E6E53`

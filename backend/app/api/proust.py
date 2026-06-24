from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database.db import get_db
from app.models.proust import ProustQuestion, ProustAnswer
from app.schemas.proust import (
    ProustQuestionOut,
    ProustQuestionWithAnswers,
    ProustAnswerCreate,
    ProustAnswerUpdate,
    ProustAnswerOut,
)

router = APIRouter(prefix="/proust", tags=["proust"])


@router.get("/questions", response_model=List[ProustQuestionOut])
def list_questions(db: Session = Depends(get_db)):
    return db.query(ProustQuestion).order_by(ProustQuestion.order_index).all()


@router.get("/questions/with-answers", response_model=List[ProustQuestionWithAnswers])
def list_questions_with_answers(
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    questions = db.query(ProustQuestion).order_by(ProustQuestion.order_index).all()
    result = []
    for q in questions:
        answers_q = db.query(ProustAnswer).filter(ProustAnswer.question_id == q.id)
        if year is not None:
            answers_q = answers_q.filter(ProustAnswer.year == year)
        answers = answers_q.all()
        q_data = ProustQuestionWithAnswers(
            id=q.id,
            question_cn=q.question_cn,
            question_en=q.question_en,
            order_index=q.order_index,
            answers=[ProustAnswerOut.model_validate(a) for a in answers],
        )
        result.append(q_data)
    return result


@router.post("/answers", response_model=ProustAnswerOut)
def create_or_update_answer(data: ProustAnswerCreate, db: Session = Depends(get_db)):
    question = db.query(ProustQuestion).filter(ProustQuestion.id == data.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    existing = db.query(ProustAnswer).filter(
        ProustAnswer.question_id == data.question_id,
        ProustAnswer.year == data.year,
    ).first()

    if existing:
        existing.answer = data.answer
        existing.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return existing
    else:
        answer = ProustAnswer(
            question_id=data.question_id,
            year=data.year,
            answer=data.answer,
        )
        db.add(answer)
        db.commit()
        db.refresh(answer)
        return answer


@router.put("/answers/{answer_id}", response_model=ProustAnswerOut)
def update_answer(answer_id: int, data: ProustAnswerUpdate, db: Session = Depends(get_db)):
    answer = db.query(ProustAnswer).filter(ProustAnswer.id == answer_id).first()
    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found")
    answer.answer = data.answer
    answer.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(answer)
    return answer


@router.get("/answers/{question_id}", response_model=List[ProustAnswerOut])
def get_answers_by_question(
    question_id: int,
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ProustAnswer).filter(ProustAnswer.question_id == question_id)
    if year is not None:
        q = q.filter(ProustAnswer.year == year)
    return q.order_by(ProustAnswer.year).all()


@router.get("/comparison/{question_id}", response_model=List[ProustAnswerOut])
def compare_answers(question_id: int, db: Session = Depends(get_db)):
    return (
        db.query(ProustAnswer)
        .filter(ProustAnswer.question_id == question_id)
        .order_by(ProustAnswer.year)
        .all()
    )

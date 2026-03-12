# backend/app/routers/exams.py
# NEW: Exam Management & AI Question Generation

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict
import uuid
import datetime
import os
import httpx # For calling Anthropic/OpenAI

router = APIRouter()

from app.services.claude_analyzer import generate_exam_questions

# ── SCHEMAS ────────────────────────────────────────────────
class QuestionBase(BaseModel):
    question_text: str
    options: Dict[str, str]
    correct_answer: str # A, B, C, or D
    explanation: Optional[str] = None
    difficulty: str = "MEDIUM"
    topic_tag: Optional[str] = None

class ExamCreate(BaseModel):
    title: str
    description: str
    duration: int
    maxStudents: int
    scheduledAt: str
    questions: List[QuestionBase]

class AIParams(BaseModel):
    topic: str
    difficulty: str
    count: int
    exam_name: str = "Exam"

# ── ENDPOINTS ──────────────────────────────────────────────

@router.post("/exams/create")
async def create_exam(exam: ExamCreate):
    exam_id = str(uuid.uuid4())
    # ... logic to save to Supabase would go here ...
    return {
        "success": True,
        "exam_id": exam_id
    }

@router.post("/exams/generate-questions")
async def generate_questions_api(params: AIParams):
    """
    Calls Agent D via claude_analyzer to generate MCQ questions.
    """
    try:
        questions = await generate_exam_questions(
            topic=params.topic,
            difficulty=params.difficulty,
            question_count=params.count,
            exam_name=params.exam_name
        )
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Generation failed: {str(e)}")

@router.get("/exams/{exam_id}/status")
async def get_exam_status(exam_id: str):
    return {"status": "published"}

@router.put("/exams/{exam_id}/publish")
async def publish_exam(exam_id: str):
    return {"success": True}

@router.post("/exams/{exam_id}/students/generate")
async def generate_exam_students(exam_id: str, payload: dict):
    count = payload.get("count", 30)
    credentials = []
    for _ in range(count):
        student_uid = f"COG-ST-{str(uuid.uuid4())[:8].upper()}"
        plain_password = str(uuid.uuid4())[:8]
        credentials.append({
            "student_uid": student_uid,
            "plain_password": plain_password,
            "exam_id": exam_id
        })
    return {"credentials": credentials}

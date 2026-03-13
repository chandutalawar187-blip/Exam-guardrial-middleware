# backend/app/routers/exams.py
# NEW: Exam Management & AI Question Generation

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import uuid
import datetime
import os
import httpx # For calling Anthropic/OpenAI

router = APIRouter()

# ── SCHEMAS ────────────────────────────────────────────────
class QuestionBase(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str # A, B, C, or D
    marks: int = 1

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

# ── ENDPOINTS ──────────────────────────────────────────────

@router.post("/exams/create")
async def create_exam(exam: ExamCreate):
    exam_id = str(uuid.uuid4())
    
    # Generate N student ID + password pairs where N = maxStudents
    credentials = []
    for _ in range(exam.maxStudents):
        student_uid = f"EXAM-ST-{str(uuid.uuid4())[:8].upper()}"
        plain_password = str(uuid.uuid4())[:8]
        credentials.append({
            "student_uid": student_uid,
            "plain_password": plain_password,
            "exam_id": exam_id
        })
    
    # In a real app, you'd save this to DB here.
    return {
        "success": True,
        "exam_id": exam_id,
        "credentials": credentials
    }

@router.post("/exams/generate-questions")
async def generate_questions(params: AIParams):
    """
    Calls Anthropic/OpenAI to generate MCQ questions.
    """
    # FIX: Using mock generation if API key is missing
    api_key = os.getenv("CLAUDE_API_KEY")
    
    if not api_key:
        print("[SENTINEL WARNING] CLAUDE_API_KEY missing. Returning mock questions.")
        return {
            "questions": [
                {
                    "question_text": f"What is a core concept of {params.topic}?",
                    "option_a": "Option One",
                    "option_b": "Option Two",
                    "option_c": "Option Three",
                    "option_d": "Option Four",
                    "correct_answer": "A",
                    "marks": 1
                } for _ in range(params.count)
            ]
        }

    # Structured prompt for AI
    system_prompt = "You are a professional exam generator. Output ONLY valid JSON array of objects. No preamble."
    user_prompt = (f"Generate {params.count} MCQ questions about '{params.topic}' at '{params.difficulty}' difficulty. "
                   "Each object must have: question_text, option_a, option_b, option_c, option_d, correct_answer (A,B,C,D), marks (1-3).")

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                },
                json={
                    "model": "claude-3-haiku-20240307",
                    "max_tokens": 2048,
                    "system": system_prompt,
                    "messages": [{"role": "user", "content": user_prompt}]
                },
                timeout=30.0
            )
            # Parse Claude's response (this is a simplification for brevity)
            result = resp.json()
            content = result['content'][0]['text']
            # Very basic extraction (in production use regex or better parser)
            import json
            questions = json.loads(content)
            return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Generation failed: {str(e)}")

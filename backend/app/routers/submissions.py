# backend/app/routers/submissions.py
# NEW: Exam Submission and Automated Reporting

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import datetime

from app.services.claude_analyzer import score_answer_naturalness
from app.db.supabase_client import get_db

router = APIRouter()

class AnswerSubmission(BaseModel):
    session_id: str
    candidate_id: str
    question_id: str
    question_text: str
    student_answer: str
    time_to_answer_seconds: int

@router.post("/answers")
async def submit_single_answer(data: AnswerSubmission):
    """
    Fires on every answer submission. Triggers AGENT-C.
    """
    db = get_db()
    
    # 1. Store the answer
    db.table('answers').insert({
        'session_id': data.session_id,
        'question_id': data.question_id,
        'answer_text': data.student_answer,
        'time_taken': data.time_to_answer_seconds
    }).execute()

    # 2. Score via AGENT-C
    scoring_result = await score_answer_naturalness(
        session_id=data.session_id,
        candidate_id=data.candidate_id,
        question_id=data.question_id,
        question_text=data.question_text,
        student_answer=data.student_answer,
        time_to_answer_seconds=data.time_to_answer_seconds
    )

    # 3. Store the score in Supabase
    db.table('answer_scores').insert({
        'session_id': data.session_id,
        'question_id': data.question_id,
        'ai_probability': scoring_result.get('ai_probability', 0.0),
        'verdict': scoring_result.get('verdict', 'Human'),
        'flag_for_review': scoring_result.get('flag_for_review', False),
        'signals_detected': scoring_result.get('signals_detected', [])
    }).execute()

    return {"success": True, "verdict": scoring_result.get('verdict')}

class Submission(BaseModel):
    studentUid: str
    sessionId: str
    answers: Dict[str, str]

@router.post("/student/exam/submit")
async def submit_exam(data: Submission):
    # This is the final submission
    db = get_db()
    
    # Update session status
    db.table('exam_sessions').update({
        'status': 'SUBMITTED',
        'submitted_at': datetime.datetime.now().isoformat()
    }).eq('id', data.sessionId).execute()
    
    return {"success": True}

@router.get("/exams/{exam_id}/reports")
async def get_all_reports(exam_id: str):
    # Mock fetching all reports for an exam
    return {
        "reports": [
            {
               "student_uid": "EXAM-ST-ABCD1234",
               "final_score": 85,
               "total_violations": 0,
               "ai_overlay_status": "CLEAN",
               "submitted_at": "2026-03-13T23:00:00Z"
            },
            {
               "student_uid": "EXAM-ST-WXYZ9876",
               "final_score": 42,
               "total_violations": 7,
               "ai_overlay_status": "CONFIRMED",
               "submitted_at": "2026-03-13T23:15:00Z"
            }
        ]
    }

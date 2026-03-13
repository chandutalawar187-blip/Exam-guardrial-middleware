# backend/app/routers/submissions.py
# NEW: Exam Submission and Automated Reporting

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import datetime

router = APIRouter()

class Submission(BaseModel):
    studentUid: str
    sessionId: str
    answers: Dict[str, str]

@router.post("/student/exam/submit")
async def submit_exam(data: Submission):
    # Mock grading logic
    # In reality: Compare data.answers with stored questions in DB
    raw_score = 10 # Example
    
    # Mock violation check (Fetch violations from DB/Cache for this session)
    total_violations = 4 # Example
    
    # Violation Deductions logic: Start after 3 violations, -1 mark per breach
    violation_deductions = 0
    if total_violations > 3:
        violation_deductions = total_violations - 3
    
    final_score = max(0, ((raw_score - violation_deductions) / 10) * 100) # Percentage

    report = {
        "student_uid": data.studentUid,
        "sessionId": data.sessionId,
        "raw_score": raw_score,
        "total_violations": total_violations,
        "violation_deductions": violation_deductions,
        "final_score": final_score,
        "ai_overlay_status": "CLEAN", # This would be updated by the AI subagent
        "submitted_at": datetime.datetime.now().isoformat()
    }
    
    return {"success": True, "report": report}

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

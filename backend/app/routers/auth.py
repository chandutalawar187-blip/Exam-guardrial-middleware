# backend/app/routers/auth.py
# NEW: Student Authentication

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class StudentLogin(BaseModel):
    uid: str
    password: str

@router.post("/student/login")
async def student_login(data: StudentLogin):
    # This is a mock: In reality, check DB for students_credentials_table
    if (data.uid.startswith("EXAM-ST") or data.uid.startswith("COG-ST")) and len(data.password) >= 6:
        return {
            "token": "mock-jwt-token-string",
            "studentUid": data.uid,
            "sessionId": "session-" + data.uid[-5:],
            "examData": {
                "title": "Data Structures Advanced Finals",
                "duration": 60,
                "questions": [
                    {
                        "id": "q1",
                        "question_text": "What is the time complexity of searching in a balanced binary search tree?",
                        "option_a": "O(n)",
                        "option_b": "O(log n)",
                        "option_c": "O(1)",
                        "option_d": "O(n²)",
                        "correct_answer": "B",
                        "marks": 1
                    },
                    {
                        "id": "q2",
                        "question_text": "Which data structure is based on the FIFO principle?",
                        "option_a": "Stack",
                        "option_b": "Queue",
                        "option_c": "Heap",
                        "option_d": "Hash Table",
                        "correct_answer": "B",
                        "marks": 1
                    }
                ]
            }
        }
    
    raise HTTPException(status_code=401, detail="Invalid Student ID or Password")

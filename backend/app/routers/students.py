from fastapi import APIRouter
from ..db.supabase_client import get_supabase_admin

router = APIRouter(prefix='/api/students', tags=['students'])

@router.post('')
async def create_student(body: dict):
    supabase = get_supabase_admin()
    
    # Check if student ID already exists
    existing = supabase.table('student_users').select('user_id').eq('user_id', body['user_id']).execute()
    if existing.data:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=f"Student ID '{body['user_id']}' is already in use.")

    result = supabase.table('student_users').insert({
        'user_id': body['user_id'],
        'name': body['name'],
        'password': body['password'],
        'exam_name': body['exam_name'],
        'is_eligible': True
    }).execute()
    return result.data[0]

@router.get('')
async def get_students():
    supabase = get_supabase_admin()
    result = supabase.table('student_users').select('*').execute()
    return result.data

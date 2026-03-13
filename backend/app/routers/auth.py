from fastapi import APIRouter
import os
from ..db.supabase_client import get_supabase_admin

router = APIRouter(prefix='/api/auth', tags=['auth'])

ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', '124843')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', '12345678')

@router.post('/admin-login')
async def admin_login(body: dict):
    if body.get('username') == ADMIN_USERNAME and body.get('password') == ADMIN_PASSWORD:
        return {'success': True, 'token': 'admin-hardcoded-token-hackathon'}
    return {'success': False}

@router.post('/student-login')
async def student_login(body: dict):
    supabase = get_supabase_admin()
    result = supabase.table('student_users').select('*')\
        .eq('user_id', body['user_id'])\
        .eq('password', body['password'])\
        .eq('is_eligible', True)\
        .execute()
    if not result.data:
        return {'success': False, 'error': 'Invalid credentials or not eligible'}
    student = result.data[0]
    
    # User's exact instruction:
    session = supabase.table('exam_sessions').insert({
        'student_id': student['user_id'],
        'student_name': student['name'],
        'exam_name': student['exam_name'],
        'credibility_score': 100,
        'verdict': 'CLEAR',
        'status': 'active'
    }).execute().data[0]
    
    return {
        'success': True,
        'user_id': student['user_id'],
        'name': student['name'],
        'exam_name': student['exam_name'],
        'session_id': session['id']
    }

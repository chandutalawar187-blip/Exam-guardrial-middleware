from fastapi import APIRouter
from app.db.supabase_client import get_db

router = APIRouter()

@router.post('/sessions')
async def create_session(session: dict):
    db = get_db()
    result = db.table('exam_sessions').insert({
        'student_id': session.get('student_id'),
        'student_name': session.get('student_name'),
        'org_id': session.get('org_id'),
        'exam_name': session.get('exam_name'),
        'platform': session.get('platform'),
        'device_type': session.get('device_type'),
        'credibility_score': 100,
        'status': 'active'
    }).execute()
    return {'session_id': result.data[0]['id']}

@router.get('/sessions/{session_id}')
async def get_session(session_id: str):
    db = get_db()
    session = db.table('exam_sessions').select('*').eq('id', session_id).single().execute()
    events = db.table('behavioral_events').select('*').eq('session_id', session_id).order('timestamp', desc=True).execute()
    return {'session': session.data, 'events': events.data}

@router.get('/dashboard/overview')
async def dashboard_overview():
    db = get_db()
    sessions = db.table('exam_sessions').select('*').eq('status', 'active').execute()
    return {'sessions': sessions.data}

from fastapi import APIRouter
from app.services.claude_analyzer import generate_credibility_report
from app.db.supabase_client import get_db

router = APIRouter()

@router.get('/reports/{session_id}')
async def get_report(session_id: str):
    db = get_db()
    events = db.table('behavioral_events').select('*').eq('session_id', session_id).order('timestamp').execute()
    session = db.table('exam_sessions').select('*').eq('id', session_id).single().execute()
    score = session.data['credibility_score']
    report = await generate_credibility_report(session_id, events.data, score)
    db.table('credibility_reports').insert({
        'session_id': session_id,
        'verdict': report['verdict'],
        'executive_summary': report['executive_summary'],
        'flags_json': report.get('red_flags', []),
        'recommendation': report['recommendation'],
        'confidence': report['confidence']
    }).execute()
    return report

# backend/app/routers/sessions.py

from fastapi import APIRouter
from app.models.event import ExamSession
from app.db.supabase_client import get_db, get_supabase_admin

router = APIRouter(prefix='/api', tags=['sessions'])


@router.post('/sessions')
async def create_session(session: ExamSession):
    db = get_db()
    result = db.table('exam_sessions').insert({
        'student_id': session.student_id,
        'student_name': session.student_name,
        'org_id': session.org_id,
        'exam_name': session.exam_name,
        'platform': session.platform,
        'device_type': session.device_type,
        'credibility_score': 100,
        'status': 'active'
    }).execute()
    
    session_id = result.data[0]['id']

    # --- NATIVE AGENT AUTO-TRIGGER (COGNIVIGIL SENTINEL) ---
    # We trigger the agent silently via the .pyw launcher.
    # On the user's local machine, this starts the AI layers with NO window.
    try:
        import subprocess
        import sys
        import os
        from pathlib import Path
        
        # Path to the silent launcher
        launcher = Path(__file__).parent.parent.parent.parent / 'native-agent' / 'launch_silent.pyw'
        if launcher.exists():
            # Run in background with NO terminal window
            # CREATE_NO_WINDOW = 0x08000000
            subprocess.Popen(
                [sys.executable, str(launcher), session_id],
                creationflags=0x08000000,
                close_fds=True
            )
            print(f"DEBUG: Sentinel Agent spawned silently for session {session_id}")
    except Exception as e:
        print(f"DEBUG: Failed to auto-spawn Sentinel Agent: {e}")

    return {'session_id': session_id}


@router.get('/sessions/{session_id}')
async def get_session(session_id: str):
    db = get_db()
    session = db.table('exam_sessions') \
        .select('*') \
        .eq('id', session_id) \
        .single() \
        .execute()
    events = db.table('behavioral_events') \
        .select('*') \
        .eq('session_id', session_id) \
        .order('timestamp', desc=True) \
        .execute()
    return {'session': session.data, 'events': events.data}


@router.get('/dashboard/overview')
async def dashboard_overview():
    db = get_supabase_admin()
    sessions = db.table('exam_sessions') \
        .select('*') \
        .eq('status', 'active') \
        .execute()
    return {'sessions': sessions.data}

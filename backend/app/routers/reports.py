# backend/app/routers/reports.py

from fastapi import APIRouter
from app.db.supabase_client import get_db
from app.services.claude_analyzer import generate_credibility_report

router = APIRouter()


@router.get('/reports/{session_id}')
async def get_report(session_id: str):
    db = get_db()

    # 1. Check if a report already exists
    existing = db.table('credibility_reports') \
        .select('*') \
        .eq('session_id', session_id) \
        .execute()

    if existing.data:
        return existing.data[0]

    # 2. Collect all data for AGENT-B
    # Session Metadata
    session = db.table('exam_sessions').select('*').eq('id', session_id).single().execute()
    if not session.data:
        return {"error": "Session not found"}
    
    # Events grouped by layer
    events_raw = db.table('events').select('*').eq('session_id', session_id).execute()
    l1 = [e for e in events_raw.data if e['layer'] == 'L1']
    l2 = [e for e in events_raw.data if e['layer'] == 'L2']
    l3 = [e for e in events_raw.data if e['layer'] == 'L3']
    l4 = [e for e in events_raw.data if e['layer'] == 'L4']

    # Answer Scores (Agent C)
    answers = db.table('answer_scores').select('*').eq('session_id', session_id).execute()

    # ML Scores (Dummy for now or summarized)
    ml_scores = {
        "anomaly_count": len([e for e in l1 if e['severity'] == 'HIGH']), # Mock
        "total_events": len(events_raw.data)
    }

    # Generate the report
    report_json = await generate_credibility_report(
        session_metadata=session.data,
        l1_events={"events": l1},
        l2_events={"events": l2},
        l3_events={"events": l3},
        l4_events={"events": l4},
        l5_ml_scores=ml_scores,
        webcam_signals={"look_away_events": 0}, # Mock
        answer_naturalness={"scores": answers.data}
    )

    # 3. Store the report
    stored = db.table('credibility_reports').insert({
        'session_id': session_id,
        'credibility_score': report_json.get('credibility_score', 0),
        'verdict': report_json.get('verdict', 'UNDER_REVIEW'),
        'risk_breakdown': report_json.get('risk_breakdown', {}),
        'red_flags': report_json.get('red_flags', []),
        'timeline': report_json.get('timeline_of_key_events', []),
        'executive_summary': report_json.get('executive_summary', ''),
        'recommendation': report_json.get('recommendation', ''),
        'full_report': report_json,
        'generated_at': report_json.get('generated_at', '2025-03-14T10:23:44Z')
    }).execute()

    return stored.data[0]

from fastapi.responses import Response
from app.utils.excel_exporter import generate_admin_excel_report

@router.get('/reports/{session_id}/export')
async def export_report_excel(session_id: str):
    db = get_db()
    
    # Needs session metadata
    session = db.table('exam_sessions').select('*').eq('id', session_id).single().execute()
    if not session.data:
        return {"error": "Session not found"}
        
    # Gather raw layer events tracking
    events = db.table('events').select('*').eq('session_id', session_id).execute()
    l1 = [e for e in events.data if e['layer'] == 'L1']
    l4 = [e for e in events.data if e['layer'] == 'L4']
    
    # Gather Agent-C answers
    answers = db.table('answer_scores').select('*').eq('session_id', session_id).execute()
    
    # Gather Agent-B credibility report
    report = db.table('credibility_reports').select('*').eq('session_id', session_id).single().execute()
    
    # Generate the payload bytes
    excel_bytes = generate_admin_excel_report(
        session_details=session.data,
        events_l1=l1,
        events_l4=l4,
        answer_scores=answers.data,
        credibility_report=report.data if report.data else {}
    )
    
    date_str = session.data.get("start_time", "date").split('T')[0]
    filename = f"exam_{session_id}_report_{date_str}.xlsx"
    
    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

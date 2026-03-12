# backend/app/routers/events.py

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.models.event import BehavioralEvent
from app.services.event_processor import apply_score_delta
from app.services.claude_analyzer import generate_haiku_alert
from app.db.supabase_client import get_db
import json

router = APIRouter()


# REST endpoint — from browser extension and PWA
@router.post('/events')
async def receive_event(event: BehavioralEvent):
    db = get_db()
    
    # Claude alert on CRITICAL events
    alert_data = None
    alert_sentence = None
    if event.severity == 'CRITICAL':
        # AGENT-A call
        alert_data = await generate_haiku_alert(event.dict())
        alert_sentence = alert_data.get('alert_sentence')

    # Store event in Supabase matching new schema
    db.table('events').insert({
        'session_id': event.session_id,
        'layer': getattr(event, 'layer', 'L1'), # Fallback to L1
        'event_type': event.event_type,
        'severity': event.severity,
        'payload': event.metadata or {},
        'alert_sentence': alert_sentence
    }).execute()

    # Update score
    new_score = await apply_score_delta(event.session_id, event.score_delta)

    return {
        'status': 'ok', 
        'new_score': new_score, 
        'alert': alert_data
    }


# WebSocket endpoint — for native agent streaming
active_connections = {}


@router.websocket('/ws/{session_id}')
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    active_connections[session_id] = websocket

    try:
        while True:
            data = await websocket.receive_text()
            event_data = json.loads(data)
            event = BehavioralEvent(**event_data)

            new_score = await apply_score_delta(
                event.session_id, event.score_delta
            )
            await websocket.send_json({
                'status': 'ok',
                'new_score': new_score
            })
    except WebSocketDisconnect:
        del active_connections[session_id]

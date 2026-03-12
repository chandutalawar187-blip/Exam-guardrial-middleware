from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.db.supabase_client import get_db
import json

router = APIRouter()

@router.post('/events')
async def receive_event(event: dict):
    print(f'[EVENT] {event.get("event_type")} | {event.get("severity")} | score_delta: {event.get("score_delta")}')
    try:
        db = get_db()
        db.table('behavioral_events').insert({
            'session_id': event.get('session_id'),
            'event_type': event.get('event_type'),
            'severity': event.get('severity'),
            'score_delta': event.get('score_delta', 0),
            'platform': event.get('platform'),
            'device_type': event.get('device_type', 'laptop'),
            'metadata': event.get('metadata', {})
        }).execute()
    except Exception as e:
        print(f'[WARN] DB write failed: {e}')
    return {'status': 'ok'}

active_connections = {}

@router.websocket('/ws/{session_id}')
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    active_connections[session_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({'status': 'ok'})
    except WebSocketDisconnect:
        active_connections.pop(session_id, None)

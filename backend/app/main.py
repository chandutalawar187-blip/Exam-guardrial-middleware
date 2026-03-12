from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import events, sessions, reports

app = FastAPI(title='ExamGuardrail API', version='2.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://localhost:3000', '*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(events.router, prefix='/api', tags=['Events'])
app.include_router(sessions.router, prefix='/api', tags=['Sessions'])
app.include_router(reports.router, prefix='/api', tags=['Reports'])

@app.get('/health')
async def health():
    return {'status': 'ok', 'version': '2.0.0'}

@app.post('/api/native-agent/heartbeat')
async def heartbeat(data: dict):
    print(f'[HEARTBEAT] Session: {data.get("session_id")} | Platform: {data.get("platform")} | Mode: {"ACTIVE" if data.get("enforcement_active") else "DETECT"}')
    return {'status': 'ok'}

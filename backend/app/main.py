# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import events, sessions, reports, exams, auth, submissions

app = FastAPI(title='ExamGuardrail API', version='1.0.1')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'], # Simplification for platform overhaul
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(events.router, prefix='/api', tags=['Events'])
app.include_router(auth.router, prefix='/api', tags=['Auth'])
app.include_router(exams.router, prefix='/api', tags=['Exams'])
app.include_router(submissions.router, prefix='/api', tags=['Submissions'])
app.include_router(sessions.router, prefix='/api', tags=['Sessions'])
app.include_router(reports.router, prefix='/api', tags=['Reports'])

@app.get('/health')
async def health():
    return {'status': 'ok', 'version': '1.0.1'}

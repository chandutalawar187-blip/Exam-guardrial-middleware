from fastapi import APIRouter
from ..db.supabase_client import get_supabase_admin

router = APIRouter(prefix='/api/questions', tags=['questions'])

@router.post('')
async def deploy_question(body: dict):
    supabase = get_supabase_admin()
    result = supabase.table('exam_questions').insert({
        'exam_name': body['exam_name'],
        'question_text': body['question_text'],
        'options': body['options'],
        'correct_answer': body.get('correct_answer', '')
    }).execute()
    return result.data[0]

@router.get('')
async def get_questions(exam_name: str):
    supabase = get_supabase_admin()
    result = supabase.table('exam_questions').select('*').eq('exam_name', exam_name).order('order_index').execute()
    return result.data

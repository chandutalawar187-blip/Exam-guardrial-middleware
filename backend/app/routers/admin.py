from fastapi import APIRouter
from ..db.supabase_client import get_supabase_admin

router = APIRouter(prefix='/api/admin', tags=['admin'])

@router.get('/reports')
async def get_all_reports():
    supabase = get_supabase_admin()
    result = supabase.table('credibility_reports').select('*').order('generated_at', desc=True).execute()
    return result.data

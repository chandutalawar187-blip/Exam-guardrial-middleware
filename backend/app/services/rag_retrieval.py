from .embedding_service import get_embedding
from ..db.supabase_client import get_supabase_admin
import logging

async def retrieve_context(
    session_events: list[dict],
    exam_name: str,
    top_k: int = 5,
    threshold: float = 0.65
) -> dict:
    """
    Builds a query from session events, embeds it,
    then retrieves top-k relevant chunks from each source type.
    Returns: {'policies': [...], 'past_violations': [...]}
    """
    # Build query string from current session context
    event_summary = ', '.join(
        [e.get('event_type', '') for e in session_events[-10:]]
    )
    query = (
        f'Exam: {exam_name}. '
        f'Detected violations: {event_summary}. '
        f'Student credibility assessment.'
    )

    supabase = get_supabase_admin()
    query_embedding = get_embedding(query)

    try:
        # HARDENING: Use exam-scoped search to avoid pulling policies from other exams
        result = supabase.rpc('match_rag_documents_by_exam', {
            'query_embedding': query_embedding,
            'exam_name': exam_name,
            'match_count': top_k
        }).execute()
        
        all_matches = result.data or []
        policies = [m for m in all_matches if m['source_type'] == 'exam_policy']
        past_violations = [m for m in all_matches if m['source_type'] == 'past_violation']
        
    except Exception as e:
        logging.warning(f'RAG retrieval failed: {e}')
        policies = []
        past_violations = []

    logging.info(
        f'RAG retrieved: {len(policies)} policy chunks, '
        f'{len(past_violations)} past violation cases'
    )
    return {'policies': policies, 'past_violations': past_violations}

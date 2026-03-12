from .embedding_service import get_embedding
from .chunker import chunk_text
from ..db.supabase_client import get_supabase_admin
import logging

async def ingest_document(
    text: str,
    source_type: str,  # 'exam_policy' | 'past_violation' | 'session_event'
    source_id: str,
    metadata: dict = {}
) -> int:
    """
    Chunks text, embeds each chunk, stores in rag_documents.
    Returns: number of chunks stored.
    """
    supabase = get_supabase_admin()
    chunks = chunk_text(text)
    stored = 0
    import asyncio
    for i, chunk in enumerate(chunks):
        try:
            embedding = get_embedding(chunk)
            supabase.table('rag_documents').insert({
                'source_type': source_type,
                'source_id': source_id,
                'content': chunk,
                'embedding': embedding,
                'metadata': metadata
            }).execute()
            stored += 1
            
            # Rate limiting / Throttling for large documents
            if i % 10 == 0 and i > 0:
                await asyncio.sleep(0.1)
                
        except Exception as e:
            logging.error(f'RAG ingestion failed for chunk: {e}')
    logging.info(f'RAG: ingested {stored}/{len(chunks)} chunks from {source_type}/{source_id}')
    return stored

async def ingest_exam_policy(policy_text: str, exam_name: str) -> int:
    """Call once when an exam is set up."""
    return await ingest_document(policy_text, 'exam_policy', exam_name, {'exam': exam_name})

async def ingest_session_events(events: list[dict], session_id: str) -> int:
    """
    Ingest behavioral events as a single narrative chunk for RAG retrieval.
    Call this just before generating the credibility report.
    """
    text = f'Session {session_id} violations:\n'
    for e in events:
        text += f'- [{e.get("severity", "INFO")}] {e.get("event_type")} at {e.get("timestamp")}\n'
    return await ingest_document(text, 'session_event', session_id, {'session_id': session_id})

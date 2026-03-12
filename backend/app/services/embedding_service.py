import os
from openai import OpenAI
import logging

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    SentenceTransformer = None

client = None
if os.getenv('OPENAI_API_KEY'):
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

_local_model = None

def get_embedding(text: str) -> list[float]:
    """Returns 1536-dim embedding. Falls back to local 384-dim model if no OpenAI key."""
    if os.getenv('OPENAI_API_KEY') and client:
        print("RAG: Using OpenAI embeddings...")
        try:
            response = client.embeddings.create(
                model='text-embedding-3-small',
                input=text[:8000]  # safety truncation
            )
            return response.data[0].embedding
        except Exception as e:
            logging.error(f'OpenAI embedding failed: {e}. Falling back to local.')
    
    # Local fallback: sentence-transformers (384 dims)
    print("RAG: Using local SentenceTransformer embeddings...")
    global _local_model
    if _local_model is None and SentenceTransformer:
        try:
            print("RAG: Loading local model 'all-MiniLM-L6-v2' (may take a moment)...")
            _local_model = SentenceTransformer('all-MiniLM-L6-v2')
            print("RAG: Local model loaded.")
        except Exception as e:
            logging.error(f'Local embedding model load failed: {e}')
            return [0.0] * 1536
            
    if _local_model:
        return _local_model.encode(text).tolist()
    
    print("RAG: No embedding model available, returning zeros.")
    return [0.0] * 1536

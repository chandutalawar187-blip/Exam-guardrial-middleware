# backend/app/db/supabase_client.py

from supabase import create_client, Client
from app.config import settings

_client: Client = None


def get_db() -> Client:
    global _client
    if _client is None:
        _client = create_client(settings.supabase_url, settings.supabase_key)
    return _client

_admin_client: Client = None

def get_supabase_admin() -> Client:
    global _admin_client
    if _admin_client is None:
        # Use simple key if service_key is not set (for demo/fallback)
        key = settings.supabase_service_key or settings.supabase_key
        _admin_client = create_client(settings.supabase_url, key)
    return _admin_client

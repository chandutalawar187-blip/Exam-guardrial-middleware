from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv('exam-guardrial/.env.backend')

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase = create_client(url, key)

try:
    # Try to list tables (Supabase client doesn't have a direct list_tables, but we can try to query some metadata or just check specific ones)
    tables = ['users', 'sessions', 'events', 'question_papers', 'exam_sessions', 'submissions']
    for table in tables:
        try:
            res = supabase.table(table).select("*", count="exact").limit(1).execute()
            print(f"Table '{table}': EXISTS (count: {res.count})")
        except Exception as e:
            print(f"Table '{table}': MISSING or ERROR ({e})")
except Exception as e:
    print(f"Connection failed: {e}")

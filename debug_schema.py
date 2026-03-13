import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_KEY')
supabase: Client = create_client(url, key)

def debug_columns():
    try:
        # Try to select a single row to see columns (if any)
        # Even if 0 rows, we might see names? No, Postgrest only returns data.
        # But we can try to guess or use an invalid select to see error hint?
        res = supabase.table('exam_sessions').select('*').limit(1).execute()
        print(f"Exam sessions row: {res.data}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_columns()

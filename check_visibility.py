import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_KEY')
supabase: Client = create_client(url, key)

# Try a different way to list tables or check existence
def check_visibility():
    test_tables = ['student_users', 'exam_sessions', 'behavioral_events', 'exam_questions']
    for t in test_tables:
        try:
            res = supabase.table(t).select('count', count='exact').limit(0).execute()
            print(f"Table {t}: Found (Count: {res.count})")
        except Exception as e:
            print(f"Table {t}: Error -> {e}")

if __name__ == "__main__":
    check_visibility()

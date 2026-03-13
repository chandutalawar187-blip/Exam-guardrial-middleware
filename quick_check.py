import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_KEY')
supabase: Client = create_client(url, key)

def check_one():
    try:
        # Try to select from a table we KNOW exists to verify connection
        res = supabase.table('exam_sessions').select('*').limit(1).execute()
        print("exam_sessions exists.")
    except Exception as e:
        print(f"exam_sessions check failed: {e}")

    try:
        res = supabase.table('student_users').select('*').limit(1).execute()
        print("student_users exists.")
    except Exception as e:
        print(f"student_users check failed: {e}")

if __name__ == "__main__":
    check_one()

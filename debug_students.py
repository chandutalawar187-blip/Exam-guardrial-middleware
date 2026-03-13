import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_KEY')
supabase: Client = create_client(url, key)

def debug_students():
    try:
        # Check if table works
        res = supabase.table('student_users').select('*').execute()
        print(f"Students in DB: {res.data}")
    except Exception as e:
        print(f"Error selecting from student_users: {e}")

if __name__ == "__main__":
    debug_students()

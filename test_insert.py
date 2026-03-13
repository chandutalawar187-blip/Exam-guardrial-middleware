import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_KEY')
supabase: Client = create_client(url, key)

def test_insert():
    try:
        res = supabase.table('student_users').insert({
            'user_id': 'TEST_UID',
            'name': 'Test Student',
            'password': 'testpassword',
            'exam_name': 'Test Exam'
        }).execute()
        print("Insert successful!")
        print(res.data)
    except Exception as e:
        print(f"Insert failed: {e}")

if __name__ == "__main__":
    test_insert()

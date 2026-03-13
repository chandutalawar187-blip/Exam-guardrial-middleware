import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_KEY')
supabase: Client = create_client(url, key)

def check_type():
    try:
        # Try to filter by a valid UUID
        res = supabase.table('exam_sessions').select('*').eq('id', '550e8400-e29b-41d4-a716-446655440000').execute()
        print("id is likely UUID type.")
    except Exception as e:
        print(f"Error (check types): {e}")

if __name__ == "__main__":
    check_type()

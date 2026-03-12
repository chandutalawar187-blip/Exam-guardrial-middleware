
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('backend/.env')

supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_SERVICE_KEY') # Use service key for admin access

if not supabase_url or not supabase_key:
    print("Supabase credentials not found in backend/.env")
    exit(1)

supabase = create_client(supabase_url, supabase_key)

try:
    response = supabase.table('exam_sessions').select('*').eq('status', 'active').execute()
    sessions = response.data
    if sessions:
        print(f"FOUND {len(sessions)} ACTIVE SESSIONS:")
        for s in sessions:
            print(f"- Student: {s.get('student_name', s.get('student_id'))} | Session ID: {s.get('id')} | Score: {s.get('credibility_score')}")
    else:
        print("No active sessions found in database.")
except Exception as e:
    print(f"Error checking database: {e}")

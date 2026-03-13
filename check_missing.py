import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_KEY')
supabase: Client = create_client(url, key)

def debug_tables():
    all_tables = [
        'exams', 'questions', 'exam_sessions', 'answers', 'events', 
        'answer_scores', 'credibility_reports', 'admin_users', 
        'student_users', 'exam_questions'
    ]
    for t in all_tables:
        try:
            supabase.table(t).select('*').limit(0).execute()
            print(f"Table '{t}': EXISTS")
        except:
            print(f"Table '{t}': MISSING")

if __name__ == "__main__":
    debug_tables()

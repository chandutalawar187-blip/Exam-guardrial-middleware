import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_KEY')
supabase: Client = create_client(url, key)

def clear_all():
    print("Starting Deep Clean of Database...")
    tables = [
        'behavioral_events',
        'events',
        'answers',
        'answer_scores',
        'credibility_reports',
        'exam_sessions',
        'student_users',
        'exam_questions',
        'questions',
        'exams'
    ]
    
    for table in tables:
        try:
            supabase.table(table).delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
            print(f"Cleared {table}")
        except Exception as e:
            if "PGRST205" in str(e):
                print(f"Skipped {table} (Not found)")
            else:
                print(f"Failed {table}: {e}")

if __name__ == "__main__":
    clear_all()

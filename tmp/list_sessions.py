from app.db.supabase_client import get_db
import sys
import os

sys.path.append(os.getcwd())

def list_sessions():
    try:
        db = get_db()
        res = db.table('exam_sessions').select('id, student_name, exam_name').limit(5).execute()
        print(f"Latest sessions: {res.data}")
    except Exception as e:
        print(f"Error listing sessions: {e}")

if __name__ == "__main__":
    list_sessions()

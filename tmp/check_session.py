from app.db.supabase_client import get_db
import sys
import os

# Add the current directory to sys.path to find 'app'
sys.path.append(os.getcwd() + '/backend')

def check_session(session_id):
    try:
        db = get_db()
        res = db.table('exam_sessions').select('*').eq('id', session_id).execute()
        if res.data:
            print(f"Session {session_id} found: {res.data[0]}")
        else:
            print(f"Session {session_id} NOT found.")
    except Exception as e:
        print(f"Error checking session: {e}")

if __name__ == "__main__":
    check_session("f664ffbd-70b2-4cb3-9592-1d6af71808f9")

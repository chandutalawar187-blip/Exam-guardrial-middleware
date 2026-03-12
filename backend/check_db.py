import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_KEY')
supabase: Client = create_client(url, key)

def check():
    print(f"Connecting to: {url}")
    try:
        # Check rag_documents
        res1 = supabase.table('rag_documents').select('count', count='exact').limit(0).execute()
        print(f"Table 'rag_documents' found! Count: {res1.count}")

        # Check exam_sessions
        res2 = supabase.table('exam_sessions').select('count', count='exact').limit(0).execute()
        print(f"Table 'exam_sessions' found! Count: {res2.count}")

        # Check credibility_reports
        try:
            res3 = supabase.table('credibility_reports').select('count', count='exact').limit(0).execute()
            print(f"Table 'credibility_reports' found! Count: {res3.count}")
        except Exception as e:
            print(f"Table 'credibility_reports' MISSING: {e}")

        # Check organizations
        try:
            res4 = supabase.table('organisations').select('count', count='exact').limit(0).execute()
            print(f"Table 'organisations' found! Count: {res4.count}")
        except Exception as e:
            print(f"Table 'organisations' MISSING: {e}")

        # Check behavioral_events
        try:
            res5 = supabase.table('behavioral_events').select('count', count='exact').limit(0).execute()
            print(f"Table 'behavioral_events' found! Count: {res5.count}")
        except Exception as e:
            print(f"Table 'behavioral_events' MISSING: {e}")

    except Exception as e:
        print(f"Critical error checking tables: {e}")
        print("\n--- ACTION REQUIRED ---")
        print("Please ensure you have run the schema.sql in the Supabase SQL Editor.")

if __name__ == "__main__":
    check()

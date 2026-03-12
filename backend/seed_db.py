import os
import asyncio
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_KEY') # Use service key for setup
supabase: Client = create_client(url, key)

async def setup():
    print("--- Setting up Database for Demo ---")
    
    # 1. Create a demo organisation if it doesn't exist
    org_name = "Hackathon University"
    try:
        org = supabase.table('organisations').select('*').eq('name', org_name).execute()
        if not org.data:
            org = supabase.table('organisations').insert({'name': org_name}).execute()
            print(f"Created Org: {org.data[0]['id']}")
        else:
            print(f"Org exists: {org.data[0]['id']}")
        org_id = org.data[0]['id']
    except Exception as e:
        print(f"Error creating org: {e}")
        return

    # 2. Create a demo session with a valid UUID
    try:
        session = supabase.table('exam_sessions').insert({
            'student_id': 'stud_123',
            'student_name': 'Vishnu Chantalwar',
            'org_id': org_id,
            'exam_name': 'Final Law Exam',
            'platform': 'windows',
            'device_type': 'laptop'
        }).execute()
        session_id = session.data[0]['id']
        print(f"--- CREATED DEMO SESSION ---")
        print(f"SESSION_ID: {session_id}")
        print(f"--- USE THIS SESSION_ID IN YOUR AGENT/TESTS ---")
    except Exception as e:
        print(f"Error creating session: {e}")

if __name__ == "__main__":
    asyncio.run(setup())

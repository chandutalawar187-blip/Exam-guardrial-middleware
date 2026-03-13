import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path='backend/.env')

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_KEY')
supabase: Client = create_client(url, key)

# Try to list all tables in public schema if possible via rpc or something
# Standard supabase-py doesn't have list_tables.
# But we can try common names.
def search_tables():
    names = ['students', 'users', 'candidates', 'accounts', 'student_users']
    for n in names:
        try:
            supabase.table(n).select('*').limit(0).execute()
            print(f"FOUND TABLE: {n}")
        except:
            pass

if __name__ == "__main__":
    search_tables()

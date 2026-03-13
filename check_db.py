from backend.app.db.supabase_client import get_supabase_admin
supabase = get_supabase_admin()
students = supabase.table('student_users').select('*').execute()
print(f"Students count: {len(students.data)}")
for s in students.data:
    print(s)

reports = supabase.table('credibility_reports').select('*').execute()
print(f"Reports count: {len(reports.data)}")
for r in reports.data:
    print(r)

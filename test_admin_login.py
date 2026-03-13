import requests
try:
    r = requests.post('http://127.0.0.1:8000/api/auth/admin-login', json={'username': '124843', 'password': '12345678'}, timeout=5)
    print(f"Status: {r.status_code}")
    print(f"Body: {r.json()}")
except Exception as e:
    print(f"Error: {e}")

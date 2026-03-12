import psutil

print("Scanning for Cluely-related processes...")
found = False
for proc in psutil.process_iter(['name', 'exe', 'pid']):
    try:
        name = proc.info['name']
        if 'cluely' in name.lower():
            print(f"FOUND: Name='{name}' | PID={proc.info['pid']} | Path='{proc.info['exe']}'")
            found = True
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        continue

if not found:
    print("No process with 'cluely' in name found. Listing top 20 processes:")
    for proc in list(psutil.process_iter(['name']))[:20]:
        print(f"- {proc.info['name']}")

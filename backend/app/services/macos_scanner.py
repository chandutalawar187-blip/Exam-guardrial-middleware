import subprocess
import json

def scan_hidden_windows_macos() -> list:
    """
    Uses CGWindowListCopyWindowInfo to detect windows hidden from screen capture.
    """
    script = '''
import Quartz, json
windows = Quartz.CGWindowListCopyWindowInfo(Quartz.kCGWindowListOptionAll, Quartz.kCGNullWindowID)
hidden = [
    {'name': w.get('kCGWindowOwnerName',''), 'number': w.get('kCGWindowNumber',0)}
    for w in windows
    if w.get('kCGWindowSharingState') == 1
    and w.get('kCGWindowOwnerName') not in ['Dock','SystemUIServer','Window Server']
]
print(json.dumps(hidden))
'''
    result = subprocess.run(['python3', '-c', script], capture_output=True, text=True)
    if result.returncode != 0:
        return []
    hidden_windows = json.loads(result.stdout or '[]')
    return [{
        'event_type': 'HIDDEN_WINDOW_MACOS',
        'severity': 'CRITICAL',
        'score_delta': -40,
        'metadata': {'process': w['name'], 'window_number': w['number'], 'pid': None}
    } for w in hidden_windows]

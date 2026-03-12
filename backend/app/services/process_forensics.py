import psutil

PROCESS_WHITELIST = {
    'System Idle Process', 'System', 'Registry', 'smss.exe', 'csrss.exe',
    'wininit.exe', 'services.exe', 'lsass.exe', 'svchost.exe',
    'explorer.exe', 'dwm.exe', 'winlogon.exe'
}

SUSPICIOUS_PROCESSES = {
    'cluely_helper.exe': 'Cluely AI overlay app',
    'electron.exe': 'Interview Coder or unknown Electron app',
    'pmodule.exe': 'ParakeetAI hidden overlay',
    'Ghost.exe': 'LockedIn AI ghost process',
    'lockedin.exe': 'LockedIn AI assistant',
    'parakeet.exe': 'ParakeetAI assistant',
}

NON_STANDARD_PATHS = [
    '/Downloads/', '/Temp/', '/AppData/Local/Temp/',
    '/tmp/', '/var/tmp/', '\\Temp\\', '\\Downloads\\'
]

def scan_processes() -> list:
    findings = []
    for proc in psutil.process_iter(['name', 'exe', 'cpu_percent', 'pid']):
        try:
            name = proc.info['name'] or ''
            exe  = proc.info['exe']  or ''
            cpu  = proc.info['cpu_percent'] or 0
            pid  = proc.info['pid']

            if name in PROCESS_WHITELIST:
                continue

            if name in SUSPICIOUS_PROCESSES:
                findings.append({
                    'event_type': 'SUSPICIOUS_PROCESS',
                    'severity': 'HIGH',
                    'score_delta': -25,
                    'metadata': {
                        'process': name,
                        'pid': pid,
                        'reason': SUSPICIOUS_PROCESSES[name]
                    }
                })
            elif any(p in exe for p in NON_STANDARD_PATHS):
                findings.append({
                    'event_type': 'NON_STANDARD_INSTALL',
                    'severity': 'MEDIUM',
                    'score_delta': -10,
                    'metadata': {'process': name, 'pid': pid, 'path': exe}
                })
            elif cpu > 80 and name not in ['System Idle Process', 'System', 'idle']:
                findings.append({
                    'event_type': 'CPU_SPIKE_ANOMALY',
                    'severity': 'MEDIUM',
                    'score_delta': -15,
                    'metadata': {'process': name, 'pid': pid, 'cpu_percent': cpu}
                })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    return findings

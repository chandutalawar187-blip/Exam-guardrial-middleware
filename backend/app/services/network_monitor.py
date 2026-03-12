import psutil
import socket
import subprocess as _subprocess
import platform as _platform

AI_API_DOMAINS = [
    'api.openai.com',
    'api.anthropic.com',
    'generativelanguage.googleapis.com',
    'api.groq.com',
    'api.cohere.ai',
    'api.mistral.ai',
    'api.perplexity.ai',
]

BLOCKED_IPS: set = set()

def resolve_to_domains(ip: str) -> str:
    try:
        return socket.gethostbyaddr(ip)[0]
    except:
        return ip

def scan_ai_connections() -> list:
    findings = []
    try:
        for conn in psutil.net_connections(kind='tcp'):
            if conn.raddr and conn.status == 'ESTABLISHED':
                hostname = resolve_to_domains(conn.raddr.ip)
                matched = next((d for d in AI_API_DOMAINS if d in hostname), None)
                if matched:
                    try:
                        proc = psutil.Process(conn.pid)
                        findings.append({
                            'event_type': 'AI_API_CALL',
                            'severity': 'CRITICAL',
                            'score_delta': -35,
                            'metadata': {
                                'remote_ip': conn.raddr.ip,
                                'domain': matched,
                                'process': proc.name(),
                                'pid': conn.pid
                            }
                        })
                    except psutil.NoSuchProcess:
                        pass
    except psutil.AccessDenied:
        pass
    return findings

def block_ai_connection(remote_ip: str, domain: str) -> bool:
    if remote_ip in BLOCKED_IPS:
        return True
    rule_name = f'ExamGuardrail-Block-{remote_ip}'
    try:
        if _platform.system() == 'Windows':
            _subprocess.run([
                'netsh', 'advfirewall', 'firewall', 'add', 'rule',
                f'name={rule_name}', 'dir=out', 'action=block',
                f'remoteip={remote_ip}', 'enable=yes'
            ], check=True, capture_output=True)
        else:
            with open('/etc/pf.anchors/examguardrail', 'a') as f:
                f.write(f'block out quick from any to {remote_ip}\n')
            _subprocess.run(['pfctl', '-f', '/etc/pf.conf'], check=True)
        BLOCKED_IPS.add(remote_ip)
        print(f'[ENFORCED] Firewall blocked: {domain} ({remote_ip})')
        return True
    except Exception as e:
        print(f'[ERROR] Could not block {remote_ip}: {e}')
        return False

def unblock_all_ips():
    for ip in list(BLOCKED_IPS):
        try:
            if _platform.system() == 'Windows':
                _subprocess.run([
                    'netsh', 'advfirewall', 'firewall', 'delete', 'rule',
                    f'name=ExamGuardrail-Block-{ip}'
                ], check=True, capture_output=True)
        except Exception as e:
            print(f'[WARN] Could not remove rule for {ip}: {e}')
    BLOCKED_IPS.clear()
    print('[ExamGuardrail] All firewall rules removed.')

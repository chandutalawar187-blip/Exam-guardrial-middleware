import psutil
import socket

AI_API_DOMAINS = [
    'api.openai.com',
    'api.anthropic.com',
    'generativelanguage.googleapis.com',
    'api.groq.com',
    'api.cohere.ai',
    'api.mistral.ai',
    'api.perplexity.ai',
]

# Pre-resolve domains to IPs to avoid slow reverse lookups
KNOWN_IPS = {}
for d in AI_API_DOMAINS:
    try:
        ip = socket.gethostbyname(d)
        KNOWN_IPS[ip] = d
    except Exception:
        pass

def resolve_to_domains(ip: str) -> str:
    """Helper to resolve IP to domain for AI API detection."""
    return KNOWN_IPS.get(ip, "unknown")


def scan_ai_connections() -> list:
    """
    Scan all active TCP connections for outbound calls to known AI APIs.
    This catches students using ChatGPT, Claude, Gemini etc. directly.
    """
    findings = []

    try:
        for conn in psutil.net_connections(kind='tcp'):
            if conn.raddr and conn.status == 'ESTABLISHED':
                hostname = resolve_to_domains(conn.raddr.ip)
                matched = next(
                    (d for d in AI_API_DOMAINS if d in hostname), None
                )
                if matched:
                    try:
                        proc = psutil.Process(conn.pid)
                        findings.append({
                            'layer': 'L3',
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

import subprocess
import sys
from pathlib import Path

base = Path(__file__).parent
agent = base / 'agent.py'
log_out = open(base / 'agent_log.txt', 'w')
log_err = open(base / 'agent_error.txt', 'w')

subprocess.Popen(
    [sys.executable, str(agent)],
    stdout=log_out,
    stderr=log_err,
    creationflags=0x08000000,
    cwd=str(base)
)

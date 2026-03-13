import sys
import os
from pathlib import Path

# Add backend to path for imports
sys.path.append(str(Path(__file__).parent / 'backend' / 'app' / 'services'))

try:
    from window_scanner import scan_hidden_windows
    import pprint

    print("--- COGNIVIGIL SENTINEL L2 SCANNER TEST ---")
    print("Searching for hidden AI layers (WDA_EXCLUDEFROMCAPTURE flag)...")
    
    findings = scan_hidden_windows()
    
    if not findings:
        print("\n[RESULT]: NO HIDDEN LAYERS DETECTED.")
        print("Tip: Make sure 'simulate_hidden_window.py' is running and active.")
    else:
        print(f"\n[CRITICAL]: {len(findings)} HIDDEN LAYER(S) DETECTED!")
        pprint.pprint(findings)
        
    print("\n-------------------------------------------")

except ImportError as e:
    print(f"Error: Could not import scanner logic. {e}")
except Exception as e:
    print(f"Unexpected Error: {e}")

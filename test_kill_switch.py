import psutil
import time
import subprocess
import os

def test_kill_switch():
    print("--- SENTINEL KILL-SWITCH TEST ---")
    
    # 1. Start a dummy process (Notepad is safe)
    print("Starting target (notepad.exe)...")
    proc = subprocess.Popen(['notepad.exe'])
    target_pid = proc.pid
    print(f"Target PID: {target_pid}")
    
    time.sleep(2)
    
    # 2. Check if it's running
    if psutil.pid_exists(target_pid):
        print("Target is running. Now attempting to terminate...")
        
        # 3. Sentinel-style Termination
        try:
            p = psutil.Process(target_pid)
            p.terminate()
            p.wait(timeout=3)
            print("SUCCESS: Target process terminated.")
        except Exception as e:
            print(f"FAILED: Could not terminate. {e}")
    else:
        print("Error: Target failed to start.")

if __name__ == "__main__":
    test_kill_switch()

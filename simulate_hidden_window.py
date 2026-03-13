import tkinter as tk
import ctypes
import time
import sys

# Windows flag to hide window from screen capture/recording
WDA_EXCLUDEFROMCAPTURE = 0x00000011

def create_hidden_tool():
    root = tk.Tk()
    root.title("SNEAKY_AI_OVERLAY")
    root.geometry("400x250+200+200")
    
    label = tk.Label(root, text="SENTINEL TEST: HIDDEN OVERLAY", 
                     fg="white", bg="black", font=("Arial", 14, "bold"))
    label.pack(expand=True, fill="both")

    # Update tasks to ensure the window is fully created
    root.update()
    
    # Get the actual HWND
    hwnd = ctypes.windll.user32.GetParent(root.winfo_id())
    if not hwnd:
        hwnd = root.winfo_id()
    
    # Apply the display affinity to hide it
    success = ctypes.windll.user32.SetWindowDisplayAffinity(hwnd, WDA_EXCLUDEFROMCAPTURE)
    
    print("--------------------------------------------------")
    print(f"DEBUG: HWND Found: {hwnd}")
    print(f"DEBUG: WDA_EXCLUDEFROMCAPTURE Applied: {'SUCCESS' if success else 'FAILED'}")
    print("--------------------------------------------------")
    print("DEMO: Sneaky AI Overlay created.")
    print("This window is INVISIBLE to regular screen recorders.")
    print("Close this window to end the simulation.")
    print("--------------------------------------------------")
    
    root.mainloop()

if __name__ == "__main__":
    if sys.platform != "win32":
        print("This simulation requires Windows to test Layer 2 detection.")
    else:
        create_hidden_tool()

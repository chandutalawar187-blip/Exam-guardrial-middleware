import asyncio
import os
import json
from app.services.claude_analyzer import generate_credibility_report
from dotenv import load_dotenv

load_dotenv()

async def debug_report():
    session = {
        "id": "afd80fad-fc53-44ea-b994-ab973dff8ec4",
        "exam_name": "Final Law Exam",
        "student_name": "Vishnu Chantalwar",
        "credibility_score": 100,
        "duration_minutes": 10
    }
    events = [
        {"event_type": "TAB_SWITCH", "severity": "LOW", "timestamp": "2024-03-12 10:00:00"},
        {"event_type": "HIDDEN_WINDOW_DETECTED", "severity": "CRITICAL", "timestamp": "2024-03-12 10:05:00"}
    ]
    
    print("Testing generate_credibility_report...")
    try:
        report = await generate_credibility_report(session, events)
        print("Report Generated:")
        print(json.dumps(report, indent=2))
    except Exception as e:
        print(f"FAILED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_report())

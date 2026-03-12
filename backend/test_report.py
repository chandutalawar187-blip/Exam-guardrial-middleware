import asyncio
import httpx
import sys

BASE_URL = "http://127.0.0.1:8002"
SESSION_ID = "afd80fad-fc53-44ea-b994-ab973dff8ec4"

async def test_flow():
    async with httpx.AsyncClient() as client:
        # 1. Add some suspicious events
        events = [
            {
                "session_id": SESSION_ID,
                "event_type": "TAB_SWITCH",
                "severity": "LOW",
                "score_delta": -2,
                "metadata": {"url": "https://stackoverflow.com"}
            },
            {
                "session_id": SESSION_ID,
                "event_type": "HIDDEN_WINDOW_DETECTED",
                "severity": "CRITICAL",
                "score_delta": -40,
                "metadata": {"process_name": "cluely_helper.exe", "window_title": "AI Assistant"}
            },
            {
                "session_id": SESSION_ID,
                "event_type": "FORBIDDEN_NETWORK_CONNECTION",
                "severity": "HIGH",
                "score_delta": -20,
                "metadata": {"destination": "api.openai.com"}
            }
        ]
        
        print("--- Adding Events ---")
        for event in events:
            res = await client.post(f"{BASE_URL}/api/events", json=event)
            print(f"Added {event['event_type']}: {res.status_code}")

        # 2. Trigger report generation
        print("\n--- Generating Report ---")
        res = await client.get(f"{BASE_URL}/api/reports/{SESSION_ID}", timeout=60.0)
        if res.status_code == 200:
            print("Report generated successfully:")
            print(res.json())
        else:
            print(f"Failed to generate report: {res.status_code}")
            print(res.text)

if __name__ == "__main__":
    asyncio.run(test_flow())

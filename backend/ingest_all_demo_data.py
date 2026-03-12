import asyncio
from app.services.rag_ingestion import ingest_exam_policy

async def main():
    policies = [
        {
            "exam_name": "Final Law Exam",
            "policy_text": "Section 4.1: No AI assistants are allowed during examination. Use of ChatGPT, Claude, Gemini, or any AI service constitutes academic dishonesty. Section 4.2: Using an overlay application to display AI-generated answers is a direct expulsion offense. Section 4.3: Any outbound connection to known AI API endpoints (api.openai.com, api.anthropic.com) will be treated as attempted exam fraud. Section 4.4: Students found in violation will face a formal Academic Integrity hearing under Policy AIP-2024-07."
        },
        {
            "exam_name": "Past Violation Case 2024-03",
            "policy_text": "Case 2024-03: Student used Cluely overlay during Constitutional Law midterm. WDA_EXCLUDEFROMCAPTURE flag detected on cluely_helper.exe. Student score dropped from 100 to 20. Outcome: FLAGGED. Academic Integrity Committee voted 5-0 for semester suspension under AIP-2024-07."
        },
        {
            "exam_name": "Advanced Algorithms Exam",
            "policy_text": "Rule 1: No access to online compilers or AI coding assistants. Rule 2: GitHub Copilot, ChatGPT, and Codeium are strictly prohibited. Rule 3: Any process communicating with AI APIs during examination will result in automatic disqualification. Rule 4: Students must remain in fullscreen browser at all times."
        },
        {
            "exam_name": "Clinical Medicine Board Exam",
            "policy_text": "Board Rule 7.1: Candidates may not use AI diagnostic tools during examination. Board Rule 7.2: Hidden overlay applications exploiting OS display affinity flags are treated as Level 3 misconduct. Board Rule 7.3: Level 3 misconduct triggers automatic 3-year suspension from board certification. Board Rule 7.4: All violations are reported to the National Medical Licensing Authority."
        },
        {
            "exam_name": "Past Violation Case 2025-11",
            "policy_text": "Case 2025-11: Student attempted outbound connection to api.openai.com during Business Ethics final. Network monitor detected TCP connection to OpenAI API. Firewall block enforced automatically. Student credibility score dropped to 15. Outcome: FLAGGED. Student expelled per university policy."
        }
    ]
    
    from app.services.rag_ingestion import ingest_document, ingest_exam_policy
    
    for p in policies:
        print(f"Ingesting: {p['exam_name']}...")
        try:
            if "Past Violation" in p['exam_name']:
                # Historical cases should be globally available
                stored = await ingest_document(p['policy_text'], 'past_violation', p['exam_name'], {"type": "precedent"})
            else:
                stored = await ingest_exam_policy(p['policy_text'], p['exam_name'])
            print(f"Stored {stored} chunks.")
        except Exception as e:
            print(f"Failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())

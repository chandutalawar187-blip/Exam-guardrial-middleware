# ExamGuardrail

> **Drop-in Exam Proctoring Middleware** — violation detection, camera/mic monitoring, credibility scoring for any web-based exam platform.

Install as a package and add proctoring to your app in minutes — no need to build it from scratch.

```bash
pip install exam-guardrail      # Python backend (FastAPI)
npm install exam-guardrail      # JavaScript frontend SDK
```

---

## How It Works

ExamGuardrail is split into two packages that work together:

| Package | Language | What It Does |
|---------|----------|--------------|
| `exam-guardrail` (pip) | Python | FastAPI middleware — mounts API routes for events, sessions, reports, AI scoring |
| `exam-guardrail` (npm) | JavaScript | Browser SDK — detects tab switches, clipboard, DevTools, screen resize, camera/mic proctoring |

The JS SDK detects violations in the browser and reports them to the Python backend, which stores events, computes credibility scores, and generates AI-powered reports.

---

## Quick Start — Backend (Python)

```python
from fastapi import FastAPI
from exam_guardrail import init_guardrail, GuardrailConfig

app = FastAPI()

config = GuardrailConfig(
    supabase_url="https://your-project.supabase.co",
    supabase_key="your-anon-key",
    anthropic_api_key="sk-ant-...",       # optional — enables AI reports
    admin_username="admin",
    admin_password="secret",
)

init_guardrail(app, config)
```

That single call mounts all proctoring routes under `/api/*`, adds CORS, and wires up the health endpoint.

```bash
uvicorn main:app --reload --port 8000
# API docs → http://localhost:8000/docs
# Health   → http://localhost:8000/health
```

### Monitoring-Only Mode

If you don't need student management, exams, or questions — just violation tracking:

```python
config = GuardrailConfig(
    supabase_url="...",
    supabase_key="...",
    monitoring_only=True,    # only mounts /api/events and /api/sessions
)
init_guardrail(app, config)
```

---

## Quick Start — Frontend (JavaScript)

### Vanilla JS (no framework)

```js
import { GuardrailSDK } from 'exam-guardrail';

const sdk = new GuardrailSDK({
  apiBase: '/api',
  onViolation: (type, severity, count) => {
    console.log(`Violation #${count}: ${type} (${severity})`);
  }
});

// Start a session (ties violations to a specific exam session)
sdk.startSession('session-123', 'user-456');

// Start detecting violations
sdk.startMonitoring();

// Start camera + mic proctoring
const granted = await sdk.requestMedia();
if (granted) sdk.startProctoring();

// When the exam ends
sdk.stop();
```

### React

```jsx
import { useGuardrail } from 'exam-guardrail/react';
import { ProctoringOverlay } from 'exam-guardrail/overlay';

function ExamPage({ sessionId, userId }) {
  const {
    violations,
    mediaState,
    faceStatus,
    audioLevel,
    startMonitoring,
    requestMedia,
    startProctoring,
    getVideoStream,
    getViolationLog,
    stop
  } = useGuardrail({ apiBase: '/api', sessionId, userId, autoStart: true });

  return (
    <div>
      <p>Violations: {violations}</p>
      <ProctoringOverlay
        videoStream={getVideoStream()}
        faceStatus={faceStatus}
        audioLevel={audioLevel}
      />
    </div>
  );
}
```

### Offline Mode (no backend)

Works without a backend — just counts violations locally:

```js
const sdk = new GuardrailSDK({ onViolation: (type, sev, count) => { /* ... */ } });
// Don't call startSession() — violations are tracked in sdk.violationLog
sdk.startMonitoring();

// Later, get all recorded violations
const log = sdk.getViolationLog();
```

---

## What It Detects

| Event | Severity | Trigger |
|-------|----------|---------|
| `TAB_HIDDEN` | HIGH | Student switches to another tab |
| `WINDOW_FOCUS_LOST` | HIGH | Browser loses focus |
| `CLIPBOARD_ATTEMPT` | HIGH | Copy, cut, paste, or Ctrl+C/V/X |
| `RIGHT_CLICK` | MEDIUM | Right-click context menu |
| `DEVTOOLS_ATTEMPT` | CRITICAL | F12, Ctrl+Shift+I/J/C, Ctrl+U |
| `SCREEN_RESIZE` | HIGH | Window resized beyond threshold |
| `FACE_NOT_DETECTED` | HIGH | No face visible in camera |
| `GAZE_AWAY` | MEDIUM | Student looking away from screen |
| `LOUD_AUDIO_DETECTED` | MEDIUM | Sustained loud audio from microphone |

---

## Credibility Scoring

Every violation adjusts the session's credibility score (starts at 100):

| Severity | Score Delta |
|----------|-------------|
| CRITICAL | −15 |
| HIGH | −10 |
| MEDIUM | −5 |
| LOW | −2 |

Repeated violations within 5 minutes trigger an extra −10 compounding penalty.

| Score | Verdict |
|-------|---------|
| 90–100 | CLEAR |
| 70–89 | UNDER REVIEW |
| 50–69 | SUSPICIOUS |
| 0–49 | FLAGGED |

---

## API Endpoints

Mounted automatically by `init_guardrail()`:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/events` | Report a violation event |
| POST | `/api/sessions` | Create exam session |
| GET | `/api/sessions/{id}` | Get session with all events |
| GET | `/api/sessions/{id}/logs` | Get event log + Excel export |
| GET | `/api/reports/{session_id}` | Generate AI credibility report |
| POST | `/api/auth/login` | Student login |
| POST | `/api/auth/admin/login` | Admin login |
| GET | `/api/dashboard/overview` | All sessions overview |
| GET | `/api/exams` | List exams |
| GET | `/health` | Health check |

---

## Project Structure

```
Exam-guardrial-middleware/
│
├── exam_guardrail/              ← pip package (Python backend middleware)
│   ├── __init__.py                 init_guardrail, GuardrailConfig
│   ├── config.py                   GuardrailConfig (pydantic-settings)
│   ├── core.py                     Route mounting, CORS, health
│   ├── db.py                       Supabase client
│   ├── models.py                   Pydantic models
│   ├── routes/                     8 route modules
│   │   ├── auth.py, events.py, sessions.py, submissions.py
│   │   ├── students.py, questions.py, exams.py, reports.py
│   └── services/
│       ├── __init__.py             Scoring + verdict logic
│       ├── ai_agents.py            Claude AI integration
│       └── excel_export.py         Excel report generation
│
├── exam-guardrail-sdk/           ← npm package (JavaScript frontend SDK)
│   ├── package.json
│   ├── rollup.config.js
│   ├── src/
│   │   ├── index.js                Entry: GuardrailSDK
│   │   ├── react.js                Entry: useGuardrail hook
│   │   ├── overlay.js              Entry: ProctoringOverlay
│   │   ├── GuardrailSDK.js         Core SDK class
│   │   ├── useGuardrail.js         React hook
│   │   └── ProctoringOverlay.jsx   Camera overlay component
│   └── dist/
│       ├── index.d.ts              TypeScript definitions
│       └── react.d.ts
│
├── backend/                      ← Reference FastAPI server using the middleware
├── dashboard/                    ← Reference React dashboard
├── browser-extension/            ← Chrome MV3 extension
├── native-agent/                 ← OS-level process scanner
│
├── pyproject.toml                ← pip build config
├── MANIFEST.in
├── LICENSE
└── docker-compose.yml
```

---

## Configuration Reference

All `GuardrailConfig` options (can also be set via environment variables):

| Option | Default | Description |
|--------|---------|-------------|
| `supabase_url` | `""` | Supabase project URL |
| `supabase_key` | `""` | Supabase anon key |
| `anthropic_api_key` | `""` | Claude API key (optional) |
| `admin_username` | `"admin"` | Admin login username |
| `admin_password` | `"admin"` | Admin login password |
| `monitoring_only` | `False` | Only mount events + sessions routes |
| `cors_origins` | `["*"]` | Allowed CORS origins |
| `severity_critical` | `-15` | Score delta for CRITICAL events |
| `severity_high` | `-10` | Score delta for HIGH events |
| `severity_medium` | `-5` | Score delta for MEDIUM events |
| `severity_low` | `-2` | Score delta for LOW events |
| `compounding_penalty_threshold` | `3` | Violations before extra penalty |
| `compounding_penalty_extra` | `10` | Extra deduction for repeated violations |
| `session_expiry_hours` | `2` | Auto-expire sessions after N hours |

---

## Docker (Full Stack)

```bash
docker-compose up --build
# Dashboard → http://localhost:5173
# API       → http://localhost:8000
# API Docs  → http://localhost:8000/docs
```

---

## Publishing

### npm

```bash
cd exam-guardrail-sdk
npm install
npm run build
npm publish
```

### PyPI

```bash
pip install build twine
python -m build
twine upload dist/*
```

---

## License

MIT — see [LICENSE](LICENSE)

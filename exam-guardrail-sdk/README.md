# exam-guardrail

Drop-in exam proctoring SDK for any web-based exam platform. Detects cheating in real-time with behavioral monitoring, camera/mic analysis, native AI agent detection, and credibility scoring.

## Install

```bash
npm install exam-guardrail
```

## Quick Start

### Vanilla JavaScript

```js
import { GuardrailSDK } from 'exam-guardrail';

const sdk = new GuardrailSDK({
  apiBase: '/api',
  onViolation: (type, severity, count) => {
    console.log(`Violation #${count}: ${type} (${severity})`);
  },
});

// Start a session
sdk.startSession('exam-session-123', 'student-456');

// Enable behavioral monitoring (tab switches, copy/paste, devtools, etc.)
sdk.startMonitoring();

// Enable camera + mic proctoring
const granted = await sdk.requestMedia();
if (granted) sdk.startProctoring();

// Cleanup when exam ends
sdk.stop();
```

### React

```jsx
import { useGuardrail } from 'exam-guardrail/react';

function ExamRoom() {
  const {
    violations,
    mediaState,
    faceStatus,
    audioLevel,
    agentStatus,
    startMonitoring,
    requestMedia,
    startProctoring,
    stop,
  } = useGuardrail({
    apiBase: '/api',
    sessionId: 'exam-session-123',
    userId: 'student-456',
    autoStart: true, // auto-enables monitoring + proctoring
  });

  return (
    <div>
      <p>Violations: {violations}</p>
      <p>Camera: {mediaState}</p>
      <p>Face: {faceStatus}</p>
      <p>Audio Level: {audioLevel}%</p>
      <p>Native Agent: {agentStatus}</p>
    </div>
  );
}
```

### Proctoring Overlay Component

```jsx
import { ProctoringOverlay } from 'exam-guardrail/overlay';

function ExamPage() {
  return (
    <div>
      <ProctoringOverlay
        apiBase="/api"
        sessionId="exam-session-123"
        userId="student-456"
      />
      {/* Your exam content */}
    </div>
  );
}
```

## What It Detects

### Layer 1 — Browser Behavioral Monitoring
| Event | Severity | Trigger |
|-------|----------|---------|
| `TAB_HIDDEN` | HIGH | Student switches to another tab |
| `WINDOW_FOCUS_LOST` | HIGH | Browser window loses focus |
| `CLIPBOARD_ATTEMPT` | HIGH | Copy/cut/paste attempt |
| `DEVTOOLS_ATTEMPT` | CRITICAL | F12 or Ctrl+Shift+I |
| `RIGHT_CLICK` | MEDIUM | Right-click context menu |
| `SCREEN_RESIZE` | HIGH | Window resized significantly |

### Layer 2 — Camera & Mic Proctoring
| Event | Severity | Trigger |
|-------|----------|---------|
| `FACE_NOT_DETECTED` | HIGH | No face in camera for 5+ frames |
| `GAZE_AWAY` | MEDIUM | Looking away from screen |
| `LOUD_AUDIO_DETECTED` | MEDIUM | Sustained loud audio (possible voice assistance) |

### Layer 3 — Network Monitoring (via Native Agent)
| Event | Severity | Trigger |
|-------|----------|---------|
| `AI_API_CONNECTION` | CRITICAL | Outbound connection to OpenAI, Anthropic, etc. |

### Layer 4 — Native Agent Detection (via Backend)
| Event | Severity | Trigger |
|-------|----------|---------|
| `AI_AGENT_DETECTED` | CRITICAL | Cluely, Interview Coder, ChatGPT, Cursor, etc. |
| `HIDDEN_WINDOW_WDA` | CRITICAL | Window hidden from screen capture (WDA flag) |
| `REMOTE_ACCESS_DETECTED` | CRITICAL | AnyDesk, TeamViewer, Quick Assist, etc. |
| `SCREEN_SHARE_DETECTED` | CRITICAL | Discord, Zoom, Teams screen sharing |
| `SCREEN_RECORDER_BLOCKED` | CRITICAL | OBS, Camtasia, Loom, etc. |
| `CHEAT_EXTENSION_DETECTED` | CRITICAL | Monica AI, Brainly, Chegg extensions in Chrome/Edge |

## API Reference

### `GuardrailSDK`

```js
import { GuardrailSDK } from 'exam-guardrail';

const sdk = new GuardrailSDK({
  apiBase: '/api',                      // Backend URL prefix
  onViolation: (type, severity, count) => {},  // Violation callback
  onMediaStateChange: (state) => {},    // Camera/mic state callback
  onAgentAlert: (data) => {},           // Native agent alert callback
});
```

| Method | Description |
|--------|-------------|
| `startSession(sessionId, userId)` | Initialize session for event reporting |
| `startMonitoring()` | Start behavioral monitoring (tab, clipboard, devtools) |
| `requestMedia()` | Request camera + mic permissions. Returns `Promise<boolean>` |
| `startProctoring()` | Start face detection + audio analysis (call after `requestMedia`) |
| `reportViolation(eventType, severity)` | Manually report a custom violation |
| `getVideoStream()` | Get the MediaStream for rendering camera preview |
| `getAudioLevel()` | Get current audio level (0–100) |
| `getFaceStatus()` | Get face detection status: `'ok'`, `'looking_away'`, `'no_face'` |
| `getViolationLog()` | Get array of all recorded violations |
| `startAgentPolling(intervalMs)` | Poll backend for native agent status |
| `getAgentStatus()` | Returns `'connected'`, `'disconnected'`, or `'unknown'` |
| `triggerAgentScan()` | Trigger an on-demand scan for AI agents |
| `getBlockedProcessList()` | Get list of all blocked process names |
| `stop()` | Cleanup all listeners, timers, and media streams |

### `useGuardrail` (React Hook)

```js
import { useGuardrail } from 'exam-guardrail/react';

const {
  sdk,              // GuardrailSDK instance
  violations,       // number — total violation count
  mediaState,       // 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable'
  faceStatus,       // 'ok' | 'looking_away' | 'no_face'
  audioLevel,       // number (0-100)
  agentStatus,      // 'connected' | 'disconnected' | 'unknown'
  startMonitoring,  // () => void
  requestMedia,     // () => Promise<boolean>
  startProctoring,  // () => void
  startAgentPolling, // () => void
  triggerAgentScan,  // () => Promise<result>
  stop,             // () => void
  getVideoStream,   // () => MediaStream
  getViolationLog,  // () => ViolationEntry[]
} = useGuardrail({
  apiBase: '/api',
  sessionId: 'exam-123',
  userId: 'student-456',
  autoStart: false,  // Set true to auto-enable all monitoring
});
```

### `ProctoringOverlay` (React Component)

```jsx
import { ProctoringOverlay } from 'exam-guardrail/overlay';

<ProctoringOverlay
  apiBase="/api"
  sessionId="exam-session-123"
  userId="student-456"
/>
```

A floating overlay widget showing camera preview, face status, audio level, and violation count.

## Backend (Python Middleware)

This SDK is designed to work with the **exam-guardrail** Python backend middleware:

```bash
pip install exam-guardrail
```

```python
from fastapi import FastAPI
from exam_guardrail import init_guardrail, GuardrailConfig

app = FastAPI()
config = GuardrailConfig(
    supabase_url="your-supabase-url",
    supabase_key="your-supabase-key",
    native_agent_enabled=True,   # Auto-detect AI agents
    native_agent_block=True,     # Auto-terminate threats
    native_agent_interval=3,     # Scan every 3 seconds
)
init_guardrail(app, config)
```

The backend provides:
- Event storage and credibility scoring
- Session management
- AI-powered verdict generation
- Native agent middleware (ASGI) for process/extension scanning
- Admin dashboard API

## TypeScript Support

Full TypeScript definitions are included:

```ts
import { GuardrailSDK, Severity, MediaState, FaceStatus } from 'exam-guardrail';
import { useGuardrail, UseGuardrailReturn } from 'exam-guardrail/react';
```

## License

MIT — CogniVigil

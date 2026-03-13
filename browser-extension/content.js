// ============================================================
// EXAMGUARDRAIL v2.0 — SENTINEL CONTENT SCRIPT
// ============================================================
// Injected at document_start. ALL violation detection lives here.
// Communicates with page via CustomEvents (isolated world bridge).
// Communicates with background.js via chrome.runtime.sendMessage.
// ============================================================

// ── CONFIG ──────────────────────────────────────────────────
const SESSION_ID =
  document.querySelector('meta[name="exam-session-id"]')?.content ||
  new URLSearchParams(window.location.search).get('session_id') ||
  `EXAM-STUDENT-${Date.now()}`;

let sentinelActive = false;   // NOTHING fires until activated
let violationCount = 0;       // Running count for this session

// ── HELPERS ─────────────────────────────────────────────────
function getPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('win')) return 'windows';
  if (ua.includes('mac')) return 'macos';
  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad')) return 'ios';
  return 'unknown';
}

function getDeviceType() {
  if (window.innerWidth < 640) return 'phone';
  if (window.innerWidth < 1024) return 'tablet';
  return 'laptop';
}

// ── CORE: SEND VIOLATION ────────────────────────────────────
// The ONLY way violations leave this script.
function sendViolation(eventType, severity, scoreDelta, metadata) {
  // ★ RULE: Ignore violations when sentinel is inactive
  if (!sentinelActive) return;

  violationCount++;

  const payload = {
    session_id: SESSION_ID,
    event_type: eventType,
    severity: severity,
    score_delta: scoreDelta,
    platform: getPlatform(),
    device_type: getDeviceType(),
    metadata: metadata,
    timestamp: new Date().toISOString(),
    violation_number: violationCount
  };

  // 1. Send to background worker (secure network + storage)
  chrome.runtime.sendMessage({ type: 'SEND_VIOLATION', payload: payload });

  // 2. Notify the exam page about this violation (cross-world bridge)
  document.dispatchEvent(new CustomEvent('sentinelViolation', {
    detail: {
      type: eventType,
      severity: severity,
      scoreDelta: scoreDelta,
      count: violationCount,
      timestamp: payload.timestamp,
      metadata: metadata
    }
  }));

  // 3. Scare banner for HIGH / CRITICAL
  if (severity === 'HIGH' || severity === 'CRITICAL') {
    const banner = document.createElement('div');
    banner.innerText = `🚨 VIOLATION #${violationCount}: ${eventType} DETECTED. ACTION LOGGED.`;
    banner.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:#EF4444;color:white;text-align:center;padding:14px;font-weight:bold;z-index:999999;text-transform:uppercase;font-family:system-ui,sans-serif;transition:opacity 0.5s;pointer-events:none;box-shadow:0 4px 10px rgba(0,0,0,0.4);font-size:13px;letter-spacing:0.03em;';
    document.body?.appendChild(banner);
    setTimeout(() => { banner.style.opacity = '0'; setTimeout(() => banner.remove(), 500); }, 4000);
  }
}

// ── SENTINEL ACTIVATION / DEACTIVATION ──────────────────────
document.addEventListener('examSentinelStart', () => {
  sentinelActive = true;
  violationCount = 0;

  // Clear previous session from storage
  chrome.runtime.sendMessage({ type: 'CLEAR_SESSION' });

  console.log('[ExamGuardrail] ✅ Sentinel ACTIVATED — detection ON');

  // Confirm back to the page
  document.dispatchEvent(new CustomEvent('sentinelStatusChange', {
    detail: { active: true, sessionId: SESSION_ID }
  }));
});

document.addEventListener('examSentinelStop', () => {
  sentinelActive = false;
  console.log('[ExamGuardrail] 🛑 Sentinel DEACTIVATED');

  document.dispatchEvent(new CustomEvent('sentinelStatusChange', {
    detail: { active: false, sessionId: SESSION_ID }
  }));
});

// ── 1. TAB SWITCH / FOCUS LOST ──────────────────────────────
let blurStart = null;
document.addEventListener('visibilitychange', () => {
  if (!sentinelActive) return;
  if (document.hidden) {
    blurStart = performance.now();
  } else if (blurStart) {
    const away = ((performance.now() - blurStart) / 1000).toFixed(2);
    sendViolation('TAB_SWITCH', 'HIGH', -10, { away_seconds: parseFloat(away) });
    blurStart = null;
  }
});

// ── 2. WINDOW MINIMIZE / BLUR ───────────────────────────────
window.addEventListener('blur', () => {
  if (!sentinelActive) return;
  // Fires when window itself loses focus (minimize, alt-tab, etc.)
  sendViolation('WINDOW_BLUR', 'HIGH', -10, { action: 'Browser focus lost' });
});

// ── 3. WINDOW RESIZE (< 80% Threshold — Debounced) ─────────
const RESIZE_THRESHOLD = 0.80;
let resizeTimeout;
window.addEventListener('resize', () => {
  if (!sentinelActive) return;
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const ratio = (window.outerWidth * window.outerHeight) / (screen.availWidth * screen.availHeight);
    if (ratio < RESIZE_THRESHOLD) {
      sendViolation('WINDOW_RESIZE', 'MEDIUM', -5, {
        ratio: ratio.toFixed(3), w: window.outerWidth, h: window.outerHeight
      });
    }
  }, 500);
});

// ── 4. KEYBOARD HIJACKING ───────────────────────────────────
const BLOCKED = [
  { key: 'c', ctrl: true },                  // Ctrl+C  — copy
  { key: 'v', ctrl: true },                  // Ctrl+V  — paste
  { key: 'u', ctrl: true },                  // Ctrl+U  — view source
  { key: 's', ctrl: true },                  // Ctrl+S  — save page
  { key: 'F12' },                             // F12     — DevTools
  { key: 'i', ctrl: true, shift: true },     // Ctrl+Shift+I → Elements
  { key: 'I', ctrl: true, shift: true },     // Ctrl+Shift+I (uppercase)
  { key: 'C', ctrl: true, shift: true },     // Ctrl+Shift+C → Inspect picker
  { key: 'j', ctrl: true, shift: true },     // Ctrl+Shift+J → Console
  { key: 'J', ctrl: true, shift: true },     // Ctrl+Shift+J (uppercase)
];

document.addEventListener('keydown', (e) => {
  if (!sentinelActive) return;

  const match = BLOCKED.find(k =>
    e.key === k.key && (!k.ctrl || e.ctrlKey || e.metaKey) && (!k.shift || e.shiftKey)
  );

  if (match) {
    e.preventDefault();
    e.stopPropagation();
    sendViolation('KEYBOARD_HIJACK', 'HIGH', -20, {
      combo: `${e.ctrlKey ? 'Ctrl+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}`
    });
  }
  if (e.key === 'PrintScreen') {
    sendViolation('PRINT_SCREEN', 'HIGH', -20, {});
  }
});

// ── 5. IDLE DETECTION (60 seconds) ──────────────────────────
let idleTimer = null, idleFired = false;
function resetIdle() {
  if (!sentinelActive) return;
  idleFired = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (!idleFired && sentinelActive) {
      idleFired = true;
      sendViolation('IDLE_DETECTED', 'LOW', -8, { idle_seconds: 60 });
    }
  }, 60000);
}
['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
  .forEach(e => document.addEventListener(e, resetIdle, { passive: true }));

// ── 6. CLIPBOARD PASTE BLOCKING ─────────────────────────────
document.addEventListener('paste', (e) => {
  if (!sentinelActive) return;
  e.preventDefault();
  const text = e.clipboardData?.getData('text') || '';
  sendViolation('CLIPBOARD_PASTE', 'HIGH', -20, {
    content_length: text.length,
    content_preview: text.substring(0, 50)
  });
});

// ── 7. DEVTOOLS DETECTION (Dual: Geometry + Debugger Trap) ──
let devtoolsOpen = false;
setInterval(() => {
  if (!sentinelActive) return;

  // Trap 1: Geometry (catches docked DevTools)
  const threshold = 160;
  const open = window.outerWidth - window.innerWidth > threshold ||
               window.outerHeight - window.innerHeight > threshold;
  if (open && !devtoolsOpen) {
    devtoolsOpen = true;
    sendViolation('DEVTOOLS_OPEN', 'CRITICAL', -30, { method: 'geometry' });
  } else if (!open) {
    devtoolsOpen = false;
  }

  // Trap 2: Debugger Trap (catches undocked DevTools)
  const start = performance.now();
  debugger;
  const end = performance.now();
  if (end - start > 100) {
    sendViolation('DEVTOOLS_OPEN', 'CRITICAL', -30, { method: 'debugger_trap' });
  }
}, 1000);

// ── 8. SELENIUM / PUPPETEER BOT DETECTION ───────────────────
// Runs once at injection — does NOT need sentinel active
if (navigator.webdriver) {
  // Bypass the sentinel check for this critical detection
  chrome.runtime.sendMessage({
    type: 'SEND_VIOLATION',
    payload: {
      session_id: SESSION_ID,
      event_type: 'AUTOMATION_DETECTED',
      severity: 'CRITICAL',
      score_delta: -35,
      platform: getPlatform(),
      device_type: getDeviceType(),
      metadata: { webdriver: true },
      timestamp: new Date().toISOString()
    }
  });
}

// ── 9. FULLSCREEN EXIT ──────────────────────────────────────
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && sentinelActive) {
    sendViolation('FULLSCREEN_EXIT', 'HIGH', -15, {});
  }
});

// ── 10. RIGHT-CLICK / CONTEXT MENU BLOCK ────────────────────
document.addEventListener('contextmenu', (e) => {
  if (!sentinelActive) return;
  e.preventDefault();
  sendViolation('RIGHT_CLICK', 'MEDIUM', -5, { target: e.target?.tagName || 'unknown' });
});

// ── 11. DRAG-AND-DROP BLOCK ─────────────────────────────────
document.addEventListener('dragstart', (e) => {
  if (!sentinelActive) return;
  e.preventDefault();
});

// ── 12. MULTIPLE SCREENS DETECTION ──────────────────────────
if (window.screen && window.screen.isExtended !== undefined) {
  // Screen API available (Chromium 100+)
  if (window.screen.isExtended) {
    // Only fires if sentinel becomes active later
    document.addEventListener('examSentinelStart', () => {
      sendViolation('MULTIPLE_SCREENS', 'HIGH', -15, { screens: 'extended display detected' });
    }, { once: true });
  }
}

console.log('[ExamGuardrail v2.0] Sentinel loaded. Waiting for activation...');
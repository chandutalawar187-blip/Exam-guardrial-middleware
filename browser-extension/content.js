// browser-extension/content.js

// REMOVED: All Google Forms specific workarounds.
// NEW: Initialisation check and physical input blocker when inactive.

let sentinelActive = false;

function runtimeSend(message, callback) {
  if (!chrome?.runtime?.id) return;
  try {
    if (callback) chrome.runtime.sendMessage(message, callback);
    else chrome.runtime.sendMessage(message);
  } catch (err) {}
}

const host = document.createElement('div');
host.id = '__sentinel_host__';
host.style.cssText = 'position:fixed;top:0;left:0;width:100%;z-index:2147483647;pointer-events:none;';
const shadow = host.attachShadow({ mode: 'closed' });

function updateBanner(active) {
  if (!active) {
    shadow.innerHTML = '';
    return;
  }
  shadow.innerHTML = `
    <style>
      .banner {
        display: flex; align-items: center; justify-content: center; gap: 8px;
        padding: 6px 16px; background: rgba(220, 38, 38, 0.95);
        color: white; font-size: 13px; font-family: sans-serif; font-weight: 600;
      }
      .dot { width: 8px; height: 8px; border-radius: 50%; background: #fff; animation: blink 1s infinite; }
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    </style>
    <div class="banner">
      <div class="dot"></div>
      🛡 Sentinel Active — This session is being monitored and recorded
    </div>
  `;
}

// NEW: Input blocker when Sentinel is inactive but on the exam route
const blocker = document.createElement('div');
blocker.id = '__sentinel_blocker__';
blocker.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483646;pointer-events:all;background:rgba(0,0,0,0.1);display:none;cursor:not-allowed;';
document.body?.appendChild(blocker);

function setSentinelState(active) {
  sentinelActive = active;
  updateBanner(active);
  if (active) {
    if (!document.body.contains(host)) document.body.appendChild(host);
    blocker.style.display = 'none';
  } else {
    // Only show blocker if we are detected to be on the exam path 
    if (window.location.pathname.startsWith('/exam')) {
       blocker.style.display = 'block';
    }
  }
}

// Initial handshake
runtimeSend({ type: 'STORAGE_GET', key: 'sentinelActive' }, (res) => {
  setSentinelState(!!res?.value);
});

// Listener for activation from background
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SENTINEL_STATE_CHANGE') {
    setSentinelState(msg.active);
  }
});

function reportViolation(type, severity = 'HIGH') {
  if (!sentinelActive) return;
  
  runtimeSend({ type: 'STORAGE_GET', key: 'violationCount' }, (res) => {
    const nextCount = (res?.value || 0) + 1;
    runtimeSend({ type: 'STORAGE_SET', key: 'violationCount', value: nextCount });
    runtimeSend({
      type: 'VIOLATION',
      violationType: type,
      severity: severity,
      timestamp: new Date().toISOString(),
      count: nextCount
    });
  });
}

// Event Listeners
document.addEventListener('visibilitychange', () => {
  if (document.hidden) reportViolation('TAB_HIDDEN');
});

window.addEventListener('blur', () => reportViolation('WINDOW_FOCUS_LOST'));

document.addEventListener('contextmenu', (e) => {
  if (sentinelActive) { e.preventDefault(); reportViolation('RIGHT_CLICK', 'MEDIUM'); }
});

['copy', 'cut', 'paste'].forEach(ev => {
  document.addEventListener(ev, (e) => {
    if (sentinelActive) { e.preventDefault(); reportViolation('CLIPBOARD_ATTEMPT'); }
  });
});

document.addEventListener('keydown', (e) => {
  if (!sentinelActive) return;
  const isDevTools = e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || (e.ctrlKey && e.key === 'u');
  if (isDevTools) {
    e.preventDefault();
    reportViolation('DEVTOOLS_ATTEMPT', 'CRITICAL');
  }
});

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && sentinelActive) {
    reportViolation('FULLSCREEN_EXIT', 'CRITICAL');
  }
});

// Re-injection guard
const obs = new MutationObserver(() => {
  if (sentinelActive && !document.body.contains(host)) document.body.appendChild(host);
  if (!sentinelActive && window.location.pathname.startsWith('/exam') && !document.body.contains(blocker)) document.body.appendChild(blocker);
});
obs.observe(document.body, { childList: true });

console.log('[Sentinel] Content script active');
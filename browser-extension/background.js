// ============================================================
// EXAMGUARDRAIL v2.0 — SECURE BACKGROUND WORKER
// ============================================================
// Handles: API forwarding, violation storage, session management.
// Runs in an isolated Service Worker — invisible to the exam page.
// ============================================================

const API_BASE = 'http://localhost:8000/api';

// ── INSTALL / RELOAD ────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  console.log('[ExamGuardrail v2.0] Extension installed.');

  // Set the current active tab as the exam tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.storage.local.set({ examTabId: tabs[0].id });
    }
  });
});

// ── MESSAGE ROUTER ──────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  // ── CLEAR SESSION (called when sentinel activates) ──
  if (message.type === 'CLEAR_SESSION') {
    chrome.storage.local.set({ violations: [] }, () => {
      console.log('[ExamGuardrail] Session cleared — fresh exam.');
    });
    sendResponse({ status: 'cleared' });
  }

  // ── RECEIVE VIOLATION ──
  if (message.type === 'SEND_VIOLATION') {
    const payload = message.payload;

    // 1. Forward to backend API (secure — invisible to page)
    fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(data => console.log('[BG] API accepted:', payload.event_type))
    .catch(err => console.warn('[BG] API offline:', err.message));

    // 2. Store locally for popup
    chrome.storage.local.get(['violations'], (result) => {
      const violations = result.violations || [];
      violations.push({
        ...payload,
        tabId: sender.tab?.id,
        url: sender.tab?.url
      });

      // Cap at 100 violations per session
      if (violations.length > 100) violations.shift();

      chrome.storage.local.set({ violations });
    });

    sendResponse({ status: 'received' });
  }

  return true; // Keep async channel open
});

// ── TAB SWITCH TRACKING (Browser-Level) ─────────────────────
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.storage.local.get(['examTabId'], (result) => {
    if (result.examTabId && activeInfo.tabId !== result.examTabId) {
      console.log('[ExamGuardrail] Tab switch detected at browser level.');

      const payload = {
        session_id: 'BROWSER_LEVEL',
        event_type: 'BROWSER_TAB_SWITCH',
        severity: 'HIGH',
        score_delta: -15,
        platform: 'unknown',
        metadata: { action: 'Switched active browser tab' },
        timestamp: new Date().toISOString()
      };

      fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }
  });
});
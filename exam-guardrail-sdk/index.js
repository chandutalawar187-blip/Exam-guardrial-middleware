// exam-guardrail-sdk/index.js
// ExamGuardrail Frontend SDK — Drop-in proctoring middleware for any web-based exam.
//
// Usage:
//   import { GuardrailSDK } from './exam-guardrail-sdk';
//
//   const guardrail = new GuardrailSDK({ apiBase: '/api' });
//   await guardrail.startSession(sessionId, studentUid);
//   guardrail.startMonitoring();          // keyboard/mouse/tab violations
//   await guardrail.requestMedia();       // camera + mic
//   guardrail.startProctoring();          // face/eye + audio analysis
//   guardrail.stop();                     // cleanup

export class GuardrailSDK {
  constructor({ apiBase = '/api', onViolation = null, onMediaStateChange = null } = {}) {
    this.apiBase = apiBase;
    this.sessionId = null;
    this.studentUid = null;
    this.violations = 0;
    this.onViolation = onViolation;         // (eventType, severity, count) => void
    this.onMediaStateChange = onMediaStateChange; // (state) => void
    this.mediaStream = null;
    this.mediaState = 'idle';               // idle | requesting | granted | denied | unavailable
    this._cleanupFns = [];
    this._proctoringTimer = null;
    this._videoEl = null;
    this._canvasEl = null;
    this._audioCtx = null;
    this._analyser = null;
    this._lastViolation = { face: 0, audio: 0 };
    this._initialWidth = 0;
    this._initialHeight = 0;
  }

  // ── SESSION ────────────────────────────────────────────────
  startSession(sessionId, studentUid) {
    this.sessionId = sessionId;
    this.studentUid = studentUid;
    this._initialWidth = window.innerWidth;
    this._initialHeight = window.innerHeight;
  }

  // ── REPORT VIOLATION ───────────────────────────────────────
  async reportViolation(eventType, severity = 'HIGH') {
    this.violations++;
    if (this.onViolation) this.onViolation(eventType, severity, this.violations);

    try {
      await fetch(`${this.apiBase}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.sessionId,
          event_type: eventType,
          severity: severity,
          layer: 'L1',
          metadata: { source: 'guardrail_sdk', student_uid: this.studentUid }
        })
      });
    } catch (err) {
      console.error('[GuardrailSDK] violation report failed:', err);
    }
  }

  // ── BEHAVIORAL MONITORING ─────────────────────────────────
  startMonitoring() {
    const self = this;
    const onVisibility = () => {
      if (document.hidden) self.reportViolation('TAB_HIDDEN', 'HIGH');
    };
    const onBlur = () => self.reportViolation('WINDOW_FOCUS_LOST', 'HIGH');
    const onContext = (e) => { e.preventDefault(); self.reportViolation('RIGHT_CLICK', 'MEDIUM'); };
    const onClipboard = (e) => { e.preventDefault(); self.reportViolation('CLIPBOARD_ATTEMPT', 'HIGH'); };
    const onKeydown = (e) => {
      const isDevTools = e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) || (e.ctrlKey && e.key === 'u');
      if (isDevTools) { e.preventDefault(); self.reportViolation('DEVTOOLS_ATTEMPT', 'CRITICAL'); }
      // Detect Ctrl+C / Ctrl+V / Ctrl+X as keyboard-level copy/paste
      if (e.ctrlKey && ['c','v','x'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        self.reportViolation('CLIPBOARD_ATTEMPT', 'HIGH');
      }
    };
    const onResize = () => {
      const dw = Math.abs(window.innerWidth - self._initialWidth);
      const dh = Math.abs(window.innerHeight - self._initialHeight);
      if (dw > 50 || dh > 50) self.reportViolation('SCREEN_RESIZE', 'HIGH');
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    document.addEventListener('contextmenu', onContext);
    ['copy', 'cut', 'paste'].forEach(ev => document.addEventListener(ev, onClipboard));
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', onResize);

    this._cleanupFns.push(() => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('contextmenu', onContext);
      ['copy', 'cut', 'paste'].forEach(ev => document.removeEventListener(ev, onClipboard));
      document.removeEventListener('keydown', onKeydown);
      window.removeEventListener('resize', onResize);
    });
  }

  // ── MEDIA (Camera + Mic) ──────────────────────────────────
  async requestMedia() {
    this._setMediaState('requesting');
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCam = devices.some(d => d.kind === 'videoinput');
      const hasMic = devices.some(d => d.kind === 'audioinput');

      if (!hasCam && !hasMic) {
        this._setMediaState('unavailable');
        return false;
      }

      const constraints = {};
      if (hasCam) constraints.video = { width: 320, height: 240, facingMode: 'user' };
      if (hasMic) constraints.audio = { echoCancellation: true, noiseSuppression: true };

      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      this._setMediaState('granted');
      return true;
    } catch (err) {
      if (err.name === 'NotFoundError') {
        this._setMediaState('unavailable');
      } else {
        this._setMediaState('denied');
      }
      return false;
    }
  }

  _setMediaState(state) {
    this.mediaState = state;
    if (this.onMediaStateChange) this.onMediaStateChange(state);
  }

  // ── PROCTORING (Face + Audio Analysis) ─────────────────────
  startProctoring() {
    if (!this.mediaStream) return;

    // Video element for canvas capture
    this._videoEl = document.createElement('video');
    this._videoEl.srcObject = this.mediaStream;
    this._videoEl.muted = true;
    this._videoEl.playsInline = true;
    this._videoEl.play().catch(() => {});
    this._canvasEl = document.createElement('canvas');

    // Audio analyser
    const audioTracks = this.mediaStream.getAudioTracks();
    if (audioTracks.length > 0) {
      this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = this._audioCtx.createMediaStreamSource(this.mediaStream);
      this._analyser = this._audioCtx.createAnalyser();
      this._analyser.fftSize = 256;
      source.connect(this._analyser);
    }

    let noFaceCount = 0, lookAwayCount = 0, highAudioCount = 0;
    const FACE_THRESHOLD = 5;
    const AUDIO_THRESHOLD = 8;

    const loop = () => {
      // Face analysis
      const status = this._analyzeFace();
      if (status === 'no_face') {
        noFaceCount++; lookAwayCount = 0;
        if (noFaceCount >= FACE_THRESHOLD) {
          const now = Date.now();
          if (now - this._lastViolation.face > 10000) {
            this.reportViolation('FACE_NOT_DETECTED', 'HIGH');
            this._lastViolation.face = now;
          }
          noFaceCount = 0;
        }
      } else if (status === 'looking_away') {
        lookAwayCount++; noFaceCount = 0;
        if (lookAwayCount >= FACE_THRESHOLD) {
          const now = Date.now();
          if (now - this._lastViolation.face > 10000) {
            this.reportViolation('GAZE_AWAY', 'MEDIUM');
            this._lastViolation.face = now;
          }
          lookAwayCount = 0;
        }
      } else {
        noFaceCount = Math.max(0, noFaceCount - 1);
        lookAwayCount = Math.max(0, lookAwayCount - 1);
      }

      // Audio analysis
      if (this._analyser) {
        const bufLen = this._analyser.frequencyBinCount;
        const dataArr = new Uint8Array(bufLen);
        this._analyser.getByteFrequencyData(dataArr);
        let sum = 0;
        for (let i = 0; i < bufLen; i++) sum += dataArr[i];
        const avg = sum / bufLen;

        if (avg > 70) {
          highAudioCount++;
          if (highAudioCount >= AUDIO_THRESHOLD) {
            const now = Date.now();
            if (now - this._lastViolation.audio > 15000) {
              this.reportViolation('LOUD_AUDIO_DETECTED', 'MEDIUM');
              this._lastViolation.audio = now;
            }
            highAudioCount = 0;
          }
        } else {
          highAudioCount = Math.max(0, highAudioCount - 1);
        }
      }

      this._proctoringTimer = setTimeout(loop, 500);
    };

    loop();
    this._cleanupFns.push(() => {
      clearTimeout(this._proctoringTimer);
      if (this._audioCtx) this._audioCtx.close().catch(() => {});
    });
  }

  _analyzeFace() {
    const video = this._videoEl;
    const canvas = this._canvasEl;
    if (!video || !canvas || video.readyState < 2) return 'ok';

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = 160; canvas.height = 120;
    ctx.drawImage(video, 0, 0, 160, 120);

    const imageData = ctx.getImageData(0, 0, 160, 120);
    const data = imageData.data;
    const startX = 32, endX = 128, startY = 12, endY = 84;

    let skinPixels = 0, totalPixels = 0, skinWeightedX = 0;

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const i = (y * 160 + x) * 4;
        const r = data[i], g = data[i+1], b = data[i+2];
        const isSkin = r > 60 && g > 40 && b > 20 && r > g && r > b &&
          (r - g) > 10 && Math.abs(r - g) < 150 &&
          (r + g + b) > 150 && (r + g + b) < 700;
        totalPixels++;
        if (isSkin) { skinPixels++; skinWeightedX += x; }
      }
    }

    const skinRatio = totalPixels > 0 ? skinPixels / totalPixels : 0;
    if (skinRatio < 0.04) return 'no_face';
    if (skinPixels > 0) {
      const avgX = skinWeightedX / skinPixels;
      const offset = Math.abs(avgX - 80) / 80;
      if (offset > 0.45) return 'looking_away';
    }
    return 'ok';
  }

  // ── GET VIDEO STREAM (for UI rendering) ────────────────────
  getVideoStream() {
    return this.mediaStream;
  }

  // ── GET AUDIO LEVEL (0-100) ────────────────────────────────
  getAudioLevel() {
    if (!this._analyser) return 0;
    const bufLen = this._analyser.frequencyBinCount;
    const dataArr = new Uint8Array(bufLen);
    this._analyser.getByteFrequencyData(dataArr);
    let sum = 0;
    for (let i = 0; i < bufLen; i++) sum += dataArr[i];
    return Math.min(100, Math.round((sum / bufLen / 128) * 100));
  }

  // ── GET FACE STATUS ────────────────────────────────────────
  getFaceStatus() {
    return this._analyzeFace();
  }

  // ── STOP EVERYTHING ────────────────────────────────────────
  stop() {
    this._cleanupFns.forEach(fn => fn());
    this._cleanupFns = [];
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
  }
}

// ── React Hook ───────────────────────────────────────────────
// import { useGuardrail } from './exam-guardrail-sdk';
//
// const { sdk, violations, mediaState, faceStatus, audioLevel } = useGuardrail({
//   apiBase: '/api',
//   sessionId: '...',
//   studentUid: '...',
//   autoStart: true   // auto-start monitoring + media
// });

export { default as useGuardrail } from './useGuardrail';
export { default as ProctoringOverlay } from './ProctoringOverlay';

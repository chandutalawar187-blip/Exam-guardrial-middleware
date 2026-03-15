// exam-guardrail-sdk/src/useGuardrail.js
// React hook for ExamGuardrail — optional, only used if React is available.
//
// Usage:
//   import { useGuardrail } from 'exam-guardrail/react';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GuardrailSDK } from './GuardrailSDK.js';

export function useGuardrail({
  apiBase = '/api',
  sessionId = null,
  userId = null,
  autoStart = false
} = {}) {
  const sdkRef = useRef(null);
  const [violations, setViolations] = useState(0);
  const [mediaState, setMediaState] = useState('idle');
  const [faceStatus, setFaceStatus] = useState('ok');
  const [audioLevel, setAudioLevel] = useState(0);
  const pollRef = useRef(null);

  useEffect(() => {
    const sdk = new GuardrailSDK({
      apiBase,
      onViolation: (_type, _sev, count) => setViolations(count),
      onMediaStateChange: (state) => setMediaState(state)
    });
    sdkRef.current = sdk;

    if (sessionId) sdk.startSession(sessionId, userId);

    if (autoStart && sessionId) {
      sdk.startMonitoring();
      sdk.requestMedia().then(ok => {
        if (ok) sdk.startProctoring();
      });
    }

    pollRef.current = setInterval(() => {
      if (sdkRef.current) {
        setFaceStatus(sdkRef.current.getFaceStatus());
        setAudioLevel(sdkRef.current.getAudioLevel());
      }
    }, 500);

    return () => {
      clearInterval(pollRef.current);
      sdk.stop();
    };
  }, [apiBase, sessionId, userId, autoStart]);

  const startMonitoring = useCallback(() => { sdkRef.current?.startMonitoring(); }, []);
  const requestMedia = useCallback(() => sdkRef.current?.requestMedia(), []);
  const startProctoring = useCallback(() => { sdkRef.current?.startProctoring(); }, []);
  const stop = useCallback(() => { sdkRef.current?.stop(); }, []);
  const getVideoStream = useCallback(() => sdkRef.current?.getVideoStream(), []);
  const getViolationLog = useCallback(() => sdkRef.current?.getViolationLog() || [], []);

  return {
    sdk: sdkRef.current,
    violations,
    mediaState,
    faceStatus,
    audioLevel,
    startMonitoring,
    requestMedia,
    startProctoring,
    stop,
    getVideoStream,
    getViolationLog
  };
}

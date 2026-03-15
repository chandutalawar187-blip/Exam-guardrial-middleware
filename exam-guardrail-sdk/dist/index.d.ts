// Type definitions for exam-guardrail

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ViolationEntry {
  eventType: string;
  severity: Severity;
  timestamp: string;
  count: number;
}

export interface GuardrailSDKOptions {
  apiBase?: string;
  onViolation?: (eventType: string, severity: Severity, totalCount: number) => void;
  onMediaStateChange?: (state: MediaState) => void;
}

export type MediaState = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';
export type FaceStatus = 'ok' | 'looking_away' | 'no_face';

export declare class GuardrailSDK {
  sessionId: string | null;
  userId: string | null;
  violations: number;
  violationLog: ViolationEntry[];
  mediaState: MediaState;
  mediaStream: MediaStream | null;

  constructor(options?: GuardrailSDKOptions);

  startSession(sessionId: string, userId?: string): void;
  reportViolation(eventType: string, severity?: Severity): Promise<void>;
  startMonitoring(): void;
  requestMedia(): Promise<boolean>;
  startProctoring(): void;
  getVideoStream(): MediaStream | null;
  getAudioLevel(): number;
  getFaceStatus(): FaceStatus;
  getViolationLog(): ViolationEntry[];
  stop(): void;
}

-- ==========================================
-- EXAM GUARDRAIL — INTEGRITY-FIRST MIDDLEWARE
-- FINAL — Judge Demo Build Schema
-- ==========================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- EXAMS
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  join_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'DRAFT', -- DRAFT | LIVE | CLOSED
  duration INTEGER NOT NULL, -- minutes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  admin_id UUID
);

-- QUESTIONS (Agent D targets this)
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- {A: "...", B: "...", C: "...", D: "..."}
  correct_answer TEXT NOT NULL, -- A | B | C | D
  explanation TEXT,
  difficulty TEXT DEFAULT 'MEDIUM', -- EASY | MEDIUM | HARD
  topic_tag TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EXAM SESSIONS
CREATE TABLE exam_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  candidate_id TEXT NOT NULL,
  status TEXT DEFAULT 'ACTIVE', -- ACTIVE | SUBMITTED | FLAGGED | TERMINATED
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  base_score FLOAT DEFAULT 0.0,
  final_score FLOAT DEFAULT 0.0,
  credibility_score INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ANSWERS
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  time_taken INTEGER, -- seconds
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EVENTS (L1-L4 Telemetry + Agent A)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
  layer TEXT NOT NULL, -- L1 | L2 | L3 | L4
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'MEDIUM', -- LOW | MEDIUM | HIGH | CRITICAL
  payload JSONB DEFAULT '{}',
  alert_sentence TEXT, -- English sentence from Agent A
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ANSWER SCORES (Agent C results)
CREATE TABLE answer_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  ai_probability FLOAT DEFAULT 0.0,
  verdict TEXT, -- Human | Possibly AI | Likely AI | AI Generated
  flag_for_review BOOLEAN DEFAULT FALSE,
  signals_detected JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREDIBILITY REPORTS (Agent B output)
CREATE TABLE credibility_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
  credibility_score INTEGER,
  verdict TEXT, -- CLEAR | UNDER_REVIEW | SUSPICIOUS | FLAGGED
  risk_breakdown JSONB DEFAULT '{}',
  red_flags JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '[]',
  executive_summary TEXT,
  recommendation TEXT,
  full_report JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REALTIME & SECURITY
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE credibility_reports ENABLE ROW LEVEL SECURITY;

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE exam_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE credibility_reports;

-- INDEXES
CREATE INDEX idx_events_session_layer ON events(session_id, layer);
CREATE INDEX idx_answers_session ON answers(session_id);
CREATE INDEX idx_scores_session ON answer_scores(session_id);
CREATE INDEX idx_exams_code ON exams(join_code);

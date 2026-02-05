-- Carbon Footprint Calculator - Database Setup
-- Run this in Supabase Dashboard > SQL Editor > New query

-- Table: submissions (one row per completed survey)
CREATE TABLE submissions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id    TEXT NOT NULL,
  total_co2_kg  NUMERIC(10,2) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_submissions_session_id ON submissions (session_id);

-- Table: submission_categories (CO2 breakdown per category)
CREATE TABLE submission_categories (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id  UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  category       TEXT NOT NULL,
  co2_kg         NUMERIC(10,2) NOT NULL,
  UNIQUE(submission_id, category)
);

CREATE INDEX idx_sub_categories_submission ON submission_categories (submission_id);

-- Table: submission_answers (raw answers for recalculation)
CREATE TABLE submission_answers (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id  UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  question_id    TEXT NOT NULL,
  answer_value   TEXT NOT NULL
);

CREATE INDEX idx_sub_answers_submission ON submission_answers (submission_id);

-- Enable Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_answers ENABLE ROW LEVEL SECURITY;

-- Policies: anonymous insert + read (no update/delete)
CREATE POLICY "Allow anonymous inserts" ON submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON submission_categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON submission_answers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous reads" ON submissions
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous reads" ON submission_categories
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous reads" ON submission_answers
  FOR SELECT USING (true);

-- Migration: Add student fields to submissions table
-- Run this if you have existing data and don't want to drop tables

-- Add new columns (with defaults for existing rows)
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS student_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS student_email TEXT NOT NULL DEFAULT '';

-- Add index for email lookups
CREATE INDEX IF NOT EXISTS idx_submissions_student_email ON submissions (student_email);

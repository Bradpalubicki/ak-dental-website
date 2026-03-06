-- Add narrative column to seo_reports for AI-generated monthly summary
ALTER TABLE seo_reports ADD COLUMN IF NOT EXISTS narrative TEXT;

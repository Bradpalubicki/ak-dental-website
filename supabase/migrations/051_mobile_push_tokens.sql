-- Migration 051: Mobile push notification tokens
-- Stores device push tokens for patient mobile app notifications

CREATE TABLE IF NOT EXISTS mobile_push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  org_id text,
  push_token text NOT NULL UNIQUE,
  platform text NOT NULL CHECK (platform IN ('ios', 'android')),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mobile_push_tokens_user ON mobile_push_tokens(user_id);

ALTER TABLE mobile_push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON mobile_push_tokens FOR ALL USING (true) WITH CHECK (true);

-- Email style profile table
-- Stores AI-generated tone/voice profile from recently sent drafts
CREATE TABLE IF NOT EXISTS oe_email_style (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  style_summary TEXT NOT NULL,       -- AI-generated tone summary (2-3 sentences)
  example_openers JSONB DEFAULT '[]',-- ["Hi Sarah,", "Hi there,"] — common openers
  example_closings JSONB DEFAULT '[]',-- ["Dr. Alex & Team", "See you soon!"] — common closings
  tone_keywords JSONB DEFAULT '[]',  -- ["direct", "warm", "short sentences"]
  sample_snippets JSONB DEFAULT '[]',-- last 3 sent email bodies (trimmed)
  generated_at TIMESTAMPTZ DEFAULT now(),
  source_draft_count INT DEFAULT 0
);

-- Only ever one row (upsert on id = fixed UUID)
INSERT INTO oe_email_style (id, style_summary, generated_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'No style profile yet — send some emails to generate one.', now())
ON CONFLICT (id) DO NOTHING;

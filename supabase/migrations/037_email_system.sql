-- Migration 037: Email System — Nylas message ingestion, drafts, AP email linkage

-- Deduplicated inbound email messages from Nylas
CREATE TABLE IF NOT EXISTS oe_email_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nylas_message_id TEXT UNIQUE NOT NULL,
  nylas_thread_id TEXT,
  nylas_grant_id TEXT,
  from_email TEXT NOT NULL,
  from_name TEXT,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  has_attachment BOOLEAN DEFAULT false,
  attachment_names JSONB,
  classification TEXT CHECK (classification IN ('invoice', 'inquiry', 'appointment', 'other', 'noise')),
  classification_confidence FLOAT,
  direction TEXT NOT NULL DEFAULT 'inbound',
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oe_email_messages_classification ON oe_email_messages(classification);
CREATE INDEX IF NOT EXISTS idx_oe_email_messages_processed ON oe_email_messages(processed);
CREATE INDEX IF NOT EXISTS idx_oe_email_messages_created_at ON oe_email_messages(created_at DESC);

ALTER TABLE oe_email_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on oe_email_messages"
  ON oe_email_messages FOR ALL USING (true) WITH CHECK (true);

-- Pending email draft replies — require Brad's approval before sending
CREATE TABLE IF NOT EXISTS oe_email_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_message_id UUID REFERENCES oe_email_messages(id) ON DELETE SET NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sent')),
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  resend_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oe_email_drafts_status ON oe_email_drafts(status);
CREATE INDEX IF NOT EXISTS idx_oe_email_drafts_created_at ON oe_email_drafts(created_at DESC);

ALTER TABLE oe_email_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on oe_email_drafts"
  ON oe_email_drafts FOR ALL USING (true) WITH CHECK (true);

-- Link AP bills to their source email and add extraction metadata
ALTER TABLE oe_accounts_payable
  ADD COLUMN IF NOT EXISTS source_email_id UUID REFERENCES oe_email_messages(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS invoice_number TEXT,
  ADD COLUMN IF NOT EXISTS extraction_confidence FLOAT,
  ADD COLUMN IF NOT EXISTS raw_extraction JSONB;

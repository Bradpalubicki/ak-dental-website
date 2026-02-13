-- Outreach messages table for tracking individual sends + engagement
-- Drop FK constraint, recreate table, then restore FK
ALTER TABLE IF EXISTS oe_crm_communications DROP CONSTRAINT IF EXISTS oe_crm_communications_outreach_message_id_fkey;

DROP TABLE IF EXISTS oe_outreach_messages;

CREATE TABLE oe_outreach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES oe_outreach_workflows(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES oe_patients(id) ON DELETE SET NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'phone')),
  campaign_type TEXT,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'bounced', 'failed')),
  opened BOOLEAN DEFAULT false,
  clicked BOOLEAN DEFAULT false,
  converted BOOLEAN DEFAULT false,
  responded BOOLEAN DEFAULT false,
  unsubscribed BOOLEAN DEFAULT false,
  ai_generated BOOLEAN DEFAULT false,
  automated BOOLEAN DEFAULT false,
  subject TEXT,
  body_preview TEXT,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Restore FK from oe_crm_communications
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'oe_crm_communications' AND column_name = 'outreach_message_id') THEN
    ALTER TABLE oe_crm_communications
      ADD CONSTRAINT oe_crm_communications_outreach_message_id_fkey
      FOREIGN KEY (outreach_message_id) REFERENCES oe_outreach_messages(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX idx_outreach_messages_sent_at ON oe_outreach_messages(sent_at);
CREATE INDEX idx_outreach_messages_channel ON oe_outreach_messages(channel);
CREATE INDEX idx_outreach_messages_campaign_type ON oe_outreach_messages(campaign_type);
CREATE INDEX idx_outreach_messages_workflow_id ON oe_outreach_messages(workflow_id);

ALTER TABLE oe_outreach_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on outreach_messages"
  ON oe_outreach_messages FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

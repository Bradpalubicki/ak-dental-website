-- DATA RETENTION POLICIES (HIPAA 6-year requirement)
-- Configurable per resource type, enforced by weekly cron

CREATE TABLE IF NOT EXISTS oe_data_retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL UNIQUE,
  retention_days INTEGER NOT NULL,
  action TEXT NOT NULL DEFAULT 'archive' CHECK (action IN ('archive', 'anonymize', 'delete')),
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Default policies per HIPAA and business requirements
INSERT INTO oe_data_retention_policies (resource_type, retention_days, action, description) VALUES
  ('audit_log', 2190, 'archive', 'HIPAA requires 6 years retention for compliance records'),
  ('consent_log', 2190, 'archive', 'HIPAA requires 6 years retention for consent records'),
  ('oe_patient_consents', 2190, 'archive', 'Consent records kept 6 years per HIPAA'),
  ('oe_calls', 730, 'anonymize', 'Call records anonymized after 2 years'),
  ('oe_outreach_messages', 730, 'archive', 'Outreach messages archived after 2 years'),
  ('oe_leads', 365, 'anonymize', 'Non-converted leads anonymized after 1 year'),
  ('oe_ai_actions', 365, 'archive', 'AI action records archived after 1 year'),
  ('oe_patients', 2555, 'archive', 'Patient records kept 7 years (Nevada dental record retention)')
ON CONFLICT (resource_type) DO NOTHING;

-- RLS
ALTER TABLE oe_data_retention_policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON oe_data_retention_policies FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_retention_policies_updated_at
  BEFORE UPDATE ON oe_data_retention_policies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

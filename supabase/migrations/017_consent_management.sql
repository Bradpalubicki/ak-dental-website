-- PATIENT CONSENT MANAGEMENT (TCPA + HIPAA)
-- Tracks per-patient, per-channel consent status for compliance

CREATE TABLE IF NOT EXISTS oe_patient_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES oe_patients(id),
  consent_type TEXT NOT NULL CHECK (consent_type IN (
    'sms_marketing', 'sms_transactional', 'email_marketing', 'email_transactional',
    'voice_automated', 'voice_ai',
    'hipaa_treatment', 'hipaa_payment', 'hipaa_operations'
  )),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('granted', 'denied', 'revoked', 'pending')),
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  method TEXT CHECK (method IN ('web_form', 'sms_keyword', 'verbal', 'written', 'paper', 'portal', 'import', 'system')),
  document_url TEXT,
  expires_at TIMESTAMPTZ,
  ip_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(patient_id, consent_type)
);

CREATE INDEX idx_patient_consents_patient ON oe_patient_consents(patient_id);
CREATE INDEX idx_patient_consents_type ON oe_patient_consents(consent_type, status);

-- Opt-out tracking (separate table for fast lookup)
CREATE TABLE IF NOT EXISTS oe_opt_outs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT,
  email TEXT,
  patient_id UUID REFERENCES oe_patients(id),
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email', 'voice', 'all')),
  opt_out_method TEXT CHECK (opt_out_method IN ('sms_reply', 'email_link', 'phone', 'portal', 'verbal', 'manual')),
  opt_out_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  processed_within_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_opt_outs_phone ON oe_opt_outs(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_opt_outs_email ON oe_opt_outs(email) WHERE email IS NOT NULL;

-- RLS
ALTER TABLE oe_patient_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_opt_outs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON oe_patient_consents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_opt_outs FOR ALL USING (true) WITH CHECK (true);

-- Updated_at trigger
CREATE TRIGGER update_patient_consents_updated_at
  BEFORE UPDATE ON oe_patient_consents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

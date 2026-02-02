-- ONE ENGINE: AI Operations Platform for AK Ultimate Dental
-- Complete database schema

-- gen_random_uuid() is built into PostgreSQL 13+, no extension needed

-- ============================================================================
-- PATIENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  insurance_provider TEXT,
  insurance_member_id TEXT,
  insurance_group_number TEXT,
  pms_patient_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect')),
  last_visit DATE,
  next_appointment TIMESTAMPTZ,
  notes TEXT,
  tags TEXT[] DEFAULT '{}'
);

CREATE INDEX idx_oe_patients_status ON oe_patients(status);
CREATE INDEX idx_oe_patients_phone ON oe_patients(phone);
CREATE INDEX idx_oe_patients_email ON oe_patients(email);
CREATE INDEX idx_oe_patients_last_visit ON oe_patients(last_visit);
CREATE INDEX idx_oe_patients_pms_id ON oe_patients(pms_patient_id);

-- ============================================================================
-- LEADS (Speed-to-Lead)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'phone', 'referral', 'social', 'google', 'walk_in', 'other')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'appointment_booked', 'converted', 'lost')),
  inquiry_type TEXT,
  message TEXT,
  urgency TEXT NOT NULL DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'emergency')),
  ai_response_draft TEXT,
  ai_response_sent BOOLEAN DEFAULT false,
  ai_response_approved BOOLEAN DEFAULT false,
  assigned_to TEXT,
  converted_patient_id UUID REFERENCES oe_patients(id),
  response_time_seconds INTEGER,
  notes TEXT
);

CREATE INDEX idx_oe_leads_status ON oe_leads(status);
CREATE INDEX idx_oe_leads_source ON oe_leads(source);
CREATE INDEX idx_oe_leads_created ON oe_leads(created_at DESC);
CREATE INDEX idx_oe_leads_urgency ON oe_leads(urgency);

-- ============================================================================
-- APPOINTMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  patient_id UUID NOT NULL REFERENCES oe_patients(id),
  provider_name TEXT NOT NULL DEFAULT 'AK Ultimate Dental',
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'no_show', 'cancelled', 'rescheduled')),
  confirmation_sent BOOLEAN DEFAULT false,
  reminder_24h_sent BOOLEAN DEFAULT false,
  reminder_2h_sent BOOLEAN DEFAULT false,
  no_show_followup_sent BOOLEAN DEFAULT false,
  insurance_verified BOOLEAN DEFAULT false,
  notes TEXT,
  pms_appointment_id TEXT
);

CREATE INDEX idx_oe_appointments_date ON oe_appointments(appointment_date);
CREATE INDEX idx_oe_appointments_patient ON oe_appointments(patient_id);
CREATE INDEX idx_oe_appointments_status ON oe_appointments(status);

-- ============================================================================
-- INSURANCE VERIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_insurance_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  patient_id UUID NOT NULL REFERENCES oe_patients(id),
  appointment_id UUID REFERENCES oe_appointments(id),
  insurance_provider TEXT NOT NULL,
  member_id TEXT NOT NULL,
  group_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'issues', 'expired', 'not_found')),
  coverage_type TEXT,
  deductible DECIMAL(10,2),
  deductible_met DECIMAL(10,2),
  annual_maximum DECIMAL(10,2),
  annual_used DECIMAL(10,2),
  preventive_coverage INTEGER,
  basic_coverage INTEGER,
  major_coverage INTEGER,
  orthodontic_coverage INTEGER,
  waiting_periods JSONB,
  flags TEXT[] DEFAULT '{}',
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  raw_response JSONB,
  notes TEXT
);

CREATE INDEX idx_oe_insurance_patient ON oe_insurance_verifications(patient_id);
CREATE INDEX idx_oe_insurance_status ON oe_insurance_verifications(status);
CREATE INDEX idx_oe_insurance_appointment ON oe_insurance_verifications(appointment_id);

-- ============================================================================
-- TREATMENT PLANS
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_treatment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  patient_id UUID NOT NULL REFERENCES oe_patients(id),
  provider_name TEXT NOT NULL DEFAULT 'AK Ultimate Dental',
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'presented', 'accepted', 'partially_accepted', 'declined', 'completed')),
  procedures JSONB NOT NULL DEFAULT '[]',
  total_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  insurance_estimate DECIMAL(10,2) NOT NULL DEFAULT 0,
  patient_estimate DECIMAL(10,2) NOT NULL DEFAULT 0,
  ai_summary TEXT,
  patient_viewed BOOLEAN DEFAULT false,
  patient_viewed_at TIMESTAMPTZ,
  followup_count INTEGER DEFAULT 0,
  last_followup_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  decline_reason TEXT,
  notes TEXT
);

CREATE INDEX idx_oe_treatments_patient ON oe_treatment_plans(patient_id);
CREATE INDEX idx_oe_treatments_status ON oe_treatment_plans(status);

-- ============================================================================
-- CALLS (Call Intelligence)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  caller_phone TEXT,
  caller_name TEXT,
  patient_id UUID REFERENCES oe_patients(id),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  status TEXT NOT NULL CHECK (status IN ('answered', 'missed', 'voicemail', 'abandoned')),
  duration_seconds INTEGER,
  after_hours BOOLEAN DEFAULT false,
  intent TEXT,
  urgency TEXT DEFAULT 'low' CHECK (urgency IN ('low', 'medium', 'high', 'emergency')),
  ai_handled BOOLEAN DEFAULT false,
  ai_summary TEXT,
  transcription TEXT,
  recording_url TEXT,
  action_taken TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_completed BOOLEAN DEFAULT false,
  notes TEXT
);

CREATE INDEX idx_oe_calls_created ON oe_calls(created_at DESC);
CREATE INDEX idx_oe_calls_patient ON oe_calls(patient_id);
CREATE INDEX idx_oe_calls_status ON oe_calls(status);

-- ============================================================================
-- BILLING / CLAIMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_billing_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  patient_id UUID NOT NULL REFERENCES oe_patients(id),
  appointment_id UUID REFERENCES oe_appointments(id),
  claim_number TEXT,
  insurance_provider TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'pending', 'paid', 'denied', 'appealed', 'written_off')),
  procedure_codes JSONB NOT NULL DEFAULT '[]',
  billed_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  insurance_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  patient_responsibility DECIMAL(10,2) NOT NULL DEFAULT 0,
  adjustment DECIMAL(10,2) NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  denial_reason TEXT,
  aging_days INTEGER DEFAULT 0,
  notes TEXT
);

CREATE INDEX idx_oe_claims_patient ON oe_billing_claims(patient_id);
CREATE INDEX idx_oe_claims_status ON oe_billing_claims(status);
CREATE INDEX idx_oe_claims_aging ON oe_billing_claims(aging_days);

-- ============================================================================
-- OUTREACH WORKFLOWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_outreach_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('welcome', 'recall', 'treatment_followup', 'reactivation', 'no_show', 'review_request', 'custom')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'paused', 'draft')),
  trigger_conditions JSONB NOT NULL DEFAULT '{}',
  steps JSONB NOT NULL DEFAULT '[]',
  enrolled_count INTEGER DEFAULT 0,
  completed_count INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2)
);

-- ============================================================================
-- OUTREACH MESSAGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_outreach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  workflow_id UUID REFERENCES oe_outreach_workflows(id),
  patient_id UUID NOT NULL REFERENCES oe_patients(id),
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email', 'call', 'portal')),
  direction TEXT NOT NULL DEFAULT 'outbound' CHECK (direction IN ('outbound', 'inbound')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'failed', 'bounced')),
  subject TEXT,
  content TEXT NOT NULL,
  template_id TEXT,
  metadata JSONB
);

CREATE INDEX idx_oe_messages_patient ON oe_outreach_messages(patient_id);
CREATE INDEX idx_oe_messages_workflow ON oe_outreach_messages(workflow_id);
CREATE INDEX idx_oe_messages_status ON oe_outreach_messages(status);

-- ============================================================================
-- AI ACTIONS LOG (Audit Trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_ai_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  action_type TEXT NOT NULL,
  module TEXT NOT NULL,
  description TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'approved', 'executed', 'rejected', 'failed')),
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  patient_id UUID REFERENCES oe_patients(id),
  lead_id UUID REFERENCES oe_leads(id),
  confidence_score DECIMAL(5,4)
);

CREATE INDEX idx_oe_ai_actions_module ON oe_ai_actions(module);
CREATE INDEX idx_oe_ai_actions_status ON oe_ai_actions(status);
CREATE INDEX idx_oe_ai_actions_created ON oe_ai_actions(created_at DESC);

-- ============================================================================
-- DAILY METRICS (Analytics)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  new_leads INTEGER DEFAULT 0,
  leads_converted INTEGER DEFAULT 0,
  appointments_scheduled INTEGER DEFAULT 0,
  appointments_completed INTEGER DEFAULT 0,
  no_shows INTEGER DEFAULT 0,
  cancellations INTEGER DEFAULT 0,
  production DECIMAL(10,2) DEFAULT 0,
  collections DECIMAL(10,2) DEFAULT 0,
  claims_submitted INTEGER DEFAULT 0,
  claims_paid INTEGER DEFAULT 0,
  claims_denied INTEGER DEFAULT 0,
  ai_actions_taken INTEGER DEFAULT 0,
  ai_actions_approved INTEGER DEFAULT 0,
  avg_lead_response_seconds INTEGER,
  patient_messages_sent INTEGER DEFAULT 0,
  patient_messages_received INTEGER DEFAULT 0
);

CREATE INDEX idx_oe_metrics_date ON oe_daily_metrics(date DESC);

-- ============================================================================
-- PRACTICE SETTINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_practice_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default settings
INSERT INTO oe_practice_settings (key, value) VALUES
  ('practice_info', '{"name": "AK Ultimate Dental", "phone": "(702) 935-4395", "email": "dentalremind@yahoo.com", "address": "7480 West Sahara Avenue, Las Vegas, NV 89117", "doctor": "AK Ultimate Dental"}'),
  ('business_hours', '{"monday": "8:00 AM - 5:00 PM", "tuesday": "8:00 AM - 5:00 PM", "wednesday": "8:00 AM - 5:00 PM", "thursday": "8:00 AM - 5:00 PM", "friday": "Closed", "saturday": "Closed", "sunday": "Closed"}'),
  ('ai_settings', '{"auto_respond_leads": false, "auto_send_confirmations": true, "auto_send_reminders": true, "lead_response_mode": "draft_and_approve", "confidence_threshold": 0.85}'),
  ('notification_settings', '{"daily_briefing_time": "07:00", "daily_briefing_email": true, "alert_new_leads": true, "alert_no_shows": true, "alert_insurance_issues": true}'),
  ('integration_status', '{"twilio": "not_configured", "resend": "configured", "stripe": "not_configured", "pms": "not_configured", "insurance_edi": "not_configured"}')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE oe_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_insurance_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_billing_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_outreach_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_outreach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_ai_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_practice_settings ENABLE ROW LEVEL SECURITY;

-- Service role policies (full access for backend)
CREATE POLICY "Service role full access" ON oe_patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_insurance_verifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_treatment_plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_calls FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_billing_claims FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_outreach_workflows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_outreach_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_ai_actions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_daily_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_practice_settings FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_oe_patients_updated_at BEFORE UPDATE ON oe_patients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_leads_updated_at BEFORE UPDATE ON oe_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_appointments_updated_at BEFORE UPDATE ON oe_appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_insurance_updated_at BEFORE UPDATE ON oe_insurance_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_treatments_updated_at BEFORE UPDATE ON oe_treatment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_claims_updated_at BEFORE UPDATE ON oe_billing_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_workflows_updated_at BEFORE UPDATE ON oe_outreach_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at();

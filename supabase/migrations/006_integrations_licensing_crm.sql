-- MIGRATION 006: Integrations, Licensing, CRM
-- Tables for PMS, Billing, Accounting integrations; Licensing/Credentials; CRM contacts; Setup Checklist

-- ============================================================================
-- SETUP CHECKLIST (Onboarding state per practice)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_setup_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  step_key TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('essentials', 'integrations', 'team', 'operations', 'advanced')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by TEXT,
  skipped BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  UNIQUE(practice_id, step_key)
);

CREATE INDEX idx_setup_checklist_practice ON oe_setup_checklist(practice_id);
CREATE INDEX idx_setup_checklist_completed ON oe_setup_checklist(completed);

-- Seed default checklist steps (practice_id NULL = template for all new practices)
INSERT INTO oe_setup_checklist (practice_id, step_key, label, description, category, sort_order) VALUES
  (NULL, 'practice_info', 'Add Practice Information', 'Name, address, phone, email, hours', 'essentials', 1),
  (NULL, 'add_provider', 'Add Provider / Doctor', 'Add your lead provider profile with NPI and credentials', 'essentials', 2),
  (NULL, 'add_staff', 'Add Staff Members', 'Create employee records for your team', 'team', 3),
  (NULL, 'upload_licenses', 'Upload Licenses & Credentials', 'Add state licenses, DEA, NPI for all providers', 'team', 4),
  (NULL, 'connect_pms', 'Connect Practice Management System', 'Link Dentrix, Eaglesoft, Open Dental, or import CSV', 'integrations', 5),
  (NULL, 'configure_twilio', 'Configure SMS / Phone', 'Add Twilio number for patient communications', 'integrations', 6),
  (NULL, 'configure_email', 'Configure Email Sending', 'Set up Resend for appointment confirmations and outreach', 'integrations', 7),
  (NULL, 'connect_billing', 'Connect Billing / Clearinghouse', 'Link DentalXChange, Tesia, or manual claim management', 'integrations', 8),
  (NULL, 'connect_accounting', 'Connect Accounting System', 'Link QuickBooks, Xero, or manual entry', 'integrations', 9),
  (NULL, 'configure_stripe', 'Set Up Patient Payments', 'Configure Stripe for online payments and payment plans', 'integrations', 10),
  (NULL, 'import_patients', 'Import Patient Records', 'Import from PMS or upload CSV', 'operations', 11),
  (NULL, 'configure_ai', 'Configure AI Settings', 'Set auto-response mode, confidence thresholds, approval rules', 'operations', 12),
  (NULL, 'setup_outreach', 'Set Up Outreach Workflows', 'Configure recall, reactivation, and nurture sequences', 'advanced', 13),
  (NULL, 'configure_insurance', 'Set Up Insurance Verification', 'Add carrier connections and verification workflow', 'advanced', 14),
  (NULL, 'go_live', 'Go Live', 'Review settings and activate One Engine', 'advanced', 15)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PMS INTEGRATIONS (Practice Management System connections)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_pms_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  pms_type TEXT NOT NULL CHECK (pms_type IN ('dentrix', 'eaglesoft', 'open_dental', 'dentrix_ascend', 'curve', 'csv_import', 'api_generic')),
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_configured' CHECK (status IN ('not_configured', 'configuring', 'connected', 'syncing', 'error', 'disconnected')),
  -- Connection details (encrypted at app layer via src/lib/encryption.ts)
  connection_config JSONB DEFAULT '{}',
  -- Sync settings
  sync_frequency TEXT NOT NULL DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'manual')),
  sync_direction TEXT NOT NULL DEFAULT 'import' CHECK (sync_direction IN ('import', 'export', 'bidirectional')),
  last_sync_at TIMESTAMPTZ,
  last_sync_status TEXT CHECK (last_sync_status IN ('success', 'partial', 'failed')),
  last_sync_records INTEGER DEFAULT 0,
  last_sync_errors JSONB DEFAULT '[]',
  -- Mapping
  field_mapping JSONB DEFAULT '{}',
  -- Stats
  total_patients_synced INTEGER DEFAULT 0,
  total_appointments_synced INTEGER DEFAULT 0,
  total_sync_runs INTEGER DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  notes TEXT
);

CREATE INDEX idx_pms_integrations_practice ON oe_pms_integrations(practice_id);
CREATE INDEX idx_pms_integrations_type ON oe_pms_integrations(pms_type);
CREATE INDEX idx_pms_integrations_status ON oe_pms_integrations(status);

-- ============================================================================
-- PMS SYNC LOG (History of sync operations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_pms_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  integration_id UUID NOT NULL REFERENCES oe_pms_integrations(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('full', 'incremental', 'manual')),
  status TEXT NOT NULL CHECK (status IN ('started', 'in_progress', 'success', 'partial', 'failed')),
  records_processed INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0,
  records_errored INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]',
  duration_ms INTEGER,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_pms_sync_log_integration ON oe_pms_sync_log(integration_id);
CREATE INDEX idx_pms_sync_log_created ON oe_pms_sync_log(created_at DESC);

-- ============================================================================
-- LICENSING & CREDENTIALS
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  -- Who holds it
  holder_type TEXT NOT NULL CHECK (holder_type IN ('provider', 'staff', 'practice', 'team')),
  holder_name TEXT NOT NULL,
  employee_id UUID REFERENCES oe_employees(id) ON DELETE SET NULL,
  -- License details
  license_type TEXT NOT NULL,
  license_number TEXT,
  issued_by TEXT NOT NULL,
  issue_date DATE,
  expiration_date DATE,
  -- Status (computed from expiration_date, but cached for queries)
  status TEXT NOT NULL DEFAULT 'current' CHECK (status IN ('current', 'expiring_soon', 'expired', 'pending_renewal', 'revoked', 'not_applicable')),
  days_until_expiry INTEGER,
  -- Renewal tracking
  renewal_submitted BOOLEAN DEFAULT false,
  renewal_submitted_at TIMESTAMPTZ,
  renewal_notes TEXT,
  -- Document storage
  document_url TEXT,
  document_name TEXT,
  -- Alert settings
  alert_90_day_sent BOOLEAN DEFAULT false,
  alert_60_day_sent BOOLEAN DEFAULT false,
  alert_30_day_sent BOOLEAN DEFAULT false,
  alert_expired_sent BOOLEAN DEFAULT false,
  -- Metadata
  category TEXT CHECK (category IN ('state_license', 'dea', 'npi', 'certification', 'permit', 'business', 'insurance', 'training', 'other')),
  is_required BOOLEAN NOT NULL DEFAULT true,
  notes TEXT
);

CREATE INDEX idx_licenses_practice ON oe_licenses(practice_id);
CREATE INDEX idx_licenses_employee ON oe_licenses(employee_id);
CREATE INDEX idx_licenses_status ON oe_licenses(status);
CREATE INDEX idx_licenses_expiration ON oe_licenses(expiration_date);
CREATE INDEX idx_licenses_holder ON oe_licenses(holder_type, holder_name);

-- ============================================================================
-- BILLING INTEGRATIONS (Clearinghouse / Claims)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_billing_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('dentalxchange', 'tesia', 'availity', 'change_healthcare', 'manual', 'api_generic')),
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_configured' CHECK (status IN ('not_configured', 'configuring', 'connected', 'error', 'disconnected')),
  -- Connection (encrypted at app layer)
  connection_config JSONB DEFAULT '{}',
  -- Capabilities
  supports_eligibility BOOLEAN DEFAULT false,
  supports_claims BOOLEAN DEFAULT false,
  supports_era BOOLEAN DEFAULT false,
  supports_attachments BOOLEAN DEFAULT false,
  -- Stats
  claims_submitted_total INTEGER DEFAULT 0,
  claims_paid_total INTEGER DEFAULT 0,
  last_submission_at TIMESTAMPTZ,
  last_era_received_at TIMESTAMPTZ,
  avg_days_to_payment INTEGER,
  notes TEXT
);

CREATE INDEX idx_billing_int_practice ON oe_billing_integrations(practice_id);
CREATE INDEX idx_billing_int_type ON oe_billing_integrations(integration_type);
CREATE INDEX idx_billing_int_status ON oe_billing_integrations(status);

-- ============================================================================
-- ERA/EOB RECORDS (Electronic Remittance Advice / Explanation of Benefits)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_era_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  integration_id UUID REFERENCES oe_billing_integrations(id) ON DELETE SET NULL,
  claim_id UUID REFERENCES oe_billing_claims(id) ON DELETE SET NULL,
  payer_name TEXT NOT NULL,
  payer_id TEXT,
  check_number TEXT,
  check_date DATE,
  total_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_adjustments DECIMAL(10,2) NOT NULL DEFAULT 0,
  patient_name TEXT,
  procedure_codes JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'matched', 'posted', 'exception', 'void')),
  auto_posted BOOLEAN DEFAULT false,
  posted_at TIMESTAMPTZ,
  posted_by TEXT,
  raw_data JSONB DEFAULT '{}',
  notes TEXT
);

CREATE INDEX idx_era_records_claim ON oe_era_records(claim_id);
CREATE INDEX idx_era_records_integration ON oe_era_records(integration_id);
CREATE INDEX idx_era_records_status ON oe_era_records(status);

-- ============================================================================
-- ACCOUNTING INTEGRATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_accounting_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('quickbooks_online', 'xero', 'freshbooks', 'manual', 'api_generic')),
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_configured' CHECK (status IN ('not_configured', 'configuring', 'connected', 'syncing', 'error', 'disconnected')),
  -- OAuth tokens (encrypted at app layer)
  connection_config JSONB DEFAULT '{}',
  -- Sync settings
  sync_frequency TEXT NOT NULL DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'daily', 'weekly', 'manual')),
  last_sync_at TIMESTAMPTZ,
  last_sync_status TEXT CHECK (last_sync_status IN ('success', 'partial', 'failed')),
  -- Chart of Accounts mapping
  chart_of_accounts_map JSONB DEFAULT '{}',
  -- What to sync
  sync_revenue BOOLEAN DEFAULT true,
  sync_expenses BOOLEAN DEFAULT true,
  sync_payroll BOOLEAN DEFAULT false,
  sync_insurance_payments BOOLEAN DEFAULT true,
  sync_patient_payments BOOLEAN DEFAULT true,
  -- Stats
  total_entries_synced INTEGER DEFAULT 0,
  last_entry_date DATE,
  notes TEXT
);

CREATE INDEX idx_accounting_int_practice ON oe_accounting_integrations(practice_id);
CREATE INDEX idx_accounting_int_type ON oe_accounting_integrations(integration_type);
CREATE INDEX idx_accounting_int_status ON oe_accounting_integrations(status);

-- ============================================================================
-- ACCOUNTING JOURNAL ENTRIES (Pending sync to accounting system)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_accounting_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  integration_id UUID REFERENCES oe_accounting_integrations(id) ON DELETE SET NULL,
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('revenue', 'expense', 'payment', 'adjustment', 'refund', 'payroll', 'insurance_payment')),
  description TEXT NOT NULL,
  debit_account TEXT,
  credit_account TEXT,
  amount DECIMAL(10,2) NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed', 'manual')),
  synced_at TIMESTAMPTZ,
  external_id TEXT,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_accounting_entries_practice ON oe_accounting_entries(practice_id);
CREATE INDEX idx_accounting_entries_integration ON oe_accounting_entries(integration_id);
CREATE INDEX idx_accounting_entries_sync ON oe_accounting_entries(sync_status);
CREATE INDEX idx_accounting_entries_date ON oe_accounting_entries(entry_date DESC);

-- ============================================================================
-- CRM CONTACTS (Unified contact record)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  -- Identity
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  phone_secondary TEXT,
  date_of_birth DATE,
  -- Address
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  -- Lifecycle
  lifecycle_stage TEXT NOT NULL DEFAULT 'subscriber' CHECK (lifecycle_stage IN (
    'subscriber', 'lead', 'qualified_lead', 'opportunity',
    'patient', 'active_patient', 'inactive_patient', 'lost'
  )),
  lifecycle_changed_at TIMESTAMPTZ DEFAULT now(),
  -- Source tracking
  source TEXT CHECK (source IN ('website', 'phone', 'referral', 'social', 'google', 'walk_in', 'import', 'pms_sync', 'other')),
  source_detail TEXT,
  referral_source_id UUID REFERENCES oe_crm_contacts(id),
  -- Linked records
  patient_id UUID REFERENCES oe_patients(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES oe_leads(id) ON DELETE SET NULL,
  -- Engagement
  total_communications INTEGER DEFAULT 0,
  last_communication_at TIMESTAMPTZ,
  last_communication_channel TEXT,
  total_appointments INTEGER DEFAULT 0,
  last_appointment_at TIMESTAMPTZ,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  -- Scoring
  engagement_score INTEGER DEFAULT 0,
  risk_score INTEGER DEFAULT 0,
  -- Tags & segments
  tags TEXT[] DEFAULT '{}',
  segments TEXT[] DEFAULT '{}',
  -- Preferences
  preferred_channel TEXT CHECK (preferred_channel IN ('sms', 'email', 'phone', 'portal')),
  preferred_time TEXT,
  do_not_contact BOOLEAN DEFAULT false,
  -- Metadata
  custom_fields JSONB DEFAULT '{}',
  notes TEXT
);

CREATE INDEX idx_crm_contacts_practice ON oe_crm_contacts(practice_id);
CREATE INDEX idx_crm_contacts_lifecycle ON oe_crm_contacts(lifecycle_stage);
CREATE INDEX idx_crm_contacts_email ON oe_crm_contacts(email);
CREATE INDEX idx_crm_contacts_phone ON oe_crm_contacts(phone);
CREATE INDEX idx_crm_contacts_patient ON oe_crm_contacts(patient_id);
CREATE INDEX idx_crm_contacts_lead ON oe_crm_contacts(lead_id);
CREATE INDEX idx_crm_contacts_source ON oe_crm_contacts(source);
CREATE INDEX idx_crm_contacts_score ON oe_crm_contacts(engagement_score DESC);
CREATE INDEX idx_crm_contacts_tags ON oe_crm_contacts USING gin(tags);

-- ============================================================================
-- CRM COMMUNICATION LOG (Unified timeline)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_crm_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  contact_id UUID NOT NULL REFERENCES oe_crm_contacts(id) ON DELETE CASCADE,
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email', 'phone', 'portal', 'in_person', 'mail')),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  subject TEXT,
  content TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'queued', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'failed', 'bounced')),
  -- Linked to existing systems
  outreach_message_id UUID REFERENCES oe_outreach_messages(id) ON DELETE SET NULL,
  call_id UUID REFERENCES oe_calls(id) ON DELETE SET NULL,
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_crm_comms_contact ON oe_crm_communications(contact_id);
CREATE INDEX idx_crm_comms_practice ON oe_crm_communications(practice_id);
CREATE INDEX idx_crm_comms_created ON oe_crm_communications(created_at DESC);
CREATE INDEX idx_crm_comms_channel ON oe_crm_communications(channel);

-- ============================================================================
-- CRM REFERRALS
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_crm_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  referrer_contact_id UUID REFERENCES oe_crm_contacts(id) ON DELETE SET NULL,
  referred_contact_id UUID REFERENCES oe_crm_contacts(id) ON DELETE SET NULL,
  referrer_name TEXT,
  referred_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'lost')),
  converted_at TIMESTAMPTZ,
  reward_type TEXT,
  reward_amount DECIMAL(10,2),
  reward_sent BOOLEAN DEFAULT false,
  notes TEXT
);

CREATE INDEX idx_referrals_practice ON oe_crm_referrals(practice_id);
CREATE INDEX idx_referrals_referrer ON oe_crm_referrals(referrer_contact_id);
CREATE INDEX idx_referrals_status ON oe_crm_referrals(status);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE oe_setup_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_pms_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_pms_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_billing_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_era_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_accounting_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_accounting_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_crm_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_crm_referrals ENABLE ROW LEVEL SECURITY;

-- Service role policies (backend access)
CREATE POLICY "Service role full access" ON oe_setup_checklist FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_pms_integrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_pms_sync_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_licenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_billing_integrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_era_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_accounting_integrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_accounting_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_crm_contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_crm_communications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_crm_referrals FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
CREATE TRIGGER update_oe_setup_checklist_updated_at BEFORE UPDATE ON oe_setup_checklist FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_pms_integrations_updated_at BEFORE UPDATE ON oe_pms_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_licenses_updated_at BEFORE UPDATE ON oe_licenses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_billing_integrations_updated_at BEFORE UPDATE ON oe_billing_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_accounting_integrations_updated_at BEFORE UPDATE ON oe_accounting_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_crm_contacts_updated_at BEFORE UPDATE ON oe_crm_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- LICENSE EXPIRY STATUS UPDATE FUNCTION
-- Called by cron or on-demand to recalculate license statuses
-- ============================================================================
CREATE OR REPLACE FUNCTION update_license_statuses()
RETURNS void AS $$
BEGIN
  UPDATE oe_licenses SET
    days_until_expiry = CASE
      WHEN expiration_date IS NULL THEN 9999
      ELSE (expiration_date - CURRENT_DATE)
    END,
    status = CASE
      WHEN expiration_date IS NULL THEN 'not_applicable'
      WHEN expiration_date < CURRENT_DATE THEN 'expired'
      WHEN expiration_date <= CURRENT_DATE + INTERVAL '90 days' THEN 'expiring_soon'
      ELSE 'current'
    END,
    updated_at = now()
  WHERE expiration_date IS NOT NULL
    AND status NOT IN ('revoked', 'pending_renewal');
END;
$$ LANGUAGE plpgsql;

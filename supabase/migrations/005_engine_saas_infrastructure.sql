-- ENGINE SAAS INFRASTRUCTURE
-- Tables from dental-connect needed for multi-practice SaaS engine operation
-- Adds: practices, audit_log, consent_log, message_templates, practice_usage

-- ============================================================================
-- PRACTICES (Multi-tenant anchor table with billing)
-- ============================================================================
CREATE TABLE IF NOT EXISTS practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_clerk_id TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  timezone TEXT NOT NULL DEFAULT 'America/Los_Angeles',
  -- Stripe billing
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan_tier TEXT NOT NULL DEFAULT 'starter' CHECK (plan_tier IN ('starter', 'professional', 'enterprise')),
  plan_status TEXT NOT NULL DEFAULT 'trialing' CHECK (plan_status IN ('trialing', 'active', 'past_due', 'canceled', 'paused')),
  trial_ends_at TIMESTAMPTZ,
  -- Twilio
  twilio_phone_number TEXT,
  twilio_messaging_service_sid TEXT,
  -- Feature flags
  features JSONB NOT NULL DEFAULT '{}',
  settings JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_practices_slug ON practices(slug);
CREATE INDEX idx_practices_owner ON practices(owner_clerk_id);
CREATE INDEX idx_practices_stripe_customer ON practices(stripe_customer_id);
CREATE INDEX idx_practices_plan ON practices(plan_tier, plan_status);

-- ============================================================================
-- AUDIT LOG (HIPAA compliance)
-- Used by src/lib/audit.ts logAudit()
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  user_id TEXT,
  user_name TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT
);

CREATE INDEX idx_audit_log_practice ON audit_log(practice_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);

-- ============================================================================
-- CONSENT LOG (TCPA compliance for SMS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS consent_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  patient_id UUID REFERENCES oe_patients(id),
  consent_type TEXT NOT NULL CHECK (consent_type IN ('sms_marketing', 'sms_transactional', 'email_marketing', 'voice')),
  status TEXT NOT NULL CHECK (status IN ('opted_in', 'opted_out')),
  method TEXT NOT NULL CHECK (method IN ('web_form', 'sms_keyword', 'verbal', 'written', 'import', 'system')),
  source_message TEXT,
  ip_address TEXT,
  metadata JSONB
);

CREATE INDEX idx_consent_practice ON consent_log(practice_id);
CREATE INDEX idx_consent_phone ON consent_log(phone);
CREATE INDEX idx_consent_status ON consent_log(status);
CREATE INDEX idx_consent_type ON consent_log(consent_type, status);

-- ============================================================================
-- MESSAGE TEMPLATES (Reusable SMS/email templates)
-- ============================================================================
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('appointment_reminder', 'appointment_confirmation', 'recall', 'welcome', 'review_request', 'reactivation', 'custom')),
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email', 'both')),
  subject TEXT,
  body TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_templates_practice ON message_templates(practice_id);
CREATE INDEX idx_templates_category ON message_templates(category);

-- ============================================================================
-- PRACTICE USAGE (Monthly tracking for billing/limits)
-- ============================================================================
CREATE TABLE IF NOT EXISTS practice_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  messages_sent INTEGER NOT NULL DEFAULT 0,
  messages_received INTEGER NOT NULL DEFAULT 0,
  ai_actions_used INTEGER NOT NULL DEFAULT 0,
  staff_count INTEGER NOT NULL DEFAULT 0,
  patients_imported INTEGER NOT NULL DEFAULT 0,
  UNIQUE(practice_id, month)
);

CREATE INDEX idx_usage_practice_month ON practice_usage(practice_id, month DESC);

-- ============================================================================
-- STAFF USERS (Multi-tenant staff management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  clerk_user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'admin', 'staff', 'billing')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  UNIQUE(practice_id, clerk_user_id)
);

CREATE INDEX idx_staff_practice ON staff_users(practice_id);
CREATE INDEX idx_staff_clerk ON staff_users(clerk_user_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;

-- Service role policies (backend access)
CREATE POLICY "Service role full access" ON practices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON audit_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON consent_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON message_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON practice_usage FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON staff_users FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
CREATE TRIGGER update_practices_updated_at BEFORE UPDATE ON practices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON message_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff_users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- DEFAULT MESSAGE TEMPLATES (seeded per practice)
-- These are inserted when a new practice is created via the onboarding flow.
-- See: src/lib/constants.ts for PLAN_TIERS
-- See: src/lib/audit.ts for audit logging
-- See: src/lib/encryption.ts for message body encryption
-- See: src/lib/phone.ts for phone normalization
-- ============================================================================

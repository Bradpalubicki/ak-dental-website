-- Migration 033: Offer letters + employee onboarding flow

-- ============================================================================
-- OFFER LETTERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_offer_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Candidate info
  candidate_first_name TEXT NOT NULL,
  candidate_last_name  TEXT NOT NULL,
  candidate_email      TEXT NOT NULL,
  candidate_phone      TEXT,

  -- Role details
  job_title       TEXT NOT NULL,
  department      TEXT NOT NULL DEFAULT 'Clinical',
  employment_type TEXT NOT NULL DEFAULT 'FULL_TIME',
  start_date      DATE,
  salary_amount   INTEGER,       -- annual USD
  salary_unit     TEXT NOT NULL DEFAULT 'YEAR',
  hourly_rate     NUMERIC(8,2),  -- if HOUR

  -- Letter content
  letter_body     TEXT NOT NULL, -- markdown/plain text body
  custom_message  TEXT,          -- personal note from hiring manager

  -- Signing
  sign_token      TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  signed_at       TIMESTAMPTZ,
  signature_name  TEXT,          -- typed full name as signature
  signed_ip       TEXT,

  -- Lifecycle
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'declined', 'expired', 'withdrawn')),
  sent_at     TIMESTAMPTZ,
  expires_at  TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days'),

  -- Link to employee record (populated after signing + hire)
  employee_id UUID REFERENCES oe_employees(id) ON DELETE SET NULL,

  -- Created by
  created_by TEXT  -- clerk_user_id
);

CREATE INDEX idx_oe_offer_letters_status     ON oe_offer_letters(status);
CREATE INDEX idx_oe_offer_letters_sign_token ON oe_offer_letters(sign_token);
CREATE INDEX idx_oe_offer_letters_email      ON oe_offer_letters(candidate_email);

ALTER TABLE oe_offer_letters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON oe_offer_letters FOR ALL USING (true);

CREATE TRIGGER update_oe_offer_letters_updated_at
  BEFORE UPDATE ON oe_offer_letters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- NEW HIRE ONBOARDING CHECKLIST (per employee)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_onboarding_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  employee_id UUID NOT NULL REFERENCES oe_employees(id) ON DELETE CASCADE,

  task_key    TEXT NOT NULL,    -- e.g. 'offer_signed', 'i9_complete', 'w4_complete'
  task_label  TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'paperwork'
    CHECK (category IN ('paperwork', 'systems', 'training', 'compliance')),
  status      TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'skipped', 'na')),
  completed_at TIMESTAMPTZ,
  completed_by TEXT,  -- clerk_user_id or 'candidate'
  notes        TEXT,

  UNIQUE (employee_id, task_key)
);

ALTER TABLE oe_onboarding_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON oe_onboarding_tasks FOR ALL USING (true);

CREATE TRIGGER update_oe_onboarding_tasks_updated_at
  BEFORE UPDATE ON oe_onboarding_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

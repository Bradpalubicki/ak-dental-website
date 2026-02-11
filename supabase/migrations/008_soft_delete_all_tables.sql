-- Soft Delete: Add deleted_at/deleted_by to all operations tables
-- Enables 30-day trash retention across the entire platform

-- ============================================================================
-- PATIENTS
-- ============================================================================
ALTER TABLE oe_patients ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE oe_patients ADD COLUMN IF NOT EXISTS deleted_by TEXT DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_oe_patients_deleted ON oe_patients(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- APPOINTMENTS
-- ============================================================================
ALTER TABLE oe_appointments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE oe_appointments ADD COLUMN IF NOT EXISTS deleted_by TEXT DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_oe_appointments_deleted ON oe_appointments(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- TREATMENT PLANS
-- ============================================================================
ALTER TABLE oe_treatment_plans ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE oe_treatment_plans ADD COLUMN IF NOT EXISTS deleted_by TEXT DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_oe_treatment_plans_deleted ON oe_treatment_plans(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- INSURANCE VERIFICATIONS
-- ============================================================================
ALTER TABLE oe_insurance_verifications ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE oe_insurance_verifications ADD COLUMN IF NOT EXISTS deleted_by TEXT DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_oe_insurance_verifications_deleted ON oe_insurance_verifications(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- LICENSES
-- ============================================================================
ALTER TABLE oe_licenses ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE oe_licenses ADD COLUMN IF NOT EXISTS deleted_by TEXT DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_oe_licenses_deleted ON oe_licenses(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- BILLING CLAIMS
-- ============================================================================
ALTER TABLE oe_billing_claims ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE oe_billing_claims ADD COLUMN IF NOT EXISTS deleted_by TEXT DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_oe_billing_claims_deleted ON oe_billing_claims(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- OUTREACH WORKFLOWS
-- ============================================================================
ALTER TABLE oe_outreach_workflows ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE oe_outreach_workflows ADD COLUMN IF NOT EXISTS deleted_by TEXT DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_oe_outreach_workflows_deleted ON oe_outreach_workflows(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- CALLS
-- ============================================================================
ALTER TABLE oe_calls ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE oe_calls ADD COLUMN IF NOT EXISTS deleted_by TEXT DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_oe_calls_deleted ON oe_calls(deleted_at) WHERE deleted_at IS NULL;

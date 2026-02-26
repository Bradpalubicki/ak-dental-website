-- ============================================================================
-- Migration 026: Assessments, Consent Forms, Recall Rules
-- Merged from dental-engine migration 011.
-- ============================================================================

-- ============================================================================
-- ASSESSMENT DEFINITIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_assessment_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  scoring_method TEXT NOT NULL DEFAULT 'sum' CHECK (scoring_method IN ('sum', 'average', 'custom')),
  severity_ranges JSONB NOT NULL DEFAULT '[]'::jsonb,
  frequency TEXT DEFAULT 'every session',
  vertical_types TEXT[] DEFAULT ARRAY['dental'],
  active BOOLEAN DEFAULT true
);

-- ============================================================================
-- ASSESSMENT RESULTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  patient_id UUID NOT NULL REFERENCES oe_patients(id),
  provider_id UUID REFERENCES oe_providers(id),
  definition_id UUID NOT NULL REFERENCES oe_assessment_definitions(id),
  appointment_id UUID REFERENCES oe_appointments(id),
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_score NUMERIC(10,2),
  severity TEXT,
  notes TEXT,
  administered_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oe_assessment_results_patient ON oe_assessment_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_oe_assessment_results_definition ON oe_assessment_results(definition_id);
CREATE INDEX IF NOT EXISTS idx_oe_assessment_results_date ON oe_assessment_results(administered_at DESC);

-- ============================================================================
-- CONSENT FORMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_consent_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  effective_date DATE DEFAULT CURRENT_DATE,
  required_for TEXT DEFAULT 'all',
  required_service_codes TEXT[],
  active BOOLEAN DEFAULT true
);

-- ============================================================================
-- CONSENT SIGNATURES
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_consent_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  consent_form_id UUID NOT NULL REFERENCES oe_consent_forms(id),
  patient_id UUID NOT NULL REFERENCES oe_patients(id),
  form_version INTEGER NOT NULL,
  signature_data TEXT,
  signature_type TEXT NOT NULL DEFAULT 'typed' CHECK (signature_type IN ('typed', 'drawn', 'electronic')),
  ip_address TEXT,
  user_agent TEXT,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oe_consent_signatures_patient ON oe_consent_signatures(patient_id);
CREATE INDEX IF NOT EXISTS idx_oe_consent_signatures_form ON oe_consent_signatures(consent_form_id);

-- ============================================================================
-- RECALL RULES
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_recall_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_codes TEXT[],
  interval_days INTEGER NOT NULL,
  reminder_schedule JSONB DEFAULT '[]'::jsonb,
  message_template TEXT,
  active BOOLEAN DEFAULT true,
  applies_to TEXT DEFAULT 'all'
);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE oe_assessment_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_consent_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_consent_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_recall_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON oe_assessment_definitions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_assessment_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_consent_forms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_consent_signatures FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_recall_rules FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
CREATE TRIGGER set_updated_at BEFORE UPDATE ON oe_consent_forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- RBAC: Add new modules
-- ============================================================================
DO $$
DECLARE
  r RECORD;
  new_modules TEXT[] := ARRAY['assessments', 'consent_forms', 'recall'];
  m TEXT;
BEGIN
  FOR r IN SELECT id FROM oe_roles LOOP
    FOREACH m IN ARRAY new_modules LOOP
      INSERT INTO oe_role_permissions (role_id, module, can_view, can_edit, can_delete, can_admin)
      VALUES (r.id, m, false, false, false, false)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

DO $$
DECLARE
  admin_role RECORD;
  admin_modules TEXT[] := ARRAY['assessments', 'consent_forms', 'recall'];
  m TEXT;
BEGIN
  FOR admin_role IN SELECT id FROM oe_roles WHERE name IN ('global_admin', 'admin') LOOP
    FOREACH m IN ARRAY admin_modules LOOP
      UPDATE oe_role_permissions
      SET can_view = true, can_edit = true, can_delete = true, can_admin = true
      WHERE role_id = admin_role.id AND module = m;
    END LOOP;
  END LOOP;
END $$;

-- Dental clinical roles get view/edit on assessments and consent forms
DO $$
DECLARE
  clinical_role RECORD;
BEGIN
  FOR clinical_role IN SELECT id FROM oe_roles WHERE name IN ('dentist', 'hygienist', 'dental_assistant') LOOP
    UPDATE oe_role_permissions
    SET can_view = true, can_edit = true
    WHERE role_id = clinical_role.id AND module IN ('assessments', 'consent_forms');
  END LOOP;
END $$;

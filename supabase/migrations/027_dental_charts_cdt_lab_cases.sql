-- Migration 027: Dental Charts, CDT Codes, Lab Cases
-- Merged from dental-engine migration 012

-- ============================================================================
-- Migration 012: Dental-Specific Tables
-- Adds dental charts, CDT code library, lab case tracking, dental roles,
-- and RBAC permissions for dental-specific modules.
-- ============================================================================

-- ============================================================================
-- DENTAL ROLES (add dental-specific roles that don't exist yet)
-- ============================================================================
INSERT INTO oe_roles (name, display_name, description, is_system) VALUES
  ('dentist', 'Dentist', 'Full clinical access - patients, charting, notes, treatment plans', false),
  ('hygienist', 'Hygienist', 'Clinical access for hygiene services, charting, notes', false),
  ('dental_assistant', 'Dental Assistant', 'Chairside support, charting, patient prep', false),
  ('biller', 'Biller', 'Insurance claims, billing, collections', false)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- DENTAL CHARTS (tooth-level clinical findings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_dental_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  patient_id UUID NOT NULL REFERENCES oe_patients(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES oe_providers(id),
  chart_date DATE NOT NULL DEFAULT CURRENT_DATE,
  tooth_number INTEGER CHECK (tooth_number BETWEEN 1 AND 32),
  surface VARCHAR(10),                -- e.g. 'MOD', 'B', 'L', 'DL', 'MODBL'
  condition VARCHAR(100),             -- e.g. 'caries', 'fracture', 'missing', 'impacted'
  treatment VARCHAR(100),             -- CDT code reference e.g. 'D2391'
  notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'planned', 'completed')),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_oe_dental_charts_patient ON oe_dental_charts(patient_id);
CREATE INDEX idx_oe_dental_charts_provider ON oe_dental_charts(provider_id);
CREATE INDEX idx_oe_dental_charts_date ON oe_dental_charts(chart_date DESC);
CREATE INDEX idx_oe_dental_charts_tooth ON oe_dental_charts(tooth_number);
CREATE INDEX idx_oe_dental_charts_status ON oe_dental_charts(status);

-- ============================================================================
-- CDT CODES (Current Dental Terminology code library)
-- practice_id is NULL for system defaults; not a FK since this schema is
-- single-practice. The column exists for future multi-tenant portability.
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_cdt_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  code VARCHAR(10) NOT NULL,                  -- e.g. 'D0120'
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'diagnostic', 'preventive', 'restorative', 'endodontics',
    'periodontics', 'prosthodontics', 'oral_surgery', 'orthodontics',
    'adjunctive', 'emergency'
  )),
  description TEXT NOT NULL,
  fee_schedule NUMERIC(10,2),                 -- practice custom fee
  insurance_typical NUMERIC(10,2),            -- typical insurance reimbursement
  duration_minutes INTEGER DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE UNIQUE INDEX idx_oe_cdt_codes_code ON oe_cdt_codes(code);
CREATE INDEX idx_oe_cdt_codes_category ON oe_cdt_codes(category);
CREATE INDEX idx_oe_cdt_codes_active ON oe_cdt_codes(is_active);

-- ============================================================================
-- LAB CASES (external lab work tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_lab_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  patient_id UUID NOT NULL REFERENCES oe_patients(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES oe_providers(id),
  lab_name VARCHAR(200),
  case_type VARCHAR(100) NOT NULL CHECK (case_type IN (
    'crown', 'bridge', 'denture', 'implant', 'orthodontic', 'nightguard', 'other'
  )),
  material VARCHAR(100),              -- e.g. 'zirconia', 'e.max', 'PFM', 'acrylic'
  shade VARCHAR(50),                  -- e.g. 'A2', 'B1', 'VITA A3.5'
  tooth_numbers INTEGER[],            -- array of tooth numbers involved
  sent_date DATE,
  expected_return DATE,
  actual_return DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'sent', 'in_progress', 'received', 'fitted', 'completed'
  )),
  tracking_number VARCHAR(100),
  lab_fee NUMERIC(10,2),
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_oe_lab_cases_patient ON oe_lab_cases(patient_id);
CREATE INDEX idx_oe_lab_cases_provider ON oe_lab_cases(provider_id);
CREATE INDEX idx_oe_lab_cases_status ON oe_lab_cases(status);
CREATE INDEX idx_oe_lab_cases_sent ON oe_lab_cases(sent_date DESC);
CREATE INDEX idx_oe_lab_cases_expected ON oe_lab_cases(expected_return);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE oe_dental_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_cdt_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_lab_cases ENABLE ROW LEVEL SECURITY;

-- Service role bypass (matches 011 convention)
CREATE POLICY "Service role full access" ON oe_dental_charts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_cdt_codes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_lab_cases FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
CREATE TRIGGER set_updated_at BEFORE UPDATE ON oe_dental_charts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON oe_cdt_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON oe_lab_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- RBAC: Add dental-specific modules to oe_role_permissions
-- ============================================================================

-- 1. Insert new module rows for ALL existing roles (default: no access)
DO $$
DECLARE
  r RECORD;
  dental_modules TEXT[] := ARRAY['dental_charts', 'cdt_codes', 'lab_cases'];
  m TEXT;
BEGIN
  FOR r IN SELECT id FROM oe_roles LOOP
    FOREACH m IN ARRAY dental_modules LOOP
      INSERT INTO oe_role_permissions (role_id, module, can_view, can_edit, can_delete, can_admin)
      VALUES (r.id, m, false, false, false, false)
      ON CONFLICT (role_id, module) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- 2. Global admin + admin: full access to dental modules
DO $$
DECLARE
  admin_role RECORD;
  dental_modules TEXT[] := ARRAY['dental_charts', 'cdt_codes', 'lab_cases'];
  m TEXT;
BEGIN
  FOR admin_role IN SELECT id FROM oe_roles WHERE name IN ('global_admin', 'admin') LOOP
    FOREACH m IN ARRAY dental_modules LOOP
      UPDATE oe_role_permissions
      SET can_view = true, can_edit = true, can_delete = true, can_admin = true
      WHERE role_id = admin_role.id AND module = m;
    END LOOP;
  END LOOP;
END $$;

-- 3. Dentist: full clinical access (view, edit, delete on charts/lab; view/edit on CDT codes)
DO $$
DECLARE
  dentist_role RECORD;
BEGIN
  FOR dentist_role IN SELECT id FROM oe_roles WHERE name = 'dentist' LOOP
    UPDATE oe_role_permissions
    SET can_view = true, can_edit = true, can_delete = true
    WHERE role_id = dentist_role.id AND module IN ('dental_charts', 'lab_cases');

    UPDATE oe_role_permissions
    SET can_view = true, can_edit = true
    WHERE role_id = dentist_role.id AND module = 'cdt_codes';
  END LOOP;
END $$;

-- 4. Hygienist: view/edit charts, view CDT codes & lab cases (no delete)
DO $$
DECLARE
  hyg_role RECORD;
BEGIN
  FOR hyg_role IN SELECT id FROM oe_roles WHERE name = 'hygienist' LOOP
    UPDATE oe_role_permissions
    SET can_view = true, can_edit = true
    WHERE role_id = hyg_role.id AND module = 'dental_charts';

    UPDATE oe_role_permissions
    SET can_view = true
    WHERE role_id = hyg_role.id AND module IN ('cdt_codes', 'lab_cases');
  END LOOP;
END $$;

-- 5. Dental assistant: view/edit charts, view lab cases & CDT codes
DO $$
DECLARE
  da_role RECORD;
BEGIN
  FOR da_role IN SELECT id FROM oe_roles WHERE name = 'dental_assistant' LOOP
    UPDATE oe_role_permissions
    SET can_view = true, can_edit = true
    WHERE role_id = da_role.id AND module = 'dental_charts';

    UPDATE oe_role_permissions
    SET can_view = true
    WHERE role_id = da_role.id AND module IN ('cdt_codes', 'lab_cases');
  END LOOP;
END $$;

-- 6. Manager: view/edit all dental modules
DO $$
DECLARE
  mgr_role RECORD;
  dental_modules TEXT[] := ARRAY['dental_charts', 'cdt_codes', 'lab_cases'];
  m TEXT;
BEGIN
  FOR mgr_role IN SELECT id FROM oe_roles WHERE name = 'manager' LOOP
    FOREACH m IN ARRAY dental_modules LOOP
      UPDATE oe_role_permissions
      SET can_view = true, can_edit = true
      WHERE role_id = mgr_role.id AND module = m;
    END LOOP;
  END LOOP;
END $$;

-- 7. Biller: view CDT codes (for fee schedules), view lab cases (for billing)
DO $$
DECLARE
  biller_role RECORD;
BEGIN
  FOR biller_role IN SELECT id FROM oe_roles WHERE name = 'biller' LOOP
    UPDATE oe_role_permissions
    SET can_view = true
    WHERE role_id = biller_role.id AND module IN ('cdt_codes', 'lab_cases');
  END LOOP;
END $$;

-- 8. Front desk: view lab cases (for scheduling around lab returns)
DO $$
DECLARE
  fd_role RECORD;
BEGIN
  FOR fd_role IN SELECT id FROM oe_roles WHERE name = 'front_desk' LOOP
    UPDATE oe_role_permissions
    SET can_view = true
    WHERE role_id = fd_role.id AND module = 'lab_cases';
  END LOOP;
END $$;

-- Also grant the new dental roles access to existing clinical modules
-- (scheduling, providers, clinical_notes, assessments, consent_forms, waitlist, documents)
DO $$
DECLARE
  clinical_role RECORD;
  clinical_modules TEXT[] := ARRAY['scheduling', 'providers', 'clinical_notes', 'assessments', 'consent_forms', 'documents'];
  m TEXT;
BEGIN
  FOR clinical_role IN SELECT id FROM oe_roles WHERE name IN ('dentist', 'hygienist') LOOP
    FOREACH m IN ARRAY clinical_modules LOOP
      INSERT INTO oe_role_permissions (role_id, module, can_view, can_edit, can_delete, can_admin)
      VALUES (clinical_role.id, m, true, true, false, false)
      ON CONFLICT (role_id, module) DO UPDATE SET can_view = true, can_edit = true;
    END LOOP;
  END LOOP;
END $$;

DO $$
DECLARE
  da_role RECORD;
  da_modules TEXT[] := ARRAY['scheduling', 'clinical_notes', 'documents'];
  m TEXT;
BEGIN
  FOR da_role IN SELECT id FROM oe_roles WHERE name = 'dental_assistant' LOOP
    FOREACH m IN ARRAY da_modules LOOP
      INSERT INTO oe_role_permissions (role_id, module, can_view, can_edit, can_delete, can_admin)
      VALUES (da_role.id, m, true, true, false, false)
      ON CONFLICT (role_id, module) DO UPDATE SET can_view = true, can_edit = true;
    END LOOP;
  END LOOP;
END $$;

-- Give new dental roles view access to remaining standard modules
DO $$
DECLARE
  new_role RECORD;
  view_modules TEXT[] := ARRAY['dashboard', 'clients', 'inbox', 'waitlist', 'resources'];
  m TEXT;
BEGIN
  FOR new_role IN SELECT id FROM oe_roles WHERE name IN ('dentist', 'hygienist', 'dental_assistant') LOOP
    FOREACH m IN ARRAY view_modules LOOP
      INSERT INTO oe_role_permissions (role_id, module, can_view, can_edit, can_delete, can_admin)
      VALUES (new_role.id, m, true, false, false, false)
      ON CONFLICT (role_id, module) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- Biller gets access to billing/financials/insurance modules
DO $$
DECLARE
  biller_role RECORD;
  biller_modules TEXT[] := ARRAY['dashboard', 'billing', 'financials', 'insurance', 'inbox'];
  m TEXT;
BEGIN
  FOR biller_role IN SELECT id FROM oe_roles WHERE name = 'biller' LOOP
    FOREACH m IN ARRAY biller_modules LOOP
      INSERT INTO oe_role_permissions (role_id, module, can_view, can_edit, can_delete, can_admin)
      VALUES (biller_role.id, m, true, true, false, false)
      ON CONFLICT (role_id, module) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- ============================================================================
-- SEED COMMON CDT CODES (~30 most frequently used)
-- ============================================================================
INSERT INTO oe_cdt_codes (code, category, description, fee_schedule, insurance_typical, duration_minutes, is_active) VALUES
  -- Diagnostic
  ('D0120', 'diagnostic',    'Periodic oral evaluation - established patient',     50.00,   40.00,  15, true),
  ('D0140', 'diagnostic',    'Limited oral evaluation - problem focused',          65.00,   50.00,  20, true),
  ('D0150', 'diagnostic',    'Comprehensive oral evaluation - new or established', 85.00,   65.00,  30, true),
  ('D0210', 'diagnostic',    'Intraoral - complete series of radiographic images', 120.00,  95.00,  20, true),
  ('D0220', 'diagnostic',    'Intraoral - periapical first radiographic image',    25.00,   20.00,  10, true),
  ('D0274', 'diagnostic',    'Bitewings - four radiographic images',               55.00,   45.00,  15, true),

  -- Preventive
  ('D1110', 'preventive',    'Prophylaxis - adult',                                95.00,   75.00,  60, true),
  ('D1120', 'preventive',    'Prophylaxis - child',                                65.00,   50.00,  45, true),
  ('D1206', 'preventive',    'Topical application of fluoride varnish',            30.00,   25.00,  10, true),

  -- Restorative - Amalgam
  ('D2140', 'restorative',   'Amalgam - one surface, primary or permanent',        150.00,  110.00, 30, true),
  ('D2150', 'restorative',   'Amalgam - two surfaces, primary or permanent',       185.00,  140.00, 45, true),
  ('D2160', 'restorative',   'Amalgam - three surfaces, primary or permanent',     220.00,  170.00, 45, true),

  -- Restorative - Composite (anterior)
  ('D2330', 'restorative',   'Resin-based composite - one surface, anterior',      170.00,  130.00, 30, true),
  ('D2331', 'restorative',   'Resin-based composite - two surfaces, anterior',     215.00,  165.00, 45, true),

  -- Restorative - Composite (posterior)
  ('D2391', 'restorative',   'Resin-based composite - one surface, posterior',     185.00,  140.00, 30, true),
  ('D2392', 'restorative',   'Resin-based composite - two surfaces, posterior',    230.00,  175.00, 45, true),

  -- Restorative - Crowns
  ('D2740', 'restorative',   'Crown - porcelain/ceramic substrate',                1100.00, 800.00, 90, true),
  ('D2750', 'restorative',   'Crown - porcelain fused to high noble metal',        1000.00, 750.00, 90, true),
  ('D2950', 'restorative',   'Core buildup, including any pins when required',     250.00,  180.00, 30, true),

  -- Endodontics
  ('D3310', 'endodontics',   'Endodontic therapy, anterior tooth',                 750.00,  550.00, 60, true),
  ('D3320', 'endodontics',   'Endodontic therapy, premolar tooth',                 850.00,  650.00, 75, true),
  ('D3330', 'endodontics',   'Endodontic therapy, molar tooth',                    1050.00, 800.00, 90, true),

  -- Periodontics
  ('D4341', 'periodontics',  'Periodontal scaling and root planing - per quadrant', 225.00, 175.00, 45, true),
  ('D4910', 'periodontics',  'Periodontal maintenance',                             135.00, 105.00, 60, true),

  -- Prosthodontics
  ('D5110', 'prosthodontics','Complete denture - maxillary',                        1500.00, 1100.00, 60, true),
  ('D5120', 'prosthodontics','Complete denture - mandibular',                       1500.00, 1100.00, 60, true),
  ('D6010', 'prosthodontics','Surgical placement of implant body - endosteal',      2000.00, 1500.00, 90, true),

  -- Oral Surgery
  ('D7140', 'oral_surgery',  'Extraction, erupted tooth or exposed root',           175.00,  130.00, 30, true),
  ('D7210', 'oral_surgery',  'Extraction, erupted tooth - surgical, soft tissue',   300.00,  225.00, 45, true),
  ('D7240', 'oral_surgery',  'Extraction, impacted tooth - completely bony',        350.00,  260.00, 60, true),

  -- Emergency / Adjunctive
  ('D9110', 'emergency',     'Palliative (emergency) treatment of dental pain',     85.00,   65.00,  30, true)

ON CONFLICT DO NOTHING;

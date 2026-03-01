-- Migration 032: Gusto OAuth connection + Google for Jobs (DB-driven job postings)

-- ============================================================================
-- GUSTO CONNECTION (OAuth token storage per practice)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_gusto_connection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  practice_id TEXT NOT NULL DEFAULT 'ak-dental', -- engine key
  access_token TEXT,                              -- encrypted at rest via Supabase vault in prod
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  gusto_company_id TEXT,                          -- Gusto's company UUID
  gusto_company_name TEXT,
  scope TEXT,
  status TEXT NOT NULL DEFAULT 'disconnected'     -- disconnected | connected | error
    CHECK (status IN ('disconnected', 'connected', 'error')),
  error_message TEXT,
  last_synced_at TIMESTAMPTZ,
  connected_by TEXT,                              -- clerk_user_id of whoever connected
  UNIQUE (practice_id)
);

ALTER TABLE oe_gusto_connection ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON oe_gusto_connection FOR ALL USING (true);

CREATE TRIGGER update_oe_gusto_connection_updated_at
  BEFORE UPDATE ON oe_gusto_connection
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed a disconnected row so we always have one to UPDATE
INSERT INTO oe_gusto_connection (practice_id, status)
VALUES ('ak-dental', 'disconnected')
ON CONFLICT (practice_id) DO NOTHING;

-- ============================================================================
-- GUSTO PAYROLL EXPORT LOG
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_gusto_export_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  exported_by TEXT NOT NULL,   -- clerk_user_id
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  employee_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'error')),
  error_message TEXT,
  payload JSONB                -- snapshot of what was sent
);

ALTER TABLE oe_gusto_export_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON oe_gusto_export_log FOR ALL USING (true);

-- ============================================================================
-- JOB POSTINGS (DB-driven, feeds careers page + Google for Jobs JSON-LD)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Core fields
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,          -- URL-friendly: "dental-hygienist-fulltime"
  employment_type TEXT NOT NULL DEFAULT 'FULL_TIME'
    CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'TEMPORARY', 'INTERN')),
  department TEXT NOT NULL DEFAULT 'Clinical'
    CHECK (department IN ('Clinical', 'Administrative', 'Management')),

  -- Description fields
  description TEXT NOT NULL,          -- full job description (markdown)
  responsibilities TEXT,             -- bullet list (markdown)
  requirements TEXT,                  -- must-have (markdown)
  nice_to_have TEXT,                  -- nice-to-have (markdown)
  tags TEXT[] DEFAULT '{}',           -- e.g. ["RDH Required", "Full Benefits"]

  -- Compensation (for Google for Jobs schema)
  salary_min INTEGER,                 -- annual, USD
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  salary_unit TEXT DEFAULT 'YEAR'
    CHECK (salary_unit IN ('HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR')),

  -- Location (Google for Jobs)
  street_address TEXT DEFAULT '7480 W Sahara Ave',
  city TEXT DEFAULT 'Las Vegas',
  state TEXT DEFAULT 'NV',
  zip TEXT DEFAULT '89117',
  country TEXT DEFAULT 'US',
  remote_possible BOOLEAN DEFAULT false,

  -- Lifecycle
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'paused', 'filled', 'archived')),
  posted_at TIMESTAMPTZ,              -- when status set to active
  expires_at TIMESTAMPTZ,            -- optional expiry for Google schema validThrough
  filled_at TIMESTAMPTZ,

  -- Application
  apply_email TEXT DEFAULT 'careers@akultimatedental.com',
  apply_url TEXT,                     -- external URL if applicable

  -- Tracking
  views INTEGER NOT NULL DEFAULT 0,
  applications INTEGER NOT NULL DEFAULT 0,
  created_by TEXT                     -- clerk_user_id
);

CREATE INDEX idx_oe_job_postings_status ON oe_job_postings(status);
CREATE INDEX idx_oe_job_postings_slug ON oe_job_postings(slug);

ALTER TABLE oe_job_postings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON oe_job_postings FOR ALL USING (true);

CREATE TRIGGER update_oe_job_postings_updated_at
  BEFORE UPDATE ON oe_job_postings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed initial job postings from the existing hardcoded careers page
INSERT INTO oe_job_postings (
  title, slug, employment_type, department,
  description, requirements, tags,
  salary_min, salary_max,
  status, posted_at
) VALUES
(
  'Dental Hygienist',
  'dental-hygienist-fulltime',
  'FULL_TIME', 'Clinical',
  'Licensed dental hygienist to provide cleanings, periodontal care, and patient education in a modern, patient-first practice.',
  '- Active Nevada RDH license required
- Experience with digital X-rays and intraoral cameras preferred
- Strong patient communication skills
- CPR/BLS certification current',
  ARRAY['RDH Required', 'Full Benefits', 'Mon-Thu Schedule'],
  70000, 95000,
  'active', now()
),
(
  'Dental Assistant',
  'dental-assistant-fulltime',
  'FULL_TIME', 'Clinical',
  'Chairside dental assistant to support clinical procedures, take impressions, and maintain sterilization standards.',
  '- Nevada DA certification required
- Chairside experience preferred
- X-ray certification required
- CEREC experience is a plus — training available',
  ARRAY['DA Certified', 'Chairside', 'CEREC Training Available'],
  38000, 52000,
  'active', now()
),
(
  'Front Office Coordinator',
  'front-office-coordinator',
  'FULL_TIME', 'Administrative',
  'Be the warm, welcoming first point of contact for patients. Manage scheduling, insurance verification, treatment coordination, and front-office operations.',
  '- Dental front office experience preferred
- Insurance verification knowledge required
- Strong communication and multitasking skills
- Experience with dental practice management software (Dentrix/Open Dental a plus)',
  ARRAY['Front Office', 'Insurance Knowledge', 'Patient-Focused'],
  40000, 55000,
  'active', now()
),
(
  'Treatment Coordinator',
  'treatment-coordinator',
  'FULL_TIME', 'Administrative',
  'Present treatment plans, coordinate financial arrangements, and help patients understand their care options.',
  '- Dental experience required
- Comfortable presenting financial arrangements
- Strong patient communication and follow-through
- Experience with treatment plan software preferred',
  ARRAY['Treatment Plans', 'Patient Communication', 'Financial Coordination'],
  45000, 60000,
  'active', now()
)
ON CONFLICT (slug) DO NOTHING;

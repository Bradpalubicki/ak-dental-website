-- Migration 023: Benefits - Employee Enrollments, Business Insurance Policies, Corporate Filings
-- Required by /dashboard/benefits page

-- Employee benefit enrollments (ICHRA, dental, vision, life, disability)
CREATE TABLE IF NOT EXISTS oe_employee_benefit_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES oe_employees(id) ON DELETE CASCADE,
  benefit_type TEXT NOT NULL CHECK (benefit_type IN (
    'ichra_health', 'dental', 'vision', 'life',
    'short_term_disability', 'long_term_disability', 'other'
  )),
  plan_name TEXT,
  carrier_name TEXT,
  policy_number TEXT,
  monthly_premium NUMERIC(10,2),
  employer_contribution NUMERIC(10,2),
  employee_contribution NUMERIC(10,2),
  coverage_tier TEXT CHECK (coverage_tier IN ('employee', 'employee_spouse', 'employee_children', 'family')),
  enrollment_status TEXT NOT NULL DEFAULT 'not_enrolled' CHECK (enrollment_status IN (
    'not_enrolled', 'pending', 'enrolled', 'waived', 'terminated'
  )),
  effective_date DATE,
  ichra_allowance_monthly NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Business insurance policies (GL, malpractice, workers comp, cyber, property, etc.)
CREATE TABLE IF NOT EXISTS oe_business_insurance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_type TEXT NOT NULL,
  carrier_name TEXT NOT NULL,
  policy_number TEXT,
  coverage_amount NUMERIC(12,2),
  deductible NUMERIC(10,2),
  annual_premium NUMERIC(10,2),
  monthly_premium NUMERIC(10,2),
  effective_date DATE NOT NULL,
  expiration_date DATE NOT NULL,
  renewal_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
    'active', 'expiring_soon', 'expired', 'cancelled', 'pending_renewal'
  )),
  agent_name TEXT,
  agent_phone TEXT,
  agent_email TEXT,
  broker_company TEXT,
  auto_renew BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Corporate filings (state registrations, annual reports, tax registrations)
CREATE TABLE IF NOT EXISTS oe_corporate_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filing_type TEXT NOT NULL,
  title TEXT NOT NULL,
  filing_entity TEXT NOT NULL DEFAULT 'AK Ultimate Dental LLC',
  jurisdiction TEXT,
  filing_number TEXT,
  status TEXT NOT NULL DEFAULT 'current' CHECK (status IN (
    'current', 'expiring_soon', 'expired', 'pending', 'not_applicable'
  )),
  effective_date DATE,
  expiration_date DATE,
  renewal_frequency TEXT,
  cost NUMERIC(10,2),
  responsible_party TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Policy documents (attachments for business insurance policies)
CREATE TABLE IF NOT EXISTS oe_policy_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES oe_business_insurance_policies(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_oe_benefit_enrollments_employee ON oe_employee_benefit_enrollments(employee_id);
CREATE INDEX IF NOT EXISTS idx_oe_benefit_enrollments_status ON oe_employee_benefit_enrollments(enrollment_status);
CREATE INDEX IF NOT EXISTS idx_oe_business_policies_type ON oe_business_insurance_policies(policy_type);
CREATE INDEX IF NOT EXISTS idx_oe_business_policies_expiry ON oe_business_insurance_policies(expiration_date);
CREATE INDEX IF NOT EXISTS idx_oe_corporate_filings_type ON oe_corporate_filings(filing_type);
CREATE INDEX IF NOT EXISTS idx_oe_policy_documents_policy ON oe_policy_documents(policy_id);

-- RLS
ALTER TABLE oe_employee_benefit_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_business_insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_corporate_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_policy_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on oe_employee_benefit_enrollments"
  ON oe_employee_benefit_enrollments FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on oe_business_insurance_policies"
  ON oe_business_insurance_policies FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on oe_corporate_filings"
  ON oe_corporate_filings FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on oe_policy_documents"
  ON oe_policy_documents FOR ALL USING (true) WITH CHECK (true);

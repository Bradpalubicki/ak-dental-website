-- HR MODULE: Employee Records, Write-ups, and Document Signing
-- Tables: oe_employees, oe_hr_documents, oe_document_acknowledgments

-- ============================================================================
-- EMPLOYEES (Staff Directory)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'staff',
  hire_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  notes TEXT
);

CREATE INDEX idx_oe_employees_status ON oe_employees(status);
CREATE INDEX idx_oe_employees_role ON oe_employees(role);

-- ============================================================================
-- HR DOCUMENTS (Write-ups, Incident Reports, Reviews, Advisor Conversations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_hr_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  employee_id UUID NOT NULL REFERENCES oe_employees(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('disciplinary', 'incident_report', 'performance_review', 'coaching_note', 'general', 'advisor_conversation')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('info', 'warning', 'serious', 'critical')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_signature', 'acknowledged', 'disputed')),
  created_by TEXT NOT NULL DEFAULT 'Dr. Alexandru Chireu',
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_oe_hr_docs_employee ON oe_hr_documents(employee_id);
CREATE INDEX idx_oe_hr_docs_type ON oe_hr_documents(type);
CREATE INDEX idx_oe_hr_docs_status ON oe_hr_documents(status);

-- ============================================================================
-- DOCUMENT ACKNOWLEDGMENTS (Initials & Signatures)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_document_acknowledgments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  document_id UUID NOT NULL REFERENCES oe_hr_documents(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES oe_employees(id) ON DELETE CASCADE,
  acknowledgment_type TEXT NOT NULL CHECK (acknowledgment_type IN ('initial', 'signature')),
  step_label TEXT,
  typed_name TEXT,
  ip_address TEXT,
  acknowledged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_oe_ack_document ON oe_document_acknowledgments(document_id);
CREATE INDEX idx_oe_ack_employee ON oe_document_acknowledgments(employee_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE oe_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_hr_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_document_acknowledgments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON oe_employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_hr_documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON oe_document_acknowledgments FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
CREATE TRIGGER update_oe_employees_updated_at BEFORE UPDATE ON oe_employees FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_oe_hr_documents_updated_at BEFORE UPDATE ON oe_hr_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();

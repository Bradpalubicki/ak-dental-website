-- =============================================
-- Migration 010: Document Upload System
-- =============================================
-- Supports file uploads for licenses, insurance, HR, and general documents.
-- Files are stored in Supabase Storage; metadata tracked here.

CREATE TABLE IF NOT EXISTS oe_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- What this document is attached to
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'license', 'insurance_policy', 'insurance_fee_schedule',
    'hr_document', 'employee', 'general'
  )),
  entity_id UUID,

  -- File details
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,

  -- Who uploaded it
  uploaded_by TEXT NOT NULL,
  uploaded_by_name TEXT,
  description TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),

  -- Versioning
  version INTEGER NOT NULL DEFAULT 1,
  previous_version_id UUID REFERENCES oe_documents(id)
);

CREATE INDEX IF NOT EXISTS idx_documents_entity ON oe_documents(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON oe_documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_status ON oe_documents(status) WHERE status = 'active';

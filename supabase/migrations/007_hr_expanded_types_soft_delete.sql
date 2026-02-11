-- HR Module Expansion: Expanded document types + Soft delete
-- Adds: training_record, certificate, credential types
-- Adds: deleted_at column for 30-day soft delete retention

-- ============================================================================
-- EXPAND DOCUMENT TYPES
-- ============================================================================
-- Drop the existing type constraint and replace with expanded one
ALTER TABLE oe_hr_documents DROP CONSTRAINT IF EXISTS oe_hr_documents_type_check;
ALTER TABLE oe_hr_documents ADD CONSTRAINT oe_hr_documents_type_check
  CHECK (type IN (
    'disciplinary',
    'incident_report',
    'performance_review',
    'coaching_note',
    'general',
    'advisor_conversation',
    'training_record',
    'certificate',
    'credential'
  ));

-- ============================================================================
-- SOFT DELETE SUPPORT
-- ============================================================================
-- Add deleted_at column (NULL = not deleted, timestamp = soft deleted)
ALTER TABLE oe_hr_documents ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE oe_hr_documents ADD COLUMN IF NOT EXISTS deleted_by TEXT DEFAULT NULL;

-- Index for efficient filtering of non-deleted records
CREATE INDEX IF NOT EXISTS idx_oe_hr_docs_deleted ON oe_hr_documents(deleted_at)
  WHERE deleted_at IS NULL;

-- ============================================================================
-- EXPAND STATUS OPTIONS
-- ============================================================================
-- Add 'deleted' to status options (for UI display, actual soft delete uses deleted_at)
ALTER TABLE oe_hr_documents DROP CONSTRAINT IF EXISTS oe_hr_documents_status_check;
ALTER TABLE oe_hr_documents ADD CONSTRAINT oe_hr_documents_status_check
  CHECK (status IN ('draft', 'pending_signature', 'acknowledged', 'disputed', 'active', 'expired', 'archived'));

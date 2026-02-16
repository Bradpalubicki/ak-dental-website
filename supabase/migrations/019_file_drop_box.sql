-- =============================================
-- Migration 019: AI File Drop Box
-- =============================================
-- Extends oe_documents with AI processing capabilities,
-- patient association, smart categorization, and data extraction.

-- Add new columns for AI processing and patient linkage
ALTER TABLE oe_documents ADD COLUMN IF NOT EXISTS patient_id UUID REFERENCES oe_patients(id);
ALTER TABLE oe_documents ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'uncategorized';
ALTER TABLE oe_documents ADD COLUMN IF NOT EXISTS subcategory TEXT;
ALTER TABLE oe_documents ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE oe_documents ADD COLUMN IF NOT EXISTS ai_extracted_data JSONB DEFAULT '{}';
ALTER TABLE oe_documents ADD COLUMN IF NOT EXISTS ai_confidence NUMERIC(3,2);
ALTER TABLE oe_documents ADD COLUMN IF NOT EXISTS ai_processed_at TIMESTAMPTZ;
ALTER TABLE oe_documents ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE oe_documents ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update status constraint to include new statuses for AI processing
-- First drop the old constraint, then add the new one
ALTER TABLE oe_documents DROP CONSTRAINT IF EXISTS oe_documents_status_check;
ALTER TABLE oe_documents ADD CONSTRAINT oe_documents_status_check
  CHECK (status IN ('active', 'archived', 'deleted', 'pending', 'processing', 'processed', 'failed'));

-- Indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_oe_documents_patient ON oe_documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_oe_documents_category ON oe_documents(category);
CREATE INDEX IF NOT EXISTS idx_oe_documents_created ON oe_documents(created_at DESC);

-- RLS (table may already have it, but ensure it's enabled)
ALTER TABLE oe_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access" ON oe_documents;
CREATE POLICY "Service role full access" ON oe_documents FOR ALL USING (true) WITH CHECK (true);

-- Update trigger (may already exist from 010, add if not)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_oe_documents_updated_at'
  ) THEN
    CREATE TRIGGER update_oe_documents_updated_at
      BEFORE UPDATE ON oe_documents
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END
$$;

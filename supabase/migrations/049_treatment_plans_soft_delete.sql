-- Add soft-delete columns to oe_treatment_plans
-- These are referenced in the API routes but missing from the original schema

ALTER TABLE oe_treatment_plans
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by text;

-- Index for the common "not deleted" filter
CREATE INDEX IF NOT EXISTS idx_oe_treatment_plans_deleted_at
  ON oe_treatment_plans (deleted_at)
  WHERE deleted_at IS NULL;

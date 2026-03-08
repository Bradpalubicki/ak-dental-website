-- Migration 052: Add clerk_user_id to oe_patients for mobile auth linking
ALTER TABLE oe_patients ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_oe_patients_clerk_user_id ON oe_patients(clerk_user_id);

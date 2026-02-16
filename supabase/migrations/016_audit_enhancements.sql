-- AUDIT LOG ENHANCEMENTS FOR HIPAA COMPLIANCE
-- Adds PHI access tracking, session tracking, and makes practice_id optional for single-tenant mode

-- Make practice_id nullable for single-tenant usage
ALTER TABLE audit_log ALTER COLUMN practice_id DROP NOT NULL;

-- Add HIPAA-specific columns
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS phi_accessed BOOLEAN DEFAULT false;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Index for PHI access queries (compliance dashboard)
CREATE INDEX IF NOT EXISTS idx_audit_log_phi ON audit_log(phi_accessed) WHERE phi_accessed = true;
CREATE INDEX IF NOT EXISTS idx_audit_log_resource ON audit_log(resource_type, resource_id);

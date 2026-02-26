-- Migration 028: Provider Schema Compatibility
-- Adds columns to oe_providers for dental-engine scheduling lib compatibility.
-- Also adds oe_provider_time_off table used by scheduling availability service.

ALTER TABLE oe_providers
  ADD COLUMN IF NOT EXISTS credentials TEXT,
  ADD COLUMN IF NOT EXISTS npi TEXT,
  ADD COLUMN IF NOT EXISTS license_expiry DATE,
  ADD COLUMN IF NOT EXISTS telehealth_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS calendar_color TEXT DEFAULT '#3B82F6',
  ADD COLUMN IF NOT EXISTS max_daily_patients INTEGER DEFAULT 8,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Sync status from is_active for existing rows
UPDATE oe_providers SET status = CASE WHEN is_active THEN 'active' ELSE 'inactive' END
WHERE status IS NULL;

CREATE TABLE IF NOT EXISTS oe_provider_time_off (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  provider_id UUID NOT NULL REFERENCES oe_providers(id) ON DELETE CASCADE,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL DEFAULT 'pto',
  reason TEXT,
  all_day BOOLEAN DEFAULT false,
  recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT,
  approved_by TEXT,
  status TEXT NOT NULL DEFAULT 'approved'
);

CREATE INDEX IF NOT EXISTS idx_oe_provider_time_off_provider ON oe_provider_time_off(provider_id);
CREATE INDEX IF NOT EXISTS idx_oe_provider_time_off_dates ON oe_provider_time_off(start_datetime, end_datetime);

ALTER TABLE oe_provider_time_off ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON oe_provider_time_off FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE oe_provider_availability
  ADD COLUMN IF NOT EXISTS is_telehealth BOOLEAN DEFAULT false;
-- Migration 036: Prefill item approval tracking
-- Tracks which Bar 1 auto-filled items the client has approved or edited

CREATE TABLE IF NOT EXISTS oe_prefill_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engine_key TEXT NOT NULL DEFAULT 'ak-dental',
  item_key TEXT NOT NULL,         -- e.g. 'practice_name', 'address', 'npi', 'hours'
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'edited')),
  original_value JSONB,           -- what NuStack auto-filled
  edited_value JSONB,             -- what client changed it to (if edited)
  approved_by TEXT,               -- clerk_user_id
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(engine_key, item_key)
);

CREATE INDEX IF NOT EXISTS idx_oe_prefill_approvals_engine
  ON oe_prefill_approvals(engine_key, status);

ALTER TABLE oe_prefill_approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON oe_prefill_approvals FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER oe_prefill_approvals_updated_at
  BEFORE UPDATE ON oe_prefill_approvals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

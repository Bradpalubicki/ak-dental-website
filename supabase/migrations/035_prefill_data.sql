-- Migration 035: Smart Onboarding Prefill Column
-- Adds prefilled_data JSONB to onboarding_state for agency-pushed prefill payloads

ALTER TABLE onboarding_state
  ADD COLUMN IF NOT EXISTS prefilled_data JSONB,
  ADD COLUMN IF NOT EXISTS prefill_received_at TIMESTAMPTZ;

-- Index for fast lookups when wizard loads
CREATE INDEX IF NOT EXISTS idx_onboarding_state_prefill ON onboarding_state(engine_key)
  WHERE prefilled_data IS NOT NULL;

-- Insurance carriers from prefill (normalized for quick display)
CREATE TABLE IF NOT EXISTS oe_insurance_carriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual', -- 'prefill' | 'manual' | 'edi'
  payer_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name)
);

ALTER TABLE oe_insurance_carriers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON oe_insurance_carriers FOR ALL USING (true) WITH CHECK (true);

-- Trigger updated_at on oe_insurance_carriers
CREATE OR REPLACE FUNCTION update_insurance_carriers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER oe_insurance_carriers_updated_at
  BEFORE UPDATE ON oe_insurance_carriers
  FOR EACH ROW EXECUTE FUNCTION update_insurance_carriers_updated_at();

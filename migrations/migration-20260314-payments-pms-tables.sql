-- Migration: Add missing tables referenced in code
-- Date: 2026-03-14

-- oe_payments table (referenced in /api/payments/checkout/route.ts)
CREATE TABLE IF NOT EXISTS oe_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  patient_id UUID REFERENCES oe_patients(id),
  treatment_plan_id UUID REFERENCES oe_treatment_plans(id),
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  stripe_checkout_session_id TEXT,
  stripe_customer_id TEXT,
  square_payment_id TEXT,
  receipt_url TEXT,
  description TEXT,
  notes TEXT,
  deleted_at TIMESTAMPTZ
);

ALTER TABLE oe_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff_manage_payments" ON oe_payments
  FOR ALL USING (true) WITH CHECK (true);

-- oe_pms_integrations table
CREATE TABLE IF NOT EXISTS oe_pms_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  type TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  last_sync_at TIMESTAMPTZ,
  last_sync_status TEXT,
  last_sync_records INTEGER DEFAULT 0,
  total_patients_synced INTEGER DEFAULT 0
);

ALTER TABLE oe_pms_integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff_manage_pms_integrations" ON oe_pms_integrations
  FOR ALL USING (true) WITH CHECK (true);

-- oe_pms_sync_log table
CREATE TABLE IF NOT EXISTS oe_pms_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  integration_id UUID REFERENCES oe_pms_integrations(id),
  sync_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running',
  records_processed INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_errored INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]',
  duration_ms INTEGER,
  completed_at TIMESTAMPTZ
);

ALTER TABLE oe_pms_sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff_manage_pms_sync_log" ON oe_pms_sync_log
  FOR ALL USING (true) WITH CHECK (true);

-- Fix: make patient_id nullable on oe_billing_claims for Stripe webhook compatibility
ALTER TABLE oe_billing_claims ALTER COLUMN patient_id DROP NOT NULL;

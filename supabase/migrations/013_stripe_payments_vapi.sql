-- Migration 013: Stripe payment tracking + Vapi call metadata
-- Adds payment records for Stripe Checkout sessions and extends calls for Vapi

-- ============================================================================
-- PAYMENTS TABLE (Stripe Checkout sessions, card payments, financing)
-- ============================================================================
CREATE TABLE IF NOT EXISTS oe_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  patient_id UUID REFERENCES oe_patients(id),
  treatment_plan_id UUID REFERENCES oe_treatment_plans(id),
  -- Stripe fields
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  -- Payment details
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'card' CHECK (payment_method IN ('card', 'financing', 'insurance', 'cash', 'check')),
  -- Financing
  financing_provider TEXT,
  financing_term_months INTEGER,
  financing_monthly_amount NUMERIC(12,2),
  financing_status TEXT CHECK (financing_status IN ('pending', 'approved', 'denied', 'funded')),
  -- Metadata
  description TEXT,
  receipt_url TEXT,
  metadata JSONB DEFAULT '{}',
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_oe_payments_patient ON oe_payments(patient_id);
CREATE INDEX IF NOT EXISTS idx_oe_payments_treatment ON oe_payments(treatment_plan_id);
CREATE INDEX IF NOT EXISTS idx_oe_payments_stripe ON oe_payments(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_oe_payments_status ON oe_payments(status);

-- RLS
ALTER TABLE oe_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on oe_payments"
  ON oe_payments FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- ADD VAPI FIELDS TO oe_calls
-- ============================================================================
ALTER TABLE oe_calls ADD COLUMN IF NOT EXISTS vapi_call_id TEXT UNIQUE;
ALTER TABLE oe_calls ADD COLUMN IF NOT EXISTS vapi_assistant_id TEXT;
ALTER TABLE oe_calls ADD COLUMN IF NOT EXISTS call_type TEXT DEFAULT 'human' CHECK (call_type IN ('human', 'ai', 'transfer'));
ALTER TABLE oe_calls ADD COLUMN IF NOT EXISTS ended_reason TEXT;
ALTER TABLE oe_calls ADD COLUMN IF NOT EXISTS cost NUMERIC(8,4);
ALTER TABLE oe_calls ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;
ALTER TABLE oe_calls ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_oe_calls_vapi ON oe_calls(vapi_call_id);

-- ============================================================================
-- ADD STRIPE FIELDS TO oe_billing_claims (for webhook handler)
-- ============================================================================
ALTER TABLE oe_billing_claims ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE oe_billing_claims ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE oe_billing_claims ADD COLUMN IF NOT EXISTS stripe_invoice_id TEXT UNIQUE;
ALTER TABLE oe_billing_claims ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE oe_billing_claims ADD COLUMN IF NOT EXISTS amount_total NUMERIC(12,2);
ALTER TABLE oe_billing_claims ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'usd';
ALTER TABLE oe_billing_claims ADD COLUMN IF NOT EXISTS payment_type TEXT;
ALTER TABLE oe_billing_claims ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Update status constraint to include Stripe statuses
ALTER TABLE oe_billing_claims DROP CONSTRAINT IF EXISTS oe_billing_claims_status_check;
ALTER TABLE oe_billing_claims ADD CONSTRAINT oe_billing_claims_status_check
  CHECK (status IN ('draft', 'submitted', 'pending', 'paid', 'denied', 'appealed', 'written_off', 'failed', 'active', 'cancelled'));

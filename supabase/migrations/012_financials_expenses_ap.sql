-- Migration 012: Financials - Monthly Expenses & Accounts Payable
-- Replaces hardcoded expense data in financials dashboard

-- Monthly expense tracking by category
CREATE TABLE IF NOT EXISTS oe_monthly_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month DATE NOT NULL,                    -- First of month (e.g. 2026-02-01)
  label TEXT NOT NULL,                    -- e.g. "Payroll & Benefits"
  category TEXT NOT NULL,                 -- Labor, Clinical, Overhead, Growth, Other
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Accounts payable tracking
CREATE TABLE IF NOT EXISTS oe_accounts_payable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'due_soon', 'paid', 'overdue')),
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_oe_monthly_expenses_month ON oe_monthly_expenses(month);
CREATE INDEX IF NOT EXISTS idx_oe_accounts_payable_due_date ON oe_accounts_payable(due_date);
CREATE INDEX IF NOT EXISTS idx_oe_accounts_payable_status ON oe_accounts_payable(status);

-- RLS policies (service role bypass, auth users read)
ALTER TABLE oe_monthly_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE oe_accounts_payable ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on oe_monthly_expenses"
  ON oe_monthly_expenses FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on oe_accounts_payable"
  ON oe_accounts_payable FOR ALL USING (true) WITH CHECK (true);

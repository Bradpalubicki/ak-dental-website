-- Dashboard layout preferences per user
CREATE TABLE IF NOT EXISTS oe_dashboard_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  layouts JSONB NOT NULL DEFAULT '{}',
  visible_widgets TEXT[] NOT NULL DEFAULT ARRAY[
    'urgent', 'kpi', 'appointments', 'leads', 'ai_activity',
    'financials', 'hr', 'compliance', 'insurance', 'outreach'
  ],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- RLS
ALTER TABLE oe_dashboard_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on dashboard_preferences"
  ON oe_dashboard_preferences FOR ALL
  USING (true) WITH CHECK (true);

-- Updated at trigger
CREATE TRIGGER set_updated_at_dashboard_preferences
  BEFORE UPDATE ON oe_dashboard_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

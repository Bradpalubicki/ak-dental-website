-- =============================================================================
-- Migration 011: SEO System
-- Keyword tracking, audit results, web vitals, search console data, reports
-- =============================================================================

-- SEO Keywords — tracked keywords with rankings
CREATE TABLE IF NOT EXISTS seo_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'primary'
    CHECK (category IN ('primary', 'secondary', 'long_tail', 'local', 'service')),
  target_url TEXT,
  current_rank INTEGER,
  previous_rank INTEGER,
  best_rank INTEGER,
  search_volume INTEGER,
  difficulty NUMERIC(4,1),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SEO Keyword History — daily rank snapshots for trend charts
CREATE TABLE IF NOT EXISTS seo_keyword_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID NOT NULL REFERENCES seo_keywords(id) ON DELETE CASCADE,
  rank INTEGER,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT DEFAULT 'gsc',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_keyword_history_keyword_date
  ON seo_keyword_history(keyword_id, date DESC);

-- SEO Audits — periodic audit results with scores
CREATE TABLE IF NOT EXISTS seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  overall_score INTEGER,
  technical_score INTEGER,
  content_score INTEGER,
  performance_score INTEGER,
  issues_critical INTEGER DEFAULT 0,
  issues_warning INTEGER DEFAULT 0,
  issues_info INTEGER DEFAULT 0,
  run_by TEXT DEFAULT 'cron',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SEO Audit Issues — individual issues with severity
CREATE TABLE IF NOT EXISTS seo_audit_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES seo_audits(id) ON DELETE CASCADE,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  category TEXT NOT NULL,
  page TEXT,
  message TEXT NOT NULL,
  details TEXT,
  auto_fixable BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'fixed', 'ignored')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SEO Web Vitals — raw CWV data from real users
CREATE TABLE IF NOT EXISTS seo_web_vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL CHECK (metric_name IN ('LCP', 'CLS', 'INP', 'FCP', 'TTFB')),
  metric_value NUMERIC NOT NULL,
  metric_id TEXT,
  page TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_web_vitals_name_date
  ON seo_web_vitals(metric_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_web_vitals_page
  ON seo_web_vitals(page, created_at DESC);

-- SEO Indexing Log — submission tracking for Google/Bing/IndexNow
CREATE TABLE IF NOT EXISTS seo_indexing_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  service TEXT NOT NULL CHECK (service IN ('indexnow', 'google', 'bing')),
  status TEXT DEFAULT 'submitted',
  response_code INTEGER,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SEO Reports — monthly report metadata
CREATE TABLE IF NOT EXISTS seo_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_month DATE NOT NULL,
  overall_score INTEGER,
  pdf_url TEXT,
  sent_to_client BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SEO Search Console Data — cached GSC performance data
CREATE TABLE IF NOT EXISTS seo_search_console_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  query TEXT,
  page TEXT,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ctr NUMERIC(5,4) DEFAULT 0,
  position NUMERIC(6,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gsc_date
  ON seo_search_console_data(date DESC);

CREATE INDEX IF NOT EXISTS idx_gsc_query
  ON seo_search_console_data(query, date DESC);

-- Add SEO permissions to RBAC (uses oe_permissions from migration 009)
INSERT INTO oe_permissions (key, label, category, sort_order)
VALUES
  ('seo.view', 'View SEO Dashboard', 'seo', 60),
  ('seo.manage', 'Manage SEO', 'seo', 61)
ON CONFLICT (key) DO NOTHING;

-- Enable RLS on all SEO tables
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keyword_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_audit_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_web_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_indexing_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_search_console_data ENABLE ROW LEVEL SECURITY;

-- RLS policies — authenticated users can read all SEO data
CREATE POLICY "Authenticated users can read seo_keywords"
  ON seo_keywords FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage seo_keywords"
  ON seo_keywords FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can read seo_keyword_history"
  ON seo_keyword_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage seo_keyword_history"
  ON seo_keyword_history FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can read seo_audits"
  ON seo_audits FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage seo_audits"
  ON seo_audits FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can read seo_audit_issues"
  ON seo_audit_issues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage seo_audit_issues"
  ON seo_audit_issues FOR ALL TO authenticated USING (true);

CREATE POLICY "Anyone can insert seo_web_vitals"
  ON seo_web_vitals FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can read seo_web_vitals"
  ON seo_web_vitals FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read seo_indexing_log"
  ON seo_indexing_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage seo_indexing_log"
  ON seo_indexing_log FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can read seo_reports"
  ON seo_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage seo_reports"
  ON seo_reports FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can read seo_search_console_data"
  ON seo_search_console_data FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage seo_search_console_data"
  ON seo_search_console_data FOR ALL TO authenticated USING (true);

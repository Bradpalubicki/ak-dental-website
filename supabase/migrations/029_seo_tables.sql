-- SEO infrastructure tables

-- Keyword rank tracking
create table if not exists seo_keywords (
  id uuid primary key default gen_random_uuid(),
  keyword text not null,
  category text not null default 'general',
  target_url text,
  current_rank integer,
  previous_rank integer,
  best_rank integer,
  search_volume integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keyword rank history
create table if not exists seo_keyword_history (
  id uuid primary key default gen_random_uuid(),
  keyword_id uuid references seo_keywords(id) on delete cascade,
  rank integer,
  date date not null default current_date,
  source text default 'manual'
);

-- Google Search Console raw data
create table if not exists seo_search_console_data (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  query text not null,
  page text,
  clicks integer default 0,
  impressions integer default 0,
  ctr numeric(5,4) default 0,
  position numeric(6,2) default 0,
  created_at timestamptz not null default now()
);

-- Core Web Vitals (client-side beacon)
create table if not exists seo_web_vitals (
  id uuid primary key default gen_random_uuid(),
  metric_name text not null,
  metric_value numeric not null,
  metric_id text,
  page text,
  created_at timestamptz not null default now()
);

-- SEO audit snapshots
create table if not exists seo_audits (
  id uuid primary key default gen_random_uuid(),
  overall_score integer,
  issues_critical integer default 0,
  issues_warning integer default 0,
  issues_detail jsonb,
  created_at timestamptz not null default now()
);

-- Monthly SEO reports
create table if not exists seo_reports (
  id uuid primary key default gen_random_uuid(),
  report_month date not null,
  overall_score integer,
  sent_to_client boolean default false,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

-- RLS: restrict to authenticated users (dashboard only)
alter table seo_keywords enable row level security;
alter table seo_keyword_history enable row level security;
alter table seo_search_console_data enable row level security;
alter table seo_web_vitals enable row level security;
alter table seo_audits enable row level security;
alter table seo_reports enable row level security;

-- Allow service role full access (used by API routes via createServerSupabase)
create policy "service_role_all" on seo_keywords for all using (true);
create policy "service_role_all" on seo_keyword_history for all using (true);
create policy "service_role_all" on seo_search_console_data for all using (true);
create policy "service_role_all" on seo_web_vitals for all using (true);
create policy "service_role_all" on seo_audits for all using (true);
create policy "service_role_all" on seo_reports for all using (true);

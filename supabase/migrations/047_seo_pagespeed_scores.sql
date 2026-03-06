-- seo_pagespeed_scores: stores PageSpeed Insights results for desktop + mobile
create table if not exists public.seo_pagespeed_scores (
  id            uuid primary key default gen_random_uuid(),
  url           text not null,
  strategy      text not null check (strategy in ('mobile', 'desktop')),
  performance_score integer,
  lcp           numeric,        -- milliseconds
  cls           numeric,
  inp           numeric,        -- milliseconds
  fcp           numeric,        -- milliseconds
  ttfb          numeric,        -- milliseconds
  speed_index   numeric,        -- milliseconds
  opportunities jsonb,          -- array of { id, title, displayValue, numericValue }
  created_at    timestamptz not null default now()
);

create index if not exists seo_pagespeed_scores_created_at_idx
  on public.seo_pagespeed_scores (created_at desc);

alter table public.seo_pagespeed_scores enable row level security;

create policy "service role full access" on public.seo_pagespeed_scores
  using (true) with check (true);

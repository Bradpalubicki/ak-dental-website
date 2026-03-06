-- seo_gsc_tokens: stores OAuth refresh tokens per site
create table if not exists public.seo_gsc_tokens (
  id            uuid primary key default gen_random_uuid(),
  site_url      text not null unique,
  access_token  text not null,
  refresh_token text not null,
  expires_at    timestamptz not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- seo_gsc_data: latest search analytics pull from GSC
create table if not exists public.seo_gsc_data (
  id            uuid primary key default gen_random_uuid(),
  query         text not null,
  page          text,
  clicks        integer not null default 0,
  impressions   integer not null default 0,
  ctr           numeric not null default 0,
  position      numeric not null default 0,
  fetched_at    timestamptz not null default now()
);

create index if not exists seo_gsc_data_fetched_at_idx on public.seo_gsc_data (fetched_at desc);
create index if not exists seo_gsc_data_clicks_idx on public.seo_gsc_data (clicks desc);

alter table public.seo_gsc_tokens enable row level security;
alter table public.seo_gsc_data enable row level security;

create policy "service role full access" on public.seo_gsc_tokens using (true) with check (true);
create policy "service role full access" on public.seo_gsc_data using (true) with check (true);

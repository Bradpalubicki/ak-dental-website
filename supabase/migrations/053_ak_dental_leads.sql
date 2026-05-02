-- ak_dental_leads: captures Crown LP V6 form submissions
create table if not exists ak_dental_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  preferred_time text not null check (preferred_time in ('Morning', 'Afternoon', 'Evening')),
  source text not null default 'crowns-lp-v6',
  created_at timestamptz not null default now()
);

-- RLS: service role writes only (no anon insert — server action uses service role)
alter table ak_dental_leads enable row level security;

-- No public read/write — server action only
create policy "service_role_all" on ak_dental_leads
  for all to service_role using (true) with check (true);

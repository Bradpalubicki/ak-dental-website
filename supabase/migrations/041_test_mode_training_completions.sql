-- Migration 041: Test mode, test log, and training completions

-- oe_settings: key-value store for app settings
create table if not exists oe_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now(),
  updated_by text
);

-- Seed default settings
insert into oe_settings (key, value) values
  ('test_mode', 'false'),
  ('test_phone', ''),
  ('test_email', ''),
  ('go_live_at', null),
  ('nustack_signoff', 'false')
on conflict (key) do nothing;

-- oe_test_log: records all intercepted test-mode sends
create table if not exists oe_test_log (
  id uuid primary key default gen_random_uuid(),
  type text,
  channel text,
  recipient text,
  template_type text,
  message_preview text,
  created_at timestamptz default now()
);

-- oe_training_completions: tracks staff training per module
create table if not exists oe_training_completions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  user_email text,
  user_name text,
  role text,
  module text not null,
  score int,
  passed boolean default false,
  completed_at timestamptz default now()
);

create unique index if not exists oe_training_completions_user_module
  on oe_training_completions (user_id, module);

-- RLS
alter table oe_settings enable row level security;
alter table oe_test_log enable row level security;
alter table oe_training_completions enable row level security;

-- Settings: service role full access, authenticated can read
create policy "service role manage settings"
  on oe_settings for all
  using (auth.role() = 'service_role');

create policy "authenticated read settings"
  on oe_settings for select
  using (auth.role() = 'authenticated');

-- Test log: service role full access
create policy "service role manage test log"
  on oe_test_log for all
  using (auth.role() = 'service_role');

-- Training completions: service role full access, authenticated can read own
create policy "service role manage training"
  on oe_training_completions for all
  using (auth.role() = 'service_role');

create policy "authenticated read training"
  on oe_training_completions for select
  using (auth.role() = 'authenticated');

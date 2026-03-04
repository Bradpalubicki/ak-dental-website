-- Migration 041: Training completions + Test mode send log
-- Supports /api/training/complete (HIPAA/OSHA quiz pass tracking)
-- and /lib/services/test-mode.ts (test send audit log)

-- Training completions: one row per user per module
create table if not exists oe_training_completions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  user_email text,
  user_name text,
  role text,
  module text not null,
  score int not null default 0,
  passed boolean not null default false,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(user_id, module)
);

alter table oe_training_completions enable row level security;
create policy "service_role_all on oe_training_completions"
  on oe_training_completions for all using (true) with check (true);

create index if not exists idx_training_completions_user_id on oe_training_completions(user_id);
create index if not exists idx_training_completions_module on oe_training_completions(module);

-- Test mode send log: audit trail when test_mode=true intercepts a send
create table if not exists oe_test_log (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('sms', 'email')),
  channel text not null,
  recipient text not null,
  template_type text,
  message_preview text,
  created_at timestamptz not null default now()
);

alter table oe_test_log enable row level security;
create policy "service_role_all on oe_test_log"
  on oe_test_log for all using (true) with check (true);

create index if not exists idx_test_log_created_at on oe_test_log(created_at desc);

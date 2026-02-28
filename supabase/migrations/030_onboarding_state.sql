-- Onboarding state table (cross-device sync)
-- Supplements localStorage for multi-device practices (front desk + back office)

create table if not exists onboarding_state (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  engine_key text not null default 'ak-dental',
  wizard_completed boolean not null default false,
  wizard_data jsonb,
  setup_steps jsonb not null default '[]',
  tour_seen boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(clerk_user_id, engine_key)
);

-- RLS
alter table onboarding_state enable row level security;
create policy "service_role_all" on onboarding_state for all using (true);

-- Updated_at trigger
create or replace function update_onboarding_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger onboarding_state_updated_at
  before update on onboarding_state
  for each row execute function update_onboarding_updated_at();

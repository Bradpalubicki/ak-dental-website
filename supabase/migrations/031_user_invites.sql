-- User invite tracking table
create table if not exists oe_user_invites (
  id uuid primary key default gen_random_uuid(),
  clerk_invitation_id text unique not null,
  email text not null,
  first_name text,
  last_name text,
  role text not null,
  authority_level text not null,
  invited_by text not null,  -- clerk_user_id of inviter
  status text not null default 'pending', -- pending | accepted | revoked | expired
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table oe_user_invites enable row level security;
create policy "service_role_all" on oe_user_invites for all using (true);

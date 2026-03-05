-- Treatment proposals (provider creates chairside, patient receives token link)
create table if not exists oe_proposals (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references oe_patients(id) on delete cascade,
  provider_id uuid references oe_providers(id) on delete set null,
  title text not null,
  notes text,
  -- Token for patient-facing URL (no login required)
  sign_token uuid unique default gen_random_uuid(),
  -- Status machine
  status text not null default 'draft'
    check (status in ('draft','sent','viewed','accepted','declined','expired')),
  -- Pricing totals (computed, stored for performance)
  total_fee numeric(10,2) not null default 0,
  insurance_estimate numeric(10,2) not null default 0,
  patient_estimate numeric(10,2) not null default 0,
  -- Financing
  financing_provider text, -- 'cherry' | 'carecredit' | 'sunbit' | null
  financing_monthly numeric(10,2),
  financing_term_months int,
  -- Good/Better/Best tier (null = single plan)
  tier text check (tier in ('good','better','best')),
  -- E-sign fields
  signature_name text,
  signed_at timestamptz,
  signed_ip text,
  -- Timestamps
  sent_at timestamptz,
  viewed_at timestamptz,
  expires_at timestamptz default (now() + interval '30 days'),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Line items
create table if not exists oe_proposal_items (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid references oe_proposals(id) on delete cascade,
  sort_order int not null default 0,
  -- CDT code + plain language
  cdt_code text,
  procedure_name text not null,
  procedure_description text,
  tooth_number text,
  -- Pricing
  fee numeric(10,2) not null default 0,
  insurance_pays numeric(10,2) not null default 0,
  patient_pays numeric(10,2) not null default 0,
  -- Tier assignment (null = applies to all tiers)
  tier text check (tier in ('good','better','best')),
  created_at timestamptz default now()
);

-- RLS
alter table oe_proposals enable row level security;
alter table oe_proposal_items enable row level security;

-- Service role can do everything
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'oe_proposals' and policyname = 'service_all_proposals') then
    create policy "service_all_proposals" on oe_proposals for all using (true) with check (true);
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'oe_proposal_items' and policyname = 'service_all_proposal_items') then
    create policy "service_all_proposal_items" on oe_proposal_items for all using (true) with check (true);
  end if;
end $$;

-- Indexes
create index if not exists oe_proposals_patient_id_idx on oe_proposals(patient_id);
create index if not exists oe_proposals_sign_token_idx on oe_proposals(sign_token);
create index if not exists oe_proposals_status_idx on oe_proposals(status);
create index if not exists oe_proposal_items_proposal_id_idx on oe_proposal_items(proposal_id);

-- Updated_at trigger
create or replace function update_proposals_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'proposals_updated_at') then
    create trigger proposals_updated_at before update on oe_proposals
      for each row execute function update_proposals_updated_at();
  end if;
end $$;

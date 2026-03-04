-- Migration 043: Patient intake form submissions

create table if not exists oe_intake_submissions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references oe_patients(id) on delete cascade,
  submitted_at timestamptz default now(),

  -- Flattened key fields for easy querying
  reason_for_visit text,
  conditions text[], -- array of reported conditions
  medications text,
  allergies text,
  dental_anxiety text,
  referred_by text,

  -- Full JSONB blobs for everything else
  personal_info jsonb,
  medical_history jsonb,
  insurance_info jsonb,
  consents jsonb,

  created_at timestamptz default now()
);

create index if not exists oe_intake_patient_idx on oe_intake_submissions(patient_id);
create index if not exists oe_intake_submitted_at_idx on oe_intake_submissions(submitted_at desc);

alter table oe_intake_submissions enable row level security;

create policy "service role manage intake"
  on oe_intake_submissions for all
  using (auth.role() = 'service_role');

create policy "authenticated read intake"
  on oe_intake_submissions for select
  using (auth.role() = 'authenticated');

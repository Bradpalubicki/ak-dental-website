-- Migration 042: Add no-show tracking columns to oe_appointments
-- and lead_id FK to oe_calls

alter table oe_appointments
  add column if not exists no_show_30m_sent boolean default false,
  add column if not exists no_show_24h_queued boolean default false;

-- Add lead_id FK to oe_calls (references oe_leads)
alter table oe_calls
  add column if not exists lead_id uuid references oe_leads(id) on delete set null;

create index if not exists oe_calls_lead_id_idx on oe_calls(lead_id);

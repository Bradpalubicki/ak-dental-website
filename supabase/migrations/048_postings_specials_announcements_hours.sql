-- Migration 048: Website Postings — Specials, Announcements, Hours Overrides
-- Powers /dashboard/postings/specials, /announcements, /hours
-- And public pages: /specials, sitewide announcement banner

-- ─── Specials ────────────────────────────────────────────────────────────────
create table if not exists practice_specials (
  id            uuid primary key default gen_random_uuid(),
  practice_id   text not null,
  created_by    text not null,  -- Clerk user ID

  title         text not null,
  description   text,
  fine_print    text,           -- "Cannot combine with insurance", etc.

  cta_label     text not null default 'Claim This Offer',
  cta_href      text not null default '/appointment',

  -- Optional: badge/pill shown on card
  badge_text    text,           -- "Limited Time" | "New Patient Only" | "This Month Only"

  -- Discount info (at least one required)
  discount_type text,           -- 'percent' | 'fixed' | 'free' | 'custom'
  discount_value numeric(10,2), -- for percent=20, fixed=50
  discount_display text,        -- raw display: "$50 Off" | "Free Whitening" | "20% Off" | "Free Consult"

  -- Dates
  starts_at     timestamptz not null default now(),
  expires_at    timestamptz,    -- null = never expires
  status        text not null default 'active'
    check (status in ('active', 'paused', 'expired', 'archived')),

  -- Ordering
  sort_order    integer not null default 0,
  is_featured   boolean not null default false,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_specials_practice_status on practice_specials(practice_id, status);
create index if not exists idx_specials_expires on practice_specials(expires_at) where status = 'active';

-- ─── Announcements ────────────────────────────────────────────────────────────
create table if not exists practice_announcements (
  id            uuid primary key default gen_random_uuid(),
  practice_id   text not null,
  created_by    text not null,

  message       text not null,          -- Short message shown in the banner
  link_label    text,                   -- Optional CTA text: "Learn More"
  link_href     text,                   -- Optional CTA link
  style         text not null default 'info'
    check (style in ('info', 'warning', 'success', 'urgent')),

  -- Dates
  starts_at     timestamptz not null default now(),
  expires_at    timestamptz,            -- null = indefinite
  status        text not null default 'active'
    check (status in ('active', 'paused', 'expired', 'archived')),

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_announcements_practice_status on practice_announcements(practice_id, status);

-- ─── Hours Overrides ─────────────────────────────────────────────────────────
-- Normal hours live in config.ts — this table adds exceptions/overrides
create table if not exists practice_hours_overrides (
  id            uuid primary key default gen_random_uuid(),
  practice_id   text not null,
  created_by    text not null,

  label         text not null,          -- "Holiday Hours", "Spring Break", "Closed for Conference"
  note          text,                   -- Optional explanation shown to patients
  show_banner   boolean not null default true,
  banner_message text,                  -- If null, auto-generated from label

  -- Date range this override applies
  starts_at     date not null,
  ends_at       date not null,

  -- Override schedule (null day = closed that day)
  -- Each day: null (closed) or "8:00 AM – 5:00 PM"
  mon_hours     text,
  tue_hours     text,
  wed_hours     text,
  thu_hours     text,
  fri_hours     text,
  sat_hours     text,
  sun_hours     text,

  status        text not null default 'active'
    check (status in ('active', 'archived')),

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_hours_overrides_practice_dates on practice_hours_overrides(practice_id, starts_at, ends_at);

-- ─── Update triggers ──────────────────────────────────────────────────────────
create or replace function update_posting_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists trg_specials_updated_at on practice_specials;
create trigger trg_specials_updated_at before update on practice_specials for each row execute function update_posting_updated_at();

drop trigger if exists trg_announcements_updated_at on practice_announcements;
create trigger trg_announcements_updated_at before update on practice_announcements for each row execute function update_posting_updated_at();

drop trigger if exists trg_hours_overrides_updated_at on practice_hours_overrides;
create trigger trg_hours_overrides_updated_at before update on practice_hours_overrides for each row execute function update_posting_updated_at();

-- ─── Auto-expire cron helper view ─────────────────────────────────────────────
-- This view is used by /api/cron/expire-postings to find items to auto-expire
create or replace view v_expirable_postings as
  select 'special' as kind, id, practice_id, expires_at from practice_specials
    where status = 'active' and expires_at is not null and expires_at < now()
  union all
  select 'announcement' as kind, id, practice_id, expires_at from practice_announcements
    where status = 'active' and expires_at is not null and expires_at < now();

-- ─── RLS ─────────────────────────────────────────────────────────────────────
alter table practice_specials enable row level security;
alter table practice_announcements enable row level security;
alter table practice_hours_overrides enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'practice_specials' and policyname = 'service_all_specials') then
    create policy "service_all_specials" on practice_specials for all using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'practice_announcements' and policyname = 'service_all_announcements') then
    create policy "service_all_announcements" on practice_announcements for all using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'practice_hours_overrides' and policyname = 'service_all_hours_overrides') then
    create policy "service_all_hours_overrides" on practice_hours_overrides for all using (true);
  end if;
end $$;

-- ─── Before/After pair column (migration 049 adds this) ───────────────────────
-- Add pair_group_id to media_assets for before/after pairing
alter table media_assets add column if not exists pair_group_id uuid;
create index if not exists idx_media_assets_pair_group on media_assets(pair_group_id) where pair_group_id is not null;

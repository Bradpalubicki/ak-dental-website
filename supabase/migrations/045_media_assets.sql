-- Migration 045: media_assets table
-- NuStack Media Upload Tool — client-facing photo upload with AI categorization + HIPAA consent
-- Spec: MEDIA-UPLOAD-TOOL-SPEC.md

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  practice_id text not null,           -- "ak-ultimate-dental"
  uploaded_by text not null,           -- Clerk user ID

  -- Storage
  blob_url text not null default '',   -- Vercel Blob URL (published path)
  pending_blob_url text,               -- Vercel Blob URL (pending path, pre-approval)

  -- AI-generated metadata (filled after Claude Vision analysis)
  ai_category text,                    -- "before_after" | "team" | "office" | "equipment" | "other"
  ai_description text,
  ai_placement_suggestion text,
  ai_tags text[],
  ai_contains_person boolean,
  ai_quality text,                     -- "good" | "acceptable" | "poor"
  ai_quality_notes text,

  -- Client-provided metadata (from intake interview)
  photo_type text,                     -- "patient_result" | "office" | "team" | "equipment"
  service_category text,               -- "veneers" | "implants" | "whitening" | "crowns" | "smile_makeover" | "other"
  before_or_after text,                -- "before" | "after" | "na"
  paired_with_id uuid references media_assets(id) on delete set null,
  case_notes text,                     -- Internal only, never published
  caption text,                        -- Optional public caption

  -- HIPAA consent
  consent_confirmed boolean not null default false,
  consent_confirmed_by text,           -- Clerk user ID who confirmed
  consent_confirmed_at timestamptz,
  consent_type text default 'written_on_file',  -- "written_on_file" | "not_required"

  -- Workflow
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'published')),
  reviewed_by text,
  reviewed_at timestamptz,
  rejection_reason text,
  published_at timestamptz,

  -- Placement on public site
  placement text,                      -- "smile_gallery" | "homepage_hero" | "team_page" | "about_page" | "services/{slug}"
  sort_order integer not null default 0,
  is_featured boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_media_assets_practice on media_assets(practice_id);
create index if not exists idx_media_assets_status on media_assets(status);
create index if not exists idx_media_assets_placement on media_assets(placement);
create index if not exists idx_media_assets_created on media_assets(created_at desc);
create index if not exists idx_media_assets_practice_status on media_assets(practice_id, status);

-- updated_at trigger
create or replace function update_media_assets_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_media_assets_updated_at on media_assets;
create trigger trg_media_assets_updated_at
  before update on media_assets
  for each row execute function update_media_assets_updated_at();

-- RLS (service role does all auth at API layer via Clerk)
alter table media_assets enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'media_assets' and policyname = 'service_all_media_assets') then
    create policy "service_all_media_assets" on media_assets for all using (true);
  end if;
end $$;

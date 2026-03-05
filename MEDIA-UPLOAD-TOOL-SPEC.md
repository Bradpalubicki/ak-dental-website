# NuStack Media Upload Tool — Product Spec & Architecture
## "Client Uploads It. We Control It. The Site Gets It."
## Version 1.0 | 2026-03-05 | Build target: AK Dental → All NuStack engines

---

## WHAT THIS IS

A client-facing media upload module built into every NuStack engine dashboard.
The client (Alex, Carla, etc.) uploads photos from their phone or computer.
The AI agent asks questions, captures consent, categorizes the content, and queues it for NuStack approval.
NuStack approves → the photo publishes to the correct place on the public site automatically.

**Nobody touches FTP, code, or Vercel. The client does the uploading. We control what goes live.**

---

## THE PROBLEM IT SOLVES

Every NuStack client has photos that belong on their website:
- Dental: before/after cases, team photos, office photos, patient smiles
- Salon: color transformations, cuts, client results
- Equipment rental: equipment condition photos, project photos
- Mental health: office/team photos (no patient photos)

Right now: clients text us photos. We manually add them. We forget. They forget. Nothing ships.
After this tool: client uploads anytime, AI does the intake, we approve in one click, site updates automatically.

---

## USER FLOW (from client's perspective)

```
Client opens dashboard → clicks "Upload Media"
         ↓
Drag/drop or pick photos from phone (multi-select, up to 10 at once)
         ↓
For EACH photo:
  AI Agent asks:
  1. "Is this a patient/client photo, or office/team/equipment photo?"
  2. If patient/client photo:
     → "Do you have written consent from this patient to use their photo on your website?"
     → [Yes, I have signed consent] [No — skip this photo]
     → "What treatment/service is shown? (select from list)"
     → "Is this a BEFORE or AFTER photo?" (if before/after type)
     → "Any notes about this case? (optional, for internal reference)"
  3. If office/team/equipment photo:
     → "What does this photo show?" (select: exam room, reception, exterior, team, equipment, other)
     → "Caption for this photo? (optional)"
         ↓
Photos enter PENDING state — stored in Vercel Blob, tagged with metadata
         ↓
NuStack gets Slack/email notification: "3 photos pending review from AK Dental"
         ↓
NuStack opens /dashboard/admin/media-review
  - Sees each photo, AI-generated tags, consent status, placement suggestion
  - Can: Approve → publishes to site | Reject (with reason) → client notified | Edit tags
         ↓
On APPROVE:
  - Photo is published to Vercel Blob public CDN
  - Database record updated: status=published, placement confirmed
  - Public site reads from DB/Blob — gallery updates automatically without code change
  - Client sees "Published" status in their dashboard
```

---

## ARCHITECTURE

### Storage: Vercel Blob
- All uploaded photos stored in Vercel Blob (already installed: @vercel/blob ^2.3.0)
- Two paths: `pending/{practice-slug}/{uuid}.jpg` and `published/{practice-slug}/{uuid}.jpg`
- Move from pending → published on approval (copy + delete, or status flag)
- CDN-served automatically — no S3, no separate storage cost

### Database: Supabase (new table)
```sql
-- media_assets table
create table media_assets (
  id uuid primary key default gen_random_uuid(),
  practice_id text not null,           -- "ak-ultimate-dental", "littleroots-studio"
  uploaded_by text not null,           -- Clerk user ID
  blob_url text not null,              -- Vercel Blob URL
  pending_blob_url text,               -- Temp URL while pending

  -- AI-generated metadata
  ai_category text,                    -- "before_after", "team", "office", "equipment", "other"
  ai_description text,                 -- Claude's description of the image
  ai_placement_suggestion text,        -- Where Claude thinks it should go on the site
  ai_tags text[],                      -- ["veneers", "cosmetic", "before"]

  -- Client-provided metadata (from the intake interview)
  photo_type text,                     -- "patient_result", "office", "team", "equipment"
  service_category text,               -- "veneers", "implants", "whitening", etc.
  before_or_after text,                -- "before", "after", "na"
  case_notes text,                     -- Internal only, never published
  caption text,                        -- Optional public caption

  -- Consent (HIPAA)
  consent_confirmed boolean default false,
  consent_confirmed_by text,           -- Clerk user ID who confirmed
  consent_confirmed_at timestamptz,
  consent_type text,                   -- "written_on_file", "digital_on_file", "not_required"

  -- Workflow
  status text default 'pending',       -- pending | approved | rejected | published
  reviewed_by text,                    -- NuStack admin Clerk user ID
  reviewed_at timestamptz,
  rejection_reason text,
  published_at timestamptz,

  -- Placement (where it goes on the site)
  placement text,                      -- "smile_gallery", "homepage_hero", "team_page", "about_page", "services/{slug}"
  sort_order integer default 0,
  is_featured boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: clients can only see their own practice's assets
alter table media_assets enable row level security;
create policy "practice_members_own_assets" on media_assets
  using (practice_id = (select practice_id from user_practice_membership where clerk_user_id = auth.uid()));

-- NuStack admins can see all
create policy "nustack_admins_all" on media_assets
  using (exists (select 1 from nustack_admins where clerk_user_id = auth.uid()));
```

### AI Agent: Claude Vision (claude-sonnet-4-6)
On upload, Claude receives the image bytes + context and returns:
```json
{
  "category": "before_after",
  "description": "Close-up dental photo showing significant whitening transformation. Before photo shows yellowed, uneven teeth. After shows bright white uniform smile.",
  "suggested_placement": "smile_gallery",
  "detected_tags": ["teeth_whitening", "cosmetic", "smile_transformation"],
  "contains_identifiable_person": true,
  "quality_assessment": "good",
  "quality_notes": "Good lighting, clear focus. Consistent angle with similar cases."
}
```

### Consent Flow (HIPAA)
- Client must check: "I have signed written consent from this patient on file"
- This checkbox creates a timestamped `consent_confirmed_at` record tied to their Clerk user ID
- This is their legal attestation — the BAA we already have with clients covers this workflow
- We never store the physical consent form — Alex stores that in his records
- NuStack can reject any photo where consent wasn't confirmed

---

## DATABASE MIGRATION

```sql
-- Migration: add media_assets table
-- File: supabase/migrations/034_media_assets.sql

-- (full SQL above)

-- Indexes for common queries
create index idx_media_assets_practice on media_assets(practice_id);
create index idx_media_assets_status on media_assets(status);
create index idx_media_assets_placement on media_assets(placement);
create index idx_media_assets_created on media_assets(created_at desc);
```

---

## FILE STRUCTURE

```
src/
  app/
    dashboard/
      media/
        page.tsx                    ← Client-facing: "My Media" list view
        upload/
          page.tsx                  ← Client upload flow (multi-step)
          upload-client.tsx         ← "use client" upload form + AI interview
        [id]/
          page.tsx                  ← Single asset detail (client view)
      admin/
        media-review/
          page.tsx                  ← NuStack admin approval queue
          review-client.tsx         ← "use client" approve/reject UI
  api/
    media/
      upload/route.ts               ← POST: upload to Vercel Blob, trigger AI analysis
      [id]/approve/route.ts         ← POST: NuStack admin approves → publishes
      [id]/reject/route.ts          ← POST: NuStack admin rejects → notifies client
      [id]/route.ts                 ← GET/PATCH: single asset CRUD
    ai/
      analyze-media/route.ts        ← Claude Vision: analyze + tag uploaded image
  components/
    dashboard/
      media/
        upload-dropzone.tsx         ← Drag-drop component
        ai-interview.tsx            ← Conversational intake form
        consent-checkbox.tsx        ← HIPAA consent confirmation
        asset-card.tsx              ← Photo card with status badge
        placement-selector.tsx      ← "Where should this go on site?"
    marketing/
      dynamic-gallery.tsx           ← Public gallery that reads from DB (replaces static data)
```

---

## THE AI INTERVIEW UX

This is the key product differentiator. It shouldn't feel like a form — it should feel like a conversation.

```
[Photo preview shown]

Agent: "Got it! Let me ask a few quick questions about this photo."

Step 1 — Photo type:
  ○ Patient result / before-after
  ○ Office or treatment room
  ○ Team member
  ○ Equipment

[If patient result selected →]

Step 2 — Consent:
  ☐ "I confirm I have written consent from this patient on file to use this photo on our website."

  Small text: "HIPAA requires written patient authorization before publishing clinical photos.
  This checkbox is your legal attestation. AK Dental is responsible for maintaining the signed form."

Step 3 — Service category:
  ○ Veneers  ○ Implants  ○ Whitening  ○ Crowns  ○ Smile Makeover
  ○ Orthodontics  ○ Other: [text field]

Step 4 — Before or After:
  ○ This is a BEFORE photo
  ○ This is an AFTER photo
  ○ This is a single result (no before/after pair)

Step 5 — Pair matching (if before or after):
  "Do you have the matching [BEFORE/AFTER] photo to pair with this one?"
  ○ Yes — let me upload it now
  ○ No — upload the other photo later
  ○ No — this is a standalone result

Step 6 — Case notes (optional):
  "Any notes about this case? (Internal only — patients won't see this)"
  [text area]

→ "All set! Your photo is queued for review. We'll publish it within 24 hours."
```

---

## NUSTACK ADMIN REVIEW UI

Located at `/dashboard/admin/media-review` — only visible to NuStack org members.

Each pending asset shows:
- Full-size photo preview
- AI description + tags
- AI placement suggestion
- Client-provided metadata
- Consent status (confirmed / not confirmed)
- Quality assessment
- One-click: **Approve** | **Reject** | **Edit Placement**

On Approve:
1. Move blob from `pending/` to `published/` path (or update status)
2. Update `media_assets.status = 'published'`
3. Set `published_at = now()`
4. The public gallery component reads from `media_assets where status = 'published'` — site updates instantly

On Reject:
1. Update `media_assets.status = 'rejected'`
2. Store rejection reason
3. Send Resend email to client: "We couldn't publish photo #3 — [reason]. Please re-upload with correction."

---

## PUBLIC SITE INTEGRATION (dynamic gallery)

Replace static placeholder arrays in `smile-gallery/page.tsx` with DB-backed data:

```typescript
// In page.tsx (server component)
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function SmileGalleryPage() {
  const supabase = createServerSupabaseClient();

  const { data: cases } = await supabase
    .from("media_assets")
    .select("*")
    .eq("practice_id", "ak-ultimate-dental")
    .eq("status", "published")
    .eq("photo_type", "patient_result")
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false });

  // Render gallery with real photos
}
```

Same pattern for homepage, about page, team page — wherever photos are needed.

---

## MULTI-ENGINE DEPLOYMENT

This module ships as part of the NuStack engine standard. Every engine gets it.

| Engine | Primary Use Case | Photo Types |
|---|---|---|
| AK Dental | Before/after gallery, team, office | patient_result, team, office |
| Little Roots Studio | Color transformations, cuts, styles | client_result, team, salon |
| MindStar Counseling | Office photos ONLY (no patient photos) | office, team |
| Equipment Rental | Equipment condition, project sites | equipment, project_site |
| Men's Health | Office, team, before/after (approved cases) | patient_result, team, office |

**Config in `engine.ts` per client:**
```typescript
mediaConfig: {
  allowPatientPhotos: true,        // false for mental health
  requireConsentCheckbox: true,    // always true when allowPatientPhotos = true
  photoCategories: ["veneers", "implants", "whitening", "crowns", "smile_makeover"],
  placements: ["smile_gallery", "homepage", "services/porcelain-veneers"],
  maxFileSizeMB: 20,
  allowedFormats: ["jpg", "jpeg", "png", "webp", "heic"],
  reviewSLA: "24 hours",           // What we promise clients
}
```

---

## BUILD ORDER

### Phase 1 — Foundation (AK Dental, 1 sprint)
- [ ] Supabase migration 034: `media_assets` table + RLS
- [ ] Vercel Blob upload API route (`/api/media/upload`)
- [ ] Claude Vision analyze route (`/api/ai/analyze-media`)
- [ ] Client upload page with dropzone + AI interview
- [ ] Dashboard media list view (`/dashboard/media`)
- [ ] NuStack admin review queue (`/dashboard/admin/media-review`)
- [ ] Approve/reject workflow + Resend notifications

### Phase 2 — Public Site Integration (AK Dental)
- [ ] Convert `smile-gallery/page.tsx` to read from `media_assets` DB
- [ ] Convert homepage team photo to read from `media_assets`
- [ ] HEIC → JPEG conversion on upload (iPhone photos are HEIC)
- [ ] Before/after pair matching logic (link before UUID ↔ after UUID)

### Phase 3 — Polish + Multi-Engine
- [ ] Port to Little Roots Studio (`client_result` category → hair/color transformations)
- [ ] Port to all other engines (flip `allowPatientPhotos` flag per engine)
- [ ] Bulk upload (up to 10 photos at once, sequential AI interviews)
- [ ] Reorder / feature-flag published assets (drag to sort in dashboard)
- [ ] Client notification emails: "Your photo was published!" with preview

### Phase 4 — Advanced (future)
- [ ] Before/after slider component on public gallery (Embla or CSS)
- [ ] AI auto-generates alt text + SEO description for each photo
- [ ] AI suggests blog post ideas based on uploaded case photos
- [ ] Watermark removal / privacy blur for identifiable backgrounds

---

## HIPAA / COMPLIANCE CHECKLIST

- [x] Written consent required before publishing any patient photo
- [x] Consent confirmed by named user (Clerk user ID) at specific timestamp
- [x] Consent attestation is immutable in DB (no edit after confirm)
- [x] Photos stored encrypted at rest (Vercel Blob default)
- [x] Access controlled by RLS — clients only see their own practice assets
- [x] NuStack has BAA with each client (already signed — corporate-docs project)
- [x] Rejection + audit trail logged per asset
- [x] No PHI stored in photo metadata (case_notes field — internal only, never published)
- [ ] Physical consent forms retained by the dental practice (their responsibility)
- [ ] Option to delete/retract a published photo if patient withdraws consent (Phase 3)

---

## ENV VARS NEEDED

```env
# Already in ak-dental-website:
BLOB_READ_WRITE_TOKEN=        # Vercel Blob — already set
ANTHROPIC_API_KEY=            # Claude Vision — already set
NEXT_PUBLIC_SUPABASE_URL=     # Already set
SUPABASE_SERVICE_ROLE_KEY=    # Already set

# New:
MEDIA_REVIEW_NOTIFY_EMAIL=brad@nustack.digital   # Who gets notified for review
MEDIA_REVIEW_SLACK_WEBHOOK=                      # Optional Slack notification
```

---

## WHAT MAKES THIS VALUABLE AS A PRODUCT FEATURE

For NuStack clients:
- They can update their own website content without calling us
- The AI does the categorization — they don't need to think about "where does this go"
- Consent capture protects them legally (HIPAA attestation trail)
- Status visibility: they see pending / approved / published in real time

For NuStack:
- We maintain editorial control — nothing goes live without approval
- Builds the gallery over time without manual intervention
- Same module across all engines = build once, ship everywhere
- Becomes a genuine product feature in client pitches: "Your site updates itself as you work"

---

## NEXT ACTION

Run: `/ralph-big Build the NuStack Media Upload Tool — Phase 1 + Phase 2 for AK Dental.
Follow MEDIA-UPLOAD-TOOL-SPEC.md exactly. Start with Supabase migration, then API routes,
then client upload UI with AI interview, then admin review queue, then convert smile-gallery to DB-backed.`

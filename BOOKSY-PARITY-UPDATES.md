# Booksy Parity Updates — AK Dental
> Generated: 2026-03-13
> Source: 12 features built in littleroots-studio (migration 034 + UI work)
> Terminology: service → treatment type / appointment type, client → patient, stylist → provider/doctor

---

## Applicable Features (7 of 12)

### Feature 2 — Treatment Variants (HIGH)
**What it is:** One treatment type has multiple price/duration options (e.g., "Crown" → Porcelain / Zirconia / PFM with different prices and chair times).
**Why it applies:** AK Dental already has `oe_appointment_types`. Variants let providers offer Good/Better/Best tiers within a single procedure name — aligns directly with the chairside proposal system (Good/Better/Best tiering).
**Current state:** `oe_appointment_types` has `default_fee` and `duration_minutes` — single values only.
**DB change:**
```sql
-- Migration: add to ak-dental-website
CREATE TABLE IF NOT EXISTS oe_treatment_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_type_id UUID NOT NULL REFERENCES oe_appointment_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                          -- 'Porcelain', 'Zirconia', 'PFM'
  price NUMERIC(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE oe_treatment_variants ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_oe_treatment_variants_type ON oe_treatment_variants(appointment_type_id);
```
**UI:** Add "Variants" tab to treatment type editor (already has editor at `/dashboard/settings/appointment-types`). If variants exist, booking/proposal flow shows variant selector before confirming.

---

### Feature 3 — Per-Treatment Processing Time (HIGH)
**What it is:** Prep time / patient-free processing window / finish time split on a procedure.
**Why it applies:** Dental operatories work exactly like this — set, wait for impression, finish. Impacts room availability and scheduling optimization.
**Current state:** `oe_appointment_types` has `buffer_after_minutes` but no prep/processing split.
**DB change:**
```sql
ALTER TABLE oe_appointment_types
  ADD COLUMN IF NOT EXISTS prep_time_minutes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS processing_time_minutes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS finish_time_minutes INTEGER NOT NULL DEFAULT 0;
-- Note: total chair time = prep + (duration_minutes) + finish + buffer_after_minutes
-- processing_time_minutes is patient-free window (overlappable with another patient)
```
**UI:** In treatment type editor Settings tab, show "Processing time split" with 3 fields. Show visual timeline: [Prep ██] [Procedure ██████] [Processing/patient free ███] [Finish ██].

---

### Feature 4 — Per-Treatment No-Show Protection (HIGH)
**What it is:** Deposit % or cancellation fee set per treatment type, overriding global setting.
**Why it applies:** AK Dental already has global no-show protection logic. Per-treatment override is critical for high-cost procedures (implants, veneers) that need 100% deposit while cleanings stay at 0%.
**Current state:** Global no-show settings exist. No per-treatment override.
**DB change:**
```sql
ALTER TABLE oe_appointment_types
  ADD COLUMN IF NOT EXISTS noshow_protection_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS noshow_protection_type TEXT NOT NULL DEFAULT 'deposit',
  -- CHECK (noshow_protection_type IN ('deposit', 'cancellation_fee'))
  ADD COLUMN IF NOT EXISTS noshow_deposit_type TEXT NOT NULL DEFAULT 'percent',
  -- CHECK (noshow_deposit_type IN ('percent', 'fixed'))
  ADD COLUMN IF NOT EXISTS noshow_deposit_value INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS noshow_cancellation_fee_cents INTEGER NOT NULL DEFAULT 0;
```
**UI:** Add "No-Show Protection" tab to treatment type editor. Toggle ON/OFF, then deposit % or cancellation fee. Show: "Overrides global setting when enabled."

---

### Feature 5 — Per-Treatment Patient Intake Questions (MEDIUM)
**What it is:** Custom questions shown to patient at online booking for that specific treatment.
**Why it applies:** "Do you have allergies to latex?" for extractions. "Are you currently on blood thinners?" for surgery. Different from the global health intake.
**Current state:** Global intake form system exists. No per-treatment questions.
**DB change:**
```sql
CREATE TABLE IF NOT EXISTS oe_treatment_intake_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_type_id UUID NOT NULL REFERENCES oe_appointment_types(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'text',
  -- CHECK (question_type IN ('text', 'textarea', 'yes_no', 'select', 'checkbox'))
  options JSONB,          -- for 'select' and 'checkbox' types
  is_required BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE oe_treatment_intake_questions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_oe_treatment_intake_q_type ON oe_treatment_intake_questions(appointment_type_id);
```
**UI:** "For Patient" tab in treatment type editor. "+ Add Question" button. Answers saved to `oe_appointments.intake_responses JSONB` (add column if not exists).

---

### Feature 6 — FAB Button on Calendar (MEDIUM)
**What it is:** Floating action button on calendar that expands to: New Appointment / Add Time Block / Add Time Off.
**Why it applies:** AK Dental calendar is a primary work surface for front desk. FAB is a major UX upgrade — eliminates searching for "add appointment" in the nav.
**Current state:** Calendar exists. New appointment is triggered differently.
**DB change:** None — UI only.
**UI:** Add `<CalendarFAB />` component to calendar page. Radial expand on click with 3 options. Use `+` icon (Plus from lucide-react). Position: bottom-right, z-50. Options:
- "New Appointment" → opens new appointment slide panel
- "Add Time Block" → opens block time modal
- "Add Time Off" → opens time off modal
Component pattern: copy from `littleroots-studio/src/components/calendar/fab.tsx`.

---

### Feature 8 — Marketing Automation Library UI (MEDIUM)
**What it is:** Browsable card library of automation templates organized by category.
**Why it applies:** AK Dental has a remarketing/outreach system (`oe_outreach_workflows`). The Library UI is the missing front-end — currently operators don't know what automations exist.
**Current state:** `oe_outreach_workflows` table exists. No browsable UI.
**Categories for dental:**
- First Impression (new patient welcome, post-first-visit follow-up, birthday)
- Reactivate (missed 6-month recall, lapsed 12+ months, incomplete treatment plan)
- Reminders (appointment reminder 48h, 24h, same day, post-op check-in)
- Insurance (verification reminder, benefits expiring, EOB received)
**DB change:** None for Phase 1 — use existing `oe_outreach_workflows` with `category` column.
```sql
ALTER TABLE oe_outreach_workflows
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'reminders',
  ADD COLUMN IF NOT EXISTS library_description TEXT,
  ADD COLUMN IF NOT EXISTS is_library_template BOOLEAN NOT NULL DEFAULT false;
```
**UI:** Add `/dashboard/marketing` page with card grid. Categories as horizontal filter pills. Each card: title, description, status badge (Active/Inactive), toggle. Click → configure workflow. Copy card grid pattern from `littleroots-studio/src/app/(dashboard)/dashboard/campaigns/page.tsx`.

---

### Feature 12 — Calendar Filter Panel (MEDIUM)
**What it is:** Side panel on calendar to filter by payment status, appointment status, provider, starred.
**Why it applies:** AK Dental calendar with multiple providers needs filter panel — especially "unpaid" filter for front desk to flag unpaid appointments.
**Current state:** Calendar exists. No filter panel.
**DB change:** None — filtering is done client-side against existing data.
**Filter options for dental:**
- Payment: Paid / Unpaid / Insurance Pending
- Appointment Status: Scheduled / Confirmed / In Progress / Completed / No Show / Cancelled
- Provider: (list from `oe_providers` or Clerk users)
- Starred: Starred only
**UI:** Collapsible left panel on calendar page. Pill checkboxes. Persist filters in `localStorage`. Pass active filters as URL params for shareable filtered views.

---

## Features NOT Applicable to AK Dental

| Feature | Reason |
|---------|--------|
| #1 Service color picker | AK Dental already has `color` on `oe_appointment_types` (migration 024). Already done. |
| #7 Promotions as 4 named products | Not relevant to dental — no flash sales or happy hours for medical procedures. |
| #9 Checkout POS left category menu | Dental POS is different — insurance/self-pay, not a multi-category retail POS. |
| #10 Profile completeness score | Already has onboarding wizard + launch checklist. Not needed. |
| #11 Payment settings as card grid | AK Dental payment settings already organized differently. Low value. |

---

## Implementation Order

1. **Feature 4 (No-Show Protection per treatment)** — go-live blocker for high-value procedures
2. **Feature 3 (Processing time split)** — impacts scheduling accuracy immediately
3. **Feature 6 (FAB on calendar)** — front desk UX win, UI only, fast to ship
4. **Feature 2 (Treatment Variants)** — aligns with Good/Better/Best proposal system
5. **Feature 12 (Calendar filter panel)** — multi-provider ops need this
6. **Feature 5 (Per-treatment intake questions)** — clinical accuracy
7. **Feature 8 (Marketing automation library UI)** — front-end only, deferred

---

## Migration File to Create

File: `supabase/migrations/053_booksy_parity.sql`

```sql
-- Migration 053: Booksy Parity — Per-Treatment Variants, Processing Time, No-Show, Intake Questions

-- Treatment variants
CREATE TABLE IF NOT EXISTS oe_treatment_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_type_id UUID NOT NULL REFERENCES oe_appointment_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE oe_treatment_variants ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_oe_treatment_variants_type ON oe_treatment_variants(appointment_type_id);

-- Processing time split on appointment types
ALTER TABLE oe_appointment_types
  ADD COLUMN IF NOT EXISTS prep_time_minutes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS processing_time_minutes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS finish_time_minutes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS noshow_protection_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS noshow_protection_type TEXT NOT NULL DEFAULT 'deposit',
  ADD COLUMN IF NOT EXISTS noshow_deposit_type TEXT NOT NULL DEFAULT 'percent',
  ADD COLUMN IF NOT EXISTS noshow_deposit_value INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS noshow_cancellation_fee_cents INTEGER NOT NULL DEFAULT 0;

-- Per-treatment intake questions
CREATE TABLE IF NOT EXISTS oe_treatment_intake_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_type_id UUID NOT NULL REFERENCES oe_appointment_types(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'text',
  options JSONB,
  is_required BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE oe_treatment_intake_questions ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_oe_treatment_intake_q_type ON oe_treatment_intake_questions(appointment_type_id);

-- Marketing automation library columns
ALTER TABLE oe_outreach_workflows
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'reminders',
  ADD COLUMN IF NOT EXISTS library_description TEXT,
  ADD COLUMN IF NOT EXISTS is_library_template BOOLEAN NOT NULL DEFAULT false;
```

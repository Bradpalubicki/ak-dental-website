# AK Dental — Staff Training Build Spec
**Read alongside BUILD-PROMPT.md Phase 4**
**Generated: 2026-03-03**

---

## CURRENT STATE

### What Exists (Phase 2 — Message Templates)

| Item | Status | Notes |
|---|---|---|
| `src/config/message-templates.ts` | EXISTS | All 18 templates defined, typed, grouped |
| `supabase/migrations/040_message_templates_and_call_logs.sql` | EXISTS | Creates `oe_message_templates`, `oe_call_logs`, RLS, seeds all 18 templates |
| `src/app/dashboard/message-templates/page.tsx` | EXISTS | Server component, loads DB + falls back to config |
| `src/app/dashboard/message-templates/message-templates-client.tsx` | EXISTS | Client-side approval UI |

Phase 2 is complete. The message-templates system mirrors MindStar exactly — same pattern, oe_ prefix, 18 templates instead of 15.

### What Exists (Phase 3 — Test Mode + Launch Checklist)

| Item | Status | Notes |
|---|---|---|
| `src/app/api/settings/test-mode/route.ts` | EXISTS | GET + POST with admin RBAC enforcement |
| `src/components/dashboard/test-mode-banner.tsx` | EXISTS | Amber banner, dismissable |
| `src/app/dashboard/launch-checklist/page.tsx` | EXISTS | Full checklist page |
| `src/app/dashboard/launch-checklist/launch-checklist-client.tsx` | EXISTS | Client component |
| `src/lib/services/test-mode.ts` | EXISTS | References `oe_settings` table |

### What Is Missing (no migration SQL found)

| Table | Status |
|---|---|
| `oe_settings` | MISSING from migrations — referenced in code but no `create table` found |
| `oe_test_log` | MISSING from migrations — referenced but not created |
| `oe_training_completions` | MISSING from migrations — not created anywhere |
| `oe_cron_log` | MISSING from migrations — not created anywhere |

### What Is Missing (Phase 4 — Staff Training)

| Item | Status |
|---|---|
| `src/app/dashboard/training/hipaa/` | MISSING — no directory, no route |
| `src/app/dashboard/training/osha/` | MISSING — no directory, no route |
| `src/app/dashboard/training/staff/` | MISSING — no directory, no route |
| `src/app/api/training/` | MISSING — no API routes for completions |
| `src/app/api/team/invite/` | MISSING — no Clerk invitation API route |
| `src/app/dashboard/onboarding/` | CHECK — BUILD-PROMPT.md Phase 4A references `/dashboard/onboarding` with role-specific steps — verify if exists |
| RBAC enforcement in `src/proxy.ts` | MISSING — proxy.ts only does Clerk auth.protect(), no role-based route guarding |
| `oe_settings` migration | MISSING |
| `oe_test_log` migration | MISSING |
| `oe_training_completions` migration | MISSING |
| `oe_cron_log` migration | MISSING |

### Current `src/app/dashboard/training/page.tsx` — what it is

The existing training page is a CE (Continuing Education) tracker with tabs: CE Courses, Staff CE Tracker, Compliance Training, Board Reporting. It integrates with Viva Learning and CE Broker. This is a DIFFERENT concern than the role-based onboarding training in Phase 4. The Phase 4 training system (HIPAA quiz, OSHA quiz, platform modules, staff tracker) needs to live at `/dashboard/training/hipaa`, `/dashboard/training/osha`, `/dashboard/training/staff` as sub-routes — the existing `/dashboard/training` page stays as-is.

---

## WHAT NEEDS TO BE BUILT

This document is self-contained. A developer can build everything listed below without reading BUILD-PROMPT.md.

### Summary of Phase 4 Deliverables

1. Database migration — 4 missing tables with seed data
2. `/dashboard/onboarding` — role-specific first-login wizard (5 role paths)
3. `/dashboard/training/hipaa` — HIPAA quiz (5 questions, pass = 4/5)
4. `/dashboard/training/osha` — OSHA quiz (5 questions, pass = 5/5, clinical roles only)
5. `/dashboard/training/staff` — training tracker table (admin/global_admin only)
6. Platform training modules integrated into existing `/dashboard/training` or new sub-pages
7. `/api/training/complete` — POST route to record completions
8. `/api/training/status` — GET route for current user's completion state
9. `/api/team/invite` — POST route to send Clerk org invitations
10. Middleware RBAC for route-level access control

---

## CLERK METADATA SCHEMA

All role + training state lives in Clerk `publicMetadata`. Never store auth state in Supabase.

```typescript
// Clerk publicMetadata shape for AK Dental users
interface AKDentalUserMetadata {
  role: "owner-dentist" | "associate-dentist" | "office-manager" | "front-desk" | "dental-assistant";
  authorityLevel: "global_admin" | "admin" | "manager" | "staff";
  onboarding_complete: boolean;
  hipaa_trained_at: string | null;    // ISO 8601 timestamp or null
  osha_trained_at: string | null;     // ISO 8601 timestamp or null — clinical roles only
  note_template_preference: string;   // CDT code string e.g. "D0120"
}

// Role → authorityLevel mapping:
// owner-dentist      → admin (or global_admin for Dr. Chireau himself)
// associate-dentist  → manager
// office-manager     → manager
// front-desk         → staff
// dental-assistant   → staff

// Clinical roles (require OSHA training):
// owner-dentist | associate-dentist | dental-assistant

const CLINICAL_ROLES = ["owner-dentist", "associate-dentist", "dental-assistant"] as const;
```

---

## MIGRATION SQL

Create file: `supabase/migrations/041_settings_training_testlog.sql`

```sql
-- Migration 041: Settings, Test Log, Training Completions, Cron Log
-- Phase 3 + Phase 4 support tables

-- oe_settings: key-value store for practice-wide settings
-- Used by: test-mode, launch checklist, cron configuration
create table if not exists oe_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  updated_at timestamptz default now(),
  updated_by text
);

alter table oe_settings enable row level security;

create policy "Authenticated users can read settings"
  on oe_settings for select
  using (auth.role() = 'authenticated');

create policy "Admins can update settings"
  on oe_settings for update
  using (auth.jwt() ->> 'authorityLevel' in ('admin', 'global_admin'));

create policy "Service role can insert settings"
  on oe_settings for insert
  with check (true);

-- Seed defaults
insert into oe_settings (key, value) values
  ('test_mode', 'true'),
  ('test_phone', ''),
  ('test_email', '')
on conflict (key) do nothing;


-- oe_test_log: log all sends that go to test phone/email instead of patients
create table if not exists oe_test_log (
  id uuid primary key default gen_random_uuid(),
  template_type text not null,
  channel text not null check (channel in ('sms', 'email', 'both')),
  destination text not null,        -- test phone or test email
  body_preview text,                -- first 200 chars of message
  cron_job text,                    -- which cron triggered this
  patient_id uuid,                  -- patient it would have gone to (masked)
  created_at timestamptz default now()
);

alter table oe_test_log enable row level security;

create policy "Admins can read test logs"
  on oe_test_log for select
  using (auth.jwt() ->> 'authorityLevel' in ('admin', 'global_admin'));

create policy "Service role can insert test logs"
  on oe_test_log for insert
  with check (true);


-- oe_training_completions: tracks HIPAA quiz, OSHA quiz, platform modules per user
create table if not exists oe_training_completions (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  module text not null,             -- 'hipaa' | 'osha' | 'scheduling_insurance' | 'clinical_docs' | 'treatment_plan' | 'collections'
  score int,                        -- number of correct answers
  total_questions int,              -- total questions in quiz
  passed boolean not null default false,
  attempts int not null default 1,
  completed_at timestamptz default now(),
  unique(clerk_user_id, module)     -- one row per user per module, upsert on retry
);

alter table oe_training_completions enable row level security;

create policy "Users can read own completions"
  on oe_training_completions for select
  using (clerk_user_id = auth.jwt() ->> 'sub');

create policy "Admins can read all completions"
  on oe_training_completions for select
  using (auth.jwt() ->> 'authorityLevel' in ('admin', 'global_admin'));

create policy "Service role can insert/update completions"
  on oe_training_completions for insert
  with check (true);

create policy "Service role can update completions"
  on oe_training_completions for update
  using (true);


-- oe_cron_log: tracks each cron job run for debugging and launch checklist
create table if not exists oe_cron_log (
  id uuid primary key default gen_random_uuid(),
  job_name text not null,           -- 'reminders' | 'recall' | 'daily_briefing' | 'no_show' | 'reactivation' | 'data_retention' | 'email_alerts' | 'email_style_refresh'
  status text not null check (status in ('running', 'success', 'error')),
  records_processed int default 0,
  messages_sent int default 0,
  error_message text,
  test_mode boolean default false,
  started_at timestamptz default now(),
  finished_at timestamptz
);

alter table oe_cron_log enable row level security;

create policy "Admins can read cron logs"
  on oe_cron_log for select
  using (auth.jwt() ->> 'authorityLevel' in ('admin', 'global_admin'));

create policy "Service role can insert cron logs"
  on oe_cron_log for insert
  with check (true);

create policy "Service role can update cron logs"
  on oe_cron_log for update
  using (true);
```

---

## HIPAA QUIZ QUESTIONS

5 questions. Pass = 4 out of 5. Wrong answers shown on fail. Immediate retry allowed.
On pass: set `hipaa_trained_at` in Clerk metadata + upsert row in `oe_training_completions`.

```typescript
const HIPAA_QUESTIONS = [
  {
    id: "h1",
    question: "A patient asks you via text message to confirm their next appointment. Can you reply with the date and time?",
    options: [
      { id: "a", text: "Yes, they texted first" },
      { id: "b", text: "Only if they've signed a HIPAA authorization for texting", correct: true },
      { id: "c", text: "Yes always" },
      { id: "d", text: "No, never respond to texts" },
    ],
  },
  {
    id: "h2",
    question: "You finish treating a patient and their spouse is in the waiting room. Can you tell the spouse what was done?",
    options: [
      { id: "a", text: "Yes, they're family" },
      { id: "b", text: "Yes if the patient is present" },
      { id: "c", text: "No — only with the patient's explicit written authorization", correct: true },
      { id: "d", text: "Yes for routine procedures" },
    ],
  },
  {
    id: "h3",
    question: "A patient's employer calls asking if the patient was seen today for a dental emergency. What do you say?",
    options: [
      { id: "a", text: "Confirm they were seen" },
      { id: "b", text: "Say they had a dental emergency" },
      { id: "c", text: "\"I can neither confirm nor deny whether this person is a patient\"", correct: true },
      { id: "d", text: "Tell them to call back tomorrow" },
    ],
  },
  {
    id: "h4",
    question: "How must you dispose of a printed patient record you no longer need?",
    options: [
      { id: "a", text: "Regular trash" },
      { id: "b", text: "Recycling bin" },
      { id: "c", text: "Shred it (cross-cut shredding required)", correct: true },
      { id: "d", text: "Delete it digitally and trash the paper" },
    ],
  },
  {
    id: "h5",
    question: "Under HIPAA, who owns the patient's medical records?",
    options: [
      { id: "a", text: "The patient" },
      { id: "b", text: "The practice — but patients have the right to access and receive copies", correct: true },
      { id: "c", text: "The insurance company" },
      { id: "d", text: "Both the practice and patient equally" },
    ],
  },
];
```

---

## OSHA QUIZ QUESTIONS

5 questions. Pass = 5 out of 5 (no margin — regulatory requirement). Must retake entire quiz if any wrong.
Required for clinical roles only: `owner-dentist`, `associate-dentist`, `dental-assistant`.
On pass: set `osha_trained_at` in Clerk metadata + upsert row in `oe_training_completions`.

```typescript
const OSHA_QUESTIONS = [
  {
    id: "o1",
    question: "After a needlestick injury, your first action should be:",
    options: [
      { id: "a", text: "Wash the area with soap and water, report immediately to supervisor", correct: true },
      { id: "b", text: "Apply a bandage and continue working" },
      { id: "c", text: "Wait to see if symptoms develop" },
      { id: "d", text: "Report at end of shift" },
    ],
  },
  {
    id: "o2",
    question: "Dental masks must be changed:",
    options: [
      { id: "a", text: "Once per day" },
      { id: "b", text: "Between patients or when visibly soiled/wet", correct: true },
      { id: "c", text: "Once per week" },
      { id: "d", text: "Only when treating high-risk patients" },
    ],
  },
  {
    id: "o3",
    question: "Bloodborne pathogens training is required:",
    options: [
      { id: "a", text: "Once ever" },
      { id: "b", text: "Every 3 years" },
      { id: "c", text: "Annually", correct: true },
      { id: "d", text: "Only for new employees" },
    ],
  },
  {
    id: "o4",
    question: "Used sharps (needles, scalpels) must be disposed of in:",
    options: [
      { id: "a", text: "A puncture-resistant sharps container", correct: true },
      { id: "b", text: "A biohazard bag" },
      { id: "c", text: "Regular trash" },
      { id: "d", text: "A sealed plastic bag" },
    ],
  },
  {
    id: "o5",
    question: "The written Exposure Control Plan must be reviewed:",
    options: [
      { id: "a", text: "Every 5 years" },
      { id: "b", text: "Only after an incident" },
      { id: "c", text: "At least annually and when procedures change", correct: true },
      { id: "d", text: "Only when a new employee is hired" },
    ],
  },
];
```

---

## PHASE BUILD ORDER

Execute in this exact order. Each step unblocks the next.

### Step 1 — Database Migration (30 min)

File: `supabase/migrations/041_settings_training_testlog.sql`
Content: Full SQL from the MIGRATION SQL section above.
Run: `supabase db push` or paste into Supabase SQL editor.

Verifies: `oe_settings`, `oe_test_log`, `oe_training_completions`, `oe_cron_log` tables exist.

### Step 2 — API: Training Complete (45 min)

File: `src/app/api/training/complete/route.ts`

```typescript
// POST /api/training/complete
// Body: { module: string, score: number, total: number, passed: boolean }
// On pass for 'hipaa': update Clerk publicMetadata { hipaa_trained_at: new Date().toISOString() }
// On pass for 'osha': update Clerk publicMetadata { osha_trained_at: new Date().toISOString() }
// Always: upsert into oe_training_completions

import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  module: z.enum(["hipaa", "osha", "scheduling_insurance", "clinical_docs", "treatment_plan", "collections"]),
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  passed: z.boolean(),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { module, score, total, passed } = body.data;
  const supabase = createServiceSupabase();

  // Upsert completion record
  await supabase.from("oe_training_completions").upsert({
    clerk_user_id: userId,
    module,
    score,
    total_questions: total,
    passed,
    completed_at: new Date().toISOString(),
  }, { onConflict: "clerk_user_id,module" });

  // Update Clerk metadata on pass
  if (passed) {
    const metadataUpdate: Record<string, string> = {};
    if (module === "hipaa") metadataUpdate.hipaa_trained_at = new Date().toISOString();
    if (module === "osha") metadataUpdate.osha_trained_at = new Date().toISOString();

    if (Object.keys(metadataUpdate).length > 0) {
      await (await clerkClient()).users.updateUserMetadata(userId, {
        publicMetadata: metadataUpdate,
      });
    }
  }

  return NextResponse.json({ success: true });
}
```

### Step 3 — API: Training Status (20 min)

File: `src/app/api/training/status/route.ts`

```typescript
// GET /api/training/status
// Returns current user's training completion state from oe_training_completions
// Used by: onboarding flow, training page, staff tracker

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("oe_training_completions")
    .select("*")
    .eq("clerk_user_id", userId);

  return NextResponse.json({ completions: data || [] });
}
```

### Step 4 — API: Team Invite (30 min)

File: `src/app/api/team/invite/route.ts`

```typescript
// POST /api/team/invite
// Body: { email: string, role: AKDentalRole, firstName?: string }
// Sends Clerk organization invitation with role in public metadata
// Only admin/global_admin can call this

import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

const DENTAL_ROLES = ["owner-dentist", "associate-dentist", "office-manager", "front-desk", "dental-assistant"] as const;

const ROLE_TO_AUTHORITY: Record<typeof DENTAL_ROLES[number], string> = {
  "owner-dentist": "admin",
  "associate-dentist": "manager",
  "office-manager": "manager",
  "front-desk": "staff",
  "dental-assistant": "staff",
};

const schema = z.object({
  email: z.string().email(),
  role: z.enum(DENTAL_ROLES),
  firstName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const level = (sessionClaims?.publicMetadata as Record<string, string>)?.authorityLevel;
  if (!["admin", "global_admin"].includes(level)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { email, role, firstName } = body.data;
  const clerk = await clerkClient();

  // Create user with metadata pre-set, or send invitation
  // For existing orgs, use organization invitations:
  const orgId = process.env.CLERK_ORG_ID!; // AK Dental org ID from env

  await clerk.organizations.createOrganizationInvitation({
    organizationId: orgId,
    emailAddress: email,
    role: "org:member",
    publicMetadata: {
      role,
      authorityLevel: ROLE_TO_AUTHORITY[role],
      onboarding_complete: false,
      hipaa_trained_at: null,
      osha_trained_at: null,
      note_template_preference: "",
    },
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/onboarding`,
  });

  return NextResponse.json({ success: true });
}
```

### Step 5 — Onboarding Middleware Check (20 min)

In `src/app/dashboard/layout.tsx` (server component), add onboarding redirect:

```typescript
// In the dashboard layout server component, after auth():
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Check onboarding_complete in publicMetadata
const user = await currentUser();
const meta = user?.publicMetadata as { onboarding_complete?: boolean } | undefined;
const pathname = headers().get("x-pathname") || "";

if (!meta?.onboarding_complete && !pathname.startsWith("/dashboard/onboarding")) {
  redirect("/dashboard/onboarding");
}
```

### Step 6 — Onboarding Page: `/dashboard/onboarding` (3-4 hours)

File: `src/app/dashboard/onboarding/page.tsx` (server component — reads Clerk user role)
File: `src/app/dashboard/onboarding/onboarding-client.tsx` (client component — multi-step wizard)

Render role-specific step arrays. Each step is a full-screen card with a "Next" button.
Final step calls `PATCH /api/user/onboarding-complete` to set `onboarding_complete: true` in Clerk metadata + redirects to `/dashboard`.

**Role step definitions:**

`owner-dentist` — 7 steps:
1. Practice confirmation — name, phone, address, hours. Pre-filled from `src/config/practice.ts`. Edit or confirm.
2. Voice AI setup — review receptionist greeting, after-hours message, set practice phone for Vapi.
3. Template review — show `reminder_24h`, `recall_6mo`, `review_request` inline. Link to `/dashboard/message-templates`.
4. Team setup — invite staff form: email + role dropdown. Calls `/api/team/invite`. Multiple invites.
5. Financial targets — set monthly production target + collections target. Saves to `oe_settings`.
6. Launch checklist intro — brief overview, link to `/dashboard/launch-checklist`.
7. Done — confetti, "Go to Dashboard" button.

`associate-dentist` — 7 steps:
1. Schedule review — confirm chair assignment and availability hours (display only, links to scheduling).
2. Clinical note templates — pick default procedure template from CDT list (D0120, D2140, D2160, etc.). Saves to Clerk metadata `note_template_preference`.
3. Treatment plan presentation walkthrough — explain `/treatments/[id]/present` iPad view with screenshot.
4. HIPAA reminder screen — summary of key rules (no quiz here, quiz is step 6).
5. Documentation requirements — "What you must sign before leaving each day" explainer.
6. HIPAA quiz — inline quiz (5 questions). Must pass 4/5 to continue. Calls `/api/training/complete`.
7. Done — badge shown if HIPAA passed.

`office-manager` — 6 steps:
1. Scheduling preferences — booking window (how far out patients can book), buffer time. Saves to `oe_settings`.
2. Insurance flow — explain how eligibility verification works at intake (diagram/explainer).
3. Approval queue walkthrough — show 3 demo messages in the approval queue. "Practice approving" (demo only, no real send).
4. Daily briefing setup — what time to receive the daily briefing email. Saves to `oe_settings`.
5. Collections dashboard walkthrough — tour of `/dashboard/financials` with callouts.
6. Done.

`front-desk` — 6 steps:
1. Patient check-in flow — how to find patient, confirm arrival, mark arrived, alert provider. Screenshots.
2. New booking — how patients book online + what dashboard items get created.
3. Insurance verification — where to see coverage status on the patient record.
4. Intake form monitoring — where new patient forms appear in the dashboard.
5. Access explanation — "What you can see vs. cannot" (no financials, no clinical notes, no HR). List format.
6. Done.

`dental-assistant` — 5 steps:
1. Pre-appointment chart pull — how to open patient chart before they arrive.
2. Clinical note assist — how AI pre-fills procedure notes and what must be manually verified.
3. Communication rules — what can and cannot be sent to patients (role limitations).
4. HIPAA quiz — inline quiz (5 questions). Must pass 4/5 to continue. Calls `/api/training/complete`.
5. Done — badge shown if HIPAA passed.

### Step 7 — HIPAA Quiz Page: `/dashboard/training/hipaa` (2 hours)

File: `src/app/dashboard/training/hipaa/page.tsx` (server — load current user's hipaa_trained_at from Clerk)
File: `src/app/dashboard/training/hipaa/hipaa-quiz-client.tsx` (client — quiz UI)

If already trained: show completion badge + date, option to retake.
If not trained: show quiz.

Quiz UI pattern:
- Progress bar (question X of 5)
- Question text (large)
- 4 radio button options (A-D)
- "Submit Answer" button (no skip)
- On submit: highlight correct (green) + incorrect (red)
- After all 5: show score
- If 4+/5: show "HIPAA Certified" badge. Call `POST /api/training/complete` with `{ module: "hipaa", score, total: 5, passed: true }`.
- If 3 or fewer: show wrong answers highlighted. "Retake Quiz" button. Increments `attempts` counter.

### Step 8 — OSHA Quiz Page: `/dashboard/training/osha` (2 hours)

File: `src/app/dashboard/training/osha/page.tsx`
File: `src/app/dashboard/training/osha/osha-quiz-client.tsx`

Same pattern as HIPAA quiz with two differences:
- Gate: only show if user's role is in `CLINICAL_ROLES` (`owner-dentist`, `associate-dentist`, `dental-assistant`). Non-clinical roles get a "Not required for your role" message.
- Pass threshold: 5/5 (not 4/5). Any missed answer = must retake entire quiz.
- On pass: call `POST /api/training/complete` with `{ module: "osha", score: 5, total: 5, passed: true }`.

### Step 9 — Platform Training Modules (2 hours)

These can be added as new tabs on the existing `/dashboard/training` page OR as separate sub-pages at `/dashboard/training/modules/[module]`. Separate pages are cleaner.

4 modules, each gated by role:

**Scheduling & Insurance** — `front-desk`, `office-manager`
File: `src/app/dashboard/training/modules/scheduling-insurance/page.tsx`
Content:
- Section 1: How appointment booking triggers reminders (flow diagram using divs/arrows)
- Section 2: How insurance eligibility check runs on intake
- Section 3: Where to see coverage issues in the dashboard (screenshot + callouts)
- Practice task: "Find the insurance status for Demo Patient A" — links to `/dashboard/patients` filtered to demo data
- "Mark Complete" button → `POST /api/training/complete { module: "scheduling_insurance", passed: true }`

**Clinical Documentation & CDT Codes** — `owner-dentist`, `associate-dentist`, `dental-assistant`
File: `src/app/dashboard/training/modules/clinical-docs/page.tsx`
Content:
- Section 1: Overview of CDT code system — what codes AK Dental uses most (D0120, D2140, D2750, D4341, etc.)
- Section 2: How to select the right procedure template from the dashboard
- Section 3: How AI pre-fills notes and what must be manually verified (required fields highlighted)
- Section 4: Signing requirements before end of day
- Practice task: "Open demo patient, select D0120, review pre-filled note" — links to demo patient record
- "Mark Complete" button → `POST /api/training/complete { module: "clinical_docs", passed: true }`

**Treatment Plan Presentation** — `owner-dentist`, `associate-dentist`
File: `src/app/dashboard/training/modules/treatment-plan/page.tsx`
Content:
- Section 1: How to generate a treatment plan from the dashboard
- Section 2: How to present on iPad at `/treatments/[id]/present` (screenshot of presentation view)
- Section 3: How patient acceptance is tracked in the system
- Section 4: What triggers the `treatment_accepted` and `treatment_plan_ready` message templates
- Practice task: "Open demo treatment plan and walk through the presentation view"
- "Mark Complete" button → `POST /api/training/complete { module: "treatment_plan", passed: true }`

**Collections & Financials** — `owner-dentist`, `office-manager`
File: `src/app/dashboard/training/modules/collections/page.tsx`
Content:
- Section 1: What the daily briefing email includes (annotated screenshot)
- Section 2: How to read production vs. collections in the analytics dashboard
- Section 3: How Stripe payments flow into the dashboard
- Section 4: Where to see outstanding balances and aging A/R
- Practice task: "Check last month's collections in the financials dashboard"
- "Mark Complete" button → `POST /api/training/complete { module: "collections", passed: true }`

### Step 10 — Staff Training Tracker: `/dashboard/training/staff` (2 hours)

File: `src/app/dashboard/training/staff/page.tsx` (server component)
File: `src/app/dashboard/training/staff/staff-tracker-client.tsx` (client component)

Access gate: only `admin` and `global_admin` can view. Others get 403 redirect.

Server component loads:
- All users in the Clerk org via `clerkClient().organizations.getOrganizationMembershipList({ organizationId })`
- All rows from `oe_training_completions` (service role, no RLS restriction)
- Join on `clerk_user_id`

Renders a table:

| Column | Content |
|---|---|
| Staff Member | Name + role badge |
| HIPAA | Badge: Certified (green) / Pending (amber) + date if certified |
| OSHA | Badge: Certified (green) / Not Required (slate) / Pending (amber) + date if certified |
| Platform Modules | X/4 or X/2 depending on role (only count relevant modules) |
| Onboarding | Complete (green) / Pending (amber) |
| Action | "Send Reminder" button |

Alert row (red background): clinical staff with `osha_trained_at = null` AND account age > 7 days.

"Send Reminder" button per row: calls `POST /api/training/remind` which sends email via Resend:
- Subject: "Complete your AK Dental training — action required"
- Body: "Hi [name], your training is incomplete. Complete it here: [link to /dashboard/training/hipaa or /dashboard/training/osha]"

---

## API ROUTES NEEDED

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/training/complete` | POST | Any authenticated | Record quiz/module completion, update Clerk metadata on HIPAA/OSHA pass |
| `/api/training/status` | GET | Any authenticated | Return current user's training completions from `oe_training_completions` |
| `/api/training/remind` | POST | admin/global_admin | Send reminder email to a specific staff member via Resend |
| `/api/training/staff-all` | GET | admin/global_admin | Return all staff completion data (joins Clerk org members + oe_training_completions) |
| `/api/team/invite` | POST | admin/global_admin | Send Clerk org invitation with role + metadata |
| `/api/user/onboarding-complete` | PATCH | Any authenticated | Set `onboarding_complete: true` in Clerk publicMetadata |
| `/api/settings/test-mode` | GET + POST | GET: any authenticated, POST: admin only | Toggle test mode — EXISTS ALREADY |

---

## ACCESS CONTROL MATRIX

| Route | owner-dentist | associate-dentist | office-manager | front-desk | dental-assistant |
|---|---|---|---|---|---|
| `/dashboard/training/hipaa` | Required | Required | Optional | Optional | Required |
| `/dashboard/training/osha` | Required | Required | Blocked (not required) | Blocked | Required |
| `/dashboard/training/staff` | Allowed | Blocked | Blocked | Blocked | Blocked |
| `/dashboard/training/modules/scheduling-insurance` | Optional | Blocked | Required | Required | Blocked |
| `/dashboard/training/modules/clinical-docs` | Required | Required | Blocked | Blocked | Required |
| `/dashboard/training/modules/treatment-plan` | Required | Required | Blocked | Blocked | Blocked |
| `/dashboard/training/modules/collections` | Required | Blocked | Required | Blocked | Blocked |
| `/dashboard/message-templates` | Full access | Read-only | Full access | Blocked | Blocked |
| `/dashboard/launch-checklist` | Full access | Blocked | View only | Blocked | Blocked |
| `/dashboard/settings` | Full access | Blocked | Limited | Blocked | Blocked |

Implement access control at the page/component level by reading `sessionClaims.publicMetadata.role` from `auth()`.
Redirect blocked users to `/dashboard` with a toast: "You don't have access to this page."

---

## PROXY.TS — CURRENT STATE + WHAT TO ADD

Current `src/proxy.ts` only calls `auth.protect()` — it checks Clerk auth but not roles.
Route-level RBAC is currently implemented per-page (each page reads the role from session claims and redirects).
This is acceptable for Phase 4 — no middleware rewrite needed. Keep per-page checks as described in the Access Control Matrix.

If you want middleware-level RBAC for clean enforcement (optional):

```typescript
// In clerkMiddleware callback, after auth.protect():
const { sessionClaims } = await auth();
const role = (sessionClaims?.publicMetadata as Record<string, string>)?.role;
const pathname = req.nextUrl.pathname;

// Protect admin-only routes
if (pathname.startsWith("/dashboard/training/staff") &&
    !["owner-dentist"].includes(role)) {
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
```

---

## KEY DIFFERENCES FROM MINDSTAR

| Concern | MindStar | AK Dental |
|---|---|---|
| Roles | therapist, admin, front-desk, billing | owner-dentist, associate-dentist, office-manager, front-desk, dental-assistant |
| OSHA training | Not required | Required for clinical roles (owner-dentist, associate-dentist, dental-assistant) |
| OSHA pass threshold | N/A | 5/5 (no margin — regulatory) |
| HIPAA pass threshold | 4/5 | 4/5 (same) |
| Table prefix | `ms_` | `oe_` |
| Settings table | `ms_settings` | `oe_settings` |
| Training table | `ms_training_completions` | `oe_training_completions` |
| Test log | `ms_test_log` | `oe_test_log` |
| Cron log | `ms_cron_log` | `oe_cron_log` |
| Message templates | 15 templates | 18 templates |
| Training modules | 3 modules | 4 modules |
| Platform-specific quiz content | Mental health HIPAA scenarios | Dental-specific HIPAA scenarios (PHI in text, spouse privacy, employer calls, record disposal, record ownership) |
| Onboarding path count | 4 role paths | 5 role paths |

---

## LAUNCH CHECKLIST STATUS

The `/dashboard/launch-checklist` page EXISTS. It references `oe_settings` which does not have a migration yet. Running migration 041 (Step 1 above) will fix the missing table and the launch checklist will work.

The training-related checklist items (all staff completed HIPAA training) require the `oe_training_completions` table which is also created in migration 041.

---

## ESTIMATED BUILD TIME

| Step | Time |
|---|---|
| Step 1: Migration | 30 min |
| Step 2: /api/training/complete | 45 min |
| Step 3: /api/training/status | 20 min |
| Step 4: /api/team/invite | 30 min |
| Step 5: Onboarding middleware check | 20 min |
| Step 6: /dashboard/onboarding (5 role paths) | 4 hours |
| Step 7: /dashboard/training/hipaa | 2 hours |
| Step 8: /dashboard/training/osha | 2 hours |
| Step 9: 4 platform training module pages | 2 hours |
| Step 10: /dashboard/training/staff tracker | 2 hours |
| Buffer + testing | 2 hours |
| **Total** | **~16 hours** |

---

*NuStack Digital Ventures — AK Dental Phase 4 build spec.*
*Generated: 2026-03-03. Read alongside BUILD-PROMPT.md Phase 4.*

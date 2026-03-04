# AK Dental Website — Go-Live Readiness Build Prompt
**Target: Client says yes → Live in 30 days**
**Generated: 2026-03-03**

---

## PROJECT INFO
- **Location:** `C:\Users\bradp\dev\ak-dental-website`
- **Supabase:** pivfajkousqthlfaqtwr
- **Client:** Dr. Alex Chireau — AK Ultimate Dental, Illinois
- **Domain:** akultimatedental.com (DNS not yet pointed to Vercel)
- **Stack:** Next.js 16, Supabase, Clerk, Twilio, Resend, Anthropic, Stripe, Vapi
- **See also:** `NEEDS-TO-FINISH.md` in project root for integration blockers

---

## WHAT'S ALREADY BUILT
- 60+ dashboard routes covering clinical, HR, scheduling, billing, analytics, SEO, training
- Approval queue — fully working for AI-generated lead responses + recall messages
- Cron jobs — 8 of 11 implemented (reminders, recall, lead nurture, daily briefing, reactivation, data retention, email alerts, email style refresh)
- RBAC — 4-tier authority levels (global_admin / admin / manager / staff) via Clerk
- Resend email — 8 pre-built templates, but FROM address still shows littleroots.studio
- Twilio SMS — wired and sending
- Stripe — treatment checkout working
- Vapi voice AI — code exists, no API key configured
- Gusto HR — OAuth callback routes built, needs client ID + secret
- Clinical note templates — 25+ CDT procedure codes, SOAP format, production-ready
- DEMO_MODE — seed data works, approval queue pre-populated

## WHAT'S MISSING (build in this order)

---

## PHASE 1 — CRITICAL BLOCKERS (fix before anything else)

### 1A. Resend Domain Fix

Current state: All outbound emails show `from: hello@littleroots.studio`. This will break
deliverability and confuse patients. Fix before any other email work.

Steps:
1. Log into Resend dashboard — add `akultimatedental.com` as a verified domain
2. Add the DKIM DNS records to akultimatedental.com (via GoDaddy API or manually)
   - GoDaddy API key is in `~/.claude/memory/credentials.md`
3. Once verified, update `src/lib/services/resend.ts`:
   - Change all `from:` fields from `hello@littleroots.studio` to `hello@akultimatedental.com`
   - Change all `replyTo:` fields accordingly
4. Send a test appointment confirmation to a NuStack test email — confirm sender shows correctly
5. Add `RESEND_FROM_EMAIL=hello@akultimatedental.com` to Vercel env vars

### 1B. Vapi Voice AI — Wire It

Code is in `src/lib/services/vapi.ts` — it returns null if no API key. The dashboard
routes and webhook handler exist. Just needs configuration.

Steps:
1. Add `VAPI_API_KEY` to Vercel environment (Brad gets this from Vapi dashboard)
2. In Vapi dashboard, create an assistant:
   - Name: "AK Dental Receptionist"
   - Voice: Professional female (Rachel or similar)
   - System prompt: fetch from `/api/vapi/system-prompt` (route exists — verify it returns correct practice info)
   - First message: "Thank you for calling AK Ultimate Dental. How can I help you today?"
   - End of call: "Thank you for calling AK Dental. We'll follow up with you shortly. Have a great day."
3. Wire `/api/webhooks/vapi/route.ts` — currently receives but does nothing useful:
   - Parse call transcript from Vapi webhook payload
   - Detect intent: `booking` | `cancel` | `question` | `emergency` | `other`
   - If intent = `booking`: create a lead record in `oe_leads` table (name, phone, source = 'vapi_call')
   - If intent = `cancel`: create a task for front desk
   - Save full transcript to `oe_call_logs` table (create if not exists)
4. Update `/dashboard/calls` to display real data:
   - Caller phone number (masked for HIPAA: show last 4 digits only)
   - Call duration
   - Detected intent badge
   - Transcript (expandable)
   - If intent = booking: link to the lead record created
5. Test: call the practice number, verify transcript appears in dashboard within 60 seconds

### 1C. Practice Config — Social Links

Open `src/config/practice.ts`. Add social media URLs:
```ts
social: {
  instagram: 'https://instagram.com/akultimatedental',  // verify URL is correct
  facebook: '',   // add if exists
  tiktok: '',     // add if exists
  youtube: '',    // add if exists
  google: 'https://g.page/...',  // Google Business profile link for review requests
}
```
Get the correct URLs from Alex or look up the actual profiles.
These populate: website footer, Google Business schema markup, review request templates, outreach email signatures.

### 1D. DNS — Point Domain to Vercel

Once Resend is verified and basic testing is done:
1. In GoDaddy: update akultimatedental.com A record to Vercel's IP (76.76.21.21)
2. Add CNAME for www
3. In Vercel: add akultimatedental.com as custom domain on the project
4. Verify SSL certificate issues automatically
5. Update all hardcoded URLs in config from `.vercel.app` to `akultimatedental.com`

---

## PHASE 2 — MESSAGE TEMPLATES + CLIENT APPROVAL FLOW

*AK Dental already has some templates in Resend and Twilio — this phase standardizes them,
adds missing ones, and builds the approval UI so Dr. Chireau can review everything.*

### 2A. Build Dental Message Template Library

Create `src/config/message-templates.ts`.

Each template needs: `type`, `channel` (`'sms'`|`'email'`|`'both'`), `subject`, `body`, `approved` (default false).

**Merge fields:** `{{patient_name}}`, `{{practice_name}}`, `{{appointment_date}}`,
`{{appointment_time}}`, `{{provider_name}}`, `{{booking_link}}`, `{{cancel_link}}`,
`{{treatment_name}}`, `{{review_link}}`, `{{intake_link}}`, `{{payment_link}}`

**All 18 templates:**

| Type | Channel | When |
|---|---|---|
| `appointment_confirmation` | SMS + Email | Immediately on booking |
| `reminder_48h` | Email | 48h before |
| `reminder_24h` | SMS + Email | 24h before |
| `reminder_2h` | SMS | 2h before |
| `no_show_recovery_30m` | SMS | 30 min after missed — auto-send |
| `no_show_recovery_24h` | SMS | Next day — approval required |
| `new_patient_welcome` | Email | Immediately on new patient form submit |
| `intake_forms` | SMS | After new patient books, before first visit |
| `treatment_accepted` | Email | When patient accepts treatment plan |
| `treatment_followup` | SMS | 3 days post-procedure |
| `recall_6mo` | SMS + Email | 6 months after cleaning (no future appt) |
| `recall_overdue` | SMS | 9 months, still no next appointment |
| `insurance_verified` | SMS | Eligibility confirmed |
| `insurance_pending` | SMS | Coverage issue — needs attention |
| `review_request` | SMS | 24h after completed appointment |
| `referral_thank_you` | Email | When a patient refers someone |
| `treatment_plan_ready` | Email | When Dr. Chireau finalizes a plan |
| `payment_receipt` | Email | After Stripe payment processes |

**Voice:** Professional, modern, tech-forward — reflects AK Dental's brand. Clear and efficient.

**Sample copy:**

`reminder_24h` SMS:
> Hi {{patient_name}} — a reminder that you have an appointment at AK Ultimate Dental tomorrow at {{appointment_time}} with {{provider_name}}. Reply CONFIRM to confirm or CANCEL to reschedule. See you soon!

`recall_6mo` SMS:
> Hi {{patient_name}}! It's been 6 months since your last cleaning at AK Dental. Dr. Chireau recommends staying on schedule — book your next visit here: {{booking_link}} We look forward to seeing you!

`no_show_recovery_30m` SMS:
> Hi {{patient_name}}, we missed you at your {{appointment_time}} appointment today. We'd love to get you rescheduled — reply here or call us. We have availability this week.

`treatment_accepted` Email:
> Subject: Your Treatment Plan Is Confirmed — AK Ultimate Dental
> Hi {{patient_name}}, thank you for moving forward with your treatment plan. Dr. Chireau and the team are ready for you. Your appointment details: [date/time]. Any questions before then, just reply to this email.

`review_request` SMS:
> Hi {{patient_name}} — thank you for visiting AK Dental! If your experience was great, a quick Google review helps others find quality dental care: {{review_link}} Takes 60 seconds and means a lot to us.

### 2B. Database Migration

Create `supabase/migrations/[timestamp]_message_templates.sql`:

```sql
create table oe_message_templates (
  id uuid primary key default gen_random_uuid(),
  type text not null unique,
  channel text not null check (channel in ('sms', 'email', 'both')),
  subject text,
  body text not null,
  approved boolean default false,
  approved_at timestamptz,
  approved_by text,
  edited_from text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table oe_call_logs (
  id uuid primary key default gen_random_uuid(),
  vapi_call_id text,
  caller_phone_masked text,
  duration_seconds int,
  intent text,
  transcript text,
  lead_id uuid references oe_leads(id),
  created_at timestamptz default now()
);

alter table oe_message_templates enable row level security;
create policy "Authenticated users can read templates" on oe_message_templates
  for select using (auth.role() = 'authenticated');
create policy "Admins can update templates" on oe_message_templates
  for update using (auth.jwt() ->> 'authorityLevel' in ('admin', 'global_admin'));
```

Seed all 18 templates on migration run.

### 2C. Template Approval Dashboard

Build `/dashboard/message-templates` page.

Layout:
- Warning banner (amber) if unapproved templates exist: "X of 18 messages need your approval before automations run"
- Groups: Scheduling / Patient Intake / No-Show Recovery / Recall & Reactivation / Review & Referral / Financial
- Each template card:
  - Type label + channel badge + status badge (Pending / Approved / Edited & Approved)
  - Full body text (expandable)
  - Buttons: Edit · Test Send · Approve
- "Approve All" button — one click to approve all
- Edit: inline textarea, saves `edited_from`, resets to Pending until re-approved
- Test Send: sends to logged-in user's contact only
- Approve: logs approval with Clerk user ID + timestamp

---

## PHASE 3 — TEST MODE + PRE-LAUNCH CHECKLIST

### 3A. Test Mode

Add `test_mode` boolean to `oe_settings` table (or create if not exists).

When true:
- All cron sends go to `TEST_PHONE` and `TEST_EMAIL` env vars instead of patients
- Messages prepended with `[TEST]`
- Yellow chrome bar: `⚠ TEST MODE ACTIVE — messages not reaching patients`
- Log to `oe_test_log` table

Toggle in `/dashboard/settings` → "Go-Live Settings" section.
Only `admin` or `global_admin` authority level can toggle.

### 3B. Pre-Launch Checklist

Build `/dashboard/launch-checklist`. Auto-checks where possible.

```
INTEGRATIONS
☐ Resend — akultimatedental.com domain verified (check via Resend API)
☐ Twilio — test SMS sent and delivered
☐ Vapi — test call received, transcript in dashboard
☐ Stripe — $1 test payment processed and refunded
☐ Supabase — tables populated with at least 1 real patient

MESSAGE TEMPLATES
☐ All 18 templates approved (count approved = 18)
☐ Test: appointment_confirmation — received by test email
☐ Test: reminder_24h — received by test phone
☐ Test: intake_forms — received by test phone
☐ Test: recall_6mo — received by test phone

VOICE AI
☐ Vapi receptionist — test call logged in /dashboard/calls
☐ Booking intent detected correctly
☐ Lead auto-created from test call

STAFF SETUP
☐ Dr. Chireau — role: owner-dentist
☐ At least 1 front desk staff added
☐ All staff completed HIPAA training

COMPLIANCE
☐ HIPAA acknowledgment — signed
☐ TCPA consent — signed
☐ BAA on file (from corporate-docs project)

CRON JOBS (test runs in TEST_MODE)
☐ Reminders cron — test run, no errors
☐ Recall cron — test run, no errors
☐ Daily briefing — Dr. Chireau received test email

DNS + DOMAIN
☐ akultimatedental.com → Vercel (check DNS propagation)
☐ SSL certificate active
☐ All email links use akultimatedental.com (not vercel.app)

GO-LIVE GATE
☐ All above green
☐ TEST_MODE = false
☐ NuStack sign-off (manual checkbox)
```

Show completion %. Disable "Go Live" until 100%.
On go-live: email brad@nustack.digital + info@akultimatedental.com.

---

## PHASE 4 — STAFF TRAINING BY ROLE

AK Dental roles: `owner-dentist` | `associate-dentist` | `office-manager` | `front-desk` | `dental-assistant`

### 4A. First-Login Onboarding

Same pattern as MindStar: check `onboarding_complete` in Clerk publicMetadata on dashboard load.
Redirect to `/dashboard/onboarding` if not set. Render role-specific path.

**`owner-dentist` (Dr. Chireau)**
Step 1: Practice confirmation — name, phone, address, hours. Pre-filled. Confirm or edit.
Step 2: Voice AI setup — review receptionist greeting, after-hours message, set practice phone number for Vapi.
Step 3: Template review — 3 most important templates inline, link to full manager.
Step 4: Team setup — invite staff by email + role. Sends Clerk invites.
Step 5: Financial targets — set monthly production target + collections target (shows in analytics).
Step 6: Launch checklist intro.
Step 7: Done.

**`associate-dentist`**
Step 1: Schedule review — confirm chair assignments and availability hours.
Step 2: Clinical note templates — pick default procedure template (D0120 recall, D2140 filling, etc.).
Step 3: Treatment plan presentation walkthrough — how to present on iPad using `/treatments/[id]/present`.
Step 4: HIPAA reminder screen.
Step 5: Documentation requirements — what must be signed before leaving for the day.
Step 6: HIPAA quiz (mandatory).
Step 7: Done.

**`office-manager`**
Step 1: Scheduling preferences — booking window, buffer time between appointments.
Step 2: Insurance flow — how eligibility verification works at intake.
Step 3: Approval queue walkthrough — practice approving 3 demo messages.
Step 4: Daily briefing setup — what time to receive email.
Step 5: Collections dashboard walkthrough.
Step 6: Done.

**`front-desk`**
Step 1: Patient check-in flow — find patient → confirm → mark arrived → alert provider.
Step 2: New booking — how patients book online and what triggers in the dashboard.
Step 3: Insurance verification — where to see patient coverage status.
Step 4: Intake form monitoring — where new patient forms appear.
Step 5: What you can see vs. cannot (no financials, no clinical notes, no HR).
Step 6: Done.

**`dental-assistant`**
Step 1: Pre-appointment chart pull — how to open patient chart before they arrive.
Step 2: Clinical note assist — how AI pre-fills procedure notes and what needs verification.
Step 3: Communication rules — what can and cannot be sent to patients.
Step 4: HIPAA quiz (mandatory).
Step 5: Done.

### 4B. HIPAA Training Quiz

Build at `/dashboard/training/hipaa`. Same pattern as MindStar.
5 questions, pass = 4/5.

Questions:
1. "A patient asks you via text message to confirm their next appointment. Can you reply with the date and time?"
   A) Yes, they texted first  ✓B) Only if they've signed a HIPAA authorization for texting  C) Yes always  D) No, never respond to texts
2. "You finish treating a patient and their spouse is in the waiting room. Can you tell the spouse what was done?"
   A) Yes, they're family  B) Yes if the patient is present  ✓C) No — only with the patient's explicit written authorization  D) Yes for routine procedures
3. "A patient's employer calls asking if the patient was seen today for a dental emergency. What do you say?"
   A) Confirm they were seen  B) Say they had a dental emergency  ✓C) "I can neither confirm nor deny whether this person is a patient"  D) Tell them to call back tomorrow
4. "How must you dispose of a printed patient record you no longer need?"
   A) Regular trash  B) Recycling bin  ✓C) Shred it (cross-cut shredding required)  D) Delete it digitally and trash the paper
5. "Under HIPAA, who owns the patient's medical records?"
   A) The patient  ✓B) The practice — but patients have the right to access and receive copies  C) The insurance company  D) Both the practice and patient equally

On pass: set `hipaa_trained_at` + insert into `oe_training_completions`.
On fail: show wrong answers, allow retry immediately.
Certificate badge on profile.

**OSHA Training** (mandatory for clinical roles: owner-dentist, associate-dentist, dental-assistant)
Build at `/dashboard/training/osha`. 5 questions, pass = 5/5 (no margin).

Questions:
1. "After a needlestick injury, your first action should be:"
   ✓A) Wash the area with soap and water, report immediately to supervisor  B) Apply a bandage and continue working  C) Wait to see if symptoms develop  D) Report at end of shift
2. "Dental masks must be changed:"
   A) Once per day  ✓B) Between patients or when visibly soiled/wet  C) Once per week  D) Only when treating high-risk patients
3. "Bloodborne pathogens training is required:"
   A) Once ever  B) Every 3 years  ✓C) Annually  D) Only for new employees
4. "Used sharps (needles, scalpels) must be disposed of in:"
   ✓A) A puncture-resistant sharps container  B) A biohazard bag  C) Regular trash  D) A sealed plastic bag
5. "The written Exposure Control Plan must be reviewed:"
   A) Every 5 years  B) Only after an incident  ✓C) At least annually and when procedures change  D) Only when a new employee is hired

On pass: set `osha_trained_at` in Clerk metadata + insert in `oe_training_completions`.
Pass = 5/5. If they miss any, must retake.

### 4C. Platform Training Modules

Build at `/dashboard/training`. Role-gated modules:

**"Scheduling & Insurance"** (front-desk, office-manager)
- How appointment booking triggers reminders (diagram)
- How insurance eligibility check runs on intake
- Where to see coverage issues
- Practice task: "Find the insurance status for Demo Patient A"

**"Clinical Documentation & CDT Codes"** (owner-dentist, associate-dentist, dental-assistant)
- Overview of CDT code system
- How to select the right procedure template
- How AI pre-fills notes and what must be manually verified
- Signing requirements before end of day
- Practice task: "Open demo patient, select D0120, review pre-filled note"

**"Treatment Plan Presentation"** (owner-dentist, associate-dentist)
- How to generate a treatment plan from the dashboard
- How to present on iPad in `/treatments/[id]/present`
- How patient acceptance is tracked
- What triggers the `treatment_accepted` message template
- Practice task: "Open demo treatment plan and walk through the presentation view"

**"Collections & Financials"** (owner-dentist, office-manager)
- What the daily briefing email includes
- How to read production vs. collections
- How Stripe payments flow into the dashboard
- Where to see outstanding balances
- Practice task: "Check last month's collections in the financials dashboard"

Track in `oe_training_completions`. Show completion badges on staff profiles.

### 4D. Staff Training Tracker

Build `/dashboard/training/staff` — visible to `admin` and `global_admin` only.

Table: all staff, role, HIPAA status, OSHA status (if clinical), module completions.
Alert row (red) if clinical staff is OSHA-untrained > 7 days after account creation.
"Send reminder" button per row — sends email with training link.

---

## PHASE 5 — REAL DATA WIRING

These require credentials from Dr. Chireau. Do not build stub UIs — wait for real keys
then implement fully.

### 5A. Gusto Payroll

Infrastructure already exists at `/api/hr/gusto/`. Needs:
- `GUSTO_CLIENT_ID` and `GUSTO_CLIENT_SECRET` — Brad gets from Gusto developer account
- Dr. Chireau clicks "Connect Gusto" in Settings → Integrations → completes OAuth
- On connect: pull employees, roles, pay rates, hours into `oe_hr_employees`
- Replace hardcoded `ROLE_RATES` object in `src/app/dashboard/hr/page.tsx` with real API data
- Sync payroll data on daily cron (add to existing cron jobs)

### 5B. Vyne Dental Trellis — Insurance Eligibility

Currently no Vyne integration. Needs:
- `VYNE_API_KEY` from Vyne account
- Build `/api/insurance/verify` route:
  - Input: patient name, DOB, insurance member ID, payer ID
  - Call Vyne eligibility API
  - Return: coverage active/inactive, deductible, copay, remaining benefits
  - Save result to patient record
- Trigger automatically on patient check-in (when status changes to "arrived")
- If coverage issue: send `insurance_pending` SMS to patient
- If verified: send `insurance_verified` SMS
- Show verification status badge on patient record and on `/dashboard/insurance`

### 5C. QuickBooks Financial Sync

Needs Dr. Chireau's QuickBooks credentials:
- Build OAuth flow in Settings → Integrations → "Connect QuickBooks"
- On connect: sync chart of accounts, existing transactions
- Daily cron: pull new QuickBooks transactions, reconcile with Stripe payment records
- Show on `/dashboard/financials`:
  - Revenue (Stripe) vs. Expenses (QuickBooks) vs. Net
  - Monthly trend
  - Outstanding A/R aging

---

## WHAT NOT TO CLAIM UNTIL EACH PHASE IS DONE

| Sales Claim | Unlocked After |
|---|---|
| "Emails come from akultimatedental.com" | Phase 1A |
| "Voice AI answers the phone" | Phase 1B |
| "You approve every patient message before it sends" | Phase 2C |
| "Test everything before a patient sees it" | Phase 3 |
| "Staff trained by role before first login" | Phase 4 |
| "Payroll synced from Gusto" | Phase 5A |
| "Insurance verified automatically at check-in" | Phase 5B |
| "Financials pulled from QuickBooks" | Phase 5C |

---

## 30-DAY TIMELINE

```
WEEK 1 (Days 1–7)
Day 1:   DNS pointed to Vercel, Resend domain verified (Phases 1A + 1D)
Day 1:   Vapi API key added, receptionist configured (Phase 1B)
Day 1:   Social links added to practice config (Phase 1C)
Day 2-3: Build message-templates.ts + database migration + seed 18 templates
Day 3-4: Build /dashboard/message-templates approval UI
Day 4:   Send Dr. Chireau link to review templates (his 30-min task)
Day 5-7: Ensure all existing cron jobs read from oe_message_templates table

WEEK 2 (Days 8–14)
Day 8:   Build test mode toggle + oe_test_log
Day 9:   Run all crons in TEST_MODE — verify sends and logs
Day 10:  Build /dashboard/launch-checklist with auto-checks
Day 11:  Send test messages to NuStack phones — review quality
Day 12:  Dr. Chireau receives test messages, approves or requests edits (15 min)
Day 13-14: Fix any issues

WEEK 3 (Days 15–21)
Day 15:  Build role-based onboarding for all 5 roles
Day 16:  Build HIPAA quiz + OSHA quiz + training modules
Day 17:  Create all staff accounts, each completes onboarding path
Day 18-19: Test access control — verify front desk can't see financials
Day 20:  Staff training tracker at /dashboard/training/staff
Day 21:  Launch checklist 80%+

WEEK 4 (Days 22–30)
Day 22-24: Fix any issues from staff onboarding
Day 25:  30-min review call with Dr. Chireau — walk launch checklist live
Day 26:  All checklist items green — NuStack sign-off
Day 27:  TEST_MODE off — go live
Day 28-29: Monitor cron logs, call logs, approval queue
Day 30:  Handoff — Dr. Chireau managing templates and approvals independently
```

## CLIENT EFFORT

| Task | Time | Who | When |
|---|---|---|---|
| Point DNS to Vercel | 15 min | Dr. Chireau or NuStack | Day 1 |
| Provide Gusto / Vyne credentials | 30 min | Dr. Chireau | Day 1 |
| Review + approve message templates | 30 min | Dr. Chireau | Day 4-7 |
| Review test messages | 15 min | Dr. Chireau | Day 12 |
| Each staff member: role onboarding | 30 min each | Staff | Week 3 |
| Final launch review call | 30 min | Dr. Chireau | Day 25 |
| **Total (owner)** | **~2 hours** | | **Over 30 days** |

---

*NuStack Digital Ventures — Read this file before starting any session on ak-dental-website.*
*Last updated: 2026-03-03*

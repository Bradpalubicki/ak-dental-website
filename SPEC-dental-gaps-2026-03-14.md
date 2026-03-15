# SPEC: AK Ultimate Dental — Full Engine Gap Audit
**Generated:** 2026-03-14
**Engine:** ak-dental-website
**Client:** AK Ultimate Dental (Dr. Alex Chireau, DDS)
**Supabase:** pivfajkousqthlfaqtwr
**Live URL:** https://ak-ultimate-dental.vercel.app
**Research Phase:** COMPLETE — Gate R3

---

## PHASE 0a — Vertical Library Check
No dental vertical library existed at `~/.claude/skills/research-build/verticals/dental.md`.
**Action:** Full research pipeline run. Dental vertical library created at end of this pipeline.

## PHASE 0a.2 — Engine Upgrade Research Log Check
No prior row for ak-dental-website in ENGINE-RESEARCH-LOG.md.
**Action:** Full research run. Row added at end of this pipeline.

---

## PHASE 0b — Universal Health Audit Results

### 1. Template Contamination
**PASS.** No wrong-vertical terminology found. "AK Ultimate Dental" and "Dr. Alex Chireau" appear consistently. `engineConfig.engineType = "dental"` is correct.

### 2. Brand Identity Split
**MINOR FLAG.** The `sidebar.tsx` hardcodes "AK Ultimate" and "Dr. Alex Chireau" inline (not pulled from practiceConfig). If this engine is ever forked for a new dental client, those strings will contaminate. Not a live bug — low priority to fix before client handoff.

### 3. Demo Data as Production Fallback
**FLAG — NEEDS DECISION.**
- `src/app/dashboard/hr/page.tsx`: `ROLE_RATES` object is hardcoded. All payroll rates, attendance, and weekly hours use fake hash-based variation. ADP integration stub only.
- `src/app/dashboard/analytics/page.tsx`: Procedure mix (Crowns: 18, Fillings: 22, Implants: 12) is hardcoded. Patient retention chart uses `Math.random()`.
- `src/app/api/cron/daily-briefing/route.ts` line 44: `yesterdayProduction: 4250` is hardcoded. Comment says "Would come from billing integration."
- **DB state:** Only 5 patients, 9 appointments, 0 leads, 0 clinical notes, 5 treatment plans, 5 billing claims. Engine is not in production use yet.
- **Decision for Brad:** HR and analytics pages show demo data. Either (a) hide behind a "coming soon" gate until ADP/real data arrives, or (b) clearly label as "Sample Data" for demo purposes.

### 4. Missing Migrations for Referenced Tables
**FLAGS — TABLE GAPS:**
The following tables are referenced in code but DO NOT EXIST in Supabase (pivfajkousqthlfaqtwr):
| Referenced Table | File | Impact |
|---|---|---|
| `oe_payments` | `src/app/api/payments/checkout/route.ts` | Stripe checkout inserts will fail with 500 |
| `oe_pms_sync_log` | `src/lib/services/pms.ts` | PMS sync logging will fail silently |
| `oe_pms_integrations` | `src/lib/services/pms.ts` | PMS integration management broken |
| `oe_era_records` | `src/lib/services/billing-integration.ts` | ERA auto-posting will fail |

**The Stripe checkout route (`/api/payments/checkout`) will throw on every successful payment** because it tries to INSERT into `oe_payments` which does not exist.

### 5. Dashboard Nav Over-Built (>12 sections)
**PASS — WELL CONTROLLED.** Sidebar has exactly 8 primary items (Dashboard, Patients, Schedule, Clinical, Billing, Inbox, Calls, Analytics) + 2 bottom items (Settings, Help). This is compliant with the Layer Standard. The dental.ts vertical config's full nav list (19 items) is a spec/reference only — not rendered in sidebar.

### 6. Fake Contact Info in Config
**PASS.** `practiceConfig` in `src/config/practice.ts` contains real AK Ultimate Dental data: real phone `(702) 935-4395`, real address `7480 West Sahara Avenue, Las Vegas, NV 89117`, real email `dr.alex@akultimatedental.com`, real Google Review URL. No placeholder contact data.

### 7. Stub Features in Production Code
**FLAGS:**
- `VAPI_API_KEY` = "PLACEHOLDER" → AI voice receptionist disabled. Code exists, not active.
- `ANTHROPIC_API_KEY` = "PLACEHOLDER_ADD_ANTHROPIC_KEY" → All AI features (AI Advisor, clinical note assist, lead response drafts, daily briefing AI) are silently disabled.
- Twilio: Configured with real credentials per NEEDS-TO-FINISH.md (requires verification).
- Vyne Dental Trellis: Stub only, no API calls wired.
- QuickBooks Online: OAuth stub, returns "coming soon".
- ADP Workforce Now: 100% hardcoded payroll data.
- DentalXChange/Availity/Change Healthcare clearinghouse: All `status: "coming_soon"`, none wired.

### 8. PracticeConfig/Naming Mismatch
**MINOR FLAG.** Two config systems exist:
- `src/config/practice.ts` + `src/config/engine.ts` → the live practice config (correctly populated for AK Dental)
- `src/config/verticals/dental.ts` (VerticalConfig type) → a separate richer vertical config with CDT codes, role definitions, assessment types
These two are NOT connected. The `dentalVertical` config in `src/config/verticals/dental.ts` is never imported or used in any dashboard page. It's dead config. Not harmful, but the dual-config approach adds confusion.

### 9. Multiple AI Routes
**FOUND 3 AI ROUTES:**
- `/api/ai/generate` — general AI generation
- `/api/ai/chat` — chat interface
- `/api/ai/advisor` — business advisor
- `/api/ai/assistant` — clinical assistant
- `/api/clinical-notes/[id]/ai-assist` — note assist

All are gated by the same ANTHROPIC_API_KEY check and gracefully degrade when not configured. No canonical conflict — each serves a distinct purpose. **PASS** (no action needed, but Anthropic key must be wired before any AI feature works).

### 10. Cron Routes with Missing Implementations
**FLAGS — 5 CRON ROUTES IN vercel.json WITH NO FILE:**
| Cron Path | In vercel.json | File Exists? |
|---|---|---|
| `/api/cron/recall` | Yes | Yes ✅ |
| `/api/cron/reminders` | Yes | Yes ✅ |
| `/api/cron/no-show` | Yes | Yes ✅ |
| `/api/cron/email-alerts` | Yes | Yes ✅ |
| `/api/cron/email-style-refresh` | Yes | Yes ✅ |
| `/api/cron/seo-gsc-sync` | Yes | **MISSING ❌** |
| `/api/cron/expire-postings` | Yes | **MISSING ❌** |

`/api/cron/seo-gsc-sync` and `/api/cron/expire-postings` are scheduled in vercel.json but the route files do not exist. These will return 404 on every cron trigger and log errors in Vercel.

---

## PHASE 0c — Cross-Engine Duplicate Check
Insurance verification logic, CDT coding, and dental billing structures appear only in ak-dental-website. No duplication found in other engines. This is the canonical dental implementation.

---

## FILE MANIFEST

### Existing API Routes (relevant to gaps)
```
src/app/api/payments/checkout/route.ts    ← Stripe checkout (BROKEN: no oe_payments table)
src/app/api/payments/square/route.ts      ← Square SDK checkout ✅
src/app/api/payments/success/route.ts     ← Stripe success handler
src/app/api/webhooks/stripe/route.ts      ← Stripe webhook (oe_billing_claims table exists)
src/app/api/insurance/[id]/route.ts       ← Insurance verification CRUD
src/app/api/cron/daily-briefing/route.ts  ← Hardcoded production figure
src/app/api/cron/lead-nurture/route.ts    ← Wired (real imports)
src/app/api/cron/reactivation/route.ts    ← Wired (real imports)
```

### Missing Route Files (cron)
```
src/app/api/cron/seo-gsc-sync/route.ts   ← MISSING, scheduled in vercel.json
src/app/api/cron/expire-postings/route.ts ← MISSING, scheduled in vercel.json
```

### Dashboard Pages
```
src/app/dashboard/dashboard-client.tsx      ← Main dashboard (real DB data)
src/app/dashboard/analytics/analytics-client.tsx  ← Partially hardcoded
src/app/dashboard/hr/hr-client.tsx          ← Hardcoded payroll
src/app/dashboard/seo/page.tsx              ← SEO dashboard (stub tabs)
src/app/dashboard/billing/                  ← billing module (oe_billing_claims ✅)
src/app/dashboard/clinical-notes/page.tsx   ← Clinical notes (oe_clinical_notes ✅)
```

### Patient Portal
```
src/app/portal/page.tsx              ← Portal home
src/app/portal/appointments/         ← Appointment viewing
src/app/portal/treatments/           ← Treatment plans
src/app/portal/billing/              ← Billing/payments
src/app/portal/messages/             ← Comms
src/app/portal/profile/              ← Profile edit
```

### Config Files
```
src/config/practice.ts         ← AK Dental specific (real data ✅)
src/config/engine.ts           ← Dental engine config
src/config/types.ts            ← Type definitions
src/config/verticals/dental.ts ← Richer vertical spec (unused in app)
```

### DB Tables (75 total in Supabase)
Present: oe_patients, oe_appointments, oe_leads, oe_clinical_notes, oe_treatment_plans, oe_billing_claims, oe_insurance_verifications, oe_insurance_carriers, oe_providers, oe_provider_availability, oe_provider_time_off, oe_ai_actions, oe_daily_metrics, oe_outreach_messages, oe_outreach_workflows, oe_patient_reactivation_sequences, oe_lead_nurture_sequences, oe_lead_nurture_definitions, oe_reactivation_definitions, oe_recall_rules, oe_consent_forms, oe_consent_signatures, oe_dental_charts, oe_calls, oe_employees, oe_hr_documents, oe_sms_templates, oe_note_templates, oe_cdt_codes, oe_lab_cases, oe_waitlist, oe_intake_submissions, oe_assessment_definitions, oe_assessment_results, seo_*, media_assets, de_legal_documents, onboarding_state, practice_announcements, practice_hours_overrides, practice_specials

**MISSING from DB (referenced in code):**
- `oe_payments` — Stripe payment records
- `oe_pms_sync_log` — PMS import history
- `oe_pms_integrations` — PMS connection config
- `oe_era_records` — ERA auto-posting records

### Migration Watermark
No `/supabase/migrations/` directory found. Migrations have been applied ad hoc via Supabase MCP. Next migration should be named `migration-YYYYMMDD-{description}.sql` and applied via Supabase MCP.

### ENV Vars Referenced (from code scan)
Required and confirmed in code:
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — assumed set (DB connects)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_ENVIRONMENT`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `AGENCY_SECRET`
- `CRON_SECRET`

Missing/Placeholder (blocks features):
- `ANTHROPIC_API_KEY` — all AI features dead without this
- `VAPI_API_KEY` — voice receptionist dead
- `MESSAGE_ENCRYPTION_KEY` — PHI encryption for SMS
- `GOOGLE_SERVICE_ACCOUNT_KEY` — GSC SEO data
- `INDEXNOW_KEY`, `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`

---

## PHASE 0.5 — Layer Placement Decision

| Feature | Correct Layer | Currently |
|---|---|---|
| Appointments + Schedule | Layer 1 (Day 1) | ✅ In sidebar |
| Patients | Layer 1 | ✅ In sidebar |
| Inbox/Messages | Layer 1 | ✅ In sidebar |
| Billing | Layer 1 | ✅ In sidebar |
| Clinical Notes | Layer 1 (dental-specific) | ✅ In sidebar |
| Leads | Layer 2 | ✅ Not in primary nav |
| Analytics | Layer 2 | ✅ In sidebar, lower |
| Insurance | Layer 2 | Via Billing section |
| HR Module | Layer 2 | In full nav, not sidebar |
| AI Advisor | Layer 3 | Accessible, not front-and-center |
| SEO Dashboard | Layer 3 | In nav, not sidebar |
| Compliance | Layer 3 | In pages, not sidebar |
| Missing: `oe_payments` table | Blocks Layer 1 billing | **CRITICAL FIX** |
| Missing cron routes | Blocks Layer 2/3 automation | **NEEDS STUBS** |

---

## PHASE 1 — End-Client Journey Audit

### Operator Journey (Dr. Alex / Front Desk)

**State A (New — Zero Data):**
- Log into dashboard → see empty stat cards
- No patients, no appointments visible
- Onboarding state table exists (`onboarding_state`) but no wizard implemented
- **GAP: No onboarding wizard.** Per MEMORY.md, the Onboarding Pattern is standard in all engines. AK Dental is missing it.

**State B (In Progress — Live Practice):**
- Morning: Check dashboard → today's appointments + leads + pending insurance
- Check-in patient → update status from "scheduled" → "confirmed" → "checked_in"
- Verify insurance → go to Insurance page, pull up patient's verification record
- After treatment → create clinical note (SOAP) → have Dr. sign → generate treatment plan
- Treatment plan → present to patient → patient views via portal
- Collect payment → Square SDK flow (exists) OR Stripe checkout (BROKEN — no `oe_payments` table)
- **GAP: Stripe payment flow is broken** (table missing). Square flow works but is not integrated with `oe_billing_claims` updates.
- End of day: Review AI action queue → approve/reject outreach messages

**State C (Established):**
- Reactivation cron fires daily → surfaces patients 6+ months overdue → AI drafts recall messages → approval queue
- Lead nurture fires every 2h → new web leads get AI-drafted follow-up → approval queue
- Daily briefing email sent to dr.alex@akultimatedental.com at 9am
- **GAP: Daily briefing hardcodes yesterdayProduction: 4250** — not real billing data
- **GAP: Analytics procedure mix is hardcoded** — not reflecting actual CDT codes from `oe_billing_claims`

### Patient Journey (End-Customer)

**State A (New Patient — Never Visited):**
- Visits akultimatedental.com → finds service pages (19 pages exist, well-built)
- Fills out appointment request form → creates `oe_leads` record → AI drafts response
- **GAP: No self-service online booking.** The marketing site has `/appointment` page but it creates a lead, not a real-time booked slot. Patients cannot see real-time availability and book themselves.

**State B (Active Patient — Portal User):**
- Patient portal exists at `/portal` — login via token-based auth
- Can view upcoming appointments, treatment plans, billing, messages
- Can view estimated cost breakdown (insurance vs patient responsibility)
- **GAP: Portal payment flow.** `/portal/billing/page.tsx` — patient sees balance but the Square/Stripe payment integration may not be wired to patient-initiated payments from portal
- **GAP: No online forms / pre-visit intake via portal.** `oe_intake_submissions` table exists but no UI in portal for patient to complete intake forms before first visit.

**State C (Returning Patient — Full History):**
- Patient portal shows last visit, completed visits count, treatment history
- Recall SMS arrives when patient is 6mo overdue → click link → book appointment
- **GAP: Recall SMS click → no direct booking link.** The link in recall messages points to `/appointment` (lead form), not real-time booking.

### Agency View (Brad / NuStack)

- `/api/agency/status` is wired and healthy
- Reports leads, appointments, patients, AI actions, outreach, integration health
- **GAP:** `oe_pms_sync_log` and `oe_pms_integrations` tables missing → PMS sync feature in settings will break silently when Alex tries to import from Dentrix.

---

## PHASE 2 — Competitor Research: Dental Practice Management 2025-2026

### Top Competitors Analysis

**Dentrix G7 (Henry Schein) — Market Leader**
- Pricing: ~$500-800/mo on-premise; Dentrix Ascend cloud: $399-1599/mo
- Lead features: 35,000+ practices, complete PMS, imaging, Medicaid billing
- Top complaints: Very expensive, updates break things, $5-15K hardware refresh every 3-5 years, steep learning curve, support requires paid plan
- Mobile app: Limited (Dentrix Mobile exists, basic scheduling only)
- Patient portal: Patient Engage add-on (extra cost) — appointment requests, forms, limited
- **Relevance:** AK Dental staff knows Dentrix (DENTRIX_CSV_COLUMNS in constants.ts). Our CSV import adapter is the right bridging play.

**Curve Dental (Cloud-Native)**
- Pricing: Not publicly listed, custom quotes ~$300-600/mo
- Lead features: 100% cloud, no servers, modern UI, real-time multi-location, integrated imaging
- Top complaints: Higher cost than on-premise, limited customization, smaller user base
- Mobile app: Full browser-based on any device
- Patient portal: Integrated online forms, appointment requests, payment integration
- **Relevance:** Best UX benchmark for our dashboard. Their patient forms approach is what we should replicate in portal.

**Eaglesoft (Patterson Dental)**
- Pricing: ~$400-700/mo
- Lead features: Insurance estimation, batch claims, pre-authorization tracking, strong reporting
- Top complaints: Server-based, expensive hardware, older UI, requires IT support
- Mobile app: None (server-based, browser via remote desktop)
- Patient portal: Basic via add-on
- **Relevance:** Their insurance estimation/batch claims feature is what our billing module should evolve toward.

**Open Dental (Open Source)**
- Pricing: ~$169/mo support subscription; software free
- Lead features: Open source, REST API, highly customizable, strong community
- Top complaints: Requires technical expertise to set up, dated UI, support quality varies
- Mobile app: None officially
- Patient portal: Online forms, patient payments, texting integration
- **Relevance:** Their open API is why we can build the CSVImportAdapter + future direct API adapter.

### Best-in-Class UX Standards for Dental (2025-2026)

**Booking:**
- Real-time availability display (calendar view with open slots)
- 24/7 online booking (no call required)
- New patient vs returning patient flow
- Automated waitlist management
- 2-click rebook from patient portal
- **Our gap: We have lead form only, not real-time booking**

**Patient Record (Unified):**
- Demographics + contact
- Insurance coverage (primary + secondary)
- Medical history (conditions, medications, allergies)
- Dental history + chart
- Treatment plans with acceptance status
- Clinical notes (SOAP, signed)
- X-rays + images
- Payment history + balance
- Communication log (SMS, email sent/received)
- Recall due date
- **Our coverage: ~70% complete. Missing: secondary insurance, medical history form integration, X-ray/image storage.**

**Patient Portal Standards (what patients actually use):**
1. View upcoming appointments + reschedule request
2. Complete intake forms online (pre-visit paperwork)
3. View treatment plans + accept/decline
4. Make payments / view balance
5. Message the office
6. Download records / EOBs
7. **Our coverage: 1 ✅, 2 ❌ (intake form UI missing), 3 ✅, 4 partial (UI exists, payment wiring unclear), 5 ✅, 6 ❌ (no records download)**

**AI/Automation Patterns (leading-edge 2025-2026):**
- AI insurance eligibility verification (Overjet, Pearl AI, DentalRobot.ai) — submit member ID → get full breakdown in <5 seconds
- AI treatment plan explainer (plain English from CDT codes) — patients understand what they're agreeing to
- AI prior authorization — system knows which codes need auth for which payers
- Agentic RCM — AI submits claims, tracks denials, files appeals autonomously
- AI voice receptionist (VAPI pattern — already in our code)
- Post-procedure care instructions (personalized, triggered by CDT code)
- **Our coverage: AI advisor ✅, AI note assist ✅, AI lead response ✅, insurance AI ❌ (Vyne stub only), treatment explainer ❌, prior auth AI ❌**

**Mobile Patterns:**
- Operator: Appointment check-in, schedule view, patient lookup — all mobile-optimized
- Patient: Portal is responsive but not a native app
- **Our coverage: Responsive web ✅, native app ❌ (out of scope for this engine tier)**

---

## PHASE 2.5 — Third-Party API Viability

**Insurance Verification — Availity**
- REST API available for eligibility + claims
- Requires partner enrollment (not a free API — must apply)
- Supports 8.8M+ daily transactions across all major payers
- Integration complexity: HIGH (partner agreement required)
- **Recommendation:** Phase 1 = manual verification with structured data entry (current state). Phase 2 = Availity partner enrollment when Alex confirms he wants automated verification. Cost: ~$0.05-0.15/verification (volume-based).

**Insurance Verification — Vyne Dental (Trellis)**
- Already referenced in NEEDS-TO-FINISH.md as the target integration
- Dental-specific (not general healthcare like Availity)
- Real-time eligibility for major dental payers
- **Recommendation:** Wire Vyne when VYNE_API_KEY is provided. Code stub already exists in billing-integration.ts.

**Square SDK (Payments)**
- Already wired: `/api/payments/square/route.ts` using `SquareClient` from `squareup` package
- Works correctly for charging treatment plans
- SQUARE_ACCESS_TOKEN + SQUARE_LOCATION_ID needed from Alex (client owns account)
- **Gap:** Square payment does not update `oe_billing_claims` — only updates `oe_treatment_plans.status`

**Stripe (Legacy)**
- Checkout route exists but is broken (missing `oe_payments` table)
- Per stack rules: flag for migration to Square, never add new Stripe. Stripe checkout should either be fixed (add table) or removed in favor of Square.

**Cherry Financing**
- No Cherry integration exists in the engine
- Per NuStack strategy (from MEMORY.md): Cherry is primary financing partner
- Phase 1: Link-only integration (already in treatment plan display)
- Phase 2: Cherry API for pre-fill + webhook

---

## PHASE 3 — Tech Stack Decision

No new dependencies needed for P1 gaps. All fixes use existing stack:
- Supabase for missing tables
- Existing Square SDK for payment fixes
- Existing Anthropic SDK (once key is wired)
- Existing Twilio for SMS
- Existing Resend for email

The `oe_payments` table and stub cron routes can be built with zero new packages.

---

## PHASE 4 — NuStack Stack Fit Check

| Check | Status |
|---|---|
| Next.js 16 App Router | ✅ |
| Server Components default | ✅ |
| Supabase + RLS | ✅ (RLS needs audit — not verified enabled) |
| Clerk auth on protected routes | ✅ |
| Square payments (not new Stripe) | ⚠️ Stripe checkout is legacy — flag for removal |
| Twilio SMS | ✅ (Configured) |
| Resend email | ✅ |
| react-hook-form + zod on all forms | ⚠️ Not verified on all forms |
| No console.log in production | ⚠️ One found in payments/checkout/route.ts line 145 |
| TypeScript strict | ✅ |
| Mobile responsive | ✅ |
| Vercel deployment | ✅ |

**RLS Status:** Not verified via query. Should run: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public'` to confirm RLS is ON for all `oe_` tables.

---

## PHASE 5 — Automation & Agency Engine Integration

### Automatable Dental Triggers
| Trigger | Currently Wired | Target |
|---|---|---|
| New lead → AI draft response | ✅ | Working once Anthropic key set |
| Lead 48h no response → nurture sequence | ✅ | Working once Anthropic key set |
| Appointment 48h/24h/2h → SMS reminder | ✅ (cron exists) | Working once Twilio confirmed |
| No-show → AI follow-up | ✅ (cron exists) | Working |
| Patient 6mo overdue → recall message | ✅ (cron exists) | Working once Anthropic key set |
| Incomplete treatment plan → reactivation | ✅ (cron exists) | Working |
| Daily briefing email | ✅ (cron exists) | Blocked by hardcoded production figure |
| Post-procedure care instructions | ❌ | NOT BUILT |
| Insurance expiring → year-end benefit reminder | ❌ | NOT BUILT |
| New patient intake form submitted → notify staff | ❌ | NOT BUILT |

### KPIs to Agency Engine (via /api/agency/status)
Currently reporting: leads, appointments, patients, AI actions, outreach, integration health, cron health.
Missing from agency status: billing collections, no-show rate, recall rate, case acceptance rate.

---

## PHASE 6 — Skeleton Code Contracts (P1 Gaps)

### Gap 1: Missing `oe_payments` table migration
```typescript
// Migration SQL needed:
// CREATE TABLE oe_payments (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   patient_id UUID NOT NULL REFERENCES oe_patients(id),
//   treatment_plan_id UUID REFERENCES oe_treatment_plans(id),
//   amount NUMERIC NOT NULL,
//   status TEXT NOT NULL DEFAULT 'pending', -- pending|completed|failed|refunded
//   payment_method TEXT, -- card|square|stripe|cash|check
//   stripe_checkout_session_id TEXT,
//   stripe_customer_id TEXT,
//   square_payment_id TEXT,
//   receipt_url TEXT,
//   description TEXT,
//   notes TEXT,
//   deleted_at TIMESTAMPTZ
// );
```

### Gap 2: Missing `oe_pms_sync_log` and `oe_pms_integrations` tables
```typescript
// oe_pms_integrations: id, type (dentrix|csv_import|...), config (jsonb),
//   last_sync_at, last_sync_status, last_sync_records, total_patients_synced
// oe_pms_sync_log: id, integration_id, sync_type, status, records_processed,
//   records_created, records_updated, records_errored, errors (jsonb), duration_ms, completed_at
```

### Gap 3: Missing cron stub routes
```typescript
// src/app/api/cron/seo-gsc-sync/route.ts
export async function GET(req: NextRequest) {
  const auth = verifyCronSecret(req);
  if (!auth.valid) return auth.response!;
  // Sync GSC data to seo_gsc_data table
  return NextResponse.json({ success: true, message: "GSC sync stub — needs GOOGLE_SERVICE_ACCOUNT_KEY" });
}

// src/app/api/cron/expire-postings/route.ts
export async function GET(req: NextRequest) {
  const auth = verifyCronSecret(req);
  if (!auth.valid) return auth.response!;
  // Expire practice_specials and practice_announcements past their end_date
  return NextResponse.json({ success: true });
}
```

### Gap 4: `oe_billing_claims` schema mismatch with Stripe webhook
The Stripe webhook (`/api/webhooks/stripe/route.ts`) inserts into `oe_billing_claims` but the table's schema uses `patient_id` (required, NOT NULL) — the Stripe webhook does NOT have a patient_id from the session metadata. This will throw a constraint error on every Stripe `checkout.session.completed` event.

```typescript
// Fix: Either make patient_id nullable in oe_billing_claims for external payments,
// OR store treatmentPlanId in Stripe session metadata and look up patient_id on receipt.
// Current code only stores: internal_ref: treatmentPlanId (but doesn't use it to get patient_id)
```

### Gap 5: Online Booking (P1 for patient acquisition)
```typescript
interface BookingSlot {
  providerId: string;
  providerName: string;
  date: string;           // YYYY-MM-DD
  time: string;           // HH:MM
  durationMinutes: number;
  serviceType: string;
  available: boolean;
}

// GET /api/booking/availability?date=YYYY-MM-DD&type=new_patient|recall|other
// Returns BookingSlot[] for that date, filtered by provider_availability
// and blocked by existing appointments

// POST /api/booking/request
// Creates oe_appointments with status='scheduled' (pending confirmation)
// Sends confirmation SMS/email via Twilio/Resend
// Notifies front desk via email
```

---

## PHASE 7 — Error Handling Spec

| External Call | On Failure |
|---|---|
| Stripe checkout create | Return 503 "Payment processing unavailable. Call office." |
| Square payment charge | Return 500 with Square error code; do NOT update treatment plan status |
| Twilio SMS send | Log to oe_outreach_messages with status='failed'; do not retry in same request |
| Resend email send | Log failure; continue (email is non-blocking for most flows) |
| Anthropic API | Return null; all AI routes check for null and degrade gracefully |
| Supabase query | Return 500 with sanitized error (never expose DB internals) |
| VAPI API | Returns null when not configured (already handled) |
| Missing cron auth | 401 response immediately (already handled via verifyCronSecret) |

---

## PHASE 8 — Test Strategy

**Demo/Test Mode Trigger:**
- `DEMO_MODE=true` env var (pattern established in mindstar-counseling)
- When DEMO_MODE active: seed endpoint at `/api/seed/` populates test patients, appointments, leads
- Seed modules already exist: `src/app/api/seed/modules/` (calls.ts, dashboard.ts, outreach.ts)

**Critical paths to verify before client handoff:**
1. `POST /api/payments/square` → payment charges and updates treatment plan status ✅
2. `POST /api/payments/checkout` → **WILL FAIL** (missing oe_payments table) ❌
3. `GET /api/cron/daily-briefing` → sends email to dr.alex@ (verify Resend key is live)
4. `GET /api/cron/seo-gsc-sync` → **WILL RETURN 404** (missing file) ❌
5. `GET /api/cron/expire-postings` → **WILL RETURN 404** (missing file) ❌
6. Patient Portal login → view appointments + treatment plans ✅
7. Insurance verification CRUD → oe_insurance_verifications ✅
8. Lead submit from marketing site → creates oe_leads record ✅

---

## PHASE 9 — P1 GAP SUMMARY & BUILD SPEC

### P0 (Breaking — Fix Before Any Client Demo)

**P0-1: Missing `oe_payments` table**
- Impact: Stripe checkout 500s on every successful payment
- Files: 1 migration SQL
- Verify: `SELECT COUNT(*) FROM oe_payments` returns 0 (not error)

**P0-2: Missing cron route files (`seo-gsc-sync`, `expire-postings`)**
- Impact: Vercel logs 404 errors on schedule. `expire-postings` means old specials/announcements never expire.
- Files: 2 new route files (stubs are sufficient)
- Verify: `curl /api/cron/seo-gsc-sync` returns 200

**P0-3: Stripe webhook patient_id constraint violation**
- Impact: Every Stripe payment webhook 500s silently — payment records never created
- Files: 1 migration (make patient_id nullable) OR 1 route fix (look up patient_id via metadata)
- Verify: Test Stripe webhook with stripe CLI trigger → 200 response

### P1 (High — Required for Production Readiness)

**P1-1: Wire ANTHROPIC_API_KEY**
- Impact: ALL AI features (AI Advisor, clinical note assist, lead AI drafts, daily briefing) are dead
- Action: Add real key to Vercel env via `vercel env add ANTHROPIC_API_KEY`
- Verify: `GET /api/cron/daily-briefing` returns briefing content (not "AI not configured")

**P1-2: Missing `oe_pms_sync_log` and `oe_pms_integrations` tables**
- Impact: PMS import logging fails silently when Alex imports Dentrix CSV
- Files: 1 migration SQL (2 tables)
- Verify: `SELECT COUNT(*) FROM oe_pms_sync_log` returns 0 (not error)

**P1-3: Patient Portal — Online Intake Forms**
- Impact: New patients must call for paperwork; forms can't be completed before visit
- Tables needed: `oe_intake_submissions` already exists
- Files needed: `/portal/intake/page.tsx` + `/api/portal/intake/route.ts`
- Verify: Patient can complete 6-form intake flow from portal without office contact

**P1-4: Online Booking (Real-Time Availability)**
- Impact: Marketing site "/appointment" page is a lead form, not real booking
- Lost revenue: Every patient who doesn't want to call chooses a competitor who has online booking
- Tables: `oe_appointments`, `oe_providers`, `oe_provider_availability` all exist
- Files needed: `/api/booking/availability/route.ts`, `/api/booking/request/route.ts`, new booking UI on marketing site
- Verify: Patient submits booking request → appointment created in `oe_appointments` with status='scheduled' → confirmation SMS sent

**P1-5: RLS Audit**
- Impact: Unknown — RLS status on oe_ tables not verified
- Action: Run `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public' ORDER BY tablename` → confirm all oe_ tables have rowsecurity=true
- Files: Potentially multiple RLS policy migrations
- Verify: SELECT from oe_patients without service role → should return empty (patient can only see own)

### P2 (Medium — Within 30 Days)

**P2-1: Square payment should update `oe_billing_claims`**
- Currently Square charges treatment plan but doesn't create a billing claim record
- Fix: After successful Square payment → INSERT into `oe_billing_claims` with status='paid'

**P2-2: Analytics real data**
- Procedure mix should pull from `oe_billing_claims.procedure_codes` (JSONB array of CDT codes)
- Patient retention should compute from real `oe_appointments` data (% returning within 6mo)
- Files: `analytics-client.tsx` + analytics page server component

**P2-3: Daily briefing — real production figure**
- `yesterdayProduction: 4250` hardcoded in `cron/daily-briefing/route.ts`
- Fix: SUM `oe_billing_claims.billed_amount` WHERE paid_at = yesterday
- 1 file change, 5 lines

**P2-4: Cherry Financing Link Integration**
- Treatment plan presentation page should show "Apply for Cherry Financing" CTA
- Phase 1: Static link to Cherry portal with practice ID
- Files: `dashboard/treatments/[id]/present/page.tsx`

**P2-5: HR — Demo data gate**
- `dashboard/hr/page.tsx` shows hardcoded payroll data
- Add `DemoBanner` component + "Sample Data" label until ADP/real integration arrives
- 1 file change

### P3 (Low — Nice-to-Have)

**P3-1: Sidebar hardcoded strings → pull from practiceConfig**
- "AK Ultimate" and "Dr. Alex Chireau" in sidebar.tsx
- Makes fork-to-new-client easier

**P3-2: Blog page**
- Currently "Coming soon" stub at `/blog`
- `seo_blog_posts` table exists — wire it

**P3-3: SEO Dashboard tabs**
- Keywords, Audit, Vitals, Reports tabs mostly empty
- Wire to `seo_keywords`, `seo_audits`, `seo_pagespeed_scores` tables

**P3-4: Notification bell**
- Shows hardcoded "4" badge
- Wire to `oe_notifications` table (table exists)

---

## SPEC: MICRO-PROMPT BUILD PLAN

Each micro-prompt: max 3 files, has a machine-verifiable check.

### Micro-Prompt 1 — P0 Fixes: Missing Tables + Cron Stubs
**Files (3):**
1. `migrations/migration-20260314-payments-pms-tables.sql` — CREATE TABLE oe_payments, oe_pms_integrations, oe_pms_sync_log; ALTER TABLE oe_billing_claims ALTER COLUMN patient_id DROP NOT NULL
2. `src/app/api/cron/seo-gsc-sync/route.ts` — stub returning 200
3. `src/app/api/cron/expire-postings/route.ts` — real implementation querying `v_expirable_postings` view (already exists in DB)

**Verify:** `npx tsc --noEmit` clean; `SELECT COUNT(*) FROM oe_payments` = 0 (no error)

### Micro-Prompt 2 — P1: Wire Anthropic Key + Fix Daily Briefing
**Files (2):**
1. `src/app/api/cron/daily-briefing/route.ts` — replace hardcoded 4250 with real SUM query from oe_billing_claims
2. Vercel env: `vercel env add ANTHROPIC_API_KEY` (via CLI or Vercel MCP — not a code file)

**Verify:** `GET /api/cron/daily-briefing?cron_secret=...` returns `{ briefing: "<real AI content>" }`

### Micro-Prompt 3 — P1: Online Booking API
**Files (3):**
1. `src/app/api/booking/availability/route.ts` — GET with date + type query, returns slots from oe_provider_availability minus booked oe_appointments
2. `src/app/api/booking/request/route.ts` — POST creates oe_appointments (status=scheduled) + sends Twilio SMS confirmation
3. `src/app/api/booking/[id]/confirm/route.ts` — PATCH status=confirmed (for staff use)

**Verify:** `npx tsc --noEmit` clean; POST booking request → row in oe_appointments with status='scheduled'

### Micro-Prompt 4 — P1: Online Booking UI (Marketing Site)
**Files (3):**
1. `src/app/(marketing)/appointment/page.tsx` — replace lead form with 2-step booking UI (select service/date → confirm → success)
2. `src/components/marketing/booking-calendar.tsx` — calendar component fetching from /api/booking/availability
3. `src/components/marketing/booking-confirm.tsx` — confirmation step with patient info collection

**Verify:** Patient can select a slot and submit → appointment created in DB → confirmation shown

### Micro-Prompt 5 — P1: Patient Portal Intake Forms
**Files (3):**
1. `src/app/portal/intake/page.tsx` — 6-section intake form (demographics, medical history, dental history, insurance, consent, HIPAA)
2. `src/app/api/portal/intake/route.ts` — POST to oe_intake_submissions, GET to check completion
3. `src/app/portal/portal-shell.tsx` — add intake badge/CTA if intake not completed

**Verify:** New portal patient → sees intake prompt → submits form → row in oe_intake_submissions

### Micro-Prompt 6 — P2: Analytics Real Data
**Files (2):**
1. `src/app/dashboard/analytics/page.tsx` (server component) — real queries for procedure mix from oe_billing_claims + real retention from oe_appointments
2. `src/app/dashboard/analytics/analytics-client.tsx` — remove Math.random() calls, accept real data props

**Verify:** `npx tsc --noEmit` clean; procedure mix reflects actual billing claims in DB

### Micro-Prompt 7 — P2: Square payment → billing claim
**Files (2):**
1. `src/app/api/payments/square/route.ts` — after successful payment, INSERT into oe_billing_claims
2. `src/app/dashboard/billing/page.tsx` (if server-side) — confirm billing_claims reflect Square payments

**Verify:** POST /api/payments/square with valid token → row in oe_billing_claims with status='paid'

---

## GATE R3 OUTPUT

**Research complete. SPEC generated. No application code has been written.**

### P0 Gaps (Blocking — Fix Before Demo)
1. `oe_payments` table missing → Stripe checkout 500s on success
2. `seo-gsc-sync` and `expire-postings` cron routes missing → 404 every scheduled run
3. Stripe webhook `patient_id` NOT NULL constraint violation → webhook 500s silently

### P1 Gaps (Required for Production)
4. `ANTHROPIC_API_KEY` not set → ALL AI features dead (advisor, note assist, lead drafts, daily briefing)
5. `oe_pms_sync_log` and `oe_pms_integrations` tables missing → CSV import logging breaks
6. No patient portal intake forms UI → new patients can't complete paperwork before visit
7. No real-time online booking → `/appointment` is a lead form, not a booking (major patient acquisition gap)
8. RLS status not verified → potential data exposure between users

### P2 Gaps (30-Day Priority)
9. Square payment does not update `oe_billing_claims` → billing module incomplete
10. Analytics procedure mix and retention are hardcoded/random → not real data
11. Daily briefing hardcodes $4,250 production figure → not real billing data
12. Cherry financing not linked from treatment plan presentation
13. HR page shows hardcoded payroll — needs "Sample Data" label gate

### P3 Gaps (Polish)
14. Sidebar hardcodes "AK Ultimate"/"Dr. Alex Chireau" (fork hazard)
15. Blog page is "coming soon" stub
16. SEO dashboard tabs largely empty
17. Notification bell hardcoded "4" badge

**To begin building: say "build it" and /build-from-spec will execute Micro-Prompt 1.**
**Recommended starting order: Micro-Prompts 1 → 2 → 3 → 4 → 5 → 6 → 7.**

---

*Spec generated by /research-build pipeline | 2026-03-14 | ak-dental-website*

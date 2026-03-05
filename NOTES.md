# AK Dental Build Audit
**Date:** 2026-03-05
**Auditor:** Claude Code

---

## ✅ COMPLETE & PRODUCTION-READY

### Dashboard Modules (all fully implemented, 1000+ lines each)
- **Patients** — full CRUD, patient detail, history, consents
- **Appointments / Schedule** — calendar, booking, confirm/cancel, time blocks
- **Clinical Notes** — CDT templates, AI assist, provider sign-off
- **Treatments** — plans, present mode, accept/decline, AI summary
- **Proposals** — chairside builder, patient e-sign at /proposal/[token], Cherry financing, Good/Better/Best tiers (JUST BUILT)
- **Insurance** — verification queue, eligibility checks, status tracking
- **Leads** — pipeline, AI draft responses, urgency flags
- **Billing** — claims, appeal letter AI generator, write-off tracking (1,389 lines)
- **Financials** — P&L, expenses, accounts payable (1,551 lines)
- **Calls** — Vapi AI call logs, transcripts, summaries (1,136 lines)
- **Inbox** — patient messages, AI draft replies (1,304 lines)
- **Outreach** — messaging campaigns, 15 templates
- **Message Templates** — approve/test/edit templates
- **HR & Payroll** — employees, time tracking, jobs, offer letters, onboarding, certifications, documents
- **Licensing** — provider license tracking, expiry alerts, file upload
- **Compliance** — HIPAA audit log, data retention policies
- **Benefits** — policies, enrollments, filings, documents
- **Documents** — file drop box, document library, generate/sign
- **Consent Forms** — generate, sign, track
- **Approvals** — AI action approval queue
- **SEO** — keyword tracking, audit, Google Search Console sync, auto-fix cron
- **Analytics** — hourly traffic, conversion funnel, live data
- **Training** — HIPAA, OSHA, Clinical Documentation, Scheduling/Insurance, Treatment Presentation, Collections/Financials (all with quizzes)
- **Training: Staff Tracker** — per-user completion status
- **Launch Checklist** — go-live gate with auto-checks
- **Onboarding** — role-based wizard (5 roles), setup checklist
- **Email Intelligence** — AI-drafted replies + bill detection from inbox
- **Business Advisor** — Claude AI sidebar
- **Settings** — practice config, test mode, go-live, users/RBAC
- **Providers** — provider CRUD, availability, NPI lookup
- **Waitlist** — waitlist management
- **Dropbox / File Upload** — document storage

### Patient Portal (all routes complete)
- /portal — dashboard
- /portal/appointments
- /portal/treatments
- /portal/billing
- /portal/messages
- /portal/profile
- /portal/intake
- /portal/login

### Public Pages (all routes complete)
- /proposal/[token] — patient-facing treatment proposal + e-sign
- /offer/[token] — HR offer letter e-sign
- Marketing site (home, services, technology, reviews, blog, etc.)

### API Surface
- **150 API routes** — comprehensive coverage of all modules
- Cron jobs: daily-briefing, lead-nurture, no-show, reactivation, recall, reminders, SEO jobs, data-retention
- Webhooks: Nylas (email), Stripe, Twilio, Vapi, Vercel deploy

### Infrastructure
- Supabase migrations 001–044 applied
- RLS on all user-data tables
- Clerk middleware on all protected routes
- Notification bell (realtime)
- Test mode banner + go-live flow
- RBAC (roles/permissions/authority-levels)

---

## ⚠️ NEEDS ATTENTION (before client handoff)

### External Keys Missing (blocked on Alex/vendors)
- `GUSTO_CLIENT_ID` / `GUSTO_CLIENT_SECRET` — needs akultimatedental.com DNS → Vercel first
- `TWILIO_PHONE_NUMBER` for AK Dental subaccount — no phone # assigned yet
- `VAPI_API_KEY` — Vapi key not set (calls module shows empty)
- `RESEND_DOMAIN` — custom domain not verified (emails send from default)
- Dentrix eClaims activation — Alex must call 800.734.5561

### Soft Issues (not blocking, nice to fix)
- `MODULE_LABELS` unused var warning in `training/staff/staff-training-client.tsx` (line 23)
- `initialApproved` unused arg warning in `message-templates/message-templates-client.tsx` (line 198)
- Proposal `NEXT_PUBLIC_APP_URL` env var must be set in Vercel for email send links to work correctly
- Cherry merchant URL in proposal-client.tsx is a placeholder link — needs real Cherry merchant onboarding URL from withcherry.com

### Migration 044 (proposals)
- ✅ Tables created in Supabase via Management API (2026-03-05)
- File exists at supabase/migrations/044_proposals.sql

---

## ❌ NOT BUILT / OUT OF SCOPE

- **Dentrix live data sync** — no API available for treatment plan pull; Dentrix handles clinical records separately
- **Square payment processing on proposals** — Square keys not yet set up (no keys exist in any project)
- **Gusto payroll sync** — scaffold built, blocked on domain DNS
- **Google for Jobs submission** — submit button needs Keragon webhook wired
- **Checkr background checks** — Phase 2, needs partner program application
- **DocuSign templates** — Phase 2, needs ISV program
- **SMS appointment reminders** — AK Dental Twilio subaccount has no phone number yet
- **Patient portal social links** — needs Instagram/TikTok/YouTube from Alex

---

## 🔧 QUICK WINS TO DO BEFORE HANDOFF

1. Set `NEXT_PUBLIC_APP_URL=https://ak-dental-website.vercel.app` (or custom domain) in Vercel env vars — needed for proposal email links
2. Sign up for Cherry merchant account at withcherry.com — get merchant link → update proposal-client.tsx
3. Run `supabase/migrations/044_proposals.sql` against production DB ✅ DONE
4. Confirm Vercel ANTHROPIC_API_KEY is set ✅ DONE (2026-03-02)

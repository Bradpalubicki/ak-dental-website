# AK Ultimate Dental - Needs to Finish

> Last updated: 2026-02-15
> Project: AK Ultimate Dental (One Engine AI Operations Platform)
> Live: https://ak-ultimate-dental.vercel.app

---

## CRITICAL - Broken / Missing Pages

| Item | Details | Fix |
|------|---------|-----|
| `/dashboard/onboarding` | Sidebar link exists, page returns 404 | Build patient onboarding wizard or remove sidebar link |
| `/dashboard/waitlist` | Sidebar link exists, page returns 404 | Build waitlist management page or remove sidebar link |
| Clerk Branding | Application name shows "Mindstart" in Clerk components | Update in Clerk Dashboard > Customization > Branding |

---

## HIGH - Needs Real API Connections

| Service | Current State | What It Enables | Priority |
|---------|--------------|-----------------|----------|
| **ADP Workforce Now** | 100% hardcoded payroll data | Real employee hours, payroll, attendance, overtime | HIGH |
| **Vyne Dental Trellis** | Stub only, no API calls | Automated insurance eligibility verification | HIGH |
| **QuickBooks Online** | OAuth stub, returns "coming soon" | Real P&L, expense tracking, financial reporting | HIGH |
| **Vapi Voice AI** | Code exists, no API key | AI receptionist, call handling, appointment booking | HIGH |
| **Google Search Console** | No credentials configured | Real SEO data, keyword tracking, search analytics | MEDIUM |

### HR Module - Hardcoded Data (Needs ADP)
- `src/app/dashboard/hr/page.tsx` - ALL of these are fake:
  - Payroll rates (hardcoded `ROLE_RATES` object, lines 6-17)
  - Employee hours/attendance (hash-based fake variation)
  - Recent punches (static schedule with fake offsets)
  - Payroll trend charts (calculated with fake multiplier)
  - Weekly hours & attendance data

### Analytics - Partially Hardcoded
- `src/app/dashboard/analytics/page.tsx`:
  - Procedure mix: 50% hardcoded (Crowns: 18, Fillings: 22, Implants: 12, Other: 8)
  - Patient retention chart: 100% simulated with `Math.random()`
  - Only Cleanings and Whitening counts come from real data

### Financials - Needs QuickBooks
- Daily collection target hardcoded to `$7,500`
- No real accounting system integration
- Manual entries only

---

## MEDIUM - Missing Features

| Feature | Details | Location |
|---------|---------|----------|
| Clinical Notes detail page | Can list notes but can't drill into `/clinical-notes/[id]` | Needs new page |
| Accounting settings UI | Backend service exists but no user-facing page | `src/lib/services/accounting-integration.ts` |
| SEO Dashboard tabs | Keywords, Audit, Vitals, Reports tabs mostly empty | `src/app/dashboard/seo/` |
| Blog | Static "Coming soon" placeholder | `src/app/(marketing)/blog/` |

---

## LOW - Polish & Nice-to-Haves

| Item | Details |
|------|---------|
| Settings page ETAs | Shows "ADP (Q2 2026)", "QuickBooks (Q2 2026)" - may confuse users |
| Daily collection target | Hardcoded to $7,500, should be configurable |
| Patient demographics tab | May be incomplete in patient detail view |
| Notification bell | Shows hardcoded "4" badge, not connected to real notifications |

---

## Environment Variables Needed

```env
# Not configured - blocking features
VAPI_API_KEY=                    # Voice AI (Vapi)
GOOGLE_SERVICE_ACCOUNT_KEY=      # Google Search Console
MESSAGE_ENCRYPTION_KEY=          # PHI encryption for SMS

# Need real credentials when going live
# ADP_CLIENT_ID=                 # ADP Workforce Now
# ADP_CLIENT_SECRET=
# QUICKBOOKS_CLIENT_ID=          # QuickBooks Online
# QUICKBOOKS_CLIENT_SECRET=
# VYNE_API_KEY=                  # Vyne Dental Trellis
```

---

## Completed Features (Reference)

- [x] Public marketing site (homepage, services, reviews, contact, appointments)
- [x] 19 service/technology SEO pages
- [x] Patient Portal (login, dashboard, appointments, treatments, billing, messages, profile)
- [x] HIPAA Compliance (audit logging, consent management, TCPA, PHI encryption, data retention)
- [x] AI File Drop Box (upload, AI categorization/extraction, document management)
- [x] Clinical Notes (SOAP format, templates, AI assist, electronic signing)
- [x] Provider Directory (profiles, availability, time-off, referral tracking)
- [x] Dashboard data wiring (billing, analytics, financials, licensing)
- [x] Leads management with AI drafts + approval queue
- [x] HR module (employees, write-ups, certifications, tablet signing)
- [x] Insurance (verifications, carriers, benefits)
- [x] Outreach (workflows, messaging, analytics)
- [x] Calls (Vapi webhook, call logs, analytics)
- [x] AI Business Advisor
- [x] Stripe Checkout for treatment payments
- [x] Cron jobs (daily briefing, recall, lead nurture, reactivation, data retention)
- [x] Loading states, error boundaries, robots.txt, sitemap
- [x] Clerk RBAC (4-tier: global_admin/admin/manager/staff)

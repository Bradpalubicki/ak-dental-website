# Ralph Big — AK Dental Pre-Handoff Polish & Agency Wiring
## Project: ak-dental-website
## Date: 2026-03-05
## Iterations: 75
## Auto-approve: YES

---

## OBJECTIVE
Get AK Dental to 90%+ completion. Fix all soft issues, wire agency snapshot endpoint, add /api/agency/snapshot so the NuStack Agency Engine can pull live metrics. Polish every module that is close but not quite right. Build must pass clean.

---

## SUPABASE
- Project: pivfajkousqthlfaqtwr
- Management token: (use SUPABASE_MANAGEMENT_TOKEN from .env.local)
- Migrations applied: 001-044

---

## PHASE 1 — Fix All Soft Issues from NOTES.md

### 1a. Fix unused var warnings
- `src/features/training/staff/staff-training-client.tsx` line ~23: remove or use `MODULE_LABELS`
- `src/features/message-templates/message-templates-client.tsx` line ~198: remove or use `initialApproved`
Run `npm run lint` after — must be zero errors AND zero warnings on these files.

### 1b. Set NEXT_PUBLIC_APP_URL
Add to .env.local: `NEXT_PUBLIC_APP_URL=https://ak-dental-website.vercel.app`
Push to Vercel:
```bash
printf 'https://ak-dental-website.vercel.app' | vercel env add NEXT_PUBLIC_APP_URL production
printf 'https://ak-dental-website.vercel.app' | vercel env add NEXT_PUBLIC_APP_URL preview
```
Find every place proposal email links are built — verify they use NEXT_PUBLIC_APP_URL or APP_BASE_URL correctly.

### 1c. Cherry merchant URL
In proposal-client.tsx — find the placeholder Cherry merchant link.
Replace with: `https://withcherry.com/merchants` (correct Cherry merchant signup URL).
Add a TODO comment: `// TODO: Replace with Alex's actual Cherry merchant portal URL after signup`

### 1d. Fix RESEND_FROM_EMAIL
Verify `from:` address in all Resend sends uses a valid sender.
If custom domain not verified, fallback to `noreply@nustack.digital` or `brad@nustack.digital` which IS verified.
Do NOT let emails silently fail from an unverified domain.

---

## PHASE 2 — Agency Snapshot Endpoint

Create `src/app/api/agency/snapshot/route.ts`:

```typescript
// POST /api/agency/snapshot
// Called by NuStack Agency Engine to pull live metrics
// Auth: Bearer token matching AGENCY_SNAPSHOT_SECRET env var (no Clerk)
// Returns real-time practice metrics

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/libs/DB';
// import relevant schema tables

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 1. Verify bearer token
  const auth = req.headers.get('authorization');
  const secret = process.env.AGENCY_SNAPSHOT_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Pull metrics from DB (all counts for today / this week / total)
  // Use Promise.all for parallel queries
  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now); monthStart.setDate(now.getDate() - 30);

  // Query: leads today, leads this week
  // Query: appointments today, appointments this week, confirmed count
  // Query: patients total, patients new in last 30d
  // Query: ai_action_log pending approvals count
  // Query: last cron run from a cron_log table or check last appointment reminder sent
  // Query: outreach sent today

  // 3. Return snapshot
  return NextResponse.json({
    timestamp: now.toISOString(),
    site_up: true,
    leads_today: 0, // replace with real count
    leads_this_week: 0,
    appointments_today: 0,
    appointments_this_week: 0,
    patients_total: 0,
    patients_new_30d: 0,
    ai_actions_pending: 0,
    outreach_sent_today: 0,
    cron_healthy: true,
    last_cron_run: null,
    integration_health: {
      supabase: { status: 'ok' },
      clerk: { status: 'ok' },
      anthropic: { status: process.env.ANTHROPIC_API_KEY ? 'ok' : 'unknown' },
      resend: { status: process.env.RESEND_API_KEY ? 'ok' : 'unknown' },
      twilio: { status: process.env.TWILIO_AUTH_TOKEN ? 'ok' : 'unknown' },
    }
  });
}
```

Use real DB queries — import the actual schema tables and count real data. Do not hardcode zeros.

Add `AGENCY_SNAPSHOT_SECRET` to `src/libs/Env.ts` as `z.string().optional()`.

Add to .env.local: `AGENCY_SNAPSHOT_SECRET="ak-dental-agency-secret-2026"` (generate a proper random secret).

Push to Vercel:
```bash
printf 'ak-dental-agency-secret-2026' | vercel env add AGENCY_SNAPSHOT_SECRET production
printf 'ak-dental-agency-secret-2026' | vercel env add AGENCY_SNAPSHOT_SECRET preview
```

Also update the agency engine DB:
- Supabase project: syceysungaotzrfpwfhb
- Management token: sbp_fbba44dd4d24553756a32c5ce0c2ea7887f2a0e7
```sql
UPDATE managed_client
SET engine_agency_secret = 'ak-dental-agency-secret-2026'
WHERE slug = 'ak-dental';
```

---

## PHASE 3 — Dashboard Polish Pass

Do a full read of each major feature component. For any component that has:
- Hardcoded placeholder data (fake names, fake numbers) — replace with real DB query or clear empty state
- Missing empty states — add proper "No data yet" states
- Missing loading states — add skeleton loaders
- TypeScript `any` types — fix with proper types
- Dead code / unused imports — remove

Priority components to audit:
- `src/features/billing/BillingDashboard.tsx` (1,389 lines) — check for any mock data
- `src/features/financials/` — check P&L calculations are correct
- `src/features/calls/` — check Vapi integration gracefully handles missing VAPI_API_KEY
- `src/features/inbox/` — verify Nylas/Microsoft fallback when not connected

### Calls module VAPI_API_KEY missing
When `VAPI_API_KEY` is not set, the calls module should show:
"AI calling not configured — contact NuStack to activate"
Not an error/crash. Add this graceful degradation.

---

## PHASE 4 — Launch Checklist Auto-Checks

Read `src/features/launch/LaunchChecklist.tsx` or wherever the launch checklist lives.

The checklist should auto-check:
- [ ] Supabase connected (ping DB)
- [ ] Clerk auth working (session exists)
- [ ] Anthropic key set (env var present)
- [ ] Resend key set (env var present)
- [ ] At least 1 provider configured in DB
- [ ] Practice info filled in (name, address, phone)
- [ ] Test mode disabled (go-live switch)
- [ ] DNS pointed to Vercel (check if akultimatedental.com resolves to Vercel)

For the DNS check: `fetch('https://akultimatedental.com/api/health')` — if it returns 200, DNS is live.
Show DNS status as "Pending — DNS not yet pointed to Vercel" if it fails.

---

## PHASE 5 — SEO & Performance

- Verify sitemap.ts generates correct URLs using the production domain
- Verify robots.ts allows crawling
- Verify all pages have proper `<title>` and `<meta description>` via generateMetadata
- Add llms.txt if not present: `public/llms.txt` with practice info for AI search
- Run a quick audit of image optimization — all `<img>` tags should be next/image

---

## PHASE 6 — Build, Lint, Deploy

```bash
npm run build
npm run lint
git add -A
git commit -m "feat: agency snapshot endpoint, polish pass, launch checklist dns check"
git push origin main
```

Verify Vercel deploy shows Ready.

---

## SUCCESS CRITERIA
- [ ] Zero lint warnings on staff-training and message-templates files
- [ ] NEXT_PUBLIC_APP_URL set in Vercel + used correctly in proposal emails
- [ ] Cherry URL is correct withcherry.com/merchants link
- [ ] /api/agency/snapshot returns real JSON with Bearer auth
- [ ] AGENCY_SNAPSHOT_SECRET set in Vercel + agency DB updated
- [ ] Calls module shows graceful message when VAPI_API_KEY missing
- [ ] Launch checklist has DNS auto-check
- [ ] npm run build passes clean
- [ ] Deployed to Vercel

## NOTES.md
Update NOTES.md with: AGENCY_SNAPSHOT_SECRET value set, NEXT_PUBLIC_APP_URL set, any remaining blockers.

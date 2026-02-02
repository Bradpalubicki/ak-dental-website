# One Engine AI Operations Platform - Changelog

## Build Phase: Wire Real Data + Core Features

### Summary
Replaced all hardcoded mock data across dashboard pages with live Supabase queries.
Built the Approval Queue (core One Engine feature), Unified Inbox, Recall Agent,
and enhanced the Twilio webhook for intelligent inbound SMS processing.

---

### Files Modified

| File | Change |
|------|--------|
| `src/app/dashboard/page.tsx` | Converted from client to server component. Fetches real data from 7 parallel Supabase queries (patients, appointments, leads, AI actions, insurance). |
| `src/app/dashboard/leads/page.tsx` | Server component fetching from `oe_leads`. |
| `src/app/dashboard/patients/page.tsx` | Server component fetching from `oe_patients` with status counts. |
| `src/app/dashboard/appointments/page.tsx` | Server component fetching from `oe_appointments` with patient join. |
| `src/app/dashboard/insurance/page.tsx` | Server component fetching from `oe_insurance_verifications` with patient and appointment joins. |
| `src/app/api/webhooks/twilio/route.ts` | Full rewrite: patient lookup by phone, intent classification (confirm/cancel/general), AI draft generation, lead creation for unknown senders, delivery status tracking. |
| `src/components/dashboard/sidebar.tsx` | Added Approvals and Inbox nav items at top of list. Fixed TypeScript type for badge. |
| `vercel.json` | Added recall cron job (Mondays at 17:00 UTC). |

### Files Created

| File | Purpose |
|------|---------|
| `src/app/dashboard/dashboard-client.tsx` | Client component for dashboard home (icons + StatCards). |
| `src/app/dashboard/leads/leads-client.tsx` | Interactive leads UI: search, filter, select, approve & send AI drafts via API. |
| `src/app/dashboard/patients/patients-client.tsx` | Interactive patients table: search, status filter. |
| `src/app/dashboard/appointments/appointments-client.tsx` | Interactive appointments: today + upcoming, status badges, actions. |
| `src/app/dashboard/approvals/page.tsx` | Server component for Approval Queue. |
| `src/app/dashboard/approvals/approvals-client.tsx` | **Core feature**: Approval queue with approve/edit/reject, keyboard shortcuts (a/e/r/j/k), confidence scores, reject modal. |
| `src/app/dashboard/inbox/page.tsx` | Server component for Unified Inbox. Groups messages by patient. |
| `src/app/dashboard/inbox/inbox-client.tsx` | Two-panel inbox: conversation list + message thread view. |
| `src/app/dashboard/insurance/insurance-client.tsx` | Interactive insurance verification list with coverage details. |
| `src/app/api/approvals/execute/route.ts` | **Core API**: Approves/rejects AI actions. On approval, executes the action (sends email/SMS for leads, recall messages). Updates status chain. |
| `src/app/api/cron/recall/route.ts` | Weekly recall agent: finds patients >6 months since last visit, generates AI recall messages, queues for approval. |

### New API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/approvals/execute` | POST | Approve/reject AI actions with execution |
| `/api/cron/recall` | GET | Weekly recall scan (cron-secret protected) |

### New Dashboard Pages

| Route | Feature |
|-------|---------|
| `/dashboard/approvals` | Approval Queue - review/approve/edit/reject AI drafts |
| `/dashboard/inbox` | Unified Inbox - conversation threads by patient |

### Architecture Pattern

All dashboard pages follow server/client split:
- `page.tsx` = async server component that fetches from Supabase
- `*-client.tsx` = client component that receives data as serializable props and handles interactivity

This gives SSR benefits (fast initial load, no loading spinners) while preserving client-side interactivity (search, filter, state management).

### Cron Jobs

| Schedule | Route | Purpose |
|----------|-------|---------|
| Mon-Thu 14:00 UTC | `/api/cron/daily-briefing` | AI morning briefing email |
| Monday 17:00 UTC | `/api/cron/recall` | Patient recall scan |

### How to Test

1. **Dashboard Home**: Visit `/dashboard` - should show real counts (0s if DB is empty, which is correct)
2. **Leads**: Submit the website contact form at `/appointment` - creates a lead with AI draft in `/dashboard/leads`
3. **Approval Queue**: After a lead is created, its AI draft appears in `/dashboard/approvals` - click Approve & Send
4. **Inbox**: After sending messages via the approval flow, they appear in `/dashboard/inbox`
5. **Recall Cron**: `curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/recall`
6. **Twilio Webhook**: Configure Twilio webhook URL to `/api/webhooks/twilio` - inbound SMS creates messages and drafts

### Remaining TODOs

- [ ] Connect website contact form POST to `/api/leads` endpoint
- [ ] Add real-time updates via Supabase Realtime subscriptions
- [ ] Add loading.tsx skeleton files for each dashboard page
- [ ] Add error.tsx boundary files for each dashboard page
- [ ] Toast notification system (sonner or react-hot-toast)
- [ ] Patient detail view (`/dashboard/patients/[id]`)
- [ ] Wire billing, calls, analytics, outreach, treatments, settings pages to real data
- [ ] Nylas email integration for inbound email sync
- [ ] PMS (Practice Management System) integration
- [ ] Generate proper Supabase types with `supabase gen types typescript`

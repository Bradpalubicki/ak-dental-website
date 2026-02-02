# Remarketing System - Changelog

## Build Phase: Lead Nurture + Patient Reactivation

### Summary
Built a complete remarketing system with automated lead nurture sequences (6 inquiry types)
and patient reactivation sequences (4 reactivation types). All messages queue for human
approval via the Approval Queue - nothing auto-sends. Includes SMS opt-out compliance,
template-based messaging with AI fallback, and cron-driven processing.

---

### Database Migration (`002_remarketing_system.sql`)

#### New Tables

| Table | Purpose |
|-------|---------|
| `oe_sms_templates` | Reusable SMS templates with variable substitution ({{first_name}}) |
| `oe_lead_nurture_definitions` | Sequence blueprints by inquiry type (step number, delay, channel) |
| `oe_lead_nurture_sequences` | Active sequence tracking per lead (current step, next send time) |
| `oe_reactivation_definitions` | Sequence blueprints by reactivation type |
| `oe_patient_reactivation_sequences` | Active sequence tracking per patient |

#### Schema Changes to Existing Tables

| Table | Change |
|-------|--------|
| `oe_patients` | Added `sms_opt_out` and `email_opt_out` columns |
| `oe_leads` | Added `sms_opt_out` and `email_opt_out` columns |

#### Seed Data

- **6 Lead Nurture Sequences**: new_patient (6 steps), cosmetic (6), implant (6), emergency (4), insurance (5), general (5)
- **4 Reactivation Sequences**: recall (4 steps), incomplete_treatment (4), missed_appointment (3), lapsed (4)
- **~47 SMS Templates**: Professionally written, include practice phone, end with STOP opt-out on final messages

### Files Created

| File | Purpose |
|------|---------|
| `supabase/migrations/002_remarketing_system.sql` | Migration with 5 new tables, opt-out columns, seed data for definitions + templates |
| `src/lib/workflows/lead-nurture-engine.ts` | Engine: enrolls new leads, processes due sequences, generates messages, queues for approval |
| `src/lib/workflows/reactivation-engine.ts` | Engine: identifies lapsed/missed/incomplete patients, enrolls, processes sequences |
| `src/app/api/cron/lead-nurture/route.ts` | Cron route: runs enrollment + processing (every 2hr Mon-Thu) |
| `src/app/api/cron/reactivation/route.ts` | Cron route: runs enrollment + processing (daily Mon-Fri) |

### Files Modified

| File | Change |
|------|--------|
| `src/types/database.ts` | Added 5 new interfaces: SmsTemplate, LeadNurtureDefinition, LeadNurtureSequence, ReactivationDefinition, PatientReactivationSequence |
| `src/app/api/approvals/execute/route.ts` | Added `lead_nurture` and `patient_reactivation` action type handlers with email/SMS sending and sequence tracking |
| `src/app/api/webhooks/twilio/route.ts` | Added SMS opt-out handling (STOP/UNSUBSCRIBE/OPTOUT) - sets flags, pauses sequences, logs compliance |
| `vercel.json` | Added lead-nurture cron (4x/day Mon-Thu) and reactivation cron (daily Mon-Fri) |

### New API Routes

| Route | Method | Schedule | Purpose |
|-------|--------|----------|---------|
| `/api/cron/lead-nurture` | GET | `0 14,16,18,20 * * 1-4` | Enroll leads + process nurture sequences |
| `/api/cron/reactivation` | GET | `0 15 * * 1-5` | Enroll patients + process reactivation sequences |

### Cron Schedule (All Times UTC)

| Schedule | Route | Purpose |
|----------|-------|---------|
| Mon-Thu 14:00 | `/api/cron/daily-briefing` | AI morning briefing email |
| Monday 17:00 | `/api/cron/recall` | Patient recall scan |
| Mon-Thu 14:00, 16:00, 18:00, 20:00 | `/api/cron/lead-nurture` | Lead nurture processing |
| Mon-Fri 15:00 | `/api/cron/reactivation` | Patient reactivation processing |

### Lead Nurture Sequences

| Inquiry Type | Steps | Timespan | Channels |
|-------------|-------|----------|----------|
| new_patient | 6 | 14 days | Email + SMS mix |
| cosmetic | 6 | 14 days | Email + SMS mix |
| implant | 6 | 14 days | Email + SMS mix |
| emergency | 4 | 3 days | SMS-heavy, urgent |
| insurance | 5 | 14 days | Email + SMS mix |
| general | 5 | 14 days | Email + SMS mix |

### Reactivation Sequences

| Type | Trigger | Steps | Timespan |
|------|---------|-------|----------|
| recall | Last visit > 6 months | 4 | 30 days |
| incomplete_treatment | Treatment plan presented but not accepted | 4 | 21 days |
| missed_appointment | No-show in past 7 days | 3 | 7 days |
| lapsed | Last visit > 12 months | 4 | 45 days |

### Architecture

```
Cron fires → Engine scans for eligible leads/patients
  → Enrolls new sequences (if not already active)
  → Processes due sequences (next_send_at <= now)
    → Loads SMS template (or AI generates fallback)
    → Creates oe_ai_actions with status="pending_approval"
      → Staff sees in /dashboard/approvals
        → Approve → sends email/SMS, updates sequence
        → Reject → logs reason, sequence continues to next step
        → Edit → modifies content before sending
```

### Opt-Out Compliance

- Inbound SMS keywords: STOP, UNSUBSCRIBE, OPTOUT, OPT OUT, CANCEL MESSAGES, QUIT
- Sets `sms_opt_out = true` on both `oe_patients` and `oe_leads`
- Immediately pauses all active nurture and reactivation sequences
- Logs compliance action in `oe_ai_actions` audit trail
- Final messages in each sequence include "Reply STOP to opt out"

### How to Test

1. **Lead Nurture**: Create a lead via website form → cron enrolls it → generates messages in approval queue
2. **Reactivation**: Add a patient with `last_visit` > 6 months ago → cron enrolls → approval queue
3. **Manual Cron**: `curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/lead-nurture`
4. **Opt-Out**: Send "STOP" via Twilio → verify patient/lead flagged, sequences paused
5. **Approval Flow**: Approve a nurture/reactivation message → verify SMS/email sent

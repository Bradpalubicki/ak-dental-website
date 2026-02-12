# AK Ultimate Dental / One Engine -- Competitive Analysis & Strategic Roadmap

**Prepared for:** Brad Huston, NuStack Digital Ventures
**Date:** February 2026
**Purpose:** Market positioning, gap analysis, feature roadmap, and pricing strategy

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Competitive Landscape (10 Comparables)](#2-competitive-landscape)
3. [Feature Gap Analysis](#3-feature-gap-analysis)
4. [AI Agent Strategy](#4-ai-agent-strategy)
5. [Scheduling System Design](#5-scheduling-system-design)
6. [Pricing Strategy](#6-pricing-strategy)
7. [Implementation Roadmap & Cost Estimates](#7-implementation-roadmap)
8. [Enhanced Prompt: The One Engine AI Agent](#8-enhanced-prompt)

---

## 1. EXECUTIVE SUMMARY

### The Market Opportunity

The dental practice management software market is **$1.8-$3.2B** (2025), growing at **8.6-11.1% CAGR**. AI in dental is **$559M** (2025) growing to **$3.26B by 2034** (21.78% CAGR).

**The core problem:** Dental practices currently cobble together **5-8 separate vendors** (PMS + comms + analytics + AI + marketing + phone + HR + accounting) spending **$1,800-$4,050/month** with integration headaches, multiple logins, and data silos.

**One Engine's differentiation:** A unified AI-powered operations platform that replaces the entire vendor stack with a single intelligent system. No competitor currently offers:
- AI business advisor + voice AI + scheduling + HR + financials + insurance + marketing in ONE platform
- An AI agent that can execute actions across ALL modules (not just answer phones)
- Proactive intelligence ("You have 47 overdue recall patients worth $28K") vs. passive dashboards

### Where We Stand Today

**Built:** 20 dashboard pages, 64 API routes, 39 database tables, 9 cron jobs, AI advisor, HR module, financial reporting, insurance verification, lead management, treatment presentations, SEO system.

**Critical Gaps vs. Market:** No visual calendar, no voice AI, no patient self-service portal, no clinical charting, no imaging integration, no real-time insurance eligibility, no online booking widget, no unified AI agent.

---

## 2. COMPETITIVE LANDSCAPE

### 10 Comparable Platforms

| # | Platform | Type | Monthly Cost | Key Strength |
|---|----------|------|-------------|-------------|
| 1 | **Dentrix** (Henry Schein) | Legacy PMS | $500-$1,200/mo | Market leader, 40%+ market share |
| 2 | **Eaglesoft** (Patterson) | Legacy PMS | $200-$1,500/mo | Strong imaging integration |
| 3 | **Open Dental** | Open Source PMS | $179-$199/mo | Affordable, extensible, open API |
| 4 | **Curve Dental** | Cloud PMS | $300-$500/provider | Cloud-native + FLO AI (ambient charting) |
| 5 | **Archy** | AI-First PMS | $535-$1,345/mo | Pearl AI imaging, Ask Archy AI, native mobile app |
| 6 | **CareStack** | Enterprise PMS | $698+/mo | Multi-site scheduling, all-in-one |
| 7 | **Weave** | Communications | $249-$800+/mo | VoIP + AI receptionist (TrueLark acquisition) |
| 8 | **NexHealth** | Patient Engagement | $350+/mo | Online booking, forms, messaging |
| 9 | **Dental Intelligence** | Analytics | $499-$600/mo | Morning huddle, production tracking |
| 10 | **Arini** | AI Receptionist | $300-$800/mo est. | Voice AI scheduling, 15M+ dental interactions |

### Detailed Comparison

#### Tier 1: Full PMS Platforms

**Dentrix / Dentrix Ascend** (Henry Schein)
- Market leader with 40%+ share of US dental practices
- Full clinical charting, treatment planning, imaging viewer
- Insurance claims management + electronic attachments
- Patient communication add-ons (extra cost)
- Weakness: Legacy architecture, expensive, poor UX, slow innovation
- Pricing: On-premise $5,000-$10,000 upfront + 18-22%/yr maintenance; Cloud $500-$1,200/mo

**Eaglesoft** (Patterson Dental)
- Second largest market share
- Strong imaging integration (Patterson owns imaging hardware)
- Treatment planning, charting, scheduling, billing
- Weakness: Windows-only, feels dated, proprietary data lock-in
- Pricing: ~$200/mo (1 user) to ~$1,500/mo (10 users) + $3,000-$50,000 implementation

**Open Dental**
- Open-source with strong community
- Full PMS features + open API for custom integrations
- eServices add-ons: texting ($5+$0.04/msg), eConfirmations ($25-$40/mo), web scheduling ($75/mo)
- Weakness: Dated UI, requires tech-savvy office, no built-in AI
- Pricing: $199/mo first year, $129/mo after (rising to $149 in Mar 2026), +$20/mo per additional provider beyond 3

**Curve Dental**
- True cloud-native PMS (no install, browser-based)
- Launched FLO AI (Aug 2025): ambient clinical voice capture, AI charting, Pearl X-ray analysis
- Weakness: Smaller market share, newer AI features unproven at scale
- Pricing: $300-$500/provider/mo

**Archy** (Founded by Uber alumni, $20M Series B, 300% YoY growth)
- AI-first platform serving 2.5M patients across 45 states, $100M+ annual payment processing
- **Ask Archy**: Conversational AI for querying business data in natural language
- **Archy Intelligence**: AI agents for staffing, billing, insurance verification, reporting
- Pearl AI imaging at Platinum tier (FDA-cleared diagnostics)
- First dental PMS with true native mobile app (iPhone/Android, Jan 2026)
- Integrated comms: 2-way texting, MMS, email marketing, team chat, huddle
- Weakness: Newer/smaller market share, Platinum tier expensive, limited third-party integrations
- Pricing: Silver $535/mo, Gold $805/mo, **Platinum $1,345/mo**

**CareStack**
- Enterprise-grade, built for multi-location groups and DSOs
- Unified scheduling across sites, providers, and operatories with production calendars
- Patient portal with self-scheduling, payments, form signing
- Daily goal tracking per provider per operatory
- Weakness: Complex, overkill for solo practices, higher price point
- Pricing: Starting at $698/mo

**Denticon** (Planet DDS) -- First cloud PMS in dentistry, 45,000+ users
- Centralized scheduling and patient records across all locations
- **AI Voice Perio**: Voice-activated hands-free charting directly in clinical data model
- **AI Assist**: Reviews AI opportunities for patients on today's schedule
- **AutoEligibility**: Real-time insurance data pulled automatically
- **MyTooth**: Mobile-first patient portal with online scheduling and digital forms
- Native analytics -- "run any report you imagine" with DSO-level rollups
- Weakness: Higher price point, DSO-focused may be overkill for solo
- Pricing: $750-$986+/mo

**tab32** -- Cloud-native, 7.3M patients tracked
- Pearl AI integration for real-time radiograph analysis (FDA-cleared)
- **Open Data Warehousing** -- full data portability and ownership (unique)
- Per-use AI pricing (pay only for what you use vs. flat monthly)
- In-house payment plans + membership plan management built-in
- Multi-specialty customization
- Weakness: Smaller market share, per-use AI costs can add up
- Pricing: $199/mo (1 user) to $999/mo (10 users), $2,499/mo (100 users)

#### Tier 2: Engagement & AI Platforms

**Weave**
- Unified communications: VoIP, texting, email, reviews
- Acquired TrueLark for $35M (May 2025) -- AI receptionist
- AI call intelligence: analyzes calls, recovers missed bookings
- Integrates with Dentrix, Eaglesoft, Open Dental
- Weakness: Expensive at higher tiers, not a full PMS
- Pricing: Pro $249/mo, Elite mid-tier, Ultimate top-tier + $750 setup

**NexHealth**
- Patient engagement layer that sits on top of existing PMS
- Online booking, digital forms, messaging, reviews, waitlist
- Real-time PMS sync (Dentrix, Eaglesoft, Open Dental)
- Weakness: Not a PMS replacement, just an engagement add-on
- Pricing: Starting ~$350/mo

**Dental Intelligence**
- Practice analytics and business intelligence
- Morning Huddle feature: daily team briefing with KPIs
- Quick-Fill: auto-contacts ASAP list when cancellations happen
- Treatment tracker: monitors acceptance rates
- Weakness: Analytics only, no PMS or communications
- Pricing: ~$499-$600/mo

**Arini** (AI Receptionist)
- Y Combinator-backed, market leader in dental voice AI
- Handles scheduling, rescheduling, cancellations conversationally
- Trained on 15M+ dental interactions
- Integrates with OpenDental, EagleSoft, Denticon, Dentrix + phone systems
- Documented ROI: $56,000+ in new patient appointments in first month
- Weakness: Phone only (no full PMS, no clinical, no financials)
- Pricing: Custom, estimated $300-$800/mo based on volume

### Additional AI Players Worth Noting

| Platform | What It Does | Price | Relevance |
|----------|-------------|-------|-----------|
| **Pearl** | AI radiograph analysis, pathology detection | $349/mo | Could integrate for imaging AI |
| **Overjet** | AI imaging + voice clinical documentation | Enterprise | Acquired DentalBee, rolling out to 216 NADG locations |
| **Denti.AI** | Voice perio charting, X-ray AI | $49/mo (detect) | Hands-free charting in under 5 min |
| **DentalRobot** | Insurance verification automation | Custom | Automates 93% of front-desk insurance tasks |
| **Newton/Sophia** | AI agent for calls + texts + analytics | Custom | YC-backed, $3.8M seed round |
| **My AI Front Desk** | Budget AI receptionist | $45/mo | Cheapest option, good for comparison |

---

## 3. FEATURE GAP ANALYSIS

### What We Have vs. What the Market Expects

| Feature | AK Ultimate Dental | Dentrix | Curve | Archy | Weave | Gap Level |
|---------|-------------------|---------|-------|-------|-------|-----------|
| **Visual Calendar (Day/Week/Month)** | List view only | Full calendar | Full calendar | Full calendar | N/A | **CRITICAL** |
| Schedule Blocking (vacation, lunch) | Not built | Yes | Yes | Yes | N/A | **CRITICAL** |
| Multi-Provider Side-by-Side | Not built | Yes | Yes | Yes | N/A | **HIGH** |
| Online Patient Booking | Not built | Add-on | Built-in | Built-in | Yes | **HIGH** |
| Patient Self-Service Portal | Not built | Yes | Yes | Yes | Yes | **HIGH** |
| AI Voice Agent (Phone) | Vapi stubbed | No | No | No | Yes (TrueLark) | **HIGH** |
| Unified AI Agent (do anything) | Advisor only | No | FLO AI (clinical) | No | No | **DIFFERENTIATOR** |
| Clinical Charting | Not built | Yes | Yes | Yes | N/A | Medium (not our market) |
| X-Ray/Imaging Viewer | Not built | Yes | Yes | Pearl built-in | N/A | Medium |
| AI Imaging Analysis | Not built | No | Pearl via FLO | Pearl built-in | No | Medium |
| Treatment Presentations | **Built** | Yes | Yes | Yes | N/A | **DONE** |
| Insurance Verification | **Built** | Yes | Yes | Yes | No | **DONE** |
| Real-Time Eligibility API | Not built | Add-on | Add-on | No | No | HIGH |
| Appointment Reminders | **Built** (cron) | Yes | Yes | Yes | Yes | **DONE** |
| 2-Way SMS | Twilio stubbed | Add-on | Yes | Yes | Yes | HIGH |
| Patient Recall Campaigns | **Built** (cron) | Add-on | Yes | Yes | Yes | **DONE** |
| Lead Management | **Built** | No | No | Basic | No | **AHEAD** |
| AI Lead Response Drafting | **Built** | No | No | No | No | **AHEAD** |
| Morning Briefing | **Built** (cron) | No | No | No | No | **AHEAD** |
| AI Business Advisor | **Built** | No | No | No | No | **AHEAD** |
| HR & Payroll | **Built** | No | No | No | No | **AHEAD** |
| Employee Write-Ups + Signing | **Built** | No | No | No | No | **AHEAD** |
| Licensing/Compliance Tracking | **Built** | No | No | No | No | **AHEAD** |
| Financial P&L | **Built** | Limited | No | No | No | **AHEAD** |
| AR Aging / Collections | **Built** | Yes | Yes | Basic | No | **DONE** |
| Insurance Claims Filing | Not built | Yes | Yes | Yes | No | Medium |
| HIPAA Audit Logging | **Built** | Yes | Yes | Yes | N/A | **DONE** |
| Approval Queue (AI Actions) | **Built** | No | No | No | No | **AHEAD** |
| SEO Management | **Built** | No | No | No | No | **AHEAD** |
| VoIP Phone System | Not built | No | No | No | Yes | LOW (partner) |
| Waitlist / ASAP List | Not built | Yes | Yes | Yes | Yes | HIGH |
| Digital Patient Forms | Not built | Add-on | Yes | Yes | Yes | HIGH |
| Review Generation | Not built | No | No | No | Yes | Medium |

### Summary: Where We're AHEAD

One Engine has features NO competitor offers in a single platform:
1. AI Business Advisor (conversational, multi-turn, context-aware)
2. AI-drafted lead responses with approval queue
3. Automated morning briefings
4. Full HR module (write-ups, tablet signing, licensing, credentials)
5. Financial P&L with trending
6. SEO management system
7. AI action approval workflow
8. HIPAA audit logging built-in

### Summary: CRITICAL Gaps to Fill

1. **Visual Calendar** -- Every PMS has a real calendar; our list view is unusable for daily operations
2. **Schedule Blocking** -- Must be able to block lunch, vacation, holidays, emergency holds
3. **Online Booking** -- Patients expect to self-schedule from the website
4. **AI Agent** -- The unified "do anything" agent that ties all modules together
5. **Patient Portal** -- Self-service for forms, appointments, payments, records

---

## 4. AI AGENT STRATEGY

### The Vision: One Engine AI Agent

Instead of dozens of separate tools, One Engine has a **single intelligent agent** that staff can interact with via **text or voice** from anywhere in the dashboard. The agent can:

**Tier 1 -- Automate Immediately (Highest ROI)**
1. Answer inbound phone calls (after-hours + overflow) and book appointments
2. Schedule, reschedule, and cancel appointments via natural language
3. Send appointment reminders and confirmations
4. Run patient recall/reactivation campaigns
5. Check insurance eligibility in real-time
6. Answer patient FAQs (hours, location, services, insurance accepted)

**Tier 2 -- Automate Next**
7. Manage waitlist/ASAP list -- auto-fill cancellation gaps
8. Distribute intake forms to new patients
9. Follow up on presented treatment plans
10. Collect post-treatment feedback
11. Nurture unconverted leads
12. Handle billing inquiries and send payment links

**Tier 3 -- AI-Assisted (Staff + AI)**
13. Pull reports ("Show me this week's production")
14. Navigate the system ("Take me to John Smith's record")
15. Draft communications ("Write a recall email for patients overdue 6+ months")
16. Analyze trends ("Why are our no-shows up this month?")
17. Manage HR tasks ("Create a coaching note for Sarah")
18. Generate financial insights ("What's our collection rate trend?")

### Agent UI Architecture (4 Layers)

1. **Persistent Sidebar Panel** (Right side of dashboard)
   - Collapsible panel accessible from ANY dashboard page
   - Text input + voice input toggle
   - Shows agent responses, actions taken, suggestions
   - Quick action buttons for common tasks
   - Context-aware: knows what page you're on
   - This is the PRIMARY interaction point for staff

2. **Command Bar** (Cmd+K / Ctrl+K)
   - Quick-access command palette overlay
   - Type natural language commands: "schedule John Smith for cleaning Tuesday 2pm"
   - Search across all modules (patients, appointments, employees, leads)
   - Keyboard-first for power users

3. **Floating Widget** (Public website, patient-facing)
   - Bottom-right chat bubble on marketing pages
   - Handles: appointment requests, FAQs, lead capture
   - Branded to match practice
   - Hands off to human when needed

4. **Voice Channel** (Phone integration via Vapi)
   - Answers inbound calls 24/7
   - Books directly into calendar
   - Handles cancellations, rescheduling
   - Routes emergencies to on-call provider
   - Transcribes and logs all calls

### Technology Stack for Agent

| Component | Technology | Cost |
|-----------|-----------|------|
| LLM (Brain) | Claude Sonnet 4 / Opus | ~$0.003-$0.015 per interaction |
| Voice AI | Vapi | $0.05/min base + STT/TTS ($0.13-$0.31/min all-in) |
| Speech-to-Text | Deepgram (via Vapi) | Included in Vapi pricing |
| Text-to-Speech | ElevenLabs/PlayHT (via Vapi) | Included in Vapi pricing |
| Telephony | Twilio (via Vapi) | Included in Vapi pricing |
| Chat UI | Custom React component | Built in-house |
| HIPAA Compliance | Vapi BAA | $1,000/mo add-on |

### Competitive Positioning

| Feature | Arini | Weave | Newton | **One Engine** |
|---------|-------|-------|--------|---------------|
| Voice AI calls | Yes | Yes | Yes | **Yes** |
| SMS/Text | No | Yes | Yes | **Yes** |
| Web chat | No | No | Yes | **Yes** |
| In-app agent | No | No | No | **Yes** |
| Scheduling | Yes | Yes | Yes | **Yes** |
| Insurance verification | No | No | No | **Yes** |
| Financial analysis | No | No | No | **Yes** |
| HR management | No | No | No | **Yes** |
| Lead management | No | No | No | **Yes** |
| Treatment presentations | No | No | No | **Yes** |
| Report generation | No | No | No | **Yes** |
| Cross-module actions | No | No | No | **Yes** |

**No competitor has an AI agent that can operate across ALL practice modules.** This is our moat.

---

## 5. SCHEDULING SYSTEM DESIGN

### Required Calendar Views

#### Daily View (Mission Critical)
- **Column-per-provider** layout (side-by-side)
- 15-minute time slot increments (configurable 10/15/20/30)
- Color-coded by appointment type (cleaning=blue, exam=green, crown=orange, emergency=red)
- Status indicators: Scheduled, Confirmed, Checked-In, In-Chair, Completed, No-Show, Cancelled
- Drag-and-drop rescheduling within the day
- Click-to-book on empty slots
- Patient name, procedure, duration, insurance verified badge
- Blocked time shown as gray/hatched (lunch, meetings, PTO)
- Emergency hold slots highlighted

#### Weekly View
- Provider rows x 7 day columns
- Shows appointment density per day (utilization %)
- Highlights gaps and openings
- Color intensity indicates how full each day is
- Click a day to drill into daily view
- Blocked days clearly marked (closures, PTO)

#### Monthly View
- Calendar grid with appointment counts per day
- Practice closures highlighted (holidays, vacation days)
- Provider PTO overlay
- Production target vs. actual overlay
- Click a day to drill into daily view

### Schedule Blocking System

| Block Type | Scope | Recurrence | Examples |
|-----------|-------|------------|---------|
| **Practice Closure** | All providers | One-time or recurring | Holidays, office renovation |
| **Provider PTO** | Single provider | One-time | Vacation, sick day, CE course |
| **Lunch Break** | Per provider | Daily recurring | 12:00-1:00 PM |
| **Meeting** | Per provider or all | Recurring | Morning huddle 7:45-8:00 |
| **Emergency Hold** | Per provider | Daily recurring | 1-2 reserved emergency slots |
| **Production Block** | Per provider | Recurring | Reserve AM for high-value procedures |
| **Custom Block** | Flexible | Any | Staff training, equipment maintenance |

### Implementation: Tie to EMR/PMS

The calendar should support:
- **Import from PMS**: Sync provider schedules from Dentrix/Eaglesoft/Open Dental via API
- **Push to PMS**: When appointments are booked in One Engine, push to connected PMS
- **Practice Hours Template**: Define default operating hours (Mon-Thu 8am-5pm, Fri 8am-2pm)
- **One-click day closure**: Select a date, check "Close Practice", add reason -- blocks all providers
- **Bulk block**: Select date range for provider PTO (e.g., "Dr. Alex out Dec 23-Jan 2")

### Smart Scheduling (AI-Powered)

- **Waitlist Auto-Fill**: When cancellation occurs, AI texts ASAP list patients to fill the gap
- **Production Optimization**: AI prioritizes high-value procedures during peak hours
- **No-Show Prediction**: AI flags high-risk appointments (based on history) for extra confirmation
- **Provider Matching**: AI suggests best provider based on procedure type, patient preference, and availability
- **Buffer Time**: Auto-add sterilization/setup time between procedures (configurable 10-15 min)

---

## 6. PRICING STRATEGY

### Recommended Pricing Model: Per Location

| Tier | Name | Price/mo | Target | Includes |
|------|------|---------|--------|----------|
| 1 | **Starter** | $499/mo | Solo practice (1-2 providers) | Scheduling + calendar, patient management, appointment reminders, basic analytics, digital forms, lead management |
| 2 | **Professional** | $899/mo | Group practice (2-5 providers) | Everything in Starter + AI business advisor, AI lead responses, insurance verification, treatment presentations, marketing automation (recall, reactivation, nurture), HR basics |
| 3 | **Enterprise** | $1,499/mo | Multi-location / DSO | Everything in Pro + AI voice agent (phone), advanced analytics, full HR & payroll integration, P&L dashboards, compliance tracking, custom AI training, API access |

**Add-ons:**
- Additional providers beyond 3: +$99/mo each
- AI Voice Agent (for Starter/Pro): +$299/mo
- Real-time insurance eligibility API: +$149/mo
- AI imaging integration (Pearl/Overjet): +$249/mo
- White-label / custom branding: +$199/mo
- HIPAA BAA for voice AI: included in Enterprise, +$99/mo for others

### Why This Pricing Works

**vs. Current piecemeal stack ($1,800-$4,050/mo for 5-8 vendors):**
- Even Enterprise at $1,499 saves money while eliminating vendor complexity
- Professional at $899 replaces PMS ($300-$500) + comms ($249) + analytics ($499) = $1,048-$1,248

**vs. Competitors:**
- vs. Archy Gold ($805/mo): Similar price, but we include AI agent, HR, financials, voice
- vs. Dentrix Ascend ($500-$1,200/mo): We include AI, comms, analytics, HR that Dentrix charges extra for
- vs. Open Dental ($179/mo + $300+ in add-ons): We're more expensive but infinitely more capable
- vs. CareStack ($698/mo): Our Professional tier is comparable but includes AI

**Revenue Projections:**

| Year | Practices | Avg MRR | Monthly Revenue | Annual Revenue |
|------|-----------|---------|----------------|----------------|
| Year 1 | 10 | $899 | $8,990 | $107,880 |
| Year 2 | 50 | $999 | $49,950 | $599,400 |
| Year 3 | 200 | $1,099 | $219,800 | $2,637,600 |
| Year 5 | 500 | $1,199 | $599,500 | $7,194,000 |

---

## 7. IMPLEMENTATION ROADMAP & COST ESTIMATES

### Phase 1: Visual Calendar + Schedule Blocking (4-6 weeks)
**Priority: CRITICAL -- This is the #1 gap**

| Task | Effort | Cost Estimate |
|------|--------|--------------|
| Daily calendar view (column-per-provider, 15-min slots) | 2 weeks | $5,000-$8,000 |
| Weekly view (density overview) | 1 week | $2,000-$3,000 |
| Monthly view (overview + closures) | 1 week | $2,000-$3,000 |
| Schedule blocking system (PTO, lunch, closures, emergency holds) | 1.5 weeks | $3,000-$5,000 |
| Drag-and-drop rescheduling | 0.5 weeks | $1,500-$2,500 |
| **Phase 1 Total** | **4-6 weeks** | **$13,500-$21,500** |

Library recommendation: `@schedule-x/react` or custom with `date-fns` + CSS Grid. Avoid FullCalendar (bloated, poor DX).

### Phase 2: AI Agent -- Sidebar + Command Bar (3-4 weeks)
**Priority: HIGH -- This is our differentiator**

| Task | Effort | Cost Estimate |
|------|--------|--------------|
| Persistent right sidebar agent panel (text + voice toggle) | 1 week | $2,500-$4,000 |
| Command bar (Cmd+K) with natural language | 1 week | $2,500-$4,000 |
| Agent tool system (connect to all API routes) | 1.5 weeks | $4,000-$6,000 |
| Context awareness (knows current page, recent actions) | 0.5 weeks | $1,500-$2,500 |
| Voice input (browser Speech API for in-app) | 0.5 weeks | $1,000-$2,000 |
| **Phase 2 Total** | **3-4 weeks** | **$11,500-$18,500** |

### Phase 3: Voice AI Phone Agent via Vapi (2-3 weeks)
**Priority: HIGH -- Major revenue driver**

| Task | Effort | Cost Estimate |
|------|--------|--------------|
| Vapi integration + HIPAA BAA setup | 0.5 weeks | $2,000-$3,000 |
| Inbound call handling agent (scheduling, FAQs) | 1 week | $3,000-$5,000 |
| After-hours emergency triage | 0.5 weeks | $1,500-$2,500 |
| Call logging + transcription storage | 0.5 weeks | $1,500-$2,500 |
| **Phase 3 Total** | **2-3 weeks** | **$8,000-$13,000** |

**Ongoing cost:** Vapi ~$300-$500/mo for typical practice call volume + $1,000/mo HIPAA BAA

### Phase 4: Patient Self-Service (2-3 weeks)
**Priority: HIGH**

| Task | Effort | Cost Estimate |
|------|--------|--------------|
| Online booking widget (embeddable on website) | 1 week | $3,000-$5,000 |
| Patient portal (view appointments, forms, payments) | 1.5 weeks | $4,000-$6,000 |
| Digital intake forms (new patient paperwork) | 0.5 weeks | $1,500-$2,500 |
| **Phase 4 Total** | **2-3 weeks** | **$8,500-$13,500** |

### Phase 5: Smart Scheduling + Waitlist (1-2 weeks)
**Priority: MEDIUM**

| Task | Effort | Cost Estimate |
|------|--------|--------------|
| Waitlist / ASAP list management | 0.5 weeks | $1,500-$2,500 |
| Auto-fill cancellation gaps (AI contacts waitlist via SMS) | 0.5 weeks | $1,500-$2,500 |
| No-show prediction model | 0.5 weeks | $1,500-$2,500 |
| Production-optimized scheduling | 0.5 weeks | $1,500-$2,500 |
| **Phase 5 Total** | **1-2 weeks** | **$6,000-$10,000** |

### Phase 6: Integration Activation (2-3 weeks)
**Priority: MEDIUM**

| Task | Effort | Cost Estimate |
|------|--------|--------------|
| Twilio SMS activation (env vars + testing) | 0.5 weeks | $1,000-$1,500 |
| Stripe payments integration | 1 week | $3,000-$5,000 |
| Clerk auth full wiring | 0.5 weeks | $1,500-$2,500 |
| Real-time insurance eligibility API | 1 week | $3,000-$5,000 |
| **Phase 6 Total** | **2-3 weeks** | **$8,500-$14,000** |

### Phase 7: Website Chat Widget + Review Generation (1-2 weeks)
**Priority: MEDIUM-LOW**

| Task | Effort | Cost Estimate |
|------|--------|--------------|
| Public-facing chat widget (lead capture + FAQs) | 1 week | $2,500-$4,000 |
| Review request automation (post-appointment) | 0.5 weeks | $1,500-$2,500 |
| **Phase 7 Total** | **1-2 weeks** | **$4,000-$6,500** |

### TOTAL INVESTMENT SUMMARY

| Phase | Timeline | Cost Range | Priority |
|-------|----------|-----------|----------|
| Phase 1: Visual Calendar | 4-6 weeks | $13,500-$21,500 | CRITICAL |
| Phase 2: AI Agent Sidebar | 3-4 weeks | $11,500-$18,500 | HIGH |
| Phase 3: Voice AI (Vapi) | 2-3 weeks | $8,000-$13,000 | HIGH |
| Phase 4: Patient Self-Service | 2-3 weeks | $8,500-$13,500 | HIGH |
| Phase 5: Smart Scheduling | 1-2 weeks | $6,000-$10,000 | MEDIUM |
| Phase 6: Integration Activation | 2-3 weeks | $8,500-$14,000 | MEDIUM |
| Phase 7: Chat Widget + Reviews | 1-2 weeks | $4,000-$6,500 | MEDIUM-LOW |
| **TOTAL** | **15-23 weeks** | **$60,000-$97,000** | |

**Monthly ongoing costs (per practice):**
- Vapi voice AI: $300-$500/mo
- Vapi HIPAA BAA: $1,000/mo (can be shared across practices)
- Anthropic Claude API: $50-$200/mo
- Twilio SMS: $50-$150/mo
- Resend email: $20-$50/mo
- Supabase: $25-$75/mo
- Vercel: $20-$40/mo
- **Total infrastructure per practice: ~$465-$1,015/mo**

At $899/mo Professional tier, margins are thin for solo practice but improve dramatically with scale (shared HIPAA BAA, volume discounts, multi-tenant architecture).

---

## 8. ENHANCED PROMPT: THE ONE ENGINE AI AGENT

### Original Request (Enhanced)

> Build a unified AI agent for the AK Ultimate Dental / One Engine platform that serves as the central intelligence layer for the entire practice. The agent should be accessible via:
>
> **1. Persistent Sidebar Panel (Right side, all dashboard pages)**
> - Collapsible/expandable panel with text input and voice input toggle
> - Context-aware: knows the current page, selected patient, active module
> - Shows conversation history, actions taken, and pending suggestions
> - Quick action chips for common tasks based on current context
> - "What can I do?" help mode that shows all available commands
>
> **2. Command Palette (Ctrl+K / Cmd+K)**
> - Instant search across all modules (patients, appointments, employees, leads)
> - Natural language commands: "Schedule Maria for crown prep next Tuesday at 10am with Dr. Alex"
> - Quick navigation: "Go to John Smith's patient record"
> - Report generation: "Show me this month's collection rate"
>
> **3. Voice Channel (Vapi Integration)**
> - Answer inbound phone calls 24/7
> - Book, reschedule, cancel appointments conversationally
> - Handle emergency triage (route to on-call)
> - Answer FAQs (hours, location, services, insurance accepted)
> - Log all calls with transcription in the Calls module
> - Multilingual support (English, Spanish minimum)
>
> **4. Website Chat Widget (Public-facing)**
> - Floating chat bubble on marketing pages
> - Lead capture: name, phone, email, reason for visit
> - Appointment request routing to scheduling system
> - FAQ handling with branded personality
> - Seamless handoff to human when needed
>
> ### Agent Capabilities (Must Have)
>
> The agent MUST be able to:
> - **Schedule**: Create, modify, cancel appointments across all providers
> - **Patient Lookup**: Find patients by name, DOB, phone, or ID
> - **Insurance**: Check verification status, explain coverage details
> - **Leads**: Respond to new leads, update status, assign to team member
> - **HR**: Look up employee info, create documents, check compliance status
> - **Financials**: Pull revenue reports, AR aging, collection rates
> - **Analytics**: Answer questions about practice performance, trends
> - **Navigate**: Take users to any page or record in the system
> - **Draft**: Create emails, SMS messages, treatment summaries for approval
> - **Explain**: Describe any feature, teach new staff how to use the system
>
> ### Agent Personality
>
> - Professional but warm, like a trusted office manager
> - Proactive: surfaces insights without being asked ("I noticed 3 patients are overdue for recall worth $4,200")
> - Efficient: completes actions in minimum steps
> - Safe: routes to approval queue for irreversible actions (sending messages, deleting records)
> - Transparent: always explains what it did and why
>
> ### Technical Architecture
>
> - Claude Sonnet 4 as the reasoning engine
> - Tool-use pattern: agent has access to all 64+ API routes as callable tools
> - Streaming responses for real-time feel
> - Conversation persistence (resume where you left off)
> - Rate limiting and cost controls per practice
> - HIPAA-compliant data handling (no PHI in logs shipped externally)

---

## APPENDIX: SOURCES

### Practice Management Systems
- Dentrix: selecthub.com, wiredforthefuture.com
- Eaglesoft: itqlick.com
- Open Dental: opendental.com/site/fees.html
- Curve Dental: curvedental.com, selecthub.com
- Archy: capterra.com
- CareStack: carestack.com

### AI & Voice Platforms
- Arini: arini.ai, aichief.com
- Vapi: vapi.ai, blog.dograh.com, softailed.com
- Overjet: overjet.com
- Denti.AI: denti.ai, prnewswire.com
- Newton: ycombinator.com, newsfilecorp.com
- My AI Front Desk: myaifrontdesk.com
- TrueLark/Weave: businesswire.com, truelark.com

### Engagement & Analytics
- Weave: getweave.com, emitrr.com
- NexHealth: softwarefinder.com
- Dental Intelligence: dentalintel.com, softwarefinder.com
- RevenueWell: revenuewell.com

### Market Research
- Dental PMS Market: precedenceresearch.com, mordorintelligence.com
- AI in Dental Market: towardshealthcare.com
- Pricing Analysis: getmonetizely.com, tekkis.com
- Switching Costs: withwisdom.com
- AI Adoption: dentaleconomics.com, hellopearl.com

---

*This analysis was compiled using data from 30+ sources including vendor websites, pricing pages, industry reports, and market research. Pricing data is current as of February 2026 but may vary by region and negotiation.*

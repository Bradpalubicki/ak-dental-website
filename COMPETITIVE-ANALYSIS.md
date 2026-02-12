# One Engine — Competitive Analysis & Strategic Roadmap

**Prepared for:** Brad Huston, NuStack Digital Ventures
**Date:** February 2026
**Purpose:** Market positioning, gap analysis, integration strategy, vendor partnerships, and pricing

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Strategic Position: What One Engine IS and ISN'T](#2-strategic-position)
3. [Direct Competitors (10 Engagement Platforms)](#3-direct-competitors)
4. [Competitive Feature Matrix](#4-competitive-feature-matrix)
5. [PMS Integration Architecture](#5-pms-integration-architecture)
6. [Vendor Integration Map: Build vs. Partner](#6-vendor-integration-map)
7. [Affiliate & Partner Revenue Opportunities](#7-affiliate--partner-revenue)
8. [AI Agent Strategy](#8-ai-agent-strategy)
9. [Pricing Strategy](#9-pricing-strategy)
10. [Implementation Roadmap & Costs](#10-implementation-roadmap)

---

## 1. EXECUTIVE SUMMARY

### The Market Opportunity

The dental engagement/operations software market sits on top of a **$2.98B PMS market** (2025) growing at **10.8% CAGR**. AI in dental is **$559M** (2025) growing to **$3.26B by 2034** (21.78% CAGR). There are **~200,000 dental clinics** in the US, and the DSO market alone is **$161B** (2025) heading to **$584B by 2032**.

**The core problem:** Dental practices run a PMS (Dentrix, Eaglesoft, Open Dental) for clinical work, then bolt on **4-7 additional vendors** (communications, analytics, reviews, AI, phone, marketing, payments) spending **$1,200-$3,000+/month** on top of their PMS — with no coordination between them.

### What One Engine Does Differently

One Engine is **NOT a practice management system**. It is an **AI-powered operations and engagement layer** that sits on top of existing PMS systems and unifies all the add-on vendor tools into a single intelligent platform.

**Think of it as:** Weave's communications + Dental Intelligence's analytics + Arini's AI voice + RevenueWell's marketing + HR/financials/compliance — all powered by a single AI brain that can take action across every module.

**No competitor currently offers:**
- An AI agent that operates across ALL modules (not just phones or analytics)
- Proactive business intelligence ("47 overdue recall patients worth $28K")
- HR, payroll, licensing, compliance in the same platform as patient engagement
- Financial P&L, AR aging, collections alongside scheduling and communication

### Where We Stand Today

**Built:** 20 dashboard pages, 64 API routes, 39 database tables, 9 cron jobs, AI business advisor, HR module, financial reporting, insurance verification, lead management, treatment presentations, SEO system, approval workflows.

**What competitors have that we need:** VoIP phone integration, review generation, AI voice receptionist, patient self-service portal, real-time insurance eligibility, online booking widget, visual calendar, 2-way SMS activation.

---

## 2. STRATEGIC POSITION

### What One Engine IS

| One Engine IS... | Examples |
|-----------------|---------|
| AI operations layer ON TOP of PMS | Reads/writes to Dentrix, Eaglesoft, Open Dental via their APIs |
| Unified engagement platform | Replaces Weave + Dental Intelligence + RevenueWell + Arini |
| AI-first business advisor | Proactive insights, automated actions, approval workflows |
| Practice operations hub | HR, payroll, licensing, financials, compliance — all in one |
| Integration orchestrator | Connects PMS, phone, payments, insurance, reviews into one UI |

### What One Engine IS NOT

| One Engine is NOT... | Who does this |
|---------------------|---------------|
| A PMS replacement | Dentrix, Eaglesoft, Open Dental, Curve, Archy |
| A clinical charting tool | PMS handles charting, perio, treatment plans |
| An imaging/X-ray system | Pearl, Overjet, Denti.AI |
| A phone/VoIP provider | We integrate with Weave, RingCentral, or Twilio |
| An insurance clearinghouse | We integrate with Vyne Dental, DentalXChange, Availity |
| A payroll processor | We integrate with ADP, Gusto |
| A payment processor | We integrate with Stripe |

### The Integration Model

```
┌─────────────────────────────────────────────────────┐
│                   ONE ENGINE                         │
│    AI Operations & Engagement Layer                  │
│                                                      │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ AI Agent │ │ Analytics│ │ Comms    │ │ HR/Ops  │ │
│  │ (Voice + │ │ Morning  │ │ SMS/Email│ │ Payroll │ │
│  │  Text)   │ │ Huddle   │ │ Reviews  │ │ Financ. │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬────┘ │
│       │             │            │             │      │
│  ─────┴─────────────┴────────────┴─────────────┴──── │
│                INTEGRATION LAYER                      │
└──────┬──────────┬──────────┬──────────┬──────────┬───┘
       │          │          │          │          │
  ┌────┴───┐ ┌───┴───┐ ┌───┴────┐ ┌───┴───┐ ┌───┴────┐
  │  PMS   │ │ Phone │ │Payment │ │ Insur.│ │HR/Pay  │
  │Dentrix │ │ Vapi  │ │ Stripe │ │ Vyne  │ │  ADP   │
  │Eagle   │ │Twilio │ │        │ │       │ │ Gusto  │
  │OpenDent│ │       │ │        │ │       │ │        │
  └────────┘ └───────┘ └────────┘ └───────┘ └────────┘
```

---

## 3. DIRECT COMPETITORS

### Competitive Landscape Overview

| # | Platform | Focus | Monthly Cost | Customers | Key Differentiator |
|---|----------|-------|-------------|-----------|-------------------|
| 1 | **Weave** | VoIP + AI Receptionist | $399-$500+/mo | 370+ loc (DCA alone) | Integrated VoIP phone system |
| 2 | **NexHealth** | Online Booking + Forms | $350+/mo | 10,000+ practices | 35+ PMS integrations, unicorn |
| 3 | **Dental Intelligence** | Analytics + Huddle | Custom (~$499-600) | N/A | Morning Huddle, Provider Pulse |
| 4 | **RevenueWell** | Marketing Automation | $189-custom/mo | N/A | Lowest entry price, acquired PBHS |
| 5 | **Adit** | All-in-One Engagement | $399+/mo | 5,000+ practices | AI call intelligence, DSO focus |
| 6 | **Solutionreach** | Patient Communication | $329+/mo | N/A | 400+ PMS integrations, Revenue Cycle |
| 7 | **Lighthouse 360** | Communication Platform | $329+/mo | N/A | Henry Schein backing |
| 8 | **Podium** | Reviews + Messaging | $399-$599+/mo | Multi-industry | HIPAA messaging, review generation |
| 9 | **Yapi** | Digital Forms | $100-$500/mo | N/A | Zero-click PMS form sync |
| 10 | **Arini** | AI Voice Receptionist | Custom ($300-800 est.) | Y Combinator backed | 24/7 AI voice, multilingual |

### Detailed Competitor Profiles

---

#### 1. WEAVE — VoIP + AI Receptionist

**Pricing:**
- Essentials: $399/mo + $750 setup
- Pro: $400-$500/mo (VoIP, 1,500 bulk messages, call routing, analytics)
- Elite: Custom (3,000 bulk messages, online scheduling, digital forms)

**Key Move:** Acquired TrueLark for $35M (May 2025) — AI receptionist with 6M+ calls processed, automates 80% of patient interactions. Also partnered with Patterson to bundle into Eaglesoft (Jan 2025).

**PMS Integrations:** 20+ including Dentrix, Eaglesoft, Open Dental, Curve

**Strengths:** Only platform with integrated VoIP (own the phone line), TrueLark AI adds 24/7 automation, bi-directional PMS sync

**Weaknesses:** Expensive ($400-$500+/mo), fax/payment issues reported, setup fee, communication-only — no analytics, HR, or financials

**Threat Level to One Engine:** HIGH — They are the market leader in dental engagement. Our edge: AI business advisor, HR/ops, financials, and proactive intelligence they completely lack.

---

#### 2. NEXHEALTH — Online Booking, Forms, Messaging

**Pricing:** Starting $350/mo, custom based on practice size

**Key Stat:** Became a unicorn in 2022 ($177M total funding). 10,000+ practices.

**PMS Integrations:** 35+ systems with bi-directional sync. Also offers NexHealth Synchronizer — a unified API for 30+ PMS systems that other companies can use.

**Strengths:** Best-in-class online booking and patient experience, reduces no-shows 15-30%, modern UI, RESTful API for integrators

**Weaknesses:** Expensive, engagement-only (no analytics, HR, financials), integration glitches reported, poor customer support noted

**Threat Level:** MEDIUM — They do patient engagement well but have zero operational features. Our opportunity: use their Synchronizer API to connect to PMS systems, then outcompete them on features.

---

#### 3. DENTAL INTELLIGENCE — Analytics, Morning Huddle

**Pricing:** Custom only (estimated $499-$600/mo based on user feedback)

**Key Features:**
- **Morning Huddle**: Auto-generated daily briefing (our cron job morning briefing is similar)
- **Provider Pulse**: Real-time per-provider performance tracking
- **Quick-Fill**: Auto-contacts ASAP list when cancellations happen
- Auto-generated call lists (confirmations, recare, unscheduled treatment, collections)

**Also:** Acquired LocalMed (online scheduling)

**Strengths:** Best analytics in the market, automated Morning Huddle, actionable insights

**Weaknesses:** Analytics only — no communication, no AI agent, no HR/ops, opaque pricing

**Threat Level:** MEDIUM — Our morning briefing cron + AI advisor already competes. We need to build Quick-Fill (waitlist auto-fill) and Provider Pulse-style metrics.

---

#### 4. REVENUEWELL — Marketing Automation

**Pricing:**
- Starter: $189/mo (scheduling, reminders, forms, texting, payments)
- Professional: Custom (adds reviews, surveys, social media, patient portal)
- Premium: Custom (adds mobile website, content tools, dedicated consultant)

**Key Move:** Acquired PBHS (dental marketing company) in 2021

**Strengths:** Lowest entry price ($189/mo), comprehensive marketing suite, dedicated consultant at premium tier

**Weaknesses:** Marketing-focused only, tiered pricing gets expensive fast, no operations/analytics

**Threat Level:** LOW — Marketing-only. We surpass them on every dimension except possibly social media posting.

---

#### 5. ADIT — All-in-One Patient Engagement

**Pricing:** Starting $399/mo, custom based on needs

**Key Stats:** 5,000+ practices, 1.5M+ organic calls handled, $3.7M in annual ad spend managed. Customer results: 106% revenue growth first month (Big Sky Smiles).

**Key Features:** AI Call Intelligence (listens to calls, recovers missed bookings, flags unhappy patients), consolidated VoIP + texting + email + eFax, scheduling, payments, analytics

**Strengths:** True all-in-one approach (closest to our vision), AI call intelligence, strong DSO support, proven ROI metrics

**Weaknesses:** Custom pricing, less brand recognition than Weave/NexHealth, may be overkill for solo practices

**Threat Level:** HIGH — Most similar to our vision. Our edge: AI business advisor, HR/ops/licensing, financials, proactive intelligence. They don't have an AI that can operate across all modules.

---

#### 6. SOLUTIONREACH — Patient Communication

**Pricing:** Essentials/Plus/Enterprise starting $329/mo

**Unique Feature:** Revenue Cycle Messaging™ — automates from first appointment to final payment (insurance verification, HIPAA payment requests, consent collection, unpaid balance follow-up)

**PMS Integrations:** **400+ systems** (largest integration library in the market)

**Strengths:** Most PMS integrations by far, Revenue Cycle Messaging is unique, proven across dental + medical + vision

**Weaknesses:** Communication only, advanced features cost extra, enterprise sales process

**Threat Level:** LOW-MEDIUM — Communication-focused. Revenue Cycle Messaging is worth studying/replicating.

---

#### 7. LIGHTHOUSE 360 — Henry Schein Communication Platform

**Pricing:** Starting $329/mo

**Key:** Owned by Henry Schein One. Lighthouse 360+ works with ANY PMS (not just Henry Schein products).

**Strengths:** Henry Schein backing (credibility + distribution), universal PMS compatibility

**Weaknesses:** Not transparent pricing, less innovative post-acquisition, limited vs newer competitors

**Threat Level:** LOW — Legacy platform. We outcompete on every modern feature.

---

#### 8. PODIUM — Reviews + Messaging

**Pricing:** Pro starting $399-$599/mo per location (custom quotes)

**Key Features:** Centralized inbox (text, web chat, all channels), unlimited 1:1 texts, review generation, payment links via SMS, HIPAA-compliant with BAA

**Strengths:** Best-in-class review generation, HIPAA messaging, payment links via text

**Weaknesses:** Most expensive for reviews, no Yelp integration, not dental-specific, opaque pricing

**Threat Level:** LOW — Reviews specialist. We can integrate review generation and not need them.

---

#### 9. YAPI — Digital Forms + Communication

**Pricing:** $100-$500/mo + $399 setup

**Key Feature:** Zero-click auto-sync — signed forms + patient data sync to PMS automatically. 30+ pre-made forms.

**ROI Claim:** Practices save $18,600/year on printing/scanning/shredding

**Strengths:** Forms specialist, lowest price, zero-click PMS sync

**Weaknesses:** Point solution, limited feature set, less known

**Threat Level:** LOW — Point solution. We can build digital forms and outcompete easily.

---

#### 10. ARINI — AI Voice Receptionist

**Pricing:** Custom (estimated $300-$800/mo based on volume)

**Key Stats:** Y Combinator-backed, 15M+ dental interactions, 100% HIPAA-compliant

**Features:** 24/7 AI voice receptionist, appointment scheduling, multilingual, handles calls + texts, referral management, voicemail transcription

**Strengths:** Market leader in dental voice AI, 24/7 availability, multilingual, YC-backed

**Weaknesses:** Voice/phone only, no dashboard/analytics/ops, opaque pricing, enterprise sales

**Threat Level:** MEDIUM-HIGH — They do voice AI very well. We can integrate Vapi for voice but Arini has a massive training data advantage (15M+ interactions). Consider: partner with Arini OR build our own with Vapi.

---

## 4. COMPETITIVE FEATURE MATRIX

### What One Engine Has vs. Competitors

| Feature | One Engine | Weave | NexHealth | Dental Intel | Adit | Arini |
|---------|-----------|-------|-----------|-------------|------|-------|
| **AI Business Advisor** | **BUILT** | No | No | No | No | No |
| **AI Lead Response Drafting** | **BUILT** | No | No | No | No | No |
| **Morning Briefing** | **BUILT** | No | No | **Yes** | No | No |
| **HR & Payroll** | **BUILT** | No | No | No | No | No |
| **Employee Write-Ups + Signing** | **BUILT** | No | No | No | No | No |
| **Licensing/Compliance** | **BUILT** | No | No | No | No | No |
| **Financial P&L** | **BUILT** | No | No | No | No | No |
| **AR Aging / Collections** | **BUILT** | No | No | No | No | No |
| **Approval Queue (AI Actions)** | **BUILT** | No | No | No | No | No |
| **SEO Management** | **BUILT** | No | No | No | No | No |
| **Treatment Presentations** | **BUILT** | No | No | No | No | No |
| **Insurance Verification** | **BUILT** | No | No | No | No | No |
| **Lead Management** | **BUILT** | No | No | No | No | No |
| **Patient Recall Campaigns** | **BUILT** | Yes | Yes | Yes | Yes | No |
| **Appointment Reminders** | **BUILT** | Yes | Yes | Yes | Yes | Yes |
| VoIP Phone System | ❌ Partner | **Yes** | No | No | **Yes** | No |
| AI Voice Receptionist | ❌ Build | **Yes** (TrueLark) | No | No | Yes | **Yes** |
| Online Booking Widget | ❌ Build | Yes | **Yes** | Yes | Yes | Yes |
| 2-Way SMS (Live) | ❌ Activate | **Yes** | **Yes** | Yes | **Yes** | Yes |
| Review Generation | ❌ Build | Yes | Yes | No | Yes | No |
| Digital Patient Forms | ❌ Build | Yes | **Yes** | No | Yes | No |
| Patient Self-Service Portal | ❌ Build | No | **Yes** | No | No | No |
| Visual Calendar | ❌ Build | N/A | N/A | N/A | Yes | N/A |
| Waitlist / Quick-Fill | ❌ Build | Yes | Yes | **Yes** | Yes | No |
| Real-Time Insurance Eligibility | ❌ Integrate | No | No | No | No | No |
| Revenue Cycle Messaging | ❌ Build | No | No | No | No | No |

### Summary

**One Engine is AHEAD on:** AI intelligence, business operations (HR, financials, licensing, compliance), lead management, approval workflows, SEO — features NO competitor has in a single platform.

**One Engine NEEDS:** VoIP/phone integration, AI voice receptionist, online booking, 2-way SMS activation, review generation, digital forms, patient portal, visual calendar, waitlist auto-fill.

---

## 5. PMS INTEGRATION ARCHITECTURE

### Integration Methods (Ranked by Feasibility)

| Method | Best For | Cost | Complexity |
|--------|---------|------|-----------|
| **1. NexHealth Synchronizer** | Quick access to 30+ PMS systems | Starting $350/mo | LOW |
| **2. Open Dental REST API** | Open Dental practices (direct) | $179/mo + endpoint fees | MEDIUM |
| **3. Kolla / DentalBridge** | DSOs, multi-location, data warehouse | Custom (70% less than competitors) | MEDIUM |
| **4. Dentrix DDP** | Dentrix practices (official) | $10K entry + SOC2 required | HIGH |
| **5. Eaglesoft PIC** | Eaglesoft practices (official) | $3-5K entry | MEDIUM-HIGH |

### Recommended Strategy

**Phase 1 — NexHealth Synchronizer** (fastest to market)
- Single API connection → access to 30+ PMS systems instantly
- No need for individual PMS certifications
- $10,000 Synchronizer Guarantee
- Trade-off: dependency on NexHealth, less control, adds cost layer

**Phase 2 — Open Dental Direct** (our primary market)
- Full REST API available (Remote Mode at `api.opendental.com`)
- Endpoints: patients, appointments, insurance, claims, referrals, recalls
- Webhooks available for real-time sync
- Most dental practices are adopting Open Dental due to pricing

**Phase 3 — Kolla for DSOs** (enterprise accounts)
- PMS-agnostic unified API + data warehouse
- 70% cost reduction vs. building individual integrations
- Target multi-location groups running mixed PMS systems

### What Data We Read vs. Write

| Data Type | Read | Write | Notes |
|-----------|------|-------|-------|
| Patient demographics | ✅ | ✅ | Sync new patients both ways |
| Appointments | ✅ | ✅ | Online booking writes to PMS |
| Insurance info | ✅ | ⚠️ Limited | Read coverage, can't always write |
| Treatment plans | ✅ | ❌ | Clinical data, read only |
| Recall/hygiene | ✅ | ✅ | Manage recall campaigns |
| Claims/billing | ✅ | ⚠️ Limited | Read claims status |
| Provider schedules | ✅ | ✅ | Blocking, availability |
| Clinical notes | ✅ | ❌ | HIPAA-sensitive, read only |
| X-rays/images | ❌ | ❌ | Stays in PMS/imaging system |

---

## 6. VENDOR INTEGRATION MAP: BUILD vs. PARTNER

### What We BUILD In-House

| Feature | Why Build | Status |
|---------|----------|--------|
| AI Business Advisor | Core differentiator, no one else has this | **BUILT** |
| AI Lead Response | Core differentiator | **BUILT** |
| Morning Briefing | Core differentiator (Dental Intel charges $500+/mo for theirs) | **BUILT** |
| HR & Employee Management | Core differentiator | **BUILT** |
| Financial Dashboards | Core differentiator | **BUILT** |
| Licensing/Compliance | Core differentiator | **BUILT** |
| Approval Workflows | Core differentiator | **BUILT** |
| Unified AI Agent | #1 differentiator — ties everything together | **TO BUILD** |
| Visual Calendar + Blocking | Must own the scheduling UI | **TO BUILD** |
| Analytics Dashboard | Must own the insights layer | **TO BUILD** |
| Patient Portal | Must own the patient experience | **TO BUILD** |
| Waitlist/Quick-Fill | Competitive feature, AI-powered | **TO BUILD** |
| Review Generation | Simple to build, high ROI | **TO BUILD** |
| Digital Forms | Moderate effort, high value | **TO BUILD** |

### What We INTEGRATE from Vendors

| Category | Recommended Vendor(s) | Cost | Integration Method |
|----------|----------------------|------|-------------------|
| **PMS Connection** | NexHealth Synchronizer → Open Dental API → Kolla | $350/mo → $179/mo → Custom | REST API |
| **Voice AI (Phone)** | Vapi (build) or Arini (partner) | Vapi: $0.25-0.33/min + $1K/mo HIPAA | Vapi SDK / Arini API |
| **SMS/Texting** | Twilio | $0.0083/msg send + $0.0083/msg receive | Twilio API (already installed) |
| **Email** | Resend | $20/mo (50K emails) | Resend API (already installed) |
| **Payments** | Stripe Connect | 2.9% + $0.30 + 0.25% platform fee | Stripe SDK |
| **Insurance Verification** | Vyne Dental Trellis | Flat monthly (no per-transaction) | Vyne API |
| **Insurance Eligibility** | DentalXChange or Availity | Custom | X12/SOAP/REST API |
| **Payroll** | ADP or Gusto | ADP: ~$1/employee/mo API; Gusto: varies | REST API |
| **Review Platforms** | Google Business Profile API (free) | $0 | Google API |
| **Imaging AI** | Pearl ($299-349/mo) or Overjet (enterprise) | $299-349/mo | Partnership/API |
| **VoIP Phone** | Practice's existing (Weave, RingCentral, etc.) | N/A (their cost) | Call webhooks / CTI |

### Monthly Vendor Cost Per Practice (Estimated)

| Vendor | Monthly Cost | Notes |
|--------|-------------|-------|
| Anthropic Claude API | $50-200 | AI agent + advisor usage |
| Vapi (voice AI) | $150-400 | Based on call volume |
| Vapi HIPAA BAA | $1,000 | Shared across all practices |
| Twilio SMS | $30-100 | Based on message volume |
| Resend email | $20-50 | Based on email volume |
| Stripe | 2.9% + $0.30/txn | Patient payment processing |
| Supabase | $25-75 | Database hosting |
| Vercel | $20-40 | App hosting |
| **Total per practice** | **$295-865** | Before Vapi HIPAA sharing |

**Note:** Vapi HIPAA BAA ($1,000/mo) is shared across ALL practices on the platform. At 10 practices = $100/practice. At 100 practices = $10/practice. This is why scale matters.

---

## 7. AFFILIATE & PARTNER REVENUE OPPORTUNITIES

### High-Value Referral Programs

| Vendor | Commission / Revenue | How It Works |
|--------|---------------------|-------------|
| **Gusto** (Payroll) | $300-$1,000 per referral (tiered) | 1st=$300, 2nd=$400, 3rd=$500, 4th=$700, 5th+=$1,000 |
| **NexHealth** | $525 per referral ($25 qualified + $500 at launch) | No limit on referrals |
| **RingCentral** | $85 per customer + lifetime recurring | Channel Harmony program, 100% commissions |
| **Podium** (Reviews) | 30% commission + 30% renewals for 1 year | Affiliate program |
| **Stripe Connect** | Platform fee revenue (0.25%+ of processing) | Earn on every transaction |
| **Weave** | Commission on customer transactions | Affiliate Partner Agreement exists |
| **BirdEye** (Reviews) | Commission (undisclosed) | Reseller/affiliate programs available |

### Revenue Modeling: Affiliate Income per Practice

| Revenue Source | Annual Estimate | Notes |
|---------------|----------------|-------|
| Stripe Connect platform fees | $1,200-$3,600 | 0.25% on $40K-$120K/mo processing |
| Gusto referral | $300-$1,000 | One-time per practice |
| NexHealth referral (if used) | $525 | One-time per practice |
| Podium affiliate | $120-$180/yr | 30% of $400+/mo subscription |
| RingCentral referral | $85 + recurring | If practice switches phone system |
| **Total Year 1 per practice** | **$2,230-$5,390** | Mix of one-time + recurring |

### Free Integrations (No Cost to Us)

| Service | Cost | Value |
|---------|------|-------|
| Google Business Profile API | FREE | Review management, business info |
| Twilio (pay-per-use) | Per message | No monthly minimum |
| Open Dental API | Included in their subscription | Most endpoints free for practices |

---

## 8. AI AGENT STRATEGY

### The Vision: One Engine AI Agent

A **single intelligent agent** that staff can interact with via **text or voice** from anywhere in the dashboard. Unlike Arini (phone only), Weave (communication only), or Dental Intelligence (analytics only) — One Engine's agent can operate across **every module**.

### Agent UI Architecture (4 Layers)

**1. Persistent Sidebar Panel** (Right side of dashboard)
- Collapsible panel accessible from ANY dashboard page
- Text input + voice input toggle
- Context-aware: knows what page you're on, what patient is selected
- Quick action buttons for common tasks
- Shows conversation history, actions taken, suggestions
- PRIMARY interaction point for staff

**2. Command Bar** (Ctrl+K / Cmd+K)
- Quick-access command palette overlay
- Natural language: "schedule John Smith for cleaning Tuesday 2pm"
- Search across all modules (patients, appointments, employees, leads)
- Keyboard-first for power users

**3. Voice Channel** (Vapi Integration)
- Answers inbound calls 24/7
- Books directly into PMS calendar via API
- Handles cancellations, rescheduling
- Routes emergencies to on-call provider
- Transcribes and logs all calls
- Multilingual (English, Spanish minimum)

**4. Website Chat Widget** (Public-facing)
- Floating chat bubble on marketing pages
- Lead capture: name, phone, email, reason for visit
- FAQ handling with branded personality
- Hands off to human when needed

### What the Agent Can Do (Tiered)

**Tier 1 — Automate Immediately (Highest ROI)**
1. Answer inbound calls + book appointments (via Vapi)
2. Schedule, reschedule, cancel via natural language
3. Send appointment reminders and confirmations
4. Run recall/reactivation campaigns
5. Check insurance eligibility
6. Answer patient FAQs

**Tier 2 — Automate Next**
7. Auto-fill cancellation gaps (waitlist/Quick-Fill)
8. Distribute intake forms to new patients
9. Follow up on presented treatment plans
10. Collect post-treatment feedback + reviews
11. Nurture unconverted leads
12. Handle billing inquiries + send payment links

**Tier 3 — AI-Assisted (Staff + AI)**
13. Pull reports ("Show me this week's production")
14. Navigate the system ("Take me to John Smith's record")
15. Draft communications ("Write a recall email for 6+ month overdue")
16. Analyze trends ("Why are no-shows up this month?")
17. HR tasks ("Create a coaching note for Sarah")
18. Financial insights ("What's our collection rate trend?")

### Technology Stack

| Component | Technology | Cost |
|-----------|-----------|------|
| LLM (Brain) | Claude Sonnet 4 / Opus 4 | ~$0.003-$0.015 per interaction |
| Voice AI | Vapi | $0.25-$0.33/min all-in |
| Speech-to-Text | Deepgram (via Vapi) | Included |
| Text-to-Speech | ElevenLabs (via Vapi) | Included |
| Telephony | Twilio (via Vapi) | Included |
| HIPAA BAA | Vapi | $1,000/mo (shared) |
| Chat UI | Custom React | Built in-house |

### Competitive Edge: Agent Feature Comparison

| Capability | Arini | Weave | Dental Intel | Adit | **One Engine** |
|-----------|-------|-------|-------------|------|---------------|
| Voice AI calls | **Yes** | **Yes** | No | Yes | **Yes** |
| SMS/Text | Yes | **Yes** | Yes | **Yes** | **Yes** |
| Web chat | No | No | No | No | **Yes** |
| In-app agent | No | No | No | No | **Yes** |
| Cross-module actions | No | No | No | No | **Yes** |
| Insurance verification | No | No | No | No | **Yes** |
| Financial analysis | No | No | **Yes** | No | **Yes** |
| HR management | No | No | No | No | **Yes** |
| Lead management | No | No | No | No | **Yes** |
| Report generation | No | No | **Yes** | No | **Yes** |
| Proactive insights | No | No | **Yes** | No | **Yes** |

**No competitor has an AI agent that operates across all practice modules.** This is the moat.

---

## 9. PRICING STRATEGY

### Revised Pricing: Engagement Layer Model

Since we sit ON TOP of PMS systems (like Weave, NexHealth, Dental Intelligence), our pricing should be in the **engagement layer range** ($200-$600/mo), not the PMS range ($500-$1,500/mo).

| Tier | Name | Price/mo | Target | Includes |
|------|------|---------|--------|----------|
| 1 | **Growth** | $299/mo | Solo practice (1-2 providers) | Patient communication (SMS + email), appointment reminders, recall campaigns, lead management, AI lead responses, online booking widget, basic analytics, digital forms |
| 2 | **Professional** | $499/mo | Group practice (2-5 providers) | Everything in Growth + AI Business Advisor, Morning Huddle, insurance verification, treatment presentations, review generation, waitlist/Quick-Fill, HR basics, 2-way SMS |
| 3 | **Enterprise** | $799/mo | Multi-location / DSO | Everything in Pro + AI voice agent (24/7 phone), visual calendar with blocking, full HR & payroll integration, P&L dashboards, licensing/compliance, advanced analytics, API access, dedicated success manager |

**Add-ons:**
- AI Voice Agent (for Growth/Pro): +$199/mo
- Additional providers beyond 3: +$79/mo each
- Real-time insurance eligibility API: +$99/mo
- White-label / custom branding: +$149/mo

### Why This Pricing Works

**Undercuts all-in-one competitors:**
- vs. Weave Pro ($400-$500/mo): Our $299 Growth tier has more features
- vs. Adit ($399+/mo): Our $499 Pro includes AI advisor, HR, financials
- vs. Dental Intelligence ($499-$600/mo): Our $499 Pro includes their analytics PLUS everything else
- vs. Podium ($399-$599/mo): Our $299 Growth includes their review features

**More value than point solutions:**
- vs. RevenueWell ($189/mo): We're slightly more but include AI advisor + lead management
- vs. Yapi ($100-$500/mo): We include their forms + 20x more features
- vs. Arini ($300-$800/mo): Our $199 add-on gives voice AI plus everything else

**Replace 3-5 vendors with 1:**
A typical practice paying Weave ($400) + Dental Intelligence ($500) + RevenueWell ($189) = **$1,089/mo** could switch to One Engine Professional at **$499/mo** and get MORE features.

### Revenue Projections

| Year | Practices | Avg MRR | Monthly Revenue | Annual Revenue | + Affiliate Rev |
|------|-----------|---------|----------------|----------------|----------------|
| Year 1 | 15 | $449 | $6,735 | $80,820 | +$33K-$81K |
| Year 2 | 75 | $499 | $37,425 | $449,100 | +$167K-$404K |
| Year 3 | 250 | $549 | $137,250 | $1,647,000 | +$558K-$1.35M |
| Year 5 | 750 | $599 | $449,250 | $5,391,000 | +$1.67M-$4.04M |

**Note:** Affiliate revenue (Stripe Connect fees, Gusto referrals, etc.) adds 40-75% on top of subscription revenue.

---

## 10. IMPLEMENTATION ROADMAP

### What to Build vs. What to Integrate

**BUILD (Core Differentiators):**
- AI Agent (sidebar + command bar + voice + chat widget)
- Visual calendar + schedule blocking
- Online booking widget
- Patient portal
- Waitlist/Quick-Fill
- Review generation
- Digital forms
- Revenue Cycle workflows

**INTEGRATE (Vendor APIs):**
- PMS connection (NexHealth Synchronizer → Open Dental → Kolla)
- Voice AI (Vapi)
- SMS (Twilio — already installed)
- Email (Resend — already installed)
- Payments (Stripe Connect)
- Insurance eligibility (Vyne Dental)
- Payroll (ADP/Gusto)

### Phased Roadmap

#### Phase 1: Activate Existing Integrations (1-2 weeks)
**Quick wins — flip the switches on what's already installed**

| Task | Effort | Cost |
|------|--------|------|
| Activate Twilio 2-way SMS (env vars + testing) | 2 days | $500-$1,000 |
| Wire up Clerk auth fully (sign-in/sign-up/protected routes) | 2 days | $500-$1,000 |
| Activate Resend for transactional emails | 1 day | $250-$500 |
| **Phase 1 Total** | **1 week** | **$1,250-$2,500** |

#### Phase 2: Visual Calendar + Schedule Blocking (4-5 weeks)
**The #1 missing feature for operational credibility**

| Task | Effort | Cost |
|------|--------|------|
| Daily calendar view (column-per-provider, 15-min slots) | 2 weeks | $4,000-$6,000 |
| Weekly + Monthly views | 1.5 weeks | $3,000-$4,500 |
| Schedule blocking system (PTO, lunch, closures, emergency holds) | 1 week | $2,000-$3,000 |
| Drag-and-drop rescheduling | 0.5 weeks | $1,000-$1,500 |
| **Phase 2 Total** | **4-5 weeks** | **$10,000-$15,000** |

#### Phase 3: AI Agent — Sidebar + Command Bar (3-4 weeks)
**Our #1 differentiator**

| Task | Effort | Cost |
|------|--------|------|
| Persistent right sidebar agent panel | 1 week | $2,000-$3,500 |
| Command bar (Cmd+K) with natural language | 1 week | $2,000-$3,500 |
| Agent tool system (connect to all 64+ API routes) | 1.5 weeks | $3,500-$5,500 |
| Context awareness + voice input (browser Speech API) | 0.5 weeks | $1,000-$2,000 |
| **Phase 3 Total** | **3-4 weeks** | **$8,500-$14,500** |

#### Phase 4: Patient-Facing Features (3-4 weeks)
**Online booking, forms, reviews, portal**

| Task | Effort | Cost |
|------|--------|------|
| Online booking widget (embeddable) | 1 week | $2,500-$4,000 |
| Digital intake forms with e-signatures | 1 week | $2,500-$4,000 |
| Review generation (post-appointment automation) | 0.5 weeks | $1,000-$2,000 |
| Patient self-service portal (appointments, forms, payments) | 1.5 weeks | $3,500-$5,500 |
| **Phase 4 Total** | **3-4 weeks** | **$9,500-$15,500** |

#### Phase 5: Voice AI + Phone Integration (2-3 weeks)

| Task | Effort | Cost |
|------|--------|------|
| Vapi integration + HIPAA BAA setup | 0.5 weeks | $1,500-$2,500 |
| Inbound call handling (scheduling, FAQs) | 1 week | $2,500-$4,000 |
| After-hours triage + call logging/transcription | 0.5 weeks | $1,500-$2,500 |
| **Phase 5 Total** | **2-3 weeks** | **$5,500-$9,000** |

#### Phase 6: PMS Integration + Payments (3-4 weeks)

| Task | Effort | Cost |
|------|--------|------|
| NexHealth Synchronizer or Open Dental API integration | 2 weeks | $4,000-$6,000 |
| Stripe Connect (patient payments) | 1 week | $2,000-$3,500 |
| Vyne Dental insurance eligibility | 1 week | $2,000-$3,500 |
| **Phase 6 Total** | **3-4 weeks** | **$8,000-$13,000** |

#### Phase 7: Smart Features + Polish (2-3 weeks)

| Task | Effort | Cost |
|------|--------|------|
| Waitlist / Quick-Fill (auto-fill cancellation gaps) | 0.5 weeks | $1,000-$2,000 |
| Revenue Cycle Messaging workflows | 1 week | $2,000-$3,500 |
| Website chat widget (public-facing) | 0.5 weeks | $1,000-$2,000 |
| Analytics dashboard (connect to real data) | 0.5 weeks | $1,000-$2,000 |
| **Phase 7 Total** | **2-3 weeks** | **$5,000-$9,500** |

### TOTAL INVESTMENT SUMMARY

| Phase | Timeline | Cost Range | Priority |
|-------|----------|-----------|----------|
| Phase 1: Activate Integrations | 1 week | $1,250-$2,500 | QUICK WIN |
| Phase 2: Visual Calendar | 4-5 weeks | $10,000-$15,000 | CRITICAL |
| Phase 3: AI Agent | 3-4 weeks | $8,500-$14,500 | DIFFERENTIATOR |
| Phase 4: Patient-Facing | 3-4 weeks | $9,500-$15,500 | HIGH |
| Phase 5: Voice AI | 2-3 weeks | $5,500-$9,000 | HIGH |
| Phase 6: PMS + Payments | 3-4 weeks | $8,000-$13,000 | HIGH |
| Phase 7: Smart Features | 2-3 weeks | $5,000-$9,500 | MEDIUM |
| **TOTAL** | **18-26 weeks** | **$47,750-$79,000** | |

### Monthly Ongoing Costs (Platform-Wide)

| Cost | Monthly | Notes |
|------|---------|-------|
| Vapi HIPAA BAA | $1,000 | Shared across all practices |
| Supabase (Pro) | $25 | Database |
| Vercel (Pro) | $20 | Hosting |
| Domain + DNS | $15 | Cloudflare |
| Monitoring | $20 | Sentry/LogRocket |
| **Platform fixed** | **$1,080/mo** | Before per-practice costs |

### Break-Even Analysis

At **$499/mo Professional tier** with **$295-$865/mo variable cost per practice**:
- Gross margin per practice: ~$130-$200/mo (before platform fixed costs)
- Platform fixed costs: ~$1,080/mo
- **Break-even: ~6-8 practices**
- At 15 practices: ~$1,000-$2,000/mo profit + affiliate revenue
- At 50 practices: ~$7,500-$12,000/mo profit + affiliate revenue

---

## APPENDIX: SOURCES

### Direct Competitors
- Weave: getweave.com, emitrr.com/blog/weave-pricing, smartmolars.com
- NexHealth: nexhealth.com, capterra.com, tracxn.com
- Dental Intelligence: dentalintel.com, selecthub.com, capterra.com
- RevenueWell: revenuewell.com/plans, emitrr.com
- Adit: adit.com/pricing, softwareadvice.com, capterra.com
- Solutionreach: solutionreach.com/pricing, emitrr.com
- Lighthouse 360: henryscheinone.com, drbicuspid.com
- Podium: podium.com, socialpilot.co, emitrr.com
- Yapi: yapiapp.com, capterra.com, selecthub.com
- Arini: arini.ai, myaifrontdesk.com, openmic.ai

### Integration Vendors
- Vapi: vapi.ai/pricing, ringg.ai, cloudtalk.io
- Twilio: twilio.com/pricing
- Resend: resend.com/pricing
- Stripe: stripe.com/pricing, stripe.com/connect/pricing
- Vyne Dental: vynedental.com
- Open Dental API: opendental.com/site/apifees.html
- NexHealth Synchronizer: synchronizer.io
- Kolla: getkolla.com
- DentalBridge: dentistryautomation.com

### Partner/Affiliate Programs
- Gusto: gusto.com/affiliates ($300-$1,000 tiered)
- NexHealth: nexhealth.com/partner-program ($525/referral)
- RingCentral: ringcentral.com/partner ($85 + recurring)
- Podium: hello.podium.page/affiliates (30% + renewals)
- Weave: getweave.com/dental-affiliate-programs
- BirdEye: birdeye.com/partners
- Stripe: docs.stripe.com/partners (revenue sharing)
- Google Business Profile: FREE API

### Market Data
- Dental PMS Market: $2.98B (2025), 10.8% CAGR — grandviewresearch.com
- AI in Dental: $559M (2025) → $3.26B (2034) — towardshealthcare.com
- DSO Market: $161B (2025) → $584B (2032) — researchandmarkets.com
- ~200,000 US dental clinics — ADA data

---

*This analysis was compiled using data from 40+ sources including vendor websites, pricing pages, partner program terms, industry reports, and market research. Pricing data is current as of February 2026 but may vary by region and negotiation.*

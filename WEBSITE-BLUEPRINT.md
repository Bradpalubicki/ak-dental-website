# AK Ultimate Dental — Website Blueprint & Best Practices
## Built 2026-03-05 | Dental Engine v2

This document captures what makes the BEST dental practice website in 2026.
It was produced from live research + competitive analysis. Apply to all future dental engine clients.

---

## WHAT WAS BUILT IN THIS PASS

### New Pages Added (2026-03-05)
| Route | Purpose |
|---|---|
| `/team/dr-alex-chireau` | Provider profile — named credentials, Person schema, booking CTA |
| `/insurance` | Dedicated insurance page — logos, verify CTA, Cherry/CareCredit/Sunbit |
| `/smile-gallery` | Before/after gallery — 8 cases, 5 categories, HIPAA note |
| `/dentist-summerlin` | Neighborhood SEO — cosmetic focus |
| `/dentist-henderson` | Neighborhood SEO — family dentistry focus |
| `/dentist-spring-valley` | Neighborhood SEO — general/affordable focus |
| `/dentist-north-las-vegas` | Neighborhood SEO — emergency/accessibility focus |
| `/emergency-dentist-las-vegas` | Emergency page — phone-first, zero friction |
| `/sedation-dentistry-las-vegas` | Sedation/anxiety page — empathy-first copy |

### Components Added
| Component | Purpose |
|---|---|
| `ProviderByline` | Reusable "Written by Dr. Alex Chireau, DDS" — compact + full variants |
| `StickyEmergencyBar` | Mobile-only fixed bottom bar: "Dental Emergency? Call [phone]" |

### Schema Upgrades
| Schema | What Changed |
|---|---|
| `ProviderSchema` | New — Person schema for Dr. Alex Chireau |
| `ArticleSchema` | Author upgraded from Organization → Person with worksFor |

### Homepage Upgrades
- "Accepting New Patients" badge added to hero
- Insurance logo strip added (Delta Dental, Cigna, Aetna, MetLife, Guardian, + 5 more)

### Service Page Upgrades
- `ProviderByline` added to every service page hero
- Financing callout (Cherry button) added for: dental-implants, porcelain-veneers, cosmetic-dentistry, dental-crowns, orthodontics, oral-surgery

---

## RESEARCH FINDINGS: TOP DENTAL WEBSITE STANDARDS 2026

### Provider Pages (CRITICAL — #1 conversion gap for most practices)
- Every top dental practice has `/team/[doctor-slug]` dedicated pages
- Patients Google doctors by name before booking
- Must include: named credentials, education story, specialties, accreditations, photo, booking CTA
- Requires `Person` schema with `worksFor` dental practice
- Google E-E-A-T: anonymous medical content gets penalized — named providers are mandatory

### Insurance Page (dedicated — not scattered in FAQs)
- Patients searching "does [practice] take Delta Dental" need a landing page
- Visual insurance logos (not just text) increase trust
- "We'll verify for free" promise is a massive friction remover
- Cherry financing integration: 80%+ approval, 60-second decision, increases high-ticket case acceptance

### Before/After Gallery
- Practices with complete galleries get 42% more direction requests and 35% more website clicks
- Organized by treatment type (veneers, implants, whitening, crowns, makeovers)
- HIPAA: written patient consent required — add to new patient intake paperwork
- Even 8-10 cases at launch is transformative vs. no gallery

### Neighborhood Location Pages
- Service area data in `practice.ts` should each get a dedicated page
- Each targets "[dentist near neighborhood]" queries — high-intent, highly local
- Template: copy dentist-las-vegas structure, swap neighborhood name + local FAQs
- Summerlin = cosmetic focus | Henderson = family focus | Spring Valley = affordable | North LV = emergency

### Emergency Dental Page
- Phone-first layout — call button is primary CTA, oversized, always visible
- Never require a form submission — every second of friction costs a patient in pain
- "What counts as an emergency?" list reduces uncertainty
- After-hours guidance keeps trust even when closed

### Sedation / Dental Anxiety Page
- 20-30% of adults avoid the dentist due to anxiety
- Empathy-first copy ("You are not alone") converts better than clinical language
- Nitrous oxide vs. oral sedation explained clearly
- Key patient worries to address: "Will I be awake?" "Will I remember?" "Can I drive after?"

---

## SEO BEST PRACTICES — DENTAL 2026

### Schema That's Non-Negotiable
```
Dentist (LocalBusiness) + AggregateRating + OpeningHoursSpecification
Person (provider) + worksFor
BreadcrumbList (every page)
MedicalProcedure (every service page)
FAQPage (FAQs page, service pages, blog posts)
Article with Person author (every blog post)
```

### Google E-E-A-T for Dental
- Named licensed provider as author on ALL content
- Provider credentials linked to professional associations
- ADA/state dental association directory listings as citations
- Blog posts with datePublished + Person author byline

### Local SEO
- Google Business Profile: 100% complete, photos updated weekly, posts every 2 weeks
- NAP consistency: pick ONE format and use everywhere ("West Sahara Avenue" not "W Sahara")
- Bing Places for Business: separate submission — Bing drives 8% of US searches
- NextDoor Business: neighborhood-specific, great for Las Vegas micro-areas

### AI Search (ChatGPT, Perplexity, Claude, Copilot)
- `llms.txt` already in engine standard — keep it
- Named provider with credentials on every page = AI citation weight
- Content format: "what is X, how does [practice] perform it, how long does it take, what does it cost"
- Citations from ADA, Healthgrades, Zocdoc = signals AI crawlers trust

---

## CONVERSION INFRASTRUCTURE STANDARDS

### Booking Form
- react-hook-form + zod (always)
- Add: insurance plan field, anxiety checkbox
- Success state: "We'll call you within 2 business hours" (not "we'll be in touch")
- Urgency scoring for emergency/toothache → flags high in leads dashboard

### Financing (standard on all dental engines)
- Cherry: https://withcherry.com — primary, highest approval rate
- CareCredit: https://www.carecredit.com — established healthcare card
- Sunbit: https://sunbit.com — backup option
- Add Cherry "Check Eligibility" button to: implants, veneers, crowns, cosmetic, ortho service pages

### Mobile UX
- Sticky phone bar on mobile for emergency call (StickyEmergencyBar component)
- Add `pb-14 md:pb-0` to `<main>` to prevent content overlap
- Primary CTA button above fold, always visible

---

## DIRECTORIES — MINIMUM LISTING SET

| Directory | Priority | Notes |
|---|---|---|
| Google Business Profile | CRITICAL | Photos, services, Q&A, weekly posts |
| Healthgrades | CRITICAL | Large SEO value, patients cross-check |
| Zocdoc | CRITICAL | Real-time booking, insurance-seeking traffic |
| Yelp | CRITICAL | Already listed — keep photos current |
| ADA Member Directory | HIGH | Authoritative citation for AI crawlers |
| WebMD Dentist Finder | HIGH | Trust signal |
| Vitals | HIGH | Reviews + citations |
| Bing Places | HIGH | Separate from Google — Bing/Copilot |
| State Dental Association | HIGH | Local authority |
| 1-800-Dentist | MEDIUM | Referral network |
| NextDoor Business | MEDIUM | Neighborhood targeting |

---

## ACCREDITATIONS TO DISPLAY

| Credential | Who Has It | Display Location |
|---|---|---|
| ADA Member | Most dentists | About page, provider page |
| AGD (FAGD/MAGD) | CE-focused dentists | Provider page, about page |
| AACD | Cosmetic specialists | Cosmetic service pages, provider page |
| State Dental Association | State members | About page |
| CEREC Certified | CEREC users | Crown/CEREC service pages |
| Invisalign/SureSmile Provider | Clear aligner offices | Ortho service pages |
| HIPAA Compliant | All practices | Footer + about page |

---

## WHAT TO COLLECT FROM CLIENT BEFORE BUILD

See `~/.claude/memory/dental-website-blueprint.md` for full practice config checklist.

**Critical blockers if missing:**
- Doctor's full name + credentials (cannot build provider page or byline without this)
- Doctor headshot photo (needed for hero, provider page, byline)
- Google Review URL (needed for review badge)
- Insurance plans accepted (needed for /insurance page)
- Service areas (needed for neighborhood pages)

---

## PENDING ITEMS FOR AK DENTAL

### Waiting on Alex:
- Real before/after photos for /smile-gallery (currently showing placeholder images)
- Cherry merchant account (https://withcherry.com) — get real merchant link
- Instagram/TikTok/YouTube URLs for social links
- NEXT_PUBLIC_APP_URL=https://akultimatedental.com in Vercel env vars

### Blocked on vendors:
- Twilio phone number for AK Dental subaccount
- Vapi API key
- Gusto (needs DNS first: akultimatedental.com → Vercel)
- Dentrix eClaims (Alex must call 800.734.5561)

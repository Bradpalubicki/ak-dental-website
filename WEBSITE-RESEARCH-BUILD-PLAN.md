# AK Ultimate Dental — Website Research & Build Plan
## Last Audit: 2026-03-05 | Next Audit: 2026-06-05

---

## INDUSTRY BRIEFING: DENTAL PRACTICE (PATIENT-FACING)

```
INDUSTRY BRIEFING: DENTAL PRACTICE — PATIENT-FACING WEBSITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Buyer: New dental patient in Las Vegas — typically 25-55, mobile-first,
       searching for a trusted provider they can verify before booking.
       90% consult reviews before booking. 77% want online booking. Most
       search on mobile evenings/weekends.

Top Pain: "I can't tell if this dentist is actually good or if the website
           is just marketing. I want to see real results and a real doctor."

Pain in Numbers:
  - 90% of patients check reviews before booking (trust barrier)
  - 77% want online booking but only 26% of practices offer it
  - 36% of no-shows are simple forgetfulness (reminder gap)
  - $200-$400 lost per missed appointment | $20K-$70K/year per practice
  - 2-5% avg website conversion rate; top practices reach 10%
  - 500 visitors/month: 2% = 10 new patients | 5% = 25 new patients
    = $216,000/year revenue difference at $1,200 avg treatment value

Hero Trigger: Patient needs cosmetic work, implants, or is new to Las Vegas
              and needs to find a dentist NOW — searches on phone, scans
              hero/reviews/photos in under 10 seconds, decides to call or leave.

Their Language: "dentist near me", "accepts my insurance", "same day",
  "new patients", "before and after", "how much does it cost", "is it painful",
  "emergency", "real reviews", "does it hurt"

Compliance Need: HIPAA notice on gallery (patient consent), provider credentials
  prominently displayed, no medical claims without caveats.

Top 3 Patient Objections:
  1. "I don't know if this dentist is actually good" → Before/after gallery + named provider
  2. "I'm afraid of the dentist / it will hurt" → Sedation page + anxiety-first copy
  3. "I don't know if my insurance is accepted" → Insurance page + logo strip
```

---

## COMPETITIVE LANDSCAPE (2026-03-05)

### Primary Competitor: Summerlin Dental Solutions
- **URL**: dentalsolutionslv.com
- **Doctor**: Dr. Marianne Cohan, DDS, AAFE, AACD — 19x Best of Las Vegas winner, 31+ years
- **Headline**: "Dentist Las Vegas and Summerlin | 19x Best of Las Vegas"
- **Differentiators**:
  - 19x "Best of Las Vegas" award — massive credibility anchor, used everywhere
  - AACD accreditation (cosmetic dentistry gold standard)
  - 55-inch in-room screens showing patients their X-rays
  - TRIOS digital scanner, AI-assisted radiology
  - Dedicated "vs. other offices" comparison page
  - Extensive comparison content: "Summerlin Dental Solutions vs. Other Offices"
- **Grade**: A — best-in-class in the Las Vegas market
- **What they do better**: Award anchoring in H1, AACD credential, comparison page, years of experience

### Competitors Found in Research
| Competitor | Location | Differentiator | Threat Level |
|---|---|---|---|
| Summerlin Dental Solutions (dentalsolutionslv.com) | Summerlin | 19x Best of LV, AACD, 31 years | HIGH |
| Las Vegas Dental Group (lasvegasdentalgroup.com) | Las Vegas | 50+ years, brand authority | MEDIUM |
| Supreme Dental (supremedentallv.com) | SW Las Vegas | Modern equipment, artistry focus | MEDIUM |
| Lone Mountain Dental (lonemtndental.com) | NW Las Vegas | Comprehensive, proximity | LOW-MEDIUM |
| Hillcrest Dental (hcdentallv.com) | Las Vegas | "Top Rated" positioning | LOW |

### Key Competitive Gap for AK Dental
AK Ultimate Dental has 193+ Yelp reviews at 5.0 stars but NO visible award
credentials on the site. Summerlin Dental Solutions leads with "19x Best of Las Vegas"
in their H1. AK Dental needs an equivalent authority anchor.

---

## CURRENT SITE AUDIT SCORES (2026-03-05)

### Hero Section: 7/10
| Check | Current State | Best Practice | Gap |
|---|---|---|---|
| H1 | "Your Dream Smile / Starts Here" | Pain-first, ≤8 words | Outcome-first, not pain-first |
| CTAs | 2 (Book + Call) | 1 primary | Acceptable — call is secondary |
| Social proof in hero | Reviews badge + "Accepting New Patients" | Named, specific | Good but could add review count |
| Visual | Doctor photo + quote card | Real doctor, named | Dr. Chireau named now — good |
| Risk removers | None below CTA | "Free consultation · No pressure" | MISSING |

### Page Structure: 8/10
Current order is strong. Could benefit from moving "Meet Dr. Chireau" section earlier
and adding a "Before/After results" preview section between testimonials and location.

### Copy Quality: 7/10
- Hero is outcome-first ("Dream Smile"), not pain-first ("Afraid of the dentist?")
- Good use of specifics: "128 five-star reviews", "20+ years"
- Missing: stats about the practice (patients served, treatments completed)
- Risk removers absent at all CTAs ("Free consultation · No commitment")

### Design Cleanliness: 9/10
- Consistent section spacing, good color hierarchy
- Gradient text used only in hero — correct
- Trust bar, insurance strip, services, testimonials — strong flow
- Minor: no dark mode issues, no inconsistent card styles

### Social Proof: 6/10
| Signal | Present | Quality |
|---|---|---|
| Reviews in hero | Yes | Count shown, star rated — good |
| Named testimonials | Yes | 3 on homepage from config |
| Before/after gallery | Yes | Placeholder only — no real photos |
| Video testimonials | No | Missing — highest-ROI gap |
| Case studies with numbers | No | Missing |
| Award/accolades | No | Missing — no "Best of Las Vegas" etc |

### AI Search (LLMEO): 8/10
| Signal | Status |
|---|---|
| llms.txt | EXISTS (dynamic route, pulls live practice data) |
| robots.txt | EXISTS — allows all crawlers, blocks dashboard/api |
| Organization/Dentist schema | EXISTS in local-business.tsx |
| Person schema (Dr. Chireau) | EXISTS — added this session |
| FAQPage schema | EXISTS — on FAQ page, insurance, team, location pages |
| BreadcrumbList | EXISTS on service pages |
| Named provider E-E-A-T | EXISTS — ProviderByline on all service + blog pages |
| ai.txt | MISSING |
| datePublished on blog | EXISTS in blog.ts data |
| Bing not blocked | CONFIRMED |

**LLMEO Score: 8/10**

### SEO / Keyword Coverage: 8/10
- 13 blog posts targeting high-volume Las Vegas dental queries
- Neighborhood pages: /dentist-summerlin, /dentist-henderson, /dentist-spring-valley, /dentist-north-las-vegas
- Primary city page: /dentist-las-vegas
- Emergency page: /emergency-dentist-las-vegas
- Sedation page: /sedation-dentistry-las-vegas
- Missing: /dental-implants-las-vegas standalone location page
- Missing: /porcelain-veneers-las-vegas standalone location page
- Missing: /cosmetic-dentistry-las-vegas standalone location page

**OVERALL SITE SCORE: 53/70**

---

## AUTO-FIXED THIS SESSION (2026-03-05)

| Fix | Files Changed |
|---|---|
| Removed "One Engine AI / NuStack platform" section from homepage | src/app/(marketing)/page.tsx |
| Replaced DashboardPreview with patient-benefit section | src/app/(marketing)/page.tsx |
| Fixed wrong doctor name (Khachaturian → Chireau) in hero | src/app/(marketing)/page.tsx |
| Fixed wrong doctor name in about page (2 image alts) | src/app/(marketing)/about/page.tsx |
| Fixed wrong doctor name in technology page (2 descriptions) | src/app/(marketing)/technology/page.tsx |
| Updated Meet Doctor section CTA → /team/dr-alex-chireau | src/app/(marketing)/page.tsx |
| Updated doctor quote attribution to "Dr. Alex Chireau, DDS" | src/app/(marketing)/page.tsx |

---

## CRITICAL GAPS — Fix Now

### 1. No risk removers at booking CTAs
Every CTA in the site ("Book Free Consultation") has no friction-removing text underneath.
Best practice 2026: "Free consultation · No commitment · Same-day appointments available"
- Files: `src/app/(marketing)/page.tsx` hero section, final CTA section
- Also: `src/app/(marketing)/appointment/page.tsx` form header

### 2. ai.txt missing
AI search crawlers (GPT-Bot, Perplexity, Gemini) look for `/ai.txt` separate from robots.txt.
Easy 30-min fix: Create `src/app/(marketing)/ai.txt/route.ts` following same pattern as llms.txt.

### 3. No "Best of Las Vegas" or award anchor
Primary competitor (Summerlin Dental Solutions) leads with "19x Best of Las Vegas" in their H1.
AK Dental has 193+ five-star Yelp reviews + Google reviews.
Action: Verify if Alex has applied for/won "Best of Las Vegas" awards (bestoflasvegasawards.com).
If not — this is the single most important offline action for competitive positioning.

### 4. No online real-time booking (only a request form)
77% of patients want real-time online booking. Current site has a "request appointment" form
that requires an office callback. This loses patients who want instant confirmation.
- Integration needed: NexHealth or Zocdoc (Zocdoc drives its own traffic, NexHealth is native)
- NexHealth recommended: native embed, no per-booking fee, syncs with Dentrix/Eaglesoft

### 5. Before/after gallery has placeholder photos only
Current /smile-gallery has 8 placeholder Unsplash images with "Photos coming soon" notes.
This is the #1 conversion driver for cosmetic dentistry patients.
- Blocked on: Alex sending real patient before/after photos (with signed HIPAA consent)

---

## HIGH PRIORITY — Next Sprint

### 6. Homepage H1 is outcome-first, not pain-first
Current: "Your Dream Smile / Starts Here"
Best practice: Lead with patient pain or identity statement first.
Suggested alternatives (test these):
- "Afraid of the Dentist? We've Heard That Before."
- "Las Vegas's Most Trusted Cosmetic Dentist — 193 Five-Star Reviews"
- "Same-Day Appointments. All Insurance Accepted. No Surprises."
Pain-first headlines test 20-40% better for dental practices with anxiety-skewing audience.

### 7. Video testimonials — highest ROI gap
Video testimonials increase conversion by up to 80% vs text-only.
AK Dental has text testimonials only.
Action: Record 2-3 short patient video testimonials (30-60 sec each, phone is fine).
Add to: homepage testimonial section, /reviews page, /team/dr-alex-chireau page.

### 8. Three missing location-service crossover pages
High-intent SEO pages not yet built:
- `/dental-implants-las-vegas` — "dental implants Las Vegas" has very high search volume
- `/porcelain-veneers-las-vegas` — cosmetic focus, high-value patient intent
- `/cosmetic-dentistry-las-vegas` — hub page for all cosmetic procedures

### 9. Competitor comparison page (Summerlin Dental Solutions does this)
Summerlin Dental Solutions has a page: "vs. Other Offices — Why Choose Us"
This captures patients who are comparison shopping. AK Dental should build:
- `/why-ak-dental` or `/ak-dental-vs-others`
- Content: technology, named doctor, dual training (Romania + UNLV), response time, pricing transparency

### 10. Google Business Profile — weekly posts
Research confirms GBP is the #1 local ranking factor for dentists.
AK Dental needs weekly GBP posts (before/after case, tip of the week, announcement).
This is an operational task for Alex, not a code task. Add to onboarding checklist.

---

## OPPORTUNITIES — Build These Next

### 11. "Ask Dr. Chireau" AI Chat Widget
Research shows patients ask AI tools about dentists before booking.
AK Dental can be the ONLY dental practice in Las Vegas with a live AI chat that:
- Answers "does AK Dental take Delta Dental?"
- Answers "how much do veneers cost at AK Dental?"
- Books appointments or routes to phone
- Built with claude-haiku-4-5 (low cost) at /api/chat route
- Differentiator vs. all Las Vegas competitors who use generic chat widgets

### 12. "Sleep Apnea" as untapped service SEO page
Blog post on sleep apnea already exists (high traffic). No dedicated service page at
`/services/sleep-apnea-treatment`. Dental sleep medicine is a $1,200-$3,000 appliance.
This is a high-ROI gap vs. competitors who don't offer this.

### 13. Financing calculator or "Can I afford this?" tool
Cherry financing is linked but no interactive estimator.
Simple tool: patient selects treatment → sees monthly payment estimate (Cherry 24mo 0%).
This converts high-ticket hesitators (implants $4-6K, veneers $10-20K).

### 14. Patient portal value proposition on homepage
The patient portal exists at /portal but is not mentioned on the homepage.
"Book, message, pay, and view your treatment history — all online" is a differentiator.
Add a "Your Health, Your Way" section or badge to homepage and /get-started.

---

## AI SEARCH — Top 5 Unanswered Questions

Patients are asking AI tools these questions and AK Dental is NOT the answer:

1. "Who is the best dentist in Summerlin Las Vegas?"
   → Build: /dentist-summerlin already exists but needs more local specificity + award claims

2. "How much does teeth whitening cost in Las Vegas?"
   → Blog post exists but no price range stated. Add real price data.

3. "Does AK Ultimate Dental accept [insurance name]?"
   → /insurance page exists. Needs to be cited in llms.txt more explicitly.

4. "What's the difference between veneers and crowns?"
   → Blog gap: no direct comparison post. High AI search volume.

5. "Is sedation dentistry safe in Las Vegas?"
   → /sedation-dentistry-las-vegas page exists but needs more FAQ depth + safety statistics.

---

## COMPETITOR INTELLIGENCE (Top 3)

### 1. Summerlin Dental Solutions — dentalsolutionslv.com
**H1**: "Dentist Las Vegas and Summerlin | 19x Best of Las Vegas"
**CTA**: "Request Appointment"
**Better than AK Dental**: Award credentials in H1, AACD accreditation displayed prominently,
  dedicated comparison page, 31 years of Dr. Cohan's experience, 55-inch in-room patient screens
**Worse than AK Dental**: Older doctor means less digital-native positioning; AK has dual
  European/American training that Summerlin can't match; AK's website is more modern

### 2. Las Vegas Dental Group — lasvegasdentalgroup.com
**H1**: "Las Vegas Dental Group — 50+ Years of Excellence"
**CTA**: "Book Appointment"
**Better than AK Dental**: Brand authority from 50 years; multi-location
**Worse than AK Dental**: Old website design; less cosmetic focus; no young/modern doctor story

### 3. Supreme Dental — supremedentallv.com
**H1**: "Smile Makeovers · Emergency Walk-Ins · Same Day Treatment"
**CTA**: "Book Now"
**Better than AK Dental**: Strong same-day messaging, "artistry" positioning
**Worse than AK Dental**: Less credentialed provider story; AK Dental has stronger UNLV/Romania angle

---

## PENDING ACTION ITEMS (requires Alex)

| Action | Owner | Priority | Unblocks |
|---|---|---|---|
| Real before/after patient photos (signed HIPAA consent) | Alex | CRITICAL | Smile gallery conversion |
| Apply for "Best of Las Vegas" award | Alex | HIGH | Competitive positioning vs Summerlin |
| Record 2-3 patient video testimonials | Alex | HIGH | Conversion rate +up to 80% |
| Cherry merchant account (real link) | Alex | HIGH | Financing CTAs |
| Google Business Profile: weekly posts | Alex | HIGH | Local SEO ranking |
| Zocdoc or NexHealth real-time booking setup | Alex + Brad | HIGH | 77% patient booking preference |
| Instagram/TikTok/YouTube URLs | Alex | MEDIUM | Social links, AI citations |
| Point akultimatedental.com DNS → Vercel | Alex | CRITICAL | NEXT_PUBLIC_APP_URL, Gusto, all live URLs |

---

## NEXT RECOMMENDED AUDIT: 2026-06-05

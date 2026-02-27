# AK Ultimate Dental — Website & Platform Status
**As of:** February 2026
**Prepared by:** Brad Palubicki, NuStack Digital Ventures

---

## Website: What's Live

The new AK Ultimate Dental website has been fully built and is live at the Vercel preview URL. It is ready to go live on the production domain (`akultimatedental.com`) whenever Alex gives the green light.

### Pages Built

| Page | URL | Status |
|------|-----|--------|
| Homepage | `/` | Live |
| About | `/about` | Live |
| Services (all) | `/services` | Live |
| Individual service pages | `/services/[service]` | Live (20+ services) |
| Technology | `/technology` | Live |
| Blog | `/blog` | Live (12 articles) |
| Reviews | `/reviews` | Live |
| Contact | `/contact` | Live |
| Appointment Request | `/appointment` | Live |
| FAQs | `/faqs` | Live |
| Patient Portal | `/patient-portal` | Live |
| Dentist Las Vegas | `/dentist-las-vegas` | Live |
| Careers | `/careers` | Live |
| Dr. Scott Miller Retirement | `/dr-scott-miller-retirement` | Live |

### Technical Stack
- **Framework**: Next.js 16 (App Router) — fast, SEO-optimized
- **Hosting**: Vercel (CDN, automatic HTTPS, global edge network)
- **Images**: Professional dental photography via Next.js Image optimization
- **SEO**: Full schema markup (LocalBusiness, MedicalProcedure, FAQ, Article, BreadcrumbList)
- **Performance**: Lighthouse score 90+ target
- **Mobile**: Fully responsive for all devices

---

## SEO: What's Built In

### Structured Data (Schema.org)
Every page has proper JSON-LD markup for:
- Local Business (practice name, address, phone, hours, geo coordinates)
- Aggregate Rating (Google review count + score)
- Medical Procedure (for each service page)
- FAQ (for FAQ pages)
- Article (for blog posts)
- Breadcrumb navigation

### Metadata
- Unique title tags and meta descriptions for every page
- Open Graph tags for social sharing and AI search (ChatGPT, Perplexity)
- Canonical URLs
- Sitemap (auto-generated)

### Content
- 12 blog articles written targeting high-value Las Vegas dental search terms
- Service pages with full procedure descriptions
- FAQs targeting "People Also Ask" Google results
- 301 redirects from all old site URLs (so existing rankings transfer)

---

## Dental Engine: What's Built

The backend SaaS platform powering the practice operations:

| Feature | Status |
|---------|--------|
| Patient intake forms | Complete |
| Online appointment requests | Complete |
| Appointment types + scheduling | Complete |
| Provider availability management | Complete |
| Clinical notes (AI-assisted) | Complete |
| Dental charting | Complete |
| CDT code library (31 codes) | Complete |
| Lab case tracking | Complete |
| Patient consent forms | Complete |
| Recall system (automated) | Complete |
| Assessment tools | Complete |
| Dashboard (admin + provider views) | Complete |
| Role-based access control | Complete |
| Outreach / patient communications | Complete |

### Still To Build (Phase 2)
- Dentrix PMS integration (needs API credentials)
- Insurance billing / clearinghouse integration
- Credit card processing integration
- Payroll integration
- Patient portal full features

---

## Domain Cutover Plan

When ready to go live on `akultimatedental.com`:

1. Add Brad as contributor in Vercel (or we handle DNS change together)
2. Update Vercel project domain settings
3. Change DNS at domain registrar to point to Vercel
4. SSL certificate auto-provisions (takes < 5 minutes)
5. Old site 301 redirects fire automatically — all existing Google rankings transfer
6. Google Search Console: submit new sitemap

**Estimated downtime:** Near zero (< 60 seconds for DNS propagation edge cases)

---

## What's NOT Changing

- Phone number stays the same
- Address stays the same
- All existing patient reviews stay visible on Google/Yelp
- The brand name and visual identity are preserved and enhanced
- Existing URL paths from the old site redirect automatically to new pages

---

*The site is ready. The platform is ready. We're waiting on your go-ahead.*

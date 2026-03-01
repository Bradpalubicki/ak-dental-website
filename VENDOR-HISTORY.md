# AK Ultimate Dental — Vendor Research & Decision History

**Maintained by:** NuStack Digital Ventures
**Master record:** NuStack Agency Engine → `/migrations/0046_hr_vendor_catalog.sql` and `vendor_catalog` + `vendor_affiliate_program` tables
**Note:** This file mirrors the vendor database in NuStack Agency Engine. Both should stay in sync.

---

## How the Connector Model Works

NuStack acts as the **connector**, not the vendor. The client (AK Ultimate Dental, and all future engine clients) pays each vendor directly. NuStack earns a referral/affiliate commission from the vendor. This means:

- No billing risk to NuStack for vendor services
- No collections issues when clients don't pay vendors
- Client maintains direct account with each vendor
- NuStack platform connects via OAuth 2.0 (client authenticates their own account)
- Commission is earned via referral/affiliate program, paid by vendor to NuStack

**Verified 2026-02-28.** All vendors below confirmed this model is supported.

---

## HR Module Vendor Decisions

### Research Date: 2026-02-28

---

## PAYROLL

### 1. Gusto — PRIMARY PAYROLL PARTNER ✅ GO

| Field | Detail |
|---|---|
| Model | OAuth 2.0 connector. Client has own Gusto account. |
| Client pays | Gusto directly: $54 + $7/emp/mo (Simple) to $199 + $24/emp/mo (Premium) |
| NuStack commission | $300 per referred client who runs payroll (PartnerStack) |
| Affiliate program | PartnerStack — 120-day cookie, one-time (no residual) |
| Docs | https://docs.gusto.com/app-integrations/docs/introduction |
| Partner signup | https://market.partnerstack.com/page/gusto |
| Status | Not started — apply PartnerStack first, then Gusto App Partner for OAuth |
| Note | Confirm affiliate + OAuth app tracks are compatible simultaneously |

---

### 2. OnPay — SECONDARY PAYROLL OPTION ✅ GO

| Field | Detail |
|---|---|
| Model | OAuth 2.0 (approved partners only — must apply) |
| Client pays | OnPay directly: $40/mo + $6/emp/mo flat, all-inclusive |
| NuStack commission | Revenue share via Ambassadors program (scales with client count) |
| Affiliate program | OnPay Ambassadors: https://onpay.com/ambassadors/ |
| Docs | https://onpay.readme.io/reference/authorization |
| Status | Not started — apply for API access + Ambassadors |
| Note | Best client-facing pricing. Easiest sell. API is approved-partners-only. |

---

### 3. QuickBooks Payroll — ADD LATER ⚠️ PARTIAL

| Field | Detail |
|---|---|
| Model | OAuth 2.0 via Intuit App Partner Program (July 2025) |
| Client pays | Intuit directly: $45/mo + $6/emp/mo (Core) to $125 + $10/emp/mo (Elite) |
| NuStack commission | 30% base + 15%/emp for 12 months via ProAdvisor. $300-$500 bonus/client. |
| Issue | Two separate tracks (App Partner + ProAdvisor) — confirm combinable with Intuit |
| Status | Not started — enroll ProAdvisor, apply App Partner, confirm track compatibility |
| Note | Add after Gusto/OnPay proven. Good for clients already on QuickBooks. |

---

### 4. ADP Run — ADD AT SCALE ⚠️ PARTIAL

| Field | Detail |
|---|---|
| Model | OAuth 2.0 via ADP Marketplace |
| Client pays | ADP directly: ~$59-149/mo + $4-7/emp/mo (custom pricing) |
| NuStack commission | 25-75% of annual invoice for 12 months (Accountant Partner program) |
| Issue | 3-client minimum before any commission unlocks. Enterprise integration complexity. |
| Status | Not started — add after Gusto/OnPay are live and have 3+ referrals |
| Note | Highest commission ceiling but complex. Not the right starting point. |

---

### 5. Patriot Payroll — BUDGET TIER OPTION

| Field | Detail |
|---|---|
| Model | Direct API |
| Client pays | Patriot directly: $17/mo + $4/emp/mo (Basic) / $37/mo (Full Service) |
| NuStack commission | Revenue share (contact required) |
| Status | Not started — add as budget option for very small practices (5-10 employees) |

---

## BACKGROUND CHECKS

### 6. Checkr — PRIMARY BACKGROUND CHECK PARTNER ✅ GO (with conditions)

| Field | Detail |
|---|---|
| Model | OAuth 2.0 (Partner Program — must apply and be approved) |
| Client pays | Checkr directly: $29.99/check (Basic+) or $79.99/check (Professional) |
| NuStack commission | Negotiated revenue share (not publicly disclosed) |
| Partner signup | https://checkr.com/contact/partners |
| Docs | https://docs.checkr.com/partners/ |
| Status | Not started — apply BEFORE building any integration |
| **CRITICAL — FCRA** | Use OAuth track ONLY (client has own Checkr account, orders through Checkr). Do NOT build embedded ordering flow (where our platform places the order) without full FCRA compliance implementation. OAuth track = employer is the FCRA "user," not NuStack. |
| Integration review | Checkr requires 2-week review + compliance demo before production access |

**FCRA Requirements (non-negotiable):**
- Client must provide standalone FCRA disclosure to candidate (not bundled with job application)
- Client must collect written candidate authorization before running check
- Adverse action flow: pre-adverse notice → 5 business day wait → final adverse action notice
- Store signed consent + results with access controls

---

### 7. GoodHire — NO-GO ❌

Same parent company as Checkr. Weaker API (redirect-based, not OAuth). No documented affiliate commission. Use Checkr instead.

---

## JOB BOARDS

### 8. Google for Jobs — GO (free, always on) ✅

| Field | Detail |
|---|---|
| Model | JSON-LD structured data on public job listing pages (no API, no account) |
| Cost | $0 |
| Commission | None (not needed — it's free) |
| Docs | https://developers.google.com/search/docs/appearance/structured-data/job-posting |
| Status | Not started — implement JSON-LD on all public job pages |
| Note | Pages must be publicly accessible (not behind auth). Required fields: title, hiringOrganization, datePosted, description, jobLocation. Validate with Google Rich Results Test. |

---

### 9. Indeed — PARTIAL ⚠️ (feature value, not commission)

| Field | Detail |
|---|---|
| Model | ATS Partner API (requires formal agreement with Indeed — not self-serve) |
| Client pays | Indeed directly (CPC model for sponsored jobs) |
| NuStack commission | ~$0.10/click via Publisher program (negligible) |
| Status | Not started — request ATS partner agreement. Build for posting functionality, not revenue. |
| Note | Indeed is increasingly restrictive on API access since 2023. Low commission potential. |

---

### 10. DentalPost — EVALUATE ⚠️

| Field | Detail |
|---|---|
| Model | No confirmed API. Employer dashboard posting. |
| Cost | $94-399/post (paid by client) |
| Commission | No confirmed affiliate program |
| Status | Not started — contact DentalPost directly about partner/API program. Link out as fallback. |
| Note | Dental-specific, 900K+ dental professionals. Worth pursuing if they have an affiliate program. |

---

### 11. ZipRecruiter — NO-GO ❌

ZipRecruiter killed its affiliate/publisher program in early 2025. No commission opportunity. Skip.

---

## E-SIGNATURES

### 12. DocuSign — GO (specifically for I-9) ✅

| Field | Detail |
|---|---|
| Model | ISV Connector — client has own DocuSign account, NuStack connects via OAuth |
| Client pays | DocuSign directly: $15-65/mo depending on plan |
| NuStack commission | 15% of first-year subscription via Digital Referral Program |
| Partner signup | https://www.docusign.com/partner/become-a-partner |
| Docs | https://developers.docusign.com/partner/partner-implementation-overview/ |
| Status | Not started — apply to ISV/Digital Referral program |
| **Why DocuSign for I-9** | DHS has stricter electronic I-9 requirements beyond standard ESIGN Act. DocuSign has a USCIS-compliant I-9 product. Custom e-sig is NOT sufficient for I-9. |

---

### 13. Custom NuStack E-Signature — GO (all non-I-9 docs) ✅

| Field | Detail |
|---|---|
| Model | In-house canvas-based signature pad + audit trail |
| Cost | $0 — built into platform |
| Legal basis | ESIGN Act (15 U.S.C. § 7001) + Nevada NRS 719.240 |
| Valid for | Handbook acknowledgment, HIPAA acknowledgment, OSHA acknowledgment, offer letter, direct deposit authorization, at-will acknowledgment, emergency contacts |
| NOT valid for | I-9 (use DocuSign) |

**Required implementation:**
- Pre-signature consent disclosure ("I agree to sign electronically")
- Canvas draw or click-to-sign with intent confirmation
- Document SHA-256 hash embedded in signed PDF
- Audit log: signer name, email, IP address, user agent, timestamp (UTC), document hash, fields signed
- Signed PDF + audit log stored immutably in Supabase Storage
- Both employer and employee can download signed PDF

---

## Vendor Build Order

When Brad approves HR module build, execute in this sequence:

| Sprint | Vendor | First Step |
|---|---|---|
| 1 | Gusto OAuth | Apply PartnerStack + Gusto App Partner |
| 1 | Google for Jobs | Implement JSON-LD on public job pages |
| 2 | Checkr OAuth | Apply partner program BEFORE building |
| 2 | DocuSign ISV | Apply Digital Referral + ISV certification |
| 2 | Custom E-Sig | Build canvas pad + audit log |
| 3 | OnPay | Apply for API access + Ambassadors |
| 3 | Indeed | Request ATS partner agreement |
| 4 | QuickBooks Payroll | Enroll ProAdvisor, confirm App Partner compatibility |
| 5 | ADP Run | Add after 3+ referrals on Gusto/OnPay |

---

## Nevada Compliance — Key Requirements for HR Module

| Requirement | Rule | System Action |
|---|---|---|
| New hire reporting | Report to DETR within 20 days of start | Auto-submit + log confirmation |
| I-9 completion | Within 3 business days of start | Alert if Section 2 not completed |
| Final pay — termination | Immediately | Alert to practice on separation |
| Final pay — resignation | Next scheduled payday | Alert to practice on separation |
| HIPAA training | All staff with PHI access, annual renewal | Auto-assign + track + annual renew |
| OSHA bloodborne pathogens | Annual, all clinical staff | Auto-assign + track |
| License/cert expiration | RDA, RDH, CPR/BLS, X-ray cert | 30/60/90-day alerts |
| Paid leave (50+ employees) | 0.01923 hrs/hr worked = 40 hrs/year | PTO accrual engine |
| Minimum wage | $12.00/hr (no tip credit) | Validation on offer letter |
| Daily OT | 1.5x after 8 hrs/day (<$18/hr employees) | Payroll export flag |

---

## Competitors Researched (HR context)

| Platform | HR? | ATS? | Background Checks | Payroll | Price |
|---|---|---|---|---|---|
| Rippling | Full HRIS | Add-on | Via Checkr | Separate module | $8-25/emp/mo + $35 base |
| Gusto | Full HR | Basic (no real ATS) | Not built-in | Core product | $54+$7 to $199+$24/emp/mo |
| BambooHR | Full HRIS | Add-on (Hiring module) | Via Checkr/Sterling | Add-on | ~$250/mo flat (<25 emp) |
| HR for Health | Healthcare-specific | No | No | Add-on | $245-395/mo |
| Dentrix | None | No | No | No | $500-800/mo (PM only) |
| Curve Dental | None | No | No | No | $300-600/mo (PM only) |

**Gap confirmed:** No dental PM software (Dentrix, Curve, Carestream) has any meaningful HR functionality.

---

## Session History

| Date | Action | Detail |
|---|---|---|
| 2026-02-28 | Email test verified | Resend confirmed working. littleroots.studio domain verified. Test email delivered to brad@nustack.digital. |
| 2026-02-28 | Test email button built | Settings > Notifications tab. POST /api/test/send-email. From: noreply@littleroots.studio (temp until akultimatedental.com verified in Resend). |
| 2026-02-28 | HR module research | Researched full HR feature set, competitors, payroll vendors, background check vendors, job boards, e-signatures. |
| 2026-02-28 | Connector model verified | All vendors confirmed: client pays direct, NuStack earns affiliate. ZipRecruiter affiliate dead. GoodHire = skip. |
| 2026-02-28 | Vendor records written | NuStack Agency Engine migration 0046_hr_vendor_catalog.sql. This file (AK Dental VENDOR-HISTORY.md). Both in sync. |

---

*This file is kept in sync with the NuStack Agency Engine vendor_catalog and vendor_affiliate_program database tables.*
*Master database: nustack-agency-engine → migrations/0046_hr_vendor_catalog.sql*

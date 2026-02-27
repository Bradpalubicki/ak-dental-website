---

# DENTAL ENGINE — MASTER PRACTICE ONBOARDING CHECKLIST

**Internal Document | NuStack Digital Ventures**
**Product: Dental Engine (One Engine AI)**
**Version: 1.0 | February 2026**
**Based on: AK Ultimate Dental reference implementation**

---

## EXECUTIVE SUMMARY

Onboarding a dental practice onto Dental Engine requires data collection across 12 categories, touching every functional module in the platform. Based on analysis of the platform schema (migrations 001–028), the AK Ultimate Dental reference implementation, and standard dental practice management onboarding methodology (Dentrix, Eaglesoft, Curve Dental, OpenDental), the full go-live data set requires approximately **180–240 discrete data points** and **15–25 documents**.

The checklist is organized by category, with each item flagged as:
- **[P1]** — Required for Day 1 launch (blocking)
- **[P2]** — Required within 30 days of launch
- **[P3]** — Phase 2 (60–90 days)

**The most common go-live delays (from competitor platform onboarding research):**
1. Incomplete NPI/CAQH credentialing with payers — adds 30–90 days
2. Dentrix data export not initiated early enough — adds 2–4 weeks
3. ERA/EFT enrollment not submitted before launch — delays electronic remittance indefinitely
4. Missing TCPA consent records for existing patients — blocks SMS communications
5. Fee schedule not reconciled from old PMS — causes billing errors from day one

---

## A. PRACTICE IDENTITY & LEGAL

**Purpose:** Populates `practices` table, `oe_corporate_filings`, insurance billing header, and all regulatory submissions. Every EDI transaction (837/835) legally requires this data.

### A1. Core Practice Identifiers

| Field | Description | Phase | Source | Module(s) Fed |
|-------|-------------|-------|--------|---------------|
| **Legal Business Name** | Exact name on bank account and tax filings | P1 | Secretary of State filing | Billing header, W-9, ERA/EFT |
| **DBA Name** | "Doing business as" if different (e.g., "AK Ultimate Dental") | P1 | Business license | Marketing site, patient-facing |
| **Entity Type** | LLC, S-Corp, PC, PLLC, Sole Proprietor | P1 | State filing | Payroll, taxes |
| **EIN (Employer Identification Number)** | Federal Tax ID — 9 digits | P1 | IRS CP-575 letter or IRS.gov | Insurance billing, payroll, 1099s |
| **State License Number** | State dental practice license | P1 | State Dental Board | Credentialing, compliance |
| **State License Expiration** | Must be current at go-live | P1 | State Dental Board | `oe_corporate_filings` alerts |
| **DEA Registration Number** | If prescribing controlled substances | P1 | DEA.gov certificate | Clinical notes, e-prescribe |
| **DEA Expiration Date** | Renews every 3 years | P1 | DEA certificate | `oe_corporate_filings` alerts |
| **NPI Type II (Organization NPI)** | 10-digit group/practice NPI | P1 | NPPES / CMS NPI Registry | Every insurance claim |
| **NPI Type I (Individual NPI)** | Each treating provider's individual NPI | P1 | NPPES | Every insurance claim |
| **Taxonomy Code(s)** | Dental taxonomy: 1223G0001X (General), 1223S0112X (Oral Surgery), etc. | P1 | NPPES profile | Insurance claims, credentialing |
| **CAQH Provider ID(s)** | Council for Affordable Quality Healthcare — provider profile number | P1 | caqh.org | Payer credentialing, re-credentialing |
| **Medicaid Provider ID** | State-specific, if enrolled | P2 | State Medicaid agency | Medicaid claims |
| **Medicare Provider ID** | If billing Medicare (dental implants, medically necessary) | P3 | CMS PECOS | Medicare claims |

### A2. Location & Contact

| Field | Phase | Source | Module(s) Fed |
|-------|-------|--------|---------------|
| Physical address (street, city, state, zip) | P1 | Lease or deed | All patient communications, claims |
| Mailing address (if different) | P1 | Practice | ERA/EFT enrollment |
| Main phone number | P1 | Practice | Scheduling, communications |
| Fax number | P1 | Practice | Insurance submissions, referrals |
| Primary email | P1 | Practice | Patient portal, leads |
| Billing contact name & email | P1 | Practice | Insurance correspondence |
| Timezone | P1 | Practice | Scheduling, automated messages |
| Practice hours per day of week | P1 | Practice | `practiceConfig.hours`, scheduling |

### A3. Insurance & Legal Documents

| Document | Phase | Source | Module(s) Fed |
|----------|-------|--------|---------------|
| Malpractice/Professional Liability policy | P1 | Insurance broker | `oe_business_insurance_policies` |
| General Liability policy | P1 | Insurance broker | Benefits module |
| Workers Compensation policy | P1 | Insurance broker | Payroll/HR compliance |
| Cyber Liability policy | P2 | Insurance broker | HIPAA compliance documentation |
| Business Owners Policy (BOP) | P2 | Insurance broker | Benefits module |
| Copy of state dental license | P1 | State Board | Compliance module |
| Copy of DEA certificate | P1 | DEA | Compliance module |
| W-9 form (signed) | P1 | Practice | ERA/EFT enrollment |

**HIPAA Compliance Note:** The practice's NPI, EIN, and physical address are PHI-adjacent — they appear on every claim and ERAs. All claim transmission must use HIPAA-compliant 837 format through a clearinghouse. The platform's audit log (`audit_log` table) must record every access to billing-level data.

---

## B. PROVIDER & STAFF INFORMATION

**Purpose:** Populates `oe_providers`, `oe_employees`, `staff_users`, `oe_provider_availability`, RBAC roles. Needed for clinical notes signing, claim submission (requires rendering provider NPI), scheduling, and payroll.

### B1. Per Dentist / Treating Provider

| Field | Phase | Source | Module(s) Fed |
|-------|-------|--------|---------------|
| Full legal name | P1 | Provider | All modules |
| Credentials (DDS, DMD, DDS/MS, etc.) | P1 | Diploma/license | Clinical notes, patient-facing |
| Individual NPI Type I | P1 | NPPES | Every insurance claim |
| State dental license number | P1 | State Board | Compliance, credentialing |
| State license expiration | P1 | State Board | `oe_corporate_filings` alerts |
| DEA number (individual) | P1 | DEA certificate | Clinical notes, e-prescribing |
| CAQH Provider ID | P1 | caqh.org | Payer credentialing |
| CAQH attestation date (must be current — within 120 days) | P1 | CAQH portal | Payer credentialing |
| Specialty taxonomy codes (all applicable) | P1 | NPPES profile | Insurance claims |
| Date of birth (required for CAQH/payer credentialing) | P1 | Provider | Credentialing |
| SSN (required for payer enrollment) | P1 | Provider (encrypt at rest) | Credentialing (not stored in platform) |
| Medical school and graduation year | P2 | Provider's CV | CAQH profile |
| Residency / specialty training | P2 | Provider's CV | CAQH profile |
| Board certifications | P2 | Certificates | Credentialing, patient-facing bio |
| Malpractice coverage limits (per occurrence/aggregate) | P1 | Insurance certificate | CAQH, credentialing |
| Malpractice insurance carrier & policy number | P1 | Insurance certificate | CAQH, credentialing |
| Hospital privileges (if any) | P3 | Hospital | CAQH profile |
| Hire date | P1 | HR records | `oe_providers`, payroll |
| Work schedule (days/hours) | P1 | Provider | `oe_provider_availability` |
| Operatory assignments | P1 | Practice | `oe_resources` scheduling |
| Calendar color preference | P1 | Provider | Scheduling UI |
| Profile photo (high-res, minimum 400x400px) | P1 | Photography | Provider directory, patient portal |
| Professional bio (200–400 words) | P1 | Provider | Provider directory, marketing site |
| Languages spoken | P2 | Provider | Patient matching, marketing |
| Accepting new patients (Y/N) | P1 | Provider | Online booking logic |

### B2. Per Dental Hygienist (RDH)

| Field | Phase | Notes |
|-------|-------|-------|
| Full name + RDH credential | P1 | |
| State hygiene license number + expiration | P1 | |
| Individual NPI (hygienists treating under Medicaid/some payers require this) | P1 | |
| CPR/BLS certification + expiration | P1 | `oe_employee_benefit_enrollments` compliance |
| Hire date, hourly rate | P1 | Payroll |
| Schedule (days/hours/operatory) | P1 | `oe_provider_availability` |
| Continuing education credits (CE) log | P3 | Compliance |

### B3. Per Clinical Support Staff (DA, Dental Assistant)

| Field | Phase | Notes |
|-------|-------|-------|
| Full name, role title | P1 | |
| State registration/certification (DANB, EFDA, X-ray certification) | P1 | State-specific |
| CPR/BLS certification + expiration | P1 | |
| Hire date, hourly rate | P1 | Payroll |
| Schedule | P1 | |

### B4. Per Administrative Staff (Front Desk, Biller, Office Manager)

| Field | Phase | Notes |
|-------|-------|-------|
| Full name, role | P1 | |
| Hire date | P1 | |
| Pay type (hourly/salary) and rate | P1 | Payroll |
| RBAC role assignment (owner/admin/billing/staff) | P1 | `staff_users` table, Clerk |
| Direct deposit banking info | P1 | HR/payroll (stored encrypted, not in platform DB) |
| W-4 elections (federal withholding) | P1 | Payroll |
| State withholding form (NV has no state income tax — note per state) | P1 | State-specific |

**RBAC Note:** The platform uses 4-tier Clerk RBAC (global_admin / admin / manager / staff) plus dental-specific roles (dentist / hygienist / dental_assistant / biller). Every staff member needs a Clerk account with the correct role assigned before go-live. The owner/practice admin gets `global_admin`.

---

## C. PATIENT DATA MIGRATION FROM DENTRIX

**Purpose:** Populates `oe_patients`, `oe_appointments`, `oe_dental_charts`, `oe_clinical_notes`, `oe_treatment_plans`, `oe_billing_claims`, `oe_insurance_verifications`, `oe_patient_consents`, `oe_consent_signatures`, and all recall tables.

### C1. Dentrix Export Formats

Dentrix exports patient data in the following formats:

| Export Method | Format | What It Contains |
|---------------|--------|-----------------|
| Dentrix Conversion Utility | XML / CSV | Patient demographics, insurance, appointments, ledger |
| HL7 / CCD (Continuity of Care Document) | XML | Clinical summaries, medication lists, allergies |
| CDT Claim History | 837P EDI | Historical claim data |
| Perio Chart Export | CSV / PDF | Periodontal measurements per tooth |
| X-ray Export (via Dexis, Carestream, Apteryx) | DICOM / JPEG / PNG | Radiographs |
| Document Manager Export | PDF / JPEG | Signed consents, photos, lab slips |
| Schedule Export | CSV | Historical and future appointments |
| Ledger Export | CSV | Full financial transaction history |

**Critical note for Dentrix migrations:** Dentrix uses a proprietary SQL Server database. Full data extraction requires either (a) Dentrix Conversion Service (paid, managed by Henry Schein), (b) a third-party migration vendor such as Conversion+ or Dataman, or (c) direct SQL access to the Dentrix database server if the practice owns the server hardware. Budget 2–4 weeks for a full migration from Dentrix G6 or G7.

### C2. Patient Demographics (per patient)

| Field | Dentrix Field | Phase | Module(s) Fed |
|-------|--------------|-------|---------------|
| Patient ID (legacy PMS ID) | Chart Number | P1 | `pms_patient_id` — links to historical records |
| First name, last name | Name fields | P1 | All modules |
| Date of birth | DOB | P1 | Insurance verification, billing |
| Social Security Number (last 4 for Medicaid/billing) | SSN | P2 | Medicaid, coordination of benefits |
| Gender | Gender | P1 | Clinical notes, insurance |
| Primary phone | Phone | P1 | Scheduling, SMS |
| Cell phone (for SMS) | Cell | P1 | `oe_patient_consents`, communications |
| Email address | Email | P1 | Patient portal, email reminders |
| Home address | Address | P1 | Insurance claims, collections |
| Emergency contact name, phone, relationship | Emergency | P2 | Clinical |
| Employer name (for insurance coordination) | Employer | P2 | Insurance |
| Responsible party (if different from patient — common for minors) | Guarantor | P1 | Billing, statements |
| Guarantor date of birth (for insurance) | Guarantor DOB | P1 | Insurance verification |
| Preferred language | Language | P2 | Patient communications |
| Patient status (active/inactive/archived) | Status | P1 | Recall, analytics |
| Referral source | How heard | P2 | Analytics, marketing attribution |
| Last visit date | Last visit | P1 | `oe_patients.last_visit` — recall logic |
| Next recall due date | Recall due | P1 | `oe_recall_rules`, automated recall |
| Patient since date | First visit | P2 | Analytics, loyalty |

### C3. Insurance Information (per patient, per plan)

| Field | Phase | Notes |
|-------|-------|-------|
| Primary insurance carrier name | P1 | |
| Primary payer ID (5-digit clearinghouse ID) | P1 | Required for electronic claims |
| Primary plan/group name | P1 | |
| Primary group number | P1 | |
| Primary subscriber ID / member ID | P1 | |
| Primary subscriber name (if not patient) | P1 | |
| Primary subscriber date of birth | P1 | |
| Primary subscriber relationship to patient | P1 | |
| Secondary insurance (all same fields) | P2 | Coordination of benefits |
| Annual maximum (remaining) | P1 | Treatment planning, `oe_insurance_verifications` |
| Deductible (annual, amount met) | P1 | Fee estimates |
| Preventive / Basic / Major / Ortho coverage % | P1 | Treatment planning |
| Waiting periods | P2 | Major restorative, ortho |
| Missing tooth clause | P2 | Implant/bridge planning |
| Ortho lifetime maximum | P3 | If practice does ortho |
| Coordination of benefits order | P2 | Dual insurance patients |

### C4. Clinical Records

| Data Type | Format | Phase | Module(s) Fed |
|-----------|--------|-------|---------------|
| Full mouth X-rays (FMX) | DICOM/JPEG | P1 | Clinical notes, charting (stored in Supabase Storage) |
| Bitewing X-rays (BWX) | DICOM/JPEG | P1 | Clinical notes |
| Panoramic X-rays | DICOM/JPEG | P1 | Implant planning, ortho |
| Periapical X-rays | DICOM/JPEG | P2 | Endodontic history |
| Perio chart data (pocket depths, BOP, recession, mobility) | CSV | P1 | `oe_dental_charts` |
| Periodontal charting history (last 3 years minimum) | CSV | P1 | Recall classification (Perio vs. prophy) |
| Existing restorations per tooth | CSV | P1 | `oe_dental_charts.treatment` |
| Missing teeth | Chart/CSV | P1 | `oe_dental_charts.condition = 'missing'` |
| Crown/bridge/implant records | CSV | P1 | Clinical charting |
| Medical history / health history forms | PDF | P1 | `oe_consent_signatures`, clinical notes |
| Allergies (medications, materials) | CSV/PDF | P1 | Clinical notes |
| Current medications | CSV | P1 | Clinical notes — drug interaction checks |
| Chief complaints and treatment history | Notes | P2 | `oe_clinical_notes` (historical import) |

### C5. Financial / Ledger History

| Data Type | Phase | Module(s) Fed |
|-----------|-------|---------------|
| Patient ledger (all transactions, 3–5 years) | P1 | `oe_billing_claims`, financial reporting baseline |
| Outstanding balances (AR aging by patient) | P1 | Collections module, analytics |
| Insurance claims history (submitted + paid) | P1 | AR aging, re-billing if needed |
| Write-off history by reason code | P2 | Financial reporting |
| Payment plan agreements | P1 | Accounts receivable |
| Credit balances (overpayments) | P1 | Must be refunded or applied |

### C6. Consent & Communication Records

| Data Type | Phase | Compliance Note |
|-----------|-------|-----------------|
| Signed HIPAA Notice of Privacy Practices (per patient) | P1 | HIPAA requires proof of offer/receipt |
| SMS/text message consent (TCPA) | P1 | CRITICAL — Cannot send SMS without consent. Must import opt-in records or re-collect from all patients before first send. |
| Email marketing consent | P1 | CAN-SPAM / HIPAA |
| Treatment consent forms (signed) | P2 | Import as PDFs to document vault |
| Financial policy acknowledgment | P2 | Import as PDFs |
| Opt-outs / do-not-contact records | P1 | Must be honored immediately in `oe_opt_outs` |

**TCPA Warning:** This is the #1 compliance gap in dental practice migrations. Dentrix historically stored a "Receive correspondence" checkbox but did NOT capture granular SMS/phone/email consent with timestamp and method. The safest approach is to send a re-consent campaign to the full patient list before sending any marketing SMS. Transactional appointment reminders are lower risk but should still have consent documentation.

---

## D. INSURANCE & CREDENTIALING

**Purpose:** Required for `oe_billing_claims` to submit 837P transactions, for `oe_insurance_verifications` to check eligibility, and for ERA enrollment (835 files). Without this, no electronic insurance billing is possible.

### D1. Payer Enrollment

| Item | Phase | Source | Notes |
|------|-------|--------|-------|
| List of ALL insurance payers currently accepted | P1 | Practice / front desk | Every payer needs separate enrollment |
| Payer ID for each carrier (clearinghouse ID, not plan code) | P1 | Clearinghouse (Vyne/Emdeon/Availity) | Different payers have different IDs |
| Current participation status per payer (in-network / out-of-network / Medicaid / fee-for-service) | P1 | Credentialing files | Affects fee schedule applied |
| Participation/group agreements (signed contracts) | P1 | Practice files / payer portal | Required for in-network billing |
| Credentialing applications per provider per payer | P1 | Credentialing company or payer | Can take 60–90 days — START IMMEDIATELY |

**The top 10 dental insurance payers by market share that need enrollment:**
1. Delta Dental (multiple regional plans — each has a different payer ID)
2. Cigna/Cigna Dental
3. Aetna Dental
4. MetLife (Dental)
5. United Concordia / Solstice
6. Guardian Life
7. BlueCross BlueShield Dental (plan varies by state)
8. Humana Dental
9. Principal Financial Group Dental
10. Sun Life / Assurant

### D2. Electronic Data Interchange (EDI) Setup

| Item | Phase | What It Enables |
|------|-------|-----------------|
| Clearinghouse account (Vyne Dental / Availity / Change Healthcare / Claim.MD) | P1 | 837P claim submission, 277 acknowledgments |
| Clearinghouse credentials (login, submitter ID) | P1 | Claims module API connection |
| ERA enrollment per payer (835 enrollment) | P1 | Automatic electronic remittance posting in `oe_billing_claims` |
| EFT enrollment per payer (direct deposit of payments) | P1 | Practice bank account funded directly from payers |
| 270/271 eligibility check enrollment | P1 | `oe_insurance_verifications` real-time eligibility |
| Remittance payment address (for payers still paying by check) | P1 | Collections |
| Payer-specific claim submission rules (attachments, narratives required) | P2 | Reduces denials |

**ERA/EFT enrollment forms** typically require: practice NPI, EIN, bank routing/account number, NPI Type II and Type I for all billing providers, and a signature from the practice owner or billing manager. Most payers take 30–60 days to activate ERA delivery after enrollment.

### D3. Fee Schedules

| Item | Phase | Notes |
|------|-------|-------|
| Practice's full UCR (Usual, Customary, and Reasonable) fee schedule — all CDT codes billed | P1 | Every code in `oe_cdt_codes.fee_schedule` |
| In-network contracted fee schedules per payer | P1 | What the payer actually pays per code — needed for patient estimates |
| Medicaid fee schedule (if enrolled) | P2 | State Medicaid rate table |
| Fee schedule effective date (schedules change annually) | P1 | `oe_cdt_codes` |
| Last fee schedule update date | P1 | Production reporting accuracy |

**Fee schedule import format:** Most practices have their UCR fee schedule in Dentrix as a "Fee Schedule" report. Export as CSV. The CDT codes used by this practice need to map to `oe_cdt_codes.code` — the platform already has the full CDT 2024 library as system defaults.

---

## E. FINANCIAL BASELINE SETUP

**Purpose:** Required for `oe_monthly_expenses`, `oe_accounts_payable`, `oe_daily_metrics`, P&L reporting, collections KPI, and the analytics dashboard. The analytics module currently shows hardcoded $7,500/day collection target — this must be replaced with real baseline data.

### E1. Chart of Accounts

| Item | Phase | Module(s) Fed |
|------|-------|---------------|
| QuickBooks Online account ID and OAuth credentials | P1 | Accounting integration (`accounting-integration.ts`) |
| Chart of accounts (revenue categories: hygiene production, restorative, specialty, whitening, implants, ortho) | P1 | `oe_monthly_expenses`, P&L |
| Expense categories (Payroll & Benefits, Clinical Supplies, Lab Fees, Rent/Mortgage, Marketing, Equipment, Insurance, Utilities, Professional Services) | P1 | `oe_monthly_expenses.category` |
| Monthly fixed overhead amount | P1 | KPI: overhead ratio |
| Annual revenue target | P1 | Analytics KPI: % to goal |
| Daily production goal (to replace $7,500 hardcode) | P1 | `oe_daily_metrics` |
| Monthly collections goal | P1 | Collections KPI |

### E2. Accounts Receivable Baseline

| Item | Phase | Notes |
|------|-------|-------|
| Total AR at go-live (by aging bucket: 0–30, 31–60, 61–90, 90+) | P1 | `oe_accounts_payable`, analytics |
| Insurance AR total (by payer) | P1 | Claims aging module |
| Patient AR total | P1 | Collections module |
| Claims older than 90 days (should be reviewed before migration — do not bring stale junk claims into a new system) | P1 | Prevent phantom AR |
| Outstanding credit balances | P1 | Must reconcile before migration |

### E3. Banking Information

| Item | Phase | Module(s) Fed |
|------|-------|---------------|
| Practice operating account (bank name, routing, account) | P1 | EFT/ERA enrollment, payroll, merchant settlement |
| Practice payroll account (if separate) | P1 | Payroll |
| Merchant services settlement account | P1 | Square merchant onboarding |
| Credit card used for recurring SaaS/vendor payments | P3 | Reference only |

### E4. Historical Financial Data

| Item | Phase | Why |
|------|-------|-----|
| Prior 12 months of monthly production by category | P2 | Analytics baseline — otherwise all charts show flat zero |
| Prior 12 months of monthly collections | P2 | Collections trend, KPI benchmarking |
| Prior 12 months of monthly new patient count | P2 | New patient trend analytics |
| Prior year total annual revenue (from tax return or QB) | P2 | Year-over-year analytics |
| Top 20 CDT codes by production volume | P1 | Procedure mix analytics, scheduling optimization |

---

## F. SCHEDULING CONFIGURATION

**Purpose:** Fully populates `oe_appointment_types`, `oe_resources`, `oe_provider_availability`, `oe_provider_blocks`, and the scheduling calendar. This is required for online booking, automated reminders, and recall scheduling.

### F1. Appointment Types

For each appointment type the practice uses, collect:

| Field | Example Values | Phase | Notes |
|-------|---------------|-------|-------|
| Appointment type name | "Adult Prophy", "Child Prophy", "New Patient Exam", "Crown Prep", "Root Canal - Molar", "Implant Consultation", "Emergency Exam" | P1 | `oe_appointment_types.name` |
| CDT code(s) associated | D0120, D1110, D0150, D2740, etc. | P1 | Links to fee schedule and recall rules |
| Duration in minutes | 30, 45, 60, 90, 120 | P1 | `oe_appointment_types.duration_minutes` |
| Buffer time after (minutes) | 0, 10, 15 | P1 | Prevents back-to-back booking |
| Which provider(s) can perform | All, or specific dentist/hygienist | P1 | `oe_appointment_types.provider_restrictions` |
| Which operatory/resource | Op 1, Op 2, Hygiene Bay | P1 | `oe_resources` assignment |
| Online bookable (Y/N) | Emergency = N, Recall prophy = Y | P1 | Online booking filtering |
| Color code (hex) | For calendar visual differentiation | P1 | `oe_appointment_types.color` |
| Max per day per provider | 4 crowns/day, unlimited hygiene | P2 | Block scheduling rules |

**Standard appointment types for a general dental practice (minimum set):**

New Patient Exam (60 min) | Adult Prophy (45 min) | Child Prophy (30 min) | Perio Maintenance (45 min) | SRP Full Mouth (120 min) | SRP Quad (60 min) | Composite Filling (60 min) | Crown Prep (90 min) | Crown Seat (30 min) | Root Canal — Anterior (90 min) | Root Canal — Premolar (90 min) | Root Canal — Molar (120 min) | Extraction — Simple (45 min) | Extraction — Surgical (60 min) | Implant Placement (90 min) | Implant Restoration (60 min) | Emergency Exam (30 min) | Consultation (30 min) | Whitening (60 min) | Night Guard Delivery (30 min) | Night Guard Impression (30 min) | Denture Impression (60 min) | Denture Delivery (45 min)

### F2. Operatory / Resource Setup

| Item | Phase | Notes |
|------|-------|-------|
| Number of operatories | P1 | `oe_resources` — one record per operatory |
| Operatory names/numbers | P1 | "Op 1", "Hygiene A", "Hygiene B", "X-Ray Room" |
| Which procedures are performed in which operatory | P1 | `oe_resources.type = 'operatory'` |
| Shared equipment (Panoramic, CBCT, Cerec) | P2 | `oe_resources.type = 'equipment'` |

### F3. Provider Schedules

| Item | Phase | Notes |
|------|-------|-------|
| Working days per provider | P1 | `oe_provider_availability.day_of_week` |
| Start/end time per day per provider | P1 | `oe_provider_availability.start_time / end_time` |
| Lunch block time | P1 | `oe_provider_blocks.block_type = 'lunch'` |
| Known future time off / vacation | P2 | `oe_provider_blocks` |
| Holiday schedule | P1 | Practice-level blocks |
| Provider who handles emergency walk-ins | P1 | Scheduling logic |

### F4. Recall Rules

| Item | Phase | Notes |
|------|-------|-------|
| Recall interval per patient category (standard: 6 months prophy, 3–4 months perio maintenance) | P1 | `oe_recall_rules.interval_days` |
| Trigger CDT codes per recall type | P1 | `oe_recall_rules.trigger_codes` — e.g., D1110 triggers 6-month recall |
| Reminder schedule per recall type (e.g., 30-day advance SMS, 7-day email, 2-day SMS) | P1 | `oe_recall_rules.reminder_schedule` |
| Reactivation trigger (patients with no visit in X days) | P1 | Reactivation outreach workflow |

---

## G. MERCHANT PROCESSING SETUP (SQUARE)

**Purpose:** Required for patient payment collection (`oe_billing_claims.patient_responsibility`), Square Web Payments SDK tokenization, and settlement reporting. This platform uses Square as primary — never add new Stripe code.

| Item | Phase | Source | Notes |
|------|-------|--------|-------|
| Square Developer account (or existing Square account) | P1 | developer.squareup.com | Brad's NuStack account or practice's own |
| Square Application ID | P1 | Square Developer Dashboard | `SQUARE_APPLICATION_ID` env var |
| Square Location ID | P1 | Square Dashboard | Identifies the specific practice location |
| Square Access Token (OAuth or personal) | P1 | Square Dashboard | `SQUARE_ACCESS_TOKEN` env var |
| Square environment (sandbox vs. production) | P1 | Dev/prod | `SQUARE_ENVIRONMENT` env var |
| Practice bank account for Square settlement | P1 | Practice | Must match merchant enrollment |
| PCI compliance attestation (SAQ-A for hosted fields) | P1 | Square handles PCI — practice attests SAQ-A | Annual requirement |
| Terminal hardware (if using Square Reader/Terminal) | P2 | Square hardware order | In-office card swipe |
| Existing payment plan agreements to migrate | P2 | Dentrix ledger | Open balances with payment plans |
| CareCredit merchant ID (if existing account) | P2 | CareCredit portal | Third-party financing integration |
| Sunbit account (if existing) | P2 | Sunbit portal | |
| Third-party financing contact at each company | P2 | Existing relationship | |

**Note on stored card tokens:** Do NOT migrate raw card numbers. If the practice has stored patient credit cards in Dentrix, those cards must be re-tokenized through Square Web Payments SDK. Build a patient re-authorization flow.

---

## H. PAYROLL SETUP

**Purpose:** Required to replace hardcoded payroll data in the HR module. The platform currently has `ROLE_RATES` hardcoded in `src/app/dashboard/hr/page.tsx` — this must be replaced with ADP or Square Payroll data per the NEEDS-TO-FINISH.md.

### H1. Practice Payroll Configuration

| Item | Phase | Source | Module(s) Fed |
|------|-------|--------|---------------|
| Payroll processor (ADP, Gusto, Square Payroll, Paychex, QuickBooks Payroll) | P1 | Practice decision | HR integration target |
| Payroll frequency (weekly / bi-weekly / semi-monthly) | P1 | Practice policy | HR module, financial projections |
| Payroll run day | P1 | Practice | Automated payroll reminders |
| State unemployment ID (SUTA) | P1 | State workforce agency | Payroll tax |
| Federal unemployment account (FUTA — EIN-linked) | P1 | IRS | Payroll tax |
| Workers compensation policy number and carrier | P1 | Insurance | HR compliance |
| ADP credentials (if ADP) | P1 | ADP Workforce Now | `ADP_CLIENT_ID`, `ADP_CLIENT_SECRET` |
| Company code (ADP) | P1 | ADP | API connection |

### H2. Per Employee Payroll Data

| Item | Phase | Notes |
|------|-------|-------|
| Employee legal name (must match SSN) | P1 | W-4 / I-9 |
| SSN | P1 | Not stored in platform — passed to payroll processor only |
| Date of birth | P1 | ADP profile |
| Home address | P1 | W-4, tax purposes |
| Pay type: Hourly vs. Salary | P1 | `oe_employees` extension needed |
| Pay rate (hourly rate or annual salary) | P1 | HR module — replaces hardcoded ROLE_RATES |
| Employment start date | P1 | `oe_employees.hire_date` |
| Federal W-4 withholding elections | P1 | ADP/payroll processor |
| State withholding (if applicable — NV has no state income tax) | P1 | State-specific |
| Exempt from overtime (Y/N) | P1 | FLSA classification |
| Direct deposit bank info (routing + account) | P1 | Payroll processor — NOT stored in Dental Engine DB |
| Benefits deductions (health, dental, 401k, FSA) | P2 | `oe_employee_benefit_enrollments` |
| PTO / vacation accrual rate | P2 | HR policy |

### H3. Benefits Setup

| Item | Phase | Notes |
|------|-------|-------|
| Health insurance carrier and plan details (or ICHRA allowance amounts) | P1 | `oe_employee_benefit_enrollments.benefit_type = 'ichra_health'` |
| Dental insurance for employees (often in-house at dental practices) | P1 | |
| Vision plan details | P2 | |
| Life insurance carrier and face amount | P2 | |
| 401k plan provider (if any) | P2 | |
| 401k employer match formula | P2 | |

---

## I. PATIENT COMMUNICATIONS SETUP

**Purpose:** Required for `oe_outreach_workflows`, `oe_outreach_messages`, `message_templates`, `consent_log`, and all automated SMS/email appointment reminders, recall, and reactivation campaigns. Also required for Twilio SMS provisioning.

### I1. SMS / Twilio Setup

| Item | Phase | Source | Notes |
|------|-------|--------|-------|
| Twilio subaccount for this practice | P1 | Already scaffolded — see memory/twilio-setup.md: AK Dental ACbff4 has no phone yet | `practices.twilio_phone_number` |
| 10DLC campaign registration | P1 | Twilio Console | A2P 10DLC required for all business SMS in USA. ISV registration must come first. |
| Campaign use case (Healthcare — HIPAA-exempt from some TCPA requirements) | P1 | Twilio | Healthcare/appointment reminders have different 10DLC rules |
| Dedicated phone number (long code or toll-free) | P1 | Twilio | `practices.twilio_messaging_service_sid` |
| Practice name as sender ID (displayed in SMS) | P1 | Twilio messaging service | |
| Opt-in keyword (e.g., "DENTAL") for TCPA compliance | P1 | Twilio | `consent_log` |
| Opt-out keyword (STOP — required by law) | P1 | Twilio / platform | Auto-handled by platform → `oe_opt_outs` |
| Help keyword response | P1 | Twilio | |
| TCPA consent records for all patients (see C6 above) | P1 | Patient migration | Cannot send without this |

### I2. Email Setup

| Item | Phase | Source | Notes |
|------|-------|--------|-------|
| Sending domain (e.g., akultimatedental.com) | P1 | Domain registrar | Must match practice website domain |
| Resend account and API key (platform uses Resend) | P1 | resend.com | `RESEND_API_KEY` |
| DNS records: SPF, DKIM, DMARC | P1 | Domain DNS — Cloudflare or registrar | Without these, emails go to spam |
| Resend domain verification | P1 | Resend Dashboard | Proves domain ownership |
| From address (e.g., hello@akultimatedental.com) | P1 | Practice decision | |
| Reply-to address (monitored inbox) | P1 | Practice | Patients reply to real staff |
| HIPAA email disclaimer template | P1 | HIPAA counsel | Required in all PHI-containing emails |
| Unsubscribe link (CAN-SPAM) | P1 | Platform default | Auto-included by Resend |

### I3. Message Templates

All message templates in `message_templates` table need to be customized per practice:

| Template Category | Phase | Content Needed |
|-------------------|-------|----------------|
| Appointment confirmation | P1 | Practice name, phone, address, cancellation policy |
| 48-hour reminder (SMS + email) | P1 | Appointment details, reminder instructions |
| 24-hour reminder (SMS) | P1 | Brief reminder text |
| 2-hour reminder (SMS) | P1 | Day-of reminder |
| No-show follow-up | P1 | Rebooking CTA |
| Recall due — 30 days advance | P1 | Hygiene recall messaging |
| Recall overdue | P1 | Reactivation language |
| New patient welcome | P1 | Welcome, what to bring, portal login |
| Review request (post-appointment) | P1 | Google review link |
| Treatment plan follow-up | P2 | Unaccepted treatment plan nudge |
| Balance due reminder | P2 | Collections — must include amount owed |
| Birthday greeting | P2 | HIPAA note — birthday = PHI, must have consent |

### I4. Communication Preferences Per Patient

| Item | Phase | Notes |
|------|-------|-------|
| Preferred contact method (SMS / email / phone) | P1 | Imported from Dentrix or collected at intake |
| Preferred language | P2 | Template language variant |
| Do-not-contact records | P1 | Must populate `oe_opt_outs` before first send |

---

## J. THIRD-PARTY FINANCING SETUP

**Purpose:** Required to wire the platform's financing integration so treatment plan presentations include real-time financing estimates (CareCredit, Sunbit, LendingClub Patient Solutions).

| Item | Phase | Source | Notes |
|------|-------|--------|-------|
| CareCredit merchant number (practice-specific) | P1 | CareCredit (via Synchrony) — call 1-800-300-3046 | Existing practices already have this |
| CareCredit merchant enrollment form (if new) | P1 | CareCredit website | Takes 3–5 business days |
| CareCredit practice bank account for funding | P1 | Existing CareCredit account | Funding deposited within 2 days of application |
| CareCredit API credentials (if using API integration) | P2 | CareCredit developer portal | For real-time apply/decisioning in-platform |
| Sunbit account number | P2 | Sunbit.com | Newer financing option; no hard credit check |
| Sunbit API key / partner ID | P2 | Sunbit partner portal | |
| Lending Club Patient Solutions account | P3 | LendingClub | For high-balance treatment plans |
| Patient financing brochure / promotional materials | P2 | CareCredit / Sunbit | Upload to `oe_documents` |
| Staff training on presenting financing | P2 | CareCredit training center | Not a platform item but blocks adoption |
| Maximum financing amounts offered | P1 | Practice policy | Treatment plan estimate display |
| Minimum case size for financing presentation | P1 | Practice policy | e.g., "Present for cases > $500" |

---

## K. DOCUMENT & CONSENT MANAGEMENT

**Purpose:** Populates `oe_consent_forms`, `oe_consent_signatures`, and the Supabase Storage document vault. The platform's consent module supports versioned forms with typed/drawn/electronic signatures.

### K1. Required Forms to Digitize

| Form | Phase | Notes |
|------|-------|-------|
| HIPAA Notice of Privacy Practices | P1 | Required by law for every new patient — `consent_type = 'hipaa_treatment'` |
| HIPAA Acknowledgment of Receipt | P1 | Patient signature acknowledging receipt of NPP |
| Financial Policy / Payment Agreement | P1 | Includes: payment expectations, financing, returned check fees, collection policy |
| Assignment of Benefits | P1 | Authorizes insurance to pay the practice directly |
| Release of Information Authorization | P1 | Allows sending records to other providers/insurers |
| General Dental Consent to Treatment | P1 | Blanket consent for examinations and standard procedures |
| Medical / Health History Form | P1 | Annual update — feeds `oe_clinical_notes.medications` and allergies |
| COVID-19 / Infection Control Notice (if still in use) | P3 | Check local requirements |
| Anesthesia Consent (Local) | P1 | Before any injection |
| Nitrous Oxide Consent | P2 | If practice offers nitrous |
| IV Sedation / Oral Sedation Consent | P3 | If applicable |
| Extraction Consent | P2 | Per procedure |
| Root Canal Consent | P2 | Per procedure |
| Implant Consent | P2 | Per procedure |
| Crown / Bridge Consent | P2 | Per procedure |
| Orthodontic Consent | P3 | If practice does ortho |
| Periodontal Treatment Consent (SRP) | P2 | |
| Photography / Video Consent | P2 | For before/after, marketing use |
| Minor Patient Consent (signed by parent/guardian) | P1 | For patients under 18 |
| Online Scheduling Terms | P1 | Acceptance of appointment booking terms |
| SMS / Text Consent | P1 | TCPA — explicit consent for SMS, separate from treatment consent |
| Portal Terms of Service | P1 | Patient portal access agreement |
| In-House Membership Plan Agreement | P3 | If practice offers an in-house membership plan |

**Form versioning note:** The `oe_consent_forms` table tracks `version` and `effective_date`. Every time a form is revised, increment the version. The `oe_consent_signatures` table records which version the patient signed — critical for HIPAA audits.

### K2. Document Standards

| Standard | Requirement |
|----------|-------------|
| Format | PDF (preferred), or HTML forms rendered in-platform |
| Signature types supported | Typed name, drawn (touch/mouse), electronic acknowledgment |
| Retention period | HIPAA minimum: 6 years from creation or last effective date. State law may be longer (Nevada: 5 years adult, until age 23 for minors) |
| PHI in documents | All documents containing PHI must be stored in encrypted Supabase Storage bucket with RLS. |
| Backup copies | Practice should maintain a separate backup of signed consent PDFs independent of platform |

---

## L. TECHNOLOGY & SYSTEM ACCESS

**Purpose:** Required to execute data migration, connect integrations, configure DNS, and set up the Google/Yelp/social presence.

### L1. Existing PMS (Dentrix)

| Item | Phase | Notes |
|------|-------|-------|
| Dentrix version (G5, G6, G7, Dentrix Ascend) | P1 | Determines migration method |
| Dentrix server type (local server vs. cloud) | P1 | Local = SQL Server access possible. Ascend = CSV export only |
| Dentrix admin username and password | P1 | For data extraction — handle securely |
| Access to Dentrix server (Remote Desktop or physical) | P1 | For migration vendor or direct extraction |
| Dentrix Support agreement status | P2 | May need Henry Schein's data export service |
| Last Dentrix backup location and format | P1 | `.dmb` files on local server |
| Data lock date (final date to enter data in old system) | P1 | Critical — establish clean cutover point |

### L2. Google & Review Platforms

| Item | Phase | Notes |
|------|-------|-------|
| Google Business Profile (GBP) login email | P1 | For reputation/review management module |
| GBP ownership verification | P1 | Must be verified owner or manager, not just a viewer |
| Google Place ID | P1 | For review request links and local SEO |
| Google Review link (short URL) | P1 | Pre-built in `practiceConfig.ratings.googleReviewUrl` |
| Google Search Console access (property owner) | P1 | SEO dashboard (`GOOGLE_SERVICE_ACCOUNT_KEY`) |
| Google Analytics 4 property ID and access | P2 | Website analytics |
| Google Ads account ID (if running ads) | P3 | Marketing attribution |
| Yelp Business account login | P1 | Reputation module |
| Yelp Business page URL | P1 | Pre-built in `practiceConfig.social.yelp` |
| Healthgrades provider profile | P2 | Reputation management |
| Zocdoc profile credentials | P2 | Online booking source |
| Vitals / RateMDs profile | P3 | Reputation management |

### L3. Website & Domain

| Item | Phase | Notes |
|------|-------|-------|
| Domain registrar login (GoDaddy, Namecheap, Cloudflare, etc.) | P1 | For DNS updates (SPF, DKIM, DMARC, TXT records) |
| Current hosting provider | P1 | May be migrating to Vercel |
| Current website platform (Squarespace, WordPress, custom, etc.) | P1 | Dental Engine replaces this with Next.js |
| Vercel project and domain config | P1 | `vercel.json` already configured |
| SSL certificate (handled by Vercel automatically) | P1 | Auto-managed |
| Current website analytics credentials | P2 | Historical traffic data |
| sitemap.xml location (current) | P2 | For redirect mapping |
| 301 redirect map (old URLs → new URLs) | P2 | Preserves SEO equity |

### L4. Social Media Accounts

| Platform | Phase | Notes |
|----------|-------|-------|
| Facebook Page URL and admin access | P1 | `practiceConfig.social.facebook` — currently: chireu.alexandru |
| Instagram handle and login | P1 | `practiceConfig.social.instagram` — currently undefined (see NEEDS-TO-FINISH.md) |
| TikTok account | P2 | `practiceConfig.social.tiktok` — currently undefined |
| YouTube channel | P2 | `practiceConfig.social.youtube` — currently undefined |

### L5. Third-Party Service Credentials

| Service | Phase | Notes |
|---------|-------|-------|
| Vyne Dental Trellis API key | P1 | Insurance eligibility — `VYNE_API_KEY` (currently stub only) |
| QuickBooks Online OAuth credentials | P1 | `QUICKBOOKS_CLIENT_ID`, `QUICKBOOKS_CLIENT_SECRET` |
| ADP API credentials | P1 | `ADP_CLIENT_ID`, `ADP_CLIENT_SECRET` |
| Vapi Voice AI API key | P1 | AI receptionist — `VAPI_API_KEY` |
| Clerk application credentials | P1 | Auth — already configured for AK Dental |
| Supabase project URL and service role key | P1 | DB — already configured |
| Message encryption key | P1 | PHI encryption for SMS — `MESSAGE_ENCRYPTION_KEY` |

---

## INDUSTRY RESEARCH: COMPETITOR ONBOARDING PRACTICES

### What Leading Platforms Require (Dentrix, Eaglesoft, Curve, OpenDental)

**Dentrix (Henry Schein):**
- Onboarding takes 8–12 weeks from contract to go-live
- Requires a dedicated "Dentrix Implementation Specialist" (included in contract)
- Data conversion from a competitor PMS costs $800–$3,000 as an add-on
- Training is broken into roles: front desk, billing, clinical, provider
- Recommends a "parallel run period" of 30–90 days running old and new systems simultaneously

**Eaglesoft (Patterson Dental):**
- On-site installation for server-based version — requires IT visit
- Data migration handled by Patterson's conversion team
- 4–8 weeks typical implementation
- Fee schedules and insurance carriers are manually entered — notorious pain point
- Requires physical presence for initial training

**Curve Dental (Cloud):**
- Fastest onboarding of the majors: 4–6 weeks
- All cloud — no server required
- Data migration from Dentrix or Eaglesoft via CSV export packages
- Uses a "Curve Implementation Checklist" that maps directly to our categories
- Unique: requires practice to designate a "Practice Champion" (internal champion for adoption)

**OpenDental (Open Source):**
- 2–4 weeks self-install; longer with data migration
- Largest community of migration scripts for Dentrix → OpenDental
- Fee schedule import via CSV — 1 row per CDT code
- Insurance carrier library can be imported via XML

**Carestream Dental (CS SoftDent, CS OrthoTrac):**
- High-touch onboarding; typically 6–10 weeks
- Requires hardware compatibility audit
- Strong on imaging integration (DICOM)

### DSO Onboarding Checklists

DSOs (Dental Service Organizations like Aspen Dental, Pacific Dental, Heartland Dental) maintain detailed practice activation checklists. Key elements not typically emphasized in single-practice onboarding:

1. **Payer credentialing is done at the GROUP level first**, then individual provider credentialing is tied to the group contract. This is different from a solo practice where the individual and group are essentially the same.
2. **Standardized fee schedules** — DSOs negotiate a single fee schedule across all locations. Fee schedule must be imported correctly or every claim will underprice.
3. **Provider NPI cross-reference table** — DSOs track each provider's NPI against each location's NPI Type II.
4. **CAQH group attestation** — DSOs require quarterly CAQH attestation for all clinical providers.
5. **Imaging system integration** — DICOM viewer and X-ray hardware vary by location. Each imaging system needs its own credentials and patient-ID mapping to the PMS.

---

## COMMON ONBOARDING MISTAKES THAT DELAY GO-LIVE

Based on industry patterns across Dentrix, Eaglesoft, Curve, and OpenDental implementations:

| Mistake | Category | Days Added | Prevention |
|---------|----------|-----------|------------|
| Not starting payer credentialing early enough | Insurance | 60–90 days | Begin credentialing applications at contract signing, not go-live prep |
| Missing ERA/EFT enrollment forms | Insurance | 30–60 days | Submit ERA enrollment on day 1 — payers are slow |
| CAQH profile not current (must attest within 120 days) | Credentialing | 30–90 days | Check CAQH status before onboarding kick-off |
| Dentrix data export not initiated | Migration | 14–28 days | Contact Henry Schein conversion team on day 1 |
| Fee schedule not imported or wrong | Billing | Production errors from day 1 | Validate top 50 codes against remittance history |
| No TCPA consent records for SMS | Compliance | Blocks SMS | Run re-consent campaign 4 weeks before go-live |
| DNS records not configured for email | Communications | Emails land in spam | SPF/DKIM/DMARC must propagate 24–48 hours before go-live |
| Staff Clerk accounts not created before training | Access | Day of go-live delay | Create all accounts 1 week before go-live, test logins |
| Historical financial data not imported | Analytics | Analytics useless for 90 days | Import 12 months of production/collections from Dentrix |
| AR not reconciled before migration | Billing | Phantom AR inflates numbers | Scrub AR in Dentrix 30 days before cutover |
| Recall rules not configured | Recall | Recall system does nothing | Import recall due dates + configure rules in week 1 |
| Provider schedules not entered | Scheduling | Online booking broken | All provider availability must be in before go-live |
| Lab case vendors not loaded | Lab | Lab tracking useless | Get list of all current labs with contact info |
| No practice champion designated | Adoption | Slow adoption, support burden | Designate 1 power user who owns the platform internally |

---

## PHASED ONBOARDING TIMELINE

### Pre-Launch (Weeks 1–4, Before Go-Live)

**Week 1 — Data Collection Blitz:**
- [ ] Execute BAA (Business Associate Agreement) — required before any PHI transfer
- [ ] Collect all Section A (Practice Identity) documents
- [ ] Collect all Section B (Provider) documents
- [ ] Submit CAQH attestation updates for all providers
- [ ] Submit ERA/EFT enrollment forms to all payers
- [ ] Contact Henry Schein / Dentrix to initiate data export
- [ ] Set up Square merchant account
- [ ] Create Clerk application for practice (or configure existing)
- [ ] Create Twilio subaccount and submit 10DLC campaign registration

**Week 2 — Configuration:**
- [ ] Configure practice settings (`practiceConfig.ts` equivalent for new practice)
- [ ] Import fee schedules (CDT codes → `oe_cdt_codes.fee_schedule`)
- [ ] Set up appointment types (`oe_appointment_types`)
- [ ] Set up operatories and resources (`oe_resources`)
- [ ] Create all staff Clerk accounts with correct RBAC roles
- [ ] Configure provider availability (`oe_provider_availability`)
- [ ] Set up recall rules (`oe_recall_rules`)
- [ ] Configure message templates (`message_templates`)
- [ ] Upload and activate consent forms (`oe_consent_forms`)
- [ ] Configure DNS: SPF, DKIM, DMARC, Resend verification

**Week 3 — Data Migration:**
- [ ] Import patient demographics (CSV → `oe_patients`)
- [ ] Import insurance information per patient
- [ ] Import AR aging (outstanding balances)
- [ ] Import historical appointments (last 90 days minimum)
- [ ] Import perio chart data → `oe_dental_charts`
- [ ] Import TCPA consent records → `oe_patient_consents`
- [ ] Import opt-out list → `oe_opt_outs` (BEFORE first SMS send)
- [ ] Upload X-rays and historical documents to Supabase Storage
- [ ] Import signed consent forms to document vault

**Week 4 — Testing & Training:**
- [ ] End-to-end scheduling test (book, confirm, reminder sends)
- [ ] Test insurance claim submission (test claim on sandbox clearinghouse)
- [ ] Test Square payment processing (test transaction)
- [ ] Test SMS/email flows (appointment reminders, recalls)
- [ ] Staff training by role (front desk, clinical, billing, admin)
- [ ] Patient portal test (have one real patient log in)
- [ ] Verify Google Business Profile connection
- [ ] Go/No-Go review with practice owner

### Post-Launch (Weeks 5–12)

**Week 5–8:**
- [ ] First live ERA/EFT receipts (verify electronic remittance posts correctly)
- [ ] First payroll run through new system
- [ ] QuickBooks Online integration activated
- [ ] Vyne Dental Trellis eligibility verification live
- [ ] Reactivation campaign launched (patients overdue for recall)

**Weeks 9–12:**
- [ ] Historical financial data import (prior 12 months)
- [ ] Analytics baseline established (all KPIs showing real data)
- [ ] Remaining Phase 2 consent forms uploaded and activated
- [ ] CareCredit / Sunbit financing integration live
- [ ] ADP payroll integration live (replaces hardcoded HR data)
- [ ] Review management automation running (post-visit Google review requests)

---

## HIPAA / HITECH COMPLIANCE CHECKLIST

The following compliance items are required before any PHI enters the system:

| Item | Regulation | Phase | Notes |
|------|-----------|-------|-------|
| BAA signed between practice and NuStack Digital Ventures | HIPAA | Pre-launch | Must be executed before any data transfer |
| BAA signed between practice and Supabase | HIPAA | Pre-launch | Supabase has a BAA available for paid plans |
| BAA signed between practice and Clerk | HIPAA | Pre-launch | Clerk provides HIPAA BAA |
| BAA signed between practice and Resend (email) | HIPAA | Pre-launch | Resend provides BAA |
| BAA signed between practice and Twilio | HIPAA | Pre-launch | Twilio HIPAA-compliant messaging requires BAA |
| BAA signed between practice and Vapi | HIPAA | P1 | Required for voice AI handling PHI |
| BAA signed between practice and Square | HIPAA | P1 | Square provides BAA for healthcare |
| PHI encryption at rest (Supabase encryption) | HITECH | P1 | Supabase encrypts at rest by default |
| PHI encryption in transit (TLS 1.2+) | HITECH | P1 | Vercel/Supabase enforce this |
| Message-level PHI encryption for SMS | HITECH | P1 | `MESSAGE_ENCRYPTION_KEY` — see NEEDS-TO-FINISH.md |
| Audit logging enabled (`audit_log` table) | HIPAA | P1 | Already implemented in schema |
| Data retention policy configured | HIPAA/HITECH | P1 | Migration 018 implemented |
| Minimum Necessary access (RBAC) | HIPAA | P1 | Clerk + RBAC tables implemented |
| Patient right to access records (portal) | HIPAA | P1 | Patient portal already built |
| Breach notification procedure (written policy) | HIPAA | P1 | Practice must have written policy |
| Employee HIPAA training documentation | HIPAA | P1 | Document in HR module |
| Annual HIPAA risk assessment | HIPAA | P1 | Must be documented; platform audit log supports this |

---

## SUMMARY: DATA COLLECTION DELIVERY FORMAT

When collecting onboarding data from a new practice, deliver these intake packages:

**Package 1 — Day 1 (sent with contract):**
- Practice Identity Form (Section A) — fillable PDF
- Provider Information Form (Section B) — one per provider
- Payer List Worksheet (Section D1) — Excel, lists all accepted insurances with payer IDs
- ERA/EFT Enrollment Bundle — pre-filled with practice NPI/EIN, needs bank info + signature

**Package 2 — Week 1:**
- Employee Census Spreadsheet (Section H) — Excel template
- Fee Schedule Template (Section E3) — Excel with CDT code column, fee column
- Appointment Types Worksheet (Section F1) — Excel
- Scheduling/Hours Form (Section F3) — one per provider

**Package 3 — During Migration:**
- Dentrix Data Export Instructions (Section C) — sent to practice IT/Dentrix contact
- Document Upload Checklist (Section K) — list of forms to scan and upload
- TCPA Consent Migration Guide (Section C6 / I1) — critical compliance item

**Package 4 — Go-Live Week:**
- Staff Credential Assignments (Clerk invite emails)
- Square merchant activation
- Twilio number confirmation
- DNS record configuration instructions (for their IT/registrar)

---

This document represents the complete internal master checklist for Dental Engine practice onboarding. It maps every data collection requirement to the specific database schema tables and environment variables in the platform, cross-referenced against the AK Ultimate Dental reference implementation and industry-standard dental practice management onboarding methodology.
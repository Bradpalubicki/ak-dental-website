// POST /api/onboarding/send-documents
// Seeds MPA + TSA + NV SB370 addendum in oe_offer_letters for Alex Chireau to sign.
// Returns sign links for all 3 documents.
// Idempotent — skips any document that already exists in sent/signed state.

import { NextResponse } from "next/server";
import { tryAuth } from "@/lib/auth";
import { createServiceSupabase } from "@/lib/supabase/server";

const ALEX = {
  first_name: "Alex",
  last_name: "Chireau",
  email: "info@akultimatedental.com",
  title: "DDS, Owner",
};

const DOCUMENTS = [
  {
    document_type: "master_platform_agreement",
    job_title: "Master Platform Agreement + Business Associate Agreement",
    department: "Administrative" as const,
    letter_body: `MASTER PLATFORM AGREEMENT
Including Business Associate Agreement (Article VI)
Agreement No. DEP-2026-001

Parties:
  Platform Provider: Dental Engine Partners LLC (Wyoming LLC)
  Practice / Covered Entity: AK Ultimate Dental LLC — Alex Chireau, DDS

KEY TERMS:

1. SERVICES — Dental Engine Partners provides the AK Dental dashboard platform including: patient management, scheduling, clinical documentation (AI-assisted SOAP notes, CDT charting), insurance verification, lead management, billing/AR tracking, HR module, and AI Advisor.

2. FOUNDER TERMS (Section 4.2) — Because Alex Chireau, DDS is a founding member of Dental Engine Partners LLC, AK Ultimate Dental receives platform access at no monthly subscription fee for as long as Alex remains an active vested member of Dental Engine Partners.

3. HIPAA / BAA (Article VI) — Dental Engine Partners is a Business Associate under HIPAA. All PHI is encrypted at rest (AES-256) and in transit (TLS 1.2+). PHI is never sent to AI services without a separate BAA. Breach notification within 60 days per 45 CFR 164.410.

4. AI LIMITATION — AI features operate on de-identified or structured inputs only. AI does not transmit full patient records or make clinical diagnoses.

5. DATA OWNERSHIP — All Practice Data remains the property of AK Ultimate Dental. On termination, Platform Provider will export all data within 30 days and delete it within 90 days.

6. TERM — Month-to-month with 30 days written notice to terminate.

7. GOVERNING LAW — Wyoming. Disputes: binding arbitration (AAA Commercial Rules).

By signing below, you acknowledge that you have read, understand, and agree to the Master Platform Agreement including the Business Associate Agreement, and that you are authorized to bind AK Ultimate Dental LLC.

Full agreement document available at: https://github.com/Bradpalubicki/corporate-docs`,
  },
  {
    document_type: "technology_services_authorization",
    job_title: "Technology Services Authorization (TSA) — Exhibit B",
    department: "Administrative" as const,
    letter_body: `TECHNOLOGY SERVICES AUTHORIZATION AND SYSTEM INTEGRATION AGREEMENT
Exhibit B to Master Platform Agreement DEP-2026-001
Authorization No. DEP-2026-001-TSA

Authorizing Party: AK Ultimate Dental LLC — Alex Chireau, DDS
Authorized Provider: Dental Engine Partners LLC / NuStack Digital Ventures LLC

WHAT YOU ARE AUTHORIZING:

This document gives Dental Engine Partners and NuStack Digital Ventures the right to provision, configure, and manage the following third-party systems ON YOUR BEHALF, so we can deliver the platform services without requiring you to manage each one manually:

TIER 1 — PHI-PRESENT SYSTEMS (all governed by HIPAA):
1. Supabase (Database) — Platform Provider provisions and manages the AK Dental database instance. Encrypted, HIPAA-compliant.
2. Twilio (SMS) — Platform Provider manages the AK Dental SMS subaccount (ACbff4...) and dedicated phone number for appointment reminders and patient messaging.
3. Resend (Email) — Platform Provider sends transactional emails on Practice's behalf.
4. Sikka ONE API (PMS Integration) — READ-ONLY sync from Dentrix to the dashboard. Platform Provider configures the connection using Practice's Sikka account.
5. Anthropic Claude AI — De-identified data only. Platform Provider uses Claude for note drafting, advisor responses, and operational insights. No PHI transmitted.

TIER 2 — NON-PHI SYSTEMS:
6. Clerk (Authentication) — User accounts and login for dashboard access.
7. Vercel (Hosting) — Dashboard application hosting.
8. Vapi (Voice AI) — Call handling if enabled.
9. Google / Meta — Ad and analytics integrations for marketing.

WHAT WE WILL NOT DO:
- Access systems beyond what is listed above
- Make financial commitments on your behalf
- Access your bank accounts or payment systems
- Share your data with any party not listed

YOU RETAIN:
- Full ownership of all Practice Data
- The right to revoke any specific authorization at any time with written notice
- The right to audit our access logs at any time

By signing, you authorize the above as described.`,
  },
  {
    document_type: "state_addendum",
    job_title: "Nevada SB370 Consumer Health Data Processing Addendum",
    department: "Administrative" as const,
    letter_body: `NEVADA CONSUMER HEALTH DATA PRIVACY ADDENDUM
Nevada Senate Bill 370 (2023) — Processing Agreement
Addendum No. DEP-2026-001-NV
Addendum to Master Platform Agreement DEP-2026-001

THIS ADDENDUM IS REQUIRED BY NEVADA LAW.
Nevada Senate Bill 370 (2023), codified at NRS Chapter 629B, effective March 31, 2024, requires a written contract between any entity that processes consumer health data and the regulated entity on whose behalf processing occurs.

Regulated Entity (Controller): AK Ultimate Dental LLC — Alex Chireau, DDS, Henderson, Nevada
Processor: Dental Engine Partners LLC (Wyoming LLC)

WHAT DENTAL HEALTH DATA WE PROCESS:
- Patient demographics (name, DOB, contact info)
- Dental health conditions, treatment history, diagnoses
- Appointment records and scheduling data
- Insurance information and billing records
- Clinical notes and charting data (CDT codes, tooth-level findings)

YOUR RIGHTS AS THE CONTROLLER:
1. Dental Engine Partners processes health data ONLY on your documented instructions and solely to deliver contracted services.
2. We do not sell or share consumer health data with third parties for their own purposes.
3. We implement appropriate security measures (AES-256 encryption, access controls, audit logging).
4. We notify you within 72 hours if we become aware of a data breach affecting Nevada consumer health data.
5. We delete or return all health data within 90 days of contract termination.
6. We assist you in responding to consumer rights requests under NRS 629B within 45 days.

HIPAA RELATIONSHIP: To the extent data also constitutes PHI under HIPAA, the BAA (Article VI of the Master Platform Agreement) governs. This Addendum provides additional protections required specifically by Nevada SB 370.

By signing below, you acknowledge this Addendum as required by Nevada law and confirm that Dental Engine Partners is authorized to process AK Ultimate Dental's consumer health data as described herein.`,
  },
];

export async function POST() {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();

  const results: Array<{ document_type: string; sign_token: string; status: string }> = [];

  for (const doc of DOCUMENTS) {
    // Check if already exists in sent/viewed/signed state
    const { data: existing } = await supabase
      .from("oe_offer_letters")
      .select("id, sign_token, status")
      .eq("document_type", doc.document_type)
      .eq("candidate_email", ALEX.email)
      .in("status", ["sent", "viewed", "signed"])
      .maybeSingle();

    if (existing) {
      results.push({ document_type: doc.document_type, sign_token: existing.sign_token, status: existing.status });
      continue;
    }

    const { data: inserted, error } = await supabase
      .from("oe_offer_letters")
      .insert({
        candidate_first_name: ALEX.first_name,
        candidate_last_name: ALEX.last_name,
        candidate_email: ALEX.email,
        job_title: doc.job_title,
        department: doc.department,
        employment_type: "FULL_TIME",
        letter_body: doc.letter_body,
        document_type: doc.document_type,
        status: "sent",
        sent_at: new Date().toISOString(),
        expires_at: twoDaysFromNow,
        created_by: authResult.userId,
      })
      .select("sign_token, status")
      .single();

    if (error || !inserted) {
      return NextResponse.json({ error: `Failed to create ${doc.document_type}: ${error?.message}` }, { status: 500 });
    }

    results.push({ document_type: doc.document_type, sign_token: inserted.sign_token, status: inserted.status });
  }

  return NextResponse.json({ documents: results }, { status: 200 });
}

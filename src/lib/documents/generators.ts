import {
  createDoc,
  collectBuffer,
  drawCoverBlock,
  drawFooters,
  sectionHead,
  para,
  clause,
  drawSignatureBlock,
  kvTable,
  MARGIN,
  CONTENT_WIDTH,
  COLORS,
  FONTS,
} from "./pdf-helpers";

const TODAY = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// ---------------------------------------------------------------------------
// 1. Master Platform Agreement + BAA (DEP-2026-001)
// ---------------------------------------------------------------------------
export async function generateMPA(): Promise<Buffer> {
  const doc = createDoc();
  const buf = collectBuffer(doc);

  // Cover
  drawCoverBlock(doc, {
    agreementNumber: "DEP-2026-001",
    title: "Master Platform Agreement",
    subtitle: "Including Business Associate Agreement (Article VI)",
    date: TODAY,
    parties: [
      {
        role: "Platform Provider",
        name: "Dental Engine Partners LLC",
        detail: "Wyoming LLC  ·  Managing Member: Brad Palubicki",
      },
      {
        role: "Covered Entity / Client",
        name: "AK Ultimate Dental LLC",
        detail: "Owner: Alex Chireau, DDS  ·  Henderson, Nevada",
      },
    ],
  });

  // Disclaimer box
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 36)
    .fill("#fef2f2");
  doc.font(FONTS.bold).fontSize(8.5).fillColor(COLORS.red)
    .text(
      "FRAMEWORK DOCUMENT — NOT A FINAL LEGAL INSTRUMENT. Must be reviewed and approved by a licensed healthcare attorney before execution.",
      MARGIN + 8, doc.y - 32, { width: CONTENT_WIDTH - 16, align: "center" }
    );
  doc.moveDown(1.5);

  // Recitals
  sectionHead(doc, "Recitals");
  para(doc, "WHEREAS, Platform Provider has developed and operates a dental practice management software platform (the \u201cPlatform\u201d) providing scheduling, patient communications, clinical documentation, insurance verification, patient engagement, and related services to dental practices;");
  para(doc, "WHEREAS, Practice is a licensed dental practice that qualifies as a Covered Entity under HIPAA;");
  para(doc, "WHEREAS, in providing the Platform services, Platform Provider will create, receive, maintain, and transmit Protected Health Information (PHI) on behalf of Practice, qualifying as a Business Associate under HIPAA;");
  para(doc, "NOW, THEREFORE, in consideration of the mutual covenants set forth herein, the parties agree as follows:");

  // Article I — Definitions
  sectionHead(doc, "Article I — Definitions");
  const definitions: Array<[string, string]> = [
    ["Authorized Users", "Employees, contractors, and agents of Practice authorized to access the Platform."],
    ["BAA", "Business Associate Agreement — this Article VI."],
    ["Breach", "As defined in 45 CFR 164.402."],
    ["Business Associate", "As defined in 45 CFR 160.103."],
    ["Covered Entity", "As defined in 45 CFR 160.103."],
    ["ePHI", "PHI created, received, maintained, or transmitted in electronic form."],
    ["HIPAA Rules", "Privacy Rule, Security Rule, Breach Notification Rule, and Enforcement Rule under 45 CFR Parts 160 and 164."],
    ["NuStack Core Platform", "Underlying SaaS architecture, AI framework, and technology owned by NuStack Digital Ventures LLC, licensed to Platform Provider."],
    ["PHI", "As defined in 45 CFR 160.103."],
    ["Platform", "The dental practice management SaaS solution operated by Platform Provider."],
    ["Practice Data", "All data, records, and information submitted to or generated through the Platform by Practice, including PHI."],
    ["Security Incident", "As defined in 45 CFR 164.304."],
    ["Services", "Platform access, implementation, support, and related services in Exhibit A."],
    ["Term", "As defined in Article X."],
  ];
  kvTable(doc, definitions);

  // Article II — Services
  sectionHead(doc, "Article II — Platform Services");
  clause(doc, "2.1", "Services Provided", "Platform Provider shall provide Practice with access to the Platform modules including: (a) Patient Management; (b) Appointment Scheduling; (c) Patient Communications via Twilio SMS; (d) Clinical Documentation with AI-assisted note drafting; (e) Insurance Verification; (f) Lead Management; (g) Patient Portal; (h) Practice Analytics; (i) HR Module; (j) AI-Powered Features.");
  clause(doc, "2.2", "Implementation and Onboarding", "Platform Provider shall provide onboarding services including platform configuration, integration setup per the Technology Services Authorization executed concurrently herewith.");
  clause(doc, "2.3", "Support", "Technical support during standard business hours via email and support portal. Critical outages (>60 consecutive minutes) receive response within 4 hours.");
  clause(doc, "2.4", "AI Features — HIPAA Limitation", "The Platform's AI features (Anthropic Claude) operate on de-identified or aggregate data only. Platform Provider shall NOT transmit individually identifiable PHI to any AI service provider without a separate, executed BAA with that provider and Practice's written authorization. AI features shall not make clinical diagnoses or serve as a substitute for licensed clinical judgment.");

  // Article III — Practice Obligations
  sectionHead(doc, "Article III — Practice Obligations");
  clause(doc, "3.1", "Account Administration", "Practice shall designate at least one administrative user responsible for managing Authorized User accounts and permissions.");
  clause(doc, "3.2", "Compliance", "Practice shall use the Platform in accordance with this Agreement and applicable law; maintain all required professional licenses; obtain all required patient consents before patient-facing communications.");
  clause(doc, "3.3", "Security", "Practice shall maintain confidentiality of login credentials; immediately notify Platform Provider of suspected unauthorized access; promptly report any Security Incident or suspected Breach.");

  // Article IV — Fees
  sectionHead(doc, "Article IV — Fees and Payment");
  clause(doc, "4.1", "Subscription Fee", "Practice shall pay Platform Provider the subscription fees set forth in Exhibit C (Fee Schedule). Fees are due on the first day of each billing period.");
  clause(doc, "4.2", "AK Ultimate Dental Special Terms", "The parties acknowledge that Alex Chireau, DDS is a founding member of Dental Engine Partners LLC. During the period that Alex Chireau, DDS remains an active member of Dental Engine Partners LLC with a vested ownership interest, AK Ultimate Dental LLC shall receive Platform access at NO MONTHLY SUBSCRIPTION FEE. Should Alex Chireau, DDS cease to be an active vested member, standard subscription fees per Exhibit C shall apply with thirty (30) days' notice.");
  clause(doc, "4.3", "Payment Terms", "All fees due within fifteen (15) days of invoice. Late payments accrue interest at 1.5% per month (18% per year) or maximum permitted rate.");

  // Article V — IP
  sectionHead(doc, "Article V — Intellectual Property");
  clause(doc, "5.1", "Platform Provider IP", "Platform Provider and its licensors retain all right, title, and interest in the Platform, NuStack Core Platform, Dental-Specific IP, and Documentation.");
  clause(doc, "5.2", "Practice Data Ownership", "Practice retains all right, title, and interest in Practice Data, including all PHI. Platform Provider has no ownership interest in Practice Data.");
  clause(doc, "5.3", "License to Practice", "Platform Provider grants Practice a limited, non-exclusive, non-transferable license to access and use the Platform during the Term solely for Practice's internal dental practice management operations.");

  // Article VI — BAA
  doc.addPage();
  sectionHead(doc, "Article VI — Business Associate Agreement");
  para(doc, "This Article VI constitutes the Business Associate Agreement required by 45 CFR 164.504(e) and is incorporated into and made a part of this Master Platform Agreement.");

  clause(doc, "6.1", "Designation of Roles", "Practice (AK Ultimate Dental LLC) is a Covered Entity under HIPAA. Platform Provider (Dental Engine Partners LLC) is a Business Associate, as it creates, receives, maintains, and transmits PHI on behalf of Practice. NuStack Digital Ventures LLC is a Subcontractor Business Associate subject to a separate Sub-Business Associate Agreement.");
  clause(doc, "6.2", "Permitted Uses of PHI", "Platform Provider may use and disclose PHI only for: (a) Platform services delivery; (b) Practice operations support and reporting; (c) System operations, backup, and security monitoring; (d) Subcontractor disclosure to the extent necessary, provided each subcontractor has executed a Sub-BA Agreement; (e) Legal compliance as required by law; (f) De-identification per 45 CFR 164.514(b).");
  clause(doc, "6.3", "Prohibited Uses", "Platform Provider shall not: (a) Use or disclose PHI except as permitted herein; (b) Sell PHI; (c) Use PHI for marketing without Practice's written authorization; (d) Transmit individually identifiable PHI to any AI service without a BAA with that service and Practice's written authorization.");
  clause(doc, "6.4", "Minimum Necessary", "Platform Provider shall limit PHI use to the minimum amount necessary per 45 CFR 164.502(b).");
  clause(doc, "6.5", "Safeguards", "Platform Provider shall implement: (a) Administrative Safeguards per 45 CFR 164.308 including designated Security Officer and workforce training; (b) Physical Safeguards per 45 CFR 164.310; (c) Technical Safeguards per 45 CFR 164.312 including TLS 1.2+ encryption in transit, AES-256 at rest, audit logs, role-based access controls.");
  clause(doc, "6.6", "Approved Subcontractor Business Associates", "Platform Provider has executed Sub-BA Agreements with the following approved subcontractors: NuStack Digital Ventures LLC; Supabase, Inc.; Twilio Inc.; Resend Inc.; Vercel Inc. Anthropic PBC (PHI excluded from all Claude API calls per Section 2.4).");
  clause(doc, "6.7", "Breach Notification", "Platform Provider shall notify Practice of any discovered Breach of Unsecured PHI within thirty (30) days of discovery (more protective than the 60-day statutory minimum). Notification shall include: (a) description of the Breach; (b) types of PHI involved; (c) persons whose PHI was breached; (d) steps individuals should take; (e) steps Platform Provider is taking to mitigate harm.");
  clause(doc, "6.8", "Individual Rights", "Platform Provider shall assist Practice in responding to individuals' HIPAA rights requests (access, amendment, accounting of disclosures) within fifteen (15) days of Practice's written request.");
  clause(doc, "6.9", "Term and Termination", "This BAA remains in effect for the Term of the Master Platform Agreement. Upon termination, Platform Provider shall return or destroy PHI within thirty (30) days, or if infeasible, continue BAA protections for as long as PHI is retained.");

  // Article VII — Limitation of Liability
  sectionHead(doc, "Article VII — Limitation of Liability");
  clause(doc, "7.1", "Limitation", "TO THE MAXIMUM EXTENT PERMITTED BY LAW, PLATFORM PROVIDER'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE GREATER OF: (A) THE TOTAL FEES PAID BY PRACTICE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM; OR (B) $5,000. THIS LIMITATION DOES NOT APPLY TO BREACHES OF THE BAA OR VIOLATIONS OF HIPAA.");
  clause(doc, "7.2", "Exclusion of Consequential Damages", "IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES, EVEN IF ADVISED OF THE POSSIBILITY.");

  // Article VIII — Confidentiality
  sectionHead(doc, "Article VIII — Confidentiality");
  clause(doc, "8.1", "Confidential Information", "Each party shall hold the other's Confidential Information in strict confidence using the same degree of care as it uses to protect its own confidential information, but no less than reasonable care.");

  // Article IX — Dispute Resolution
  sectionHead(doc, "Article IX — Governing Law and Disputes");
  clause(doc, "9.1", "Governing Law", "This Agreement shall be governed by the laws of the State of Wyoming, without regard to conflict of law principles.");
  clause(doc, "9.2", "Dispute Resolution", "The parties shall attempt in good faith to resolve disputes through negotiation. If unresolved within thirty (30) days, disputes shall be submitted to binding arbitration.");

  // Article X — Term
  sectionHead(doc, "Article X — Term and Termination");
  clause(doc, "10.1", "Term", "This Agreement commences on the Effective Date and continues for one (1) year, automatically renewing for successive one-year terms unless either party provides sixty (60) days' written notice of non-renewal.");
  clause(doc, "10.2", "Termination for Cause", "Either party may terminate this Agreement upon thirty (30) days' written notice if the other party materially breaches this Agreement and fails to cure such breach within the notice period.");

  // Exhibit A — Services
  doc.addPage();
  sectionHead(doc, "Exhibit A — Service Description");
  kvTable(doc, [
    ["Platform Tier", "Dental Engine — Full Suite"],
    ["Patient Management", "Included"],
    ["Appointment Scheduling", "Included — AI-optimized"],
    ["SMS Communications (Twilio)", "Included — BAA required"],
    ["Clinical Documentation", "Included — AI-assisted, HIPAA-limited"],
    ["Insurance Verification (Sikka)", "Included — BAA required"],
    ["Lead Management & AI Response", "Included"],
    ["Patient Portal", "Included"],
    ["Practice Analytics & AI Advisor", "Included"],
    ["HR Module", "Included"],
    ["Onboarding & Setup", "Included — first 30 days"],
    ["Support", "Business hours email + portal"],
  ]);

  // Exhibit C — Fees
  doc.moveDown(0.5);
  sectionHead(doc, "Exhibit C — Fee Schedule");
  kvTable(doc, [
    ["AK Ultimate Dental LLC", "$0 / month (Founding Member Special Terms — Section 4.2)"],
    ["Standard Rate (if Section 4.2 terminates)", "To be established per then-current rate card"],
    ["Effective Date", TODAY],
    ["Billing Cycle", "Monthly, due 1st of each month"],
    ["Late Fee", "1.5% per month on overdue amounts"],
  ]);

  // Signatures
  drawSignatureBlock(
    doc,
    {
      entity: "Dental Engine Partners LLC",
      role: "Platform Provider",
      name: "Brad Palubicki",
      title: "Managing Member",
    },
    {
      entity: "AK Ultimate Dental LLC",
      role: "Covered Entity / Client",
      name: "Alex Chireau, DDS",
      title: "Owner",
    }
  );

  drawFooters(doc);
  doc.end();
  return buf;
}

// ---------------------------------------------------------------------------
// 2. Technology Services Authorization (DEP-2026-001-TSA)
// ---------------------------------------------------------------------------
export async function generateTSA(): Promise<Buffer> {
  const doc = createDoc();
  const buf = collectBuffer(doc);

  drawCoverBlock(doc, {
    agreementNumber: "DEP-2026-001-TSA",
    title: "Technology Services Authorization",
    subtitle: "Exhibit B to Master Platform Agreement DEP-2026-001",
    date: TODAY,
    parties: [
      {
        role: "Authorizing Party (Practice)",
        name: "AK Ultimate Dental LLC",
        detail: "Owner: Alex Chireau, DDS  ·  Henderson, Nevada",
      },
      {
        role: "Authorized Service Provider",
        name: "Dental Engine Partners LLC",
        detail: "Managing Member: Brad Palubicki  ·  Wyoming LLC",
      },
      {
        role: "Platform Operator / Sub-contractor",
        name: "NuStack Digital Ventures LLC",
        detail: "Wyoming LLC",
      },
    ],
  });

  sectionHead(doc, "Article I — Grant of Authorization");
  clause(doc, "1.1", "Authorization to Act", "Practice hereby authorizes Platform Provider and its designated sub-contractor NuStack Digital Ventures LLC to access, configure, provision, manage, and operate the third-party systems and APIs set forth in Exhibit B-1 (Authorized System Matrix) on Practice's behalf, solely for the purpose of delivering the contracted platform services described in the Master Platform Agreement.");
  clause(doc, "1.2", "Scope of Authority", "The authority granted includes the right to: (a) provision and manage Platform accounts; (b) obtain, use, and rotate OAuth tokens and API keys; (c) accept technical terms of service on Practice's behalf; (d) configure administrative account settings; (e) receive inbound data feeds from authorized systems; (f) rotate credentials per security best practices.");
  clause(doc, "1.3", "Limitations", "Platform Provider shall NOT: (a) make financial commitments on Practice's behalf; (b) disclose Practice credentials to unauthorized parties; (c) access systems beyond those listed in Exhibit B-1.");

  sectionHead(doc, "Article II — PHI and Security");
  clause(doc, "2.1", "PHI Handling", "For Tier 1 (PHI-Present) systems, all access and data handling is governed by the Business Associate Agreement in Article VI of the Master Platform Agreement. PHI shall not be transmitted to AI systems except as permitted by Section 2.4 of the MPA.");
  clause(doc, "2.2", "Credential Security", "All credentials obtained under this Authorization shall be stored using AES-256 encryption, transmitted only over TLS 1.2+, and maintained in NuStack's credential management system with full audit logs.");

  sectionHead(doc, "Article III — Revocation");
  clause(doc, "3.1", "Individual System Revocation", "Practice may revoke authorization for any individual system by providing thirty (30) days' written notice to Platform Provider. Platform Provider shall cease access and return control of the revoked system within thirty (30) days.");
  clause(doc, "3.2", "Full Revocation", "Practice may revoke this entire Authorization by providing sixty (60) days' written notice. Full revocation terminates the Master Platform Agreement.");

  sectionHead(doc, "Article IV — Audit Rights");
  clause(doc, "4.1", "Access Logs", "Practice may request a complete log of all system accesses made under this Authorization within seventy-two (72) hours of written request.");
  clause(doc, "4.2", "Annual Review", "Platform Provider shall provide Practice with an annual review of all active API connections and credentials, no later than January 31 of each year.");

  // Exhibit B-1 — Authorized System Matrix
  doc.addPage();
  sectionHead(doc, "Exhibit B-1 — Authorized System Matrix");

  doc.font(FONTS.bold).fontSize(9).fillColor(COLORS.accent)
    .text("TIER 1 — PHI-PRESENT SYSTEMS (BAA Required)", { characterSpacing: 0.3 });
  doc.moveDown(0.3);

  const tier1: Array<[string, string]> = [
    ["Supabase Database", "Project: pivfajkousqthlfaqtwr  ·  All PHI categories  ·  BAA: Required"],
    ["Twilio SMS", "Account: [AK-DENTAL-TWILIO-SID]  ·  Messaging Service: [AK-DENTAL-MSG-SVC-SID]  ·  PHI: Name, phone, appt details  ·  BAA: Required"],
    ["Resend Email", "Transactional email  ·  PHI: Name, email, appt details  ·  BAA: Required"],
    ["Sikka ONE API", "PMS integration  ·  PHI: Demographics, appointments, billing  ·  BAA: Required"],
    ["Anthropic Claude AI", "PHI EXCLUDED — de-identified/structured inputs only per MPA Section 2.4  ·  BAA: Not required (PHI excluded)"],
    ["Vapi.ai Voice AI", "AI phone provisioning  ·  PHI: Caller name, phone, transcripts  ·  BAA: Required"],
  ];
  kvTable(doc, tier1, { colWidth: 160 });

  doc.moveDown(0.5);
  doc.font(FONTS.bold).fontSize(9).fillColor(COLORS.accent)
    .text("TIER 2 — ACCOUNT ACCESS (No PHI)", { characterSpacing: 0.3 });
  doc.moveDown(0.3);

  const tier2: Array<[string, string]> = [
    ["Google Business Profile", "Manage listing, reviews, posts  ·  Auth: OAuth manager access  ·  Action: Add NuStack as GBP Manager"],
    ["Google Ads", "Create/manage ad campaigns  ·  Auth: MCC linkage  ·  Action: Link account to NuStack MCC"],
    ["Google Analytics", "Monitor website traffic  ·  Action: Grant NuStack Editor access"],
    ["Google Search Console", "SEO/search performance  ·  Action: Add NuStack as Full User"],
    ["Meta Business Manager", "Facebook page, Instagram, Ads  ·  Action: Add NuStack as Business Partner"],
    ["Microsoft / Outlook", "Calendar sync, email integration (optional)  ·  Auth: OAuth delegated"],
  ];
  kvTable(doc, tier2, { colWidth: 160 });

  doc.moveDown(0.5);
  doc.font(FONTS.bold).fontSize(9).fillColor(COLORS.accent)
    .text("TIER 3 — PLATFORM-PROVISIONED (NuStack manages — Practice acknowledges)", { characterSpacing: 0.3 });
  doc.moveDown(0.3);

  const tier3: Array<[string, string]> = [
    ["Clerk Auth", "Authentication system — user management, roles  ·  No clinical PHI"],
    ["Vercel", "Application hosting and deployment  ·  No PHI in logs  ·  NuStack manages all deployments"],
  ];
  kvTable(doc, tier3, { colWidth: 160 });

  // Amendment log
  doc.moveDown(0.8);
  sectionHead(doc, "Amendment Log");
  kvTable(doc, [
    ["Amendment No.", "Date  ·  Systems Added/Removed  ·  Authorized By"],
    ["001 (Initial)", `${TODAY}  ·  All systems listed above  ·  Alex Chireau, DDS`],
  ]);

  drawSignatureBlock(
    doc,
    {
      entity: "AK Ultimate Dental LLC",
      role: "Authorizing Party",
      name: "Alex Chireau, DDS",
      title: "Owner / Nevada License No.: ________",
    },
    {
      entity: "Dental Engine Partners LLC",
      role: "Authorized Service Provider",
      name: "Brad Palubicki",
      title: "Managing Member",
    }
  );

  para(doc, "By signing above, the Authorizing Party acknowledges and represents that: (a) the signatory is the dentist-owner of AK Ultimate Dental LLC or has written delegation from the dentist-owner as required by Nevada NRS 631; (b) the dentist remains professionally responsible for all data access granted to Platform Provider under Nevada dental board rules; and (c) the dentist's Nevada dental license number is provided above.", { small: true });

  drawFooters(doc);
  doc.end();
  return buf;
}

// ---------------------------------------------------------------------------
// 3. Nevada SB 370 Processing Addendum (DEP-2026-001-NV)
// ---------------------------------------------------------------------------
export async function generateNevadaAddendum(): Promise<Buffer> {
  const doc = createDoc();
  const buf = collectBuffer(doc);

  drawCoverBlock(doc, {
    agreementNumber: "DEP-2026-001-NV",
    title: "Nevada SB 370 Processing Addendum",
    subtitle: "Nevada Senate Bill 370 (2023) — NRS Chapter 629B\nAddendum to Master Platform Agreement DEP-2026-001",
    date: TODAY,
    parties: [
      {
        role: "Regulated Entity (Controller)",
        name: "AK Ultimate Dental LLC",
        detail: "Owner: Alex Chireau, DDS  ·  Henderson, Nevada",
      },
      {
        role: "Processor",
        name: "Dental Engine Partners LLC",
        detail: "Wyoming LLC  ·  Managing Member: Brad Palubicki",
      },
    ],
  });

  // Mandate notice
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 48).fill("#fefce8");
  doc.font(FONTS.bold).fontSize(9).fillColor("#92400e")
    .text(
      "THIS ADDENDUM IS REQUIRED BY NEVADA LAW. Nevada Senate Bill 370 (2023), codified at NRS Chapter 629B, effective March 31, 2024, requires a written contract between any entity that processes consumer health data and the regulated entity on whose behalf the processing occurs. This Addendum satisfies that requirement.",
      MARGIN + 8, doc.y - 44, { width: CONTENT_WIDTH - 16 }
    );
  doc.moveDown(1.5);

  sectionHead(doc, "Article I — Definitions");
  kvTable(doc, [
    ["Consumer Health Data", "Personal information linked to a consumer's health status, conditions, treatment, or health care purchases — as defined in NRS 629B.030."],
    ["Controller", "AK Ultimate Dental LLC — determines the purpose and means of processing consumer health data."],
    ["Processor", "Dental Engine Partners LLC — processes consumer health data on behalf of the Controller."],
    ["Processing", "Any operation performed on consumer health data including collection, storage, analysis, transmission, or deletion."],
    ["HIPAA Carve-Out", "Consumer health data that is PHI subject to an executed BAA is largely exempt from SB 370 direct-to-consumer consent requirements — but this written processing contract is still required by NRS 629B."],
  ]);

  sectionHead(doc, "Article II — Processing Activities");
  para(doc, "Processor is authorized to process the following categories of consumer health data solely for the specified purposes:");
  kvTable(doc, [
    ["Patient demographics", "Platform operations — scheduling, communications, records management"],
    ["Appointment records", "Scheduling, reminders, confirmations, recall automation"],
    ["Dental clinical records", "Clinical documentation, treatment planning, charting"],
    ["Insurance information", "Benefits verification, eligibility checking"],
    ["Payment information", "Billing support (tokenized — raw card data never stored)"],
    ["Communications", "SMS/email logs for patient communications via Twilio/Resend"],
    ["AI-processed data", "De-identified/aggregate inputs only per MPA Section 2.4"],
    ["System usage data", "Analytics, error monitoring, system performance"],
    ["Staff records", "HR module — staff management, certifications"],
  ]);

  sectionHead(doc, "Article III — Processor Obligations");
  clause(doc, "3.1", "Processing Instructions", "Processor shall process consumer health data only on documented instructions from Controller and only for the purposes specified in Article II above.");
  clause(doc, "3.2", "Confidentiality", "Processor shall ensure all personnel with access to consumer health data are bound by confidentiality obligations and have received appropriate training.");
  clause(doc, "3.3", "Security", "Processor shall implement and maintain reasonable security measures appropriate to the risk, consistent with NRS 603A, including: encryption in transit (TLS 1.2+) and at rest (AES-256); access controls; audit logging; incident response procedures.");
  clause(doc, "3.4", "Subprocessors", "Processor may engage subprocessors (NuStack Digital Ventures LLC, Supabase, Twilio, Resend, Vercel) provided each subprocessor is subject to data protection obligations equivalent to those in this Addendum. Current approved subprocessors are listed in Exhibit D of the Master Platform Agreement.");
  clause(doc, "3.5", "Consumer Rights Assistance", "Processor shall assist Controller in fulfilling Nevada consumer rights requests: (a) Right to access — within 15 days of request; (b) Right to deletion — within 30 days; (c) Right to withdraw consent — within 15 days; (d) Right to know categories of data shared with third parties — within 15 days.");
  clause(doc, "3.6", "Records of Processing", "Processor shall maintain records of all processing activities and make them available to Controller or the Nevada Attorney General upon written request.");
  clause(doc, "3.7", "Data Breach Notification", "Processor shall notify Controller without unreasonable delay (and no later than 72 hours) after discovering a breach involving consumer health data. Controller shall then notify affected Nevada residents and the Nevada Attorney General per NRS 603A within 30 days if medical information of 500+ residents is involved.");

  sectionHead(doc, "Article IV — Controller Obligations");
  clause(doc, "4.1", "Consumer Consent", "Controller is responsible for obtaining all required consumer consents before consumer health data is processed, including: (a) consent for collection of consumer health data; (b) separate consent before sharing consumer health data with third parties (unless HIPAA TPO authorization or BAA exemption applies).");
  clause(doc, "4.2", "HIPAA Carve-Out", "To the extent consumer health data processed under this Addendum also constitutes PHI under a valid, executed BAA (Article VI of the MPA), the HIPAA BAA governs. This Addendum provides additional Nevada-specific protections and the written processing contract required by NRS 629B.");

  sectionHead(doc, "Article V — Records Retention");
  clause(doc, "5.1", "NRS 629.051 Retention Requirements", "For Nevada-licensed dental practice records: (a) Adult patients: 10 years from date of service; (b) Minor patients: 3 years after the minor reaches age 18 (whichever period is longer); (c) X-rays and diagnostic images: same retention period as medical records.");
  clause(doc, "5.2", "Platform Retention", "Processor shall configure the Platform's data retention settings to retain Practice records for the statutory minimum periods above. Processor shall NOT delete Practice data during the retention period without written authorization from Controller.");

  sectionHead(doc, "Article VI — Regulatory Information");
  kvTable(doc, [
    ["Nevada Attorney General — Consumer Protection", "ag.nv.gov  ·  Data Breach Report: ag.nv.gov/About/Contact/  ·  Required for breaches affecting 500+ Nevada residents (medical information)"],
    ["Nevada State Dental Board", "nvdentalboard.nv.gov  ·  Phone: (702) 486-7044  ·  Not required for breach notification (HHS OCR handles HIPAA breaches)"],
    ["HHS Office for Civil Rights (HIPAA)", "hhs.gov/ocr/privacy  ·  Breaches of 500+ individuals: notify within 60 days + media  ·  Breaches <500: annual log submission"],
  ], { colWidth: 200 });

  drawSignatureBlock(
    doc,
    {
      entity: "AK Ultimate Dental LLC",
      role: "Regulated Entity / Controller",
      name: "Alex Chireau, DDS",
      title: "Owner",
    },
    {
      entity: "Dental Engine Partners LLC",
      role: "Processor",
      name: "Brad Palubicki",
      title: "Managing Member",
    }
  );

  drawFooters(doc);
  doc.end();
  return buf;
}

// ---------------------------------------------------------------------------
// 4. Sub-Business Associate Agreement (NUSTACK-INTERNAL-SUB-BA-001)
// ---------------------------------------------------------------------------
export async function generateSubBA(): Promise<Buffer> {
  const doc = createDoc();
  const buf = collectBuffer(doc);

  drawCoverBlock(doc, {
    agreementNumber: "NUSTACK-INTERNAL-SUB-BA-001",
    title: "Sub-Business Associate Agreement",
    subtitle: "INTERNAL DOCUMENT — Not shared with AK Ultimate Dental LLC",
    date: TODAY,
    parties: [
      {
        role: "Business Associate",
        name: "Dental Engine Partners LLC",
        detail: "Wyoming LLC  ·  Managing Member: Brad Palubicki",
      },
      {
        role: "Sub-contractor Business Associate",
        name: "NuStack Digital Ventures LLC",
        detail: "Wyoming LLC  ·  Managing Member: Brad Palubicki",
      },
    ],
  });

  // Internal notice
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 36).fill("#f0fdf4");
  doc.font(FONTS.bold).fontSize(8.5).fillColor("#166534")
    .text(
      "INTERNAL DOCUMENT. This Sub-BA Agreement is between Dental Engine Partners LLC and NuStack Digital Ventures LLC only. It is NOT shared with or visible to AK Ultimate Dental LLC or any other dental practice client.",
      MARGIN + 8, doc.y - 32, { width: CONTENT_WIDTH - 16, align: "center" }
    );
  doc.moveDown(1.5);

  sectionHead(doc, "Background and Purpose");
  para(doc, "Dental Engine Partners LLC (\"BA\") has entered into a Master Platform Agreement including a Business Associate Agreement (Article VI) with AK Ultimate Dental LLC (the \"Covered Entity\") dated " + TODAY + ".");
  para(doc, "In connection with BA's obligations to Covered Entity, BA uses the services of NuStack Digital Ventures LLC (\"Sub-BA\") for platform infrastructure, operations, and technology services. Sub-BA will receive, maintain, or transmit Protected Health Information (PHI) on behalf of BA in the course of providing these services.");
  para(doc, "This Sub-Business Associate Agreement is required by 45 CFR 164.308(b)(2) and 45 CFR 164.504(e)(5), which require Business Associates to enter into written agreements with their subcontractors that will have access to PHI.");
  para(doc, "NOTE: Brad Palubicki is the Managing Member of both Dental Engine Partners LLC and NuStack Digital Ventures LLC. This agreement is executed by Brad Palubicki on behalf of both entities. The related-party nature of this agreement is disclosed in the Organizational Consent Resolution of Dental Engine Partners LLC.");

  sectionHead(doc, "Article I — Permitted Uses and Disclosures");
  clause(doc, "1.1", "Authorized Services", "Sub-BA may use and disclose PHI received from BA only to: (a) operate and maintain the NuStack Core Platform infrastructure on which the Dental Engine Platform runs; (b) provide technical support, security monitoring, and system administration; (c) perform data backup, disaster recovery, and system integrity functions; (d) assist BA in meeting its legal and compliance obligations to Covered Entity.");
  clause(doc, "1.2", "Prohibited Uses", "Sub-BA shall not: (a) use or disclose PHI for Sub-BA's own purposes unrelated to services for BA; (b) sell PHI; (c) use PHI for marketing; (d) transmit PHI to any AI service without a BAA with that service and BA's written authorization.");

  sectionHead(doc, "Article II — Safeguards");
  clause(doc, "2.1", "HIPAA Security Rule", "Sub-BA shall implement and maintain administrative, physical, and technical safeguards per 45 CFR 164.308, 164.310, and 164.312 to protect the confidentiality, integrity, and availability of all ePHI that Sub-BA creates, receives, maintains, or transmits on behalf of BA.");
  clause(doc, "2.2", "Approved Sub-Subcontractors", "Sub-BA may engage sub-subcontractors (Supabase Inc., Vercel Inc., Twilio Inc.) provided each is subject to equivalent data protection obligations. Sub-BA shall obtain BAAs with each sub-subcontractor that handles PHI.");
  clause(doc, "2.3", "Technical Controls", "Sub-BA shall maintain: (a) AES-256 encryption at rest; (b) TLS 1.2+ encryption in transit; (c) role-based access controls; (d) complete audit logs of all PHI access; (e) multi-factor authentication on all administrative access.");

  sectionHead(doc, "Article III — Breach Notification");
  clause(doc, "3.1", "Notification to BA", "Sub-BA shall notify BA of any discovered or suspected Breach of Unsecured PHI within fifteen (15) days of discovery (allowing BA to meet its thirty (30) day obligation to Covered Entity).");
  clause(doc, "3.2", "Notification Content", "Notification shall include: (a) description of what happened; (b) types of PHI involved; (c) identity of individuals whose PHI may have been compromised; (d) steps Sub-BA is taking to investigate and mitigate; (e) contact information for follow-up.");

  sectionHead(doc, "Article IV — Individual Rights and Audit");
  clause(doc, "4.1", "Individual Rights", "Sub-BA shall cooperate with BA to fulfill Covered Entity's obligations under 45 CFR 164.524 (access), 164.526 (amendment), and 164.528 (accounting of disclosures) within fifteen (15) days of BA's written request.");
  clause(doc, "4.2", "HHS Access", "Sub-BA shall make its internal practices, books, and records available to HHS for purposes of determining compliance with the HIPAA Rules.");

  sectionHead(doc, "Article V — Term and Termination");
  clause(doc, "5.1", "Term", "This Sub-BA Agreement is effective as of the Effective Date and shall remain in effect for as long as Sub-BA provides services to BA under which Sub-BA has access to PHI.");
  clause(doc, "5.2", "Termination", "BA may terminate this Sub-BA Agreement if Sub-BA materially breaches any provision and fails to cure within ten (10) days of written notice.");
  clause(doc, "5.3", "Return or Destruction of PHI", "Within thirty (30) days of termination, Sub-BA shall return or destroy all PHI. If return or destruction is infeasible, Sub-BA shall extend the protections of this Sub-BA Agreement for as long as PHI is retained and limit further use to those purposes that make return or destruction infeasible.");

  sectionHead(doc, "Article VI — Miscellaneous");
  clause(doc, "6.1", "Governing Law", "This Sub-BA Agreement is governed by the laws of the State of Wyoming.");
  clause(doc, "6.2", "Amendment", "This Sub-BA Agreement may be amended only by written agreement signed by both parties.");
  clause(doc, "6.3", "Related-Party Disclosure", "Brad Palubicki is the Managing Member of both parties to this Agreement. This related-party relationship was disclosed to all members of Dental Engine Partners LLC and approved in the Organizational Consent Resolution. Brad Palubicki is authorized to execute this Agreement on behalf of both entities pursuant to the respective Operating Agreements and the Organizational Consent Resolution.");

  drawSignatureBlock(
    doc,
    {
      entity: "Dental Engine Partners LLC",
      role: "Business Associate",
      name: "Brad Palubicki",
      title: "Managing Member",
    },
    {
      entity: "NuStack Digital Ventures LLC",
      role: "Sub-contractor Business Associate",
      name: "Brad Palubicki",
      title: "Managing Member",
    }
  );

  para(doc, "By executing this Sub-Business Associate Agreement in both capacities above, Brad Palubicki confirms that he is authorized to bind both entities and that the related-party nature of this agreement has been disclosed and approved per the Organizational Consent Resolution of Dental Engine Partners LLC.", { small: true });

  drawFooters(doc);
  doc.end();
  return buf;
}

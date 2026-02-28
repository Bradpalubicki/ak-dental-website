// AK Ultimate Dental — Onboarding Configuration
// Edit this file to customize wizard steps, setup checklist, and tour content.
// Components in src/components/onboarding/ are generic and engine-agnostic.

import type { TourSection } from "@/components/onboarding/guided-tour";

// ─── Setup Wizard Steps ───────────────────────────────────────────────────────

export interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  { id: "practice",   title: "Your Practice",        subtitle: "Confirm your practice details" },
  { id: "role",       title: "Your Role",             subtitle: "Tell us how you use the platform" },
  { id: "team",       title: "Your Team",             subtitle: "Who else will use the dashboard" },
  { id: "priorities", title: "Your Priorities",       subtitle: "What matters most right now" },
  { id: "compliance", title: "Compliance",            subtitle: "Required acknowledgments" },
  { id: "launch",     title: "You\u2019re All Set",   subtitle: "Your dashboard is ready to go" },
];

// ─── Setup Checklist (Progress Banner) ───────────────────────────────────────

export interface SetupStep {
  id: string;
  label: string;
  description: string;
  href: string;
  category: "essential" | "recommended" | "optional";
}

export const SETUP_STEPS: SetupStep[] = [
  {
    id: "practice-profile",
    label: "Complete practice profile",
    description: "Add your hours, address, and contact details",
    href: "/dashboard/settings",
    category: "essential",
  },
  {
    id: "invite-team",
    label: "Invite your team",
    description: "Add staff and set their access levels",
    href: "/dashboard/settings/users",
    category: "essential",
  },
  {
    id: "add-provider",
    label: "Add providers",
    description: "Add dentists and hygienists to the system",
    href: "/dashboard/providers",
    category: "essential",
  },
  {
    id: "first-patient",
    label: "Add your first patient",
    description: "Import or create a patient record",
    href: "/dashboard/patients",
    category: "essential",
  },
  {
    id: "insurance-setup",
    label: "Configure insurance carriers",
    description: "Add the insurance plans you accept",
    href: "/dashboard/insurance",
    category: "recommended",
  },
  {
    id: "review-compliance",
    label: "Review compliance settings",
    description: "Confirm HIPAA audit logging is active",
    href: "/dashboard/compliance",
    category: "recommended",
  },
  {
    id: "take-tour",
    label: "Complete the dashboard tour",
    description: "Learn every section in 5 minutes",
    href: "#tour",
    category: "optional",
  },
];

// ─── Role Options ─────────────────────────────────────────────────────────────

export const ROLE_OPTIONS = [
  { value: "owner-dentist", label: "Owner / Dr. Alex", description: "Full access to all features" },
  { value: "office-manager", label: "Office Manager", description: "Operations, billing, HR" },
  { value: "front-desk", label: "Front Desk", description: "Scheduling, patients, insurance" },
  { value: "hygienist", label: "Hygienist / Clinical", description: "Clinical notes, treatments" },
  { value: "associate", label: "Associate Dentist", description: "Clinical and patient access" },
];

export const TEAM_SIZE_OPTIONS = [
  { value: "solo", label: "Just me", description: "I run the practice solo" },
  { value: "small", label: "2–5 people", description: "Small team" },
  { value: "medium", label: "6–15 people", description: "Mid-size practice" },
  { value: "large", label: "16+", description: "Large or multi-location" },
];

export const PRIORITY_OPTIONS = [
  { value: "billing",      label: "Billing & Collections",      icon: "💰" },
  { value: "scheduling",   label: "Scheduling & Appointments",   icon: "📅" },
  { value: "insurance",    label: "Insurance Verification",      icon: "🛡️" },
  { value: "clinical",     label: "Clinical Notes & Charts",     icon: "📋" },
  { value: "leads",        label: "New Patient Leads",           icon: "👥" },
  { value: "hr",           label: "HR & Team Management",        icon: "🏢" },
  { value: "seo",          label: "SEO & Online Presence",       icon: "🔍" },
  { value: "ai",           label: "AI Automation",               icon: "⚡" },
];

// ─── Dashboard Tour ───────────────────────────────────────────────────────────

export const dashboardTourConfig: TourSection[] = [
  {
    id: "overview",
    sectionTitle: "Command Center",
    icon: "🏥",
    route: "/dashboard",
    steps: [
      {
        id: "overview-main",
        title: "Your Practice at a Glance",
        description:
          "The Command Center shows everything happening in your practice right now — today's appointments, unconfirmed patients, pending insurance verifications, new leads, and AI actions awaiting your approval. One screen. Real-time.",
        benefit:
          "Start every morning in 10 seconds knowing exactly what needs your attention. No spreadsheets. No sticky notes. No phone tag with staff.",
        painPoint:
          "Without this, you're walking in blind — calling the front desk to find out who's coming in, checking a whiteboard for insurance holds, missing leads that came in overnight.",
      },
      {
        id: "overview-urgent",
        title: "Urgent Items Surface Automatically",
        description:
          "Emergency leads, overdue insurance, unconfirmed appointments, and AI actions that need your sign-off all surface here, color-coded by severity. The system watches for problems so you don't have to.",
        benefit:
          "Nothing falls through the cracks. Critical items are always visible, prioritized, and one click from resolved.",
      },
    ],
  },
  {
    id: "patients",
    sectionTitle: "Patient Management",
    icon: "👤",
    route: "/dashboard/patients",
    steps: [
      {
        id: "patients-records",
        title: "Complete Patient Records",
        description:
          "Every patient record includes contact info, insurance, treatment history, clinical notes, upcoming appointments, billing balance, and communication history — all in one place. No switching between systems.",
        benefit:
          "Your entire team sees the same complete picture of every patient. Front desk, hygienist, and doctor all working from one source of truth.",
        painPoint:
          "When patient info is split between your PMS, a spreadsheet, and sticky notes, staff waste 15+ minutes per day looking for information that should be instant.",
      },
      {
        id: "patients-ai",
        title: "AI-Powered Patient Insights",
        description:
          "The AI Advisor flags patients overdue for recall, identifies high-value treatment plan opportunities, and drafts personalized outreach messages. It works continuously in the background.",
        benefit:
          "Practices using proactive recall automation see 20–30% more hygiene appointments booked without any additional front desk effort.",
      },
    ],
  },
  {
    id: "appointments",
    sectionTitle: "Scheduling",
    icon: "📅",
    route: "/dashboard/appointments",
    steps: [
      {
        id: "appointments-calendar",
        title: "Real-Time Schedule Management",
        description:
          "See today's full schedule with provider columns, operatory assignments, appointment types, and confirmation status. Drag-and-drop rescheduling. One-click appointment creation. Color-coded by status.",
        benefit:
          "Your front desk spends less time on the phone and more time on patient experience. Cancellations get filled from your waitlist automatically.",
      },
      {
        id: "appointments-waitlist",
        title: "Smart Waitlist",
        description:
          "Patients on the waitlist get automatically texted when a same-day or next-day opening matches their requested time. No manual calling down a list.",
        benefit:
          "Empty chairs cost $300–$500 per hour. The smart waitlist fills most cancellations within 2 hours of opening up, entirely on autopilot.",
        painPoint:
          "Calling 10 patients to fill one cancellation slot takes 45 minutes of front desk time — time better spent on patients who are already in the chair.",
      },
    ],
  },
  {
    id: "billing",
    sectionTitle: "Billing & Collections",
    icon: "💰",
    route: "/dashboard/billing",
    steps: [
      {
        id: "billing-overview",
        title: "Collections Dashboard",
        description:
          "Track daily collections vs. goal, outstanding balances by aging bucket, treatment plan acceptance rates, and insurance claim status — all updated in real time.",
        benefit:
          "Know your collection rate every single day. Catch billing problems the day they happen, not at month-end when it's too late to fix them.",
      },
      {
        id: "billing-payments",
        title: "In-Dashboard Patient Payments",
        description:
          "Patients can pay their balance directly from a secure link sent via text or email. No phone calls. No mailing statements. Payments appear in the dashboard instantly.",
        benefit:
          "Practices that add text-to-pay see 40% faster collections on patient balances and significantly fewer 90+ day accounts.",
        painPoint:
          "Mailing paper statements and waiting for checks costs the average practice $8–12 per statement plus 30–90 days of float.",
      },
      {
        id: "billing-insurance",
        title: "Insurance Claim Tracking",
        description:
          "Every submitted claim is tracked here with status, expected reimbursement, and days outstanding. Overdue claims are flagged automatically.",
        benefit:
          "Stop losing money to forgotten claims and slow-pay insurers. The system flags anything over 30 days and drafts the follow-up for you.",
      },
    ],
  },
  {
    id: "clinical",
    sectionTitle: "Clinical Notes",
    icon: "📋",
    route: "/dashboard/clinical-notes",
    steps: [
      {
        id: "clinical-soap",
        title: "SOAP Notes with AI Assist",
        description:
          "Create SOAP notes using templates or free-form entry. The AI Assistant suggests clinical language, auto-fills standard findings, and flags documentation that may be incomplete for insurance purposes.",
        benefit:
          "Providers spend 30% less time on documentation. Notes are complete, consistent, and defensible — every time.",
      },
      {
        id: "clinical-sign",
        title: "Electronic Signing",
        description:
          "Providers sign notes electronically. Signed notes are locked and audit-logged. Patients can sign consent forms on a tablet directly in the operatory.",
        benefit:
          "HIPAA-compliant documentation with a full audit trail. No paper, no scanning, no lost forms.",
      },
    ],
  },
  {
    id: "insurance",
    sectionTitle: "Insurance",
    icon: "🛡️",
    route: "/dashboard/insurance",
    steps: [
      {
        id: "insurance-verify",
        title: "Same-Day Eligibility Verification",
        description:
          "Insurance eligibility is verified automatically when an appointment is scheduled and again the morning of the visit. Benefits, deductible remaining, and frequency limitations are all shown on one screen.",
        benefit:
          "Zero surprises at checkout. Your team knows exactly what insurance will cover before the patient sits in the chair.",
        painPoint:
          "Manual insurance verification takes 10–20 minutes per patient. For a 20-patient day, that's 2–4 hours of phone calls — every single day.",
      },
    ],
  },
  {
    id: "leads",
    sectionTitle: "New Patient Leads",
    icon: "👥",
    route: "/dashboard/leads",
    steps: [
      {
        id: "leads-pipeline",
        title: "Lead Pipeline",
        description:
          "Every new patient inquiry — from your website, Google, phone, or referral — lands here with source tracking, urgency level, and a recommended response. Nothing gets lost in email.",
        benefit:
          "Practices that respond to new patient leads within 5 minutes convert 4x more than those who respond in an hour. The system drafts the response so you just review and send.",
      },
      {
        id: "leads-ai",
        title: "AI Response Drafts",
        description:
          "For every new lead, the AI drafts a personalized response based on what they asked, your services, and your schedule availability. You review, edit if needed, and approve — the system sends it.",
        benefit:
          "Your front desk responds to every lead in under 2 minutes without writing a single word from scratch.",
      },
    ],
  },
  {
    id: "hr",
    sectionTitle: "HR & Team",
    icon: "🏢",
    route: "/dashboard/hr",
    steps: [
      {
        id: "hr-team",
        title: "Team Management",
        description:
          "Employee records, certifications, continuing education tracking, write-ups, performance notes, and required annual acknowledgments — all in one place. Managers get alerts when certifications are expiring.",
        benefit:
          "Stay ahead of certification renewals and compliance requirements without a spreadsheet. Staff sign documents digitally — no printing, no scanning.",
      },
    ],
  },
  {
    id: "ai-advisor",
    sectionTitle: "AI Advisor",
    icon: "⚡",
    route: "/dashboard/advisor",
    steps: [
      {
        id: "advisor-main",
        title: "Your AI Business Advisor",
        description:
          "Ask the AI Advisor anything about your practice — \"Why is my collection rate down this month?\", \"Which providers have the highest no-show rate?\", \"Draft a recall message for patients 6+ months overdue.\" It knows your data and answers in plain English.",
        benefit:
          "Get the business intelligence of a $15,000/year consultant available 24/7, with real-time access to your actual practice data.",
        painPoint:
          "Most dentists have no idea where their revenue is leaking. The AI Advisor finds it, explains it, and tells you exactly what to do about it.",
      },
      {
        id: "advisor-actions",
        title: "AI Actions & Approvals",
        description:
          "The AI Advisor doesn't just give advice — it takes action. It drafts messages, creates follow-up tasks, triggers recall campaigns, and schedules outreach. Everything it does goes to your Approvals queue first. You see it before it sends.",
        benefit:
          "Full automation with full control. The AI runs your operations in the background. You're the final sign-off on anything that touches a patient.",
      },
    ],
  },
  {
    id: "seo",
    sectionTitle: "SEO & Marketing",
    icon: "🔍",
    route: "/dashboard/seo",
    steps: [
      {
        id: "seo-overview",
        title: "Your Online Presence, Tracked",
        description:
          "Track keyword rankings for every service you offer, monitor Core Web Vitals (Google's performance scores), run automated SEO audits, and receive monthly performance reports — all without touching a line of code.",
        benefit:
          "Most dental practices spend $500–$2,000/month on SEO agencies and never see what they're actually doing. This dashboard shows you exactly where you rank, what changed, and what needs fixing.",
      },
    ],
  },
];

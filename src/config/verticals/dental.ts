// Dental Vertical Configuration
// Full config for dental practices

import type { VerticalConfig } from "../vertical";

export const dentalVertical: VerticalConfig = {
  type: "dental",
  label: "Dental Engine",
  description: "Practice management for dental offices and clinics",

  terminology: {
    customer: "patient",
    customerPlural: "patients",
    provider: "dentist",
    providerPlural: "dentists",
    visit: "appointment",
    visitPlural: "appointments",
    treatment: "procedure",
    treatmentPlural: "procedures",
    clinicalNote: "clinical note",
    clinicalNotePlural: "clinical notes",
    chart: "dental chart",
    facility: "office",
    recall: "recall",
    codeSystem: "CDT",
  },

  services: [
    // Diagnostic
    { code: "D0120", name: "Periodic Oral Evaluation", category: "Diagnostic", defaultDuration: 15, defaultFee: 65, onlineBookable: true },
    { code: "D0150", name: "Comprehensive Oral Evaluation", category: "Diagnostic", defaultDuration: 30, defaultFee: 95, onlineBookable: true },
    { code: "D0210", name: "Full Mouth X-Rays", category: "Diagnostic", defaultDuration: 20, defaultFee: 150, onlineBookable: false },
    { code: "D0220", name: "Periapical X-Ray (first film)", category: "Diagnostic", defaultDuration: 10, defaultFee: 35, onlineBookable: false },
    { code: "D0274", name: "Bitewing X-Rays (4 films)", category: "Diagnostic", defaultDuration: 15, defaultFee: 75, onlineBookable: false },
    { code: "D0330", name: "Panoramic X-Ray", category: "Diagnostic", defaultDuration: 15, defaultFee: 125, onlineBookable: false },
    // Preventive
    { code: "D1110", name: "Adult Prophylaxis (Cleaning)", category: "Preventive", defaultDuration: 60, defaultFee: 125, onlineBookable: true },
    { code: "D1120", name: "Child Prophylaxis (Cleaning)", category: "Preventive", defaultDuration: 45, defaultFee: 85, onlineBookable: true },
    { code: "D1206", name: "Fluoride Treatment", category: "Preventive", defaultDuration: 10, defaultFee: 45, onlineBookable: false },
    { code: "D1351", name: "Sealant (per tooth)", category: "Preventive", defaultDuration: 15, defaultFee: 55, onlineBookable: false },
    // Restorative
    { code: "D2140", name: "Amalgam Filling (1 surface)", category: "Restorative", defaultDuration: 30, defaultFee: 175, onlineBookable: false },
    { code: "D2150", name: "Amalgam Filling (2 surface)", category: "Restorative", defaultDuration: 45, defaultFee: 225, onlineBookable: false },
    { code: "D2391", name: "Composite Filling (1 surface, posterior)", category: "Restorative", defaultDuration: 30, defaultFee: 200, onlineBookable: false },
    { code: "D2392", name: "Composite Filling (2 surface, posterior)", category: "Restorative", defaultDuration: 45, defaultFee: 260, onlineBookable: false },
    { code: "D2740", name: "Crown (porcelain/ceramic)", category: "Restorative", defaultDuration: 90, defaultFee: 1200, onlineBookable: false },
    { code: "D2750", name: "Crown (porcelain fused to metal)", category: "Restorative", defaultDuration: 90, defaultFee: 1100, onlineBookable: false },
    // Endodontics
    { code: "D3310", name: "Root Canal (anterior)", category: "Endodontics", defaultDuration: 60, defaultFee: 800, onlineBookable: false },
    { code: "D3320", name: "Root Canal (premolar)", category: "Endodontics", defaultDuration: 75, defaultFee: 950, onlineBookable: false },
    { code: "D3330", name: "Root Canal (molar)", category: "Endodontics", defaultDuration: 90, defaultFee: 1150, onlineBookable: false },
    // Periodontics
    { code: "D4341", name: "Scaling & Root Planing (per quadrant)", category: "Periodontics", defaultDuration: 45, defaultFee: 275, onlineBookable: false },
    { code: "D4910", name: "Periodontal Maintenance", category: "Periodontics", defaultDuration: 60, defaultFee: 175, onlineBookable: true },
    // Oral Surgery
    { code: "D7140", name: "Extraction (erupted tooth)", category: "Oral Surgery", defaultDuration: 30, defaultFee: 225, onlineBookable: false },
    { code: "D7210", name: "Surgical Extraction", category: "Oral Surgery", defaultDuration: 45, defaultFee: 375, onlineBookable: false },
    { code: "D7240", name: "Impacted Tooth Removal", category: "Oral Surgery", defaultDuration: 60, defaultFee: 475, onlineBookable: false },
    // Prosthodontics
    { code: "D5110", name: "Complete Denture (upper)", category: "Prosthodontics", defaultDuration: 60, defaultFee: 1800, onlineBookable: false },
    { code: "D5120", name: "Complete Denture (lower)", category: "Prosthodontics", defaultDuration: 60, defaultFee: 1800, onlineBookable: false },
    { code: "D6010", name: "Implant (endosteal)", category: "Prosthodontics", defaultDuration: 90, defaultFee: 2500, onlineBookable: false },
    // Emergency
    { code: "D0140", name: "Limited Oral Evaluation (emergency)", category: "Emergency", defaultDuration: 20, defaultFee: 85, onlineBookable: false },
    { code: "D9110", name: "Palliative Treatment (emergency)", category: "Emergency", defaultDuration: 30, defaultFee: 125, onlineBookable: false },
  ],

  serviceCategories: [
    { id: "diagnostic", label: "Diagnostic", description: "Exams and x-rays", icon: "Search" },
    { id: "preventive", label: "Preventive", description: "Cleanings, fluoride, sealants", icon: "Shield" },
    { id: "restorative", label: "Restorative", description: "Fillings, crowns, bridges", icon: "Wrench" },
    { id: "endodontics", label: "Endodontics", description: "Root canals and pulp therapy", icon: "Zap" },
    { id: "periodontics", label: "Periodontics", description: "Gum disease treatment", icon: "Leaf" },
    { id: "oral-surgery", label: "Oral Surgery", description: "Extractions and surgical procedures", icon: "Scissors" },
    { id: "prosthodontics", label: "Prosthodontics", description: "Dentures, implants, bridges", icon: "Smile" },
    { id: "cosmetic", label: "Cosmetic", description: "Whitening, veneers, bonding", icon: "Sparkles" },
    { id: "emergency", label: "Emergency", description: "Urgent dental care", icon: "AlertTriangle" },
  ],

  noteTemplates: [
    {
      type: "dental_soap",
      label: "Dental SOAP Note",
      description: "Standard dental clinical note format",
      sections: [
        { key: "subjective", label: "Subjective", placeholder: "Chief complaint, pain description (location/severity/duration), medical history updates, medication changes...", required: true },
        { key: "objective", label: "Objective", placeholder: "Clinical findings, tooth numbers, x-ray findings, periodontal readings, intraoral/extraoral exam...", required: true },
        { key: "assessment", label: "Assessment", placeholder: "Diagnosis, tooth conditions (caries/fracture/perio), ADA diagnostic codes, treatment needs prioritization...", required: true },
        { key: "plan", label: "Plan", placeholder: "Procedures performed today, treatment plan, prescriptions, follow-up schedule, referrals, home care instructions...", required: true },
      ],
      defaultForServiceCodes: ["D0120", "D0150", "D0140"],
    },
    {
      type: "dental_charting",
      label: "Dental Charting Note",
      description: "Tooth-by-tooth findings and conditions",
      sections: [
        { key: "exam_type", label: "Exam Type", placeholder: "Comprehensive, periodic, limited, emergency...", required: true },
        { key: "findings", label: "Clinical Findings", placeholder: "Tooth-by-tooth findings, existing restorations, caries, missing teeth, mobility...", required: true },
        { key: "periodontal", label: "Periodontal Assessment", placeholder: "Probing depths, bleeding on probing, recession, furcation involvement...", required: false },
        { key: "radiographic", label: "Radiographic Findings", placeholder: "X-ray interpretation, bone levels, pathology, impacted teeth...", required: false },
        { key: "treatment_plan", label: "Recommended Treatment", placeholder: "Prioritized treatment plan with CDT codes, phasing, cost estimates...", required: true },
      ],
    },
    {
      type: "intake",
      label: "New Patient Intake Note",
      description: "Initial patient assessment and examination",
      sections: [
        { key: "chief_complaint", label: "Chief Complaint", placeholder: "Reason for visit, primary dental concerns...", required: true },
        { key: "medical_history", label: "Medical History Review", placeholder: "Significant medical conditions, allergies, medications, hospitalizations...", required: true },
        { key: "dental_history", label: "Dental History", placeholder: "Previous dental care, last visit date, dental anxiety, habits (grinding/clenching)...", required: true },
        { key: "clinical_exam", label: "Clinical Examination", placeholder: "Extraoral: TMJ, lymph nodes, soft tissue. Intraoral: mucosa, tongue, floor of mouth, palate...", required: true },
        { key: "radiographic", label: "Radiographic Assessment", placeholder: "Films taken, findings, bone levels, pathology...", required: true },
        { key: "diagnosis", label: "Diagnosis & Treatment Plan", placeholder: "Diagnoses with CDT codes, prioritized treatment plan, cost estimates, insurance coverage...", required: true },
      ],
    },
    {
      type: "free_form",
      label: "Free Form Note",
      description: "Unstructured clinical note",
      sections: [
        { key: "content", label: "Note", placeholder: "Write your clinical note here...", required: true },
      ],
    },
  ],

  smsTemplates: [
    { key: "appointment_confirmation", category: "appointment", body: "Hi {{first_name}}, your dental appointment with {{provider_name}} is confirmed for {{date}} at {{time}}. Reply C to confirm or R to reschedule.", variables: ["first_name", "provider_name", "date", "time"] },
    { key: "appointment_reminder_48h", category: "appointment", body: "Reminder: You have a dental appointment with {{provider_name}} on {{date}} at {{time}}. Please arrive 10 minutes early with your insurance card. Reply C to confirm.", variables: ["first_name", "provider_name", "date", "time"] },
    { key: "appointment_reminder_2h", category: "appointment", body: "Your dental appointment with {{provider_name}} is in 2 hours at {{time}}. See you soon!", variables: ["first_name", "provider_name", "time"] },
    { key: "recall_6month", category: "recall", body: "Hi {{first_name}}, it's time for your 6-month dental checkup and cleaning at {{practice_name}}! Schedule today: {{link}} or reply BOOK.", variables: ["first_name", "practice_name", "link"] },
    { key: "treatment_followup", category: "reactivation", body: "Hi {{first_name}}, this is {{practice_name}}. You have recommended treatment that hasn't been scheduled yet. Don't wait — schedule today to prevent further issues: {{link}}", variables: ["first_name", "practice_name", "link"] },
    { key: "post_procedure", category: "clinical", body: "Hi {{first_name}}, we hope you're feeling well after your visit today. Remember: {{care_instructions}}. Call us if you have any concerns: {{phone}}", variables: ["first_name", "care_instructions", "phone"] },
    { key: "insurance_expiring", category: "general", body: "Hi {{first_name}}, our records show your dental benefits may be expiring soon. Don't lose your unused benefits — schedule before year-end: {{link}}", variables: ["first_name", "link"] },
  ],

  aiPrompts: {
    systemPrompt: `You are a professional AI assistant for a dental practice.
You help with administrative tasks, scheduling, and patient communication.
You NEVER provide medical/dental diagnoses or treatment recommendations.
Maintain a clear, professional, and friendly tone.
Refer clinical questions to the treating dentist.
For dental emergencies, advise patients to call the office immediately or go to the nearest ER if after hours.`,
    noteSummaryPrompt: `Summarize this dental clinical note in 2-3 sentences for the patient's portal. Use clear, non-technical language. Explain what was done, any findings, and next steps. Avoid dental jargon — use terms patients understand.`,
    patientSummaryPrompt: `Create a brief patient-friendly summary of their dental visit. Include what procedures were performed, any important findings, home care instructions, and when to schedule their next appointment.`,
    leadResponsePrompt: `Draft a professional, friendly response to this dental inquiry. Acknowledge their interest, briefly mention the services they asked about. Include a clear next step (booking an appointment). Mention any new patient specials if applicable. Keep it under 3 sentences.`,
    tone: "professional",
  },

  insurance: {
    codeSystem: "CDT",
    commonCodes: [
      { code: "D0120", description: "Periodic Oral Evaluation", defaultFee: 65 },
      { code: "D0150", description: "Comprehensive Oral Evaluation (new patient)", defaultFee: 95 },
      { code: "D0210", description: "Full Mouth X-Rays", defaultFee: 150 },
      { code: "D0274", description: "Bitewing X-Rays (4 films)", defaultFee: 75 },
      { code: "D1110", description: "Adult Prophylaxis", defaultFee: 125 },
      { code: "D1120", description: "Child Prophylaxis", defaultFee: 85 },
      { code: "D2391", description: "Composite Filling (1 surface, posterior)", defaultFee: 200 },
      { code: "D2740", description: "Crown (porcelain/ceramic)", defaultFee: 1200 },
      { code: "D3330", description: "Root Canal (molar)", defaultFee: 1150 },
      { code: "D4341", description: "Scaling & Root Planing (per quadrant)", defaultFee: 275 },
      { code: "D7140", description: "Extraction (erupted tooth)", defaultFee: 225 },
    ],
    verificationFields: ["preventive_coverage", "basic_coverage", "major_coverage", "deductible", "annual_maximum", "annual_used", "waiting_periods", "missing_tooth_clause"],
    claimTypes: ["dental", "predetermination"],
  },

  scheduling: {
    defaultDuration: 30,
    slotIncrement: 15,
    bufferBetween: 5,
    maxDailyPerProvider: 16,
    allowOnlineBooking: true,
    allowWaitlist: true,
    reminderSchedule: [
      { hours: 48, channel: "sms" },
      { hours: 24, channel: "email" },
      { hours: 2, channel: "sms" },
    ],
    cancellationPolicy: { hoursNotice: 24, fee: 50 },
  },

  compliance: {
    hipaaRequired: true,
    consentRequired: true,
    noteSignatureRequired: true,
    noteLockAfterSign: true,
    retentionYears: 10,
    requiredTraining: ["HIPAA Privacy", "HIPAA Security", "OSHA Bloodborne Pathogens", "OSHA Hazard Communication", "Infection Control", "Radiation Safety", "CPR/BLS"],
  },

  assessments: [
    {
      id: "dmft",
      name: "Decayed, Missing, Filled Teeth Index",
      abbreviation: "DMFT",
      description: "Standard dental caries assessment index",
      questionCount: 32,
      scoringMethod: "sum",
      severityRanges: [
        { min: 0, max: 5, label: "Very Low", color: "green" },
        { min: 6, max: 10, label: "Low", color: "yellow" },
        { min: 11, max: 15, label: "Moderate", color: "orange" },
        { min: 16, max: 32, label: "High", color: "red" },
      ],
      frequency: "annual",
    },
    {
      id: "psr",
      name: "Periodontal Screening & Recording",
      abbreviation: "PSR",
      description: "Quick periodontal health assessment",
      questionCount: 6,
      scoringMethod: "custom",
      severityRanges: [
        { min: 0, max: 0, label: "Healthy", color: "green" },
        { min: 1, max: 2, label: "Gingivitis", color: "yellow" },
        { min: 3, max: 3, label: "Moderate Periodontitis", color: "orange" },
        { min: 4, max: 4, label: "Severe Periodontitis", color: "red" },
      ],
      frequency: "every visit",
    },
  ],

  intakeForms: [
    { id: "demographics", name: "Patient Demographics", description: "Basic contact and demographic information", sections: ["personal_info", "contact", "emergency_contact", "responsible_party"], requiredBeforeFirstVisit: true },
    { id: "medical_history", name: "Medical History", description: "Health conditions, medications, allergies", sections: ["conditions", "medications", "allergies", "surgeries", "hospitalizations"], requiredBeforeFirstVisit: true },
    { id: "dental_history", name: "Dental History", description: "Previous dental care and concerns", sections: ["last_visit", "dental_concerns", "anxiety_level", "habits"], requiredBeforeFirstVisit: true },
    { id: "insurance_info", name: "Insurance Information", description: "Dental insurance and billing details", sections: ["primary_insurance", "secondary_insurance", "billing_authorization"], requiredBeforeFirstVisit: true },
    { id: "consent_treatment", name: "Consent for Treatment", description: "Treatment consent and financial agreement", sections: ["consent", "financial_agreement", "cancellation_policy"], requiredBeforeFirstVisit: true },
    { id: "hipaa_notice", name: "HIPAA Notice", description: "Privacy practices acknowledgment", sections: ["notice", "acknowledgment"], requiredBeforeFirstVisit: true },
  ],

  navigation: {
    marketing: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Insurance", href: "/insurance" },
      { name: "Contact", href: "/contact" },
    ],
    dashboard: [
      { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard", module: "dashboard" },
      { label: "Schedule", href: "/dashboard/schedule", icon: "Calendar", module: "scheduling" },
      { label: "Patients", href: "/dashboard/clients", icon: "Users", module: "clients" },
      { label: "Notes", href: "/dashboard/notes", icon: "FileText", module: "clinical_notes" },
      { label: "Leads", href: "/dashboard/leads", icon: "UserPlus", module: "leads" },
      { label: "Providers", href: "/dashboard/providers", icon: "Stethoscope", module: "providers" },
      { label: "Waitlist", href: "/dashboard/waitlist", icon: "Clock", module: "waitlist" },
      { label: "Inbox", href: "/dashboard/inbox", icon: "MessageSquare", module: "inbox" },
      { label: "Insurance", href: "/dashboard/insurance", icon: "Shield", module: "insurance" },
      { label: "Billing", href: "/dashboard/billing", icon: "CreditCard", module: "billing" },
      { label: "Financials", href: "/dashboard/financials", icon: "DollarSign", module: "financials" },
      { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3", module: "analytics" },
      { label: "Outreach", href: "/dashboard/outreach", icon: "Send", module: "outreach" },
      { label: "HR", href: "/dashboard/hr", icon: "Building2", module: "hr" },
      { label: "Documents", href: "/dashboard/documents", icon: "FolderOpen", module: "documents" },
      { label: "Training", href: "/dashboard/training", icon: "GraduationCap", module: "training" },
      { label: "Lab Cases", href: "/dashboard/lab-cases", icon: "FlaskConical", module: "lab_cases" },
      { label: "AI Advisor", href: "/dashboard/advisor", icon: "Bot", module: "advisor" },
      { label: "Settings", href: "/dashboard/settings", icon: "Settings", module: "settings" },
    ],
    ctaLabel: "Book an Appointment",
    ctaHref: "/book",
  },

  roles: [
    { name: "global_admin", displayName: "Global Admin", description: "Full system access across all modules", isSystem: true },
    { name: "admin", displayName: "Practice Admin", description: "Full practice management access", isSystem: true },
    { name: "manager", displayName: "Office Manager", description: "Day-to-day operations management", isSystem: false },
    { name: "dentist", displayName: "Dentist", description: "Full clinical access — patients, notes, treatment plans", isSystem: false },
    { name: "hygienist", displayName: "Hygienist", description: "Clinical access for hygiene services, charting, notes", isSystem: false },
    { name: "dental_assistant", displayName: "Dental Assistant", description: "Chairside support, charting, patient prep", isSystem: false },
    { name: "front_desk", displayName: "Front Desk", description: "Scheduling, check-in, insurance verification", isSystem: false },
    { name: "biller", displayName: "Biller", description: "Insurance claims, billing, collections", isSystem: false },
    { name: "staff", displayName: "Staff", description: "Basic read-only access", isSystem: false },
  ],
};

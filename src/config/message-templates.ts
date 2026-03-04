// AK Ultimate Dental — Message Template Library
// 18 templates covering the full patient communication lifecycle
// Merge fields: {{patient_name}}, {{practice_name}}, {{appointment_date}},
//   {{appointment_time}}, {{provider_name}}, {{booking_link}}, {{cancel_link}},
//   {{treatment_name}}, {{review_link}}, {{intake_link}}, {{payment_link}}

export type TemplateChannel = "sms" | "email" | "both";

export interface MessageTemplate {
  type: string;
  label: string;
  group: TemplateGroup;
  channel: TemplateChannel;
  subject?: string;
  body: string;
  approved: boolean;
  requiresApproval: boolean; // false = auto-send, true = needs admin approval before each send
}

export type TemplateGroup =
  | "Scheduling"
  | "Patient Intake"
  | "No-Show Recovery"
  | "Recall & Reactivation"
  | "Review & Referral"
  | "Financial";

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  // --- SCHEDULING ---
  {
    type: "appointment_confirmation",
    label: "Appointment Confirmation",
    group: "Scheduling",
    channel: "both",
    subject: "Your appointment is confirmed — AK Ultimate Dental",
    body: `Hi {{patient_name}}, your appointment at AK Ultimate Dental is confirmed for {{appointment_date}} at {{appointment_time}} with {{provider_name}}. Please arrive 10 minutes early. Need to cancel? {{cancel_link}}`,
    approved: false,
    requiresApproval: false,
  },
  {
    type: "reminder_48h",
    label: "48-Hour Reminder",
    group: "Scheduling",
    channel: "email",
    subject: "Reminder: Your appointment is in 2 days — AK Ultimate Dental",
    body: `Hi {{patient_name}}, just a reminder that you have an appointment at AK Ultimate Dental on {{appointment_date}} at {{appointment_time}} with {{provider_name}}. We look forward to seeing you! Need to reschedule? {{cancel_link}}`,
    approved: false,
    requiresApproval: false,
  },
  {
    type: "reminder_24h",
    label: "24-Hour Reminder",
    group: "Scheduling",
    channel: "both",
    subject: "Your appointment is tomorrow — AK Ultimate Dental",
    body: `Hi {{patient_name}} — a reminder that you have an appointment at AK Ultimate Dental tomorrow at {{appointment_time}} with {{provider_name}}. Reply CONFIRM to confirm or CANCEL to reschedule. See you soon!`,
    approved: false,
    requiresApproval: false,
  },
  {
    type: "reminder_2h",
    label: "2-Hour Reminder",
    group: "Scheduling",
    channel: "sms",
    body: `Hi {{patient_name}}, your appointment at AK Dental is in 2 hours ({{appointment_time}}). We're ready for you! Reply CANCEL if you can't make it.`,
    approved: false,
    requiresApproval: false,
  },

  // --- PATIENT INTAKE ---
  {
    type: "new_patient_welcome",
    label: "New Patient Welcome",
    group: "Patient Intake",
    channel: "email",
    subject: "Welcome to AK Ultimate Dental — We're excited to meet you!",
    body: `Hi {{patient_name}}, welcome to AK Ultimate Dental! We're thrilled to have you as a new patient. Dr. Chireau and the team are looking forward to meeting you. If you have any questions before your visit, just reply to this email. See you soon!`,
    approved: false,
    requiresApproval: false,
  },
  {
    type: "intake_forms",
    label: "Intake Forms",
    group: "Patient Intake",
    channel: "sms",
    body: `Hi {{patient_name}}, please complete your new patient forms before your first visit at AK Dental: {{intake_link}} Takes about 5 minutes and saves time at check-in. Thank you!`,
    approved: false,
    requiresApproval: false,
  },

  // --- NO-SHOW RECOVERY ---
  {
    type: "no_show_recovery_30m",
    label: "No-Show Recovery (30 min)",
    group: "No-Show Recovery",
    channel: "sms",
    body: `Hi {{patient_name}}, we missed you at your {{appointment_time}} appointment today. We'd love to get you rescheduled — reply here or call us. We have availability this week.`,
    approved: false,
    requiresApproval: false,
  },
  {
    type: "no_show_recovery_24h",
    label: "No-Show Recovery (Next Day)",
    group: "No-Show Recovery",
    channel: "sms",
    body: `Hi {{patient_name}}, we noticed you weren't able to make your appointment yesterday at AK Dental. No worries — we'd love to get you back on the schedule. Book here: {{booking_link}}`,
    approved: false,
    requiresApproval: true,
  },

  // --- RECALL & REACTIVATION ---
  {
    type: "recall_6mo",
    label: "6-Month Recall",
    group: "Recall & Reactivation",
    channel: "both",
    subject: "Time for your 6-month cleaning — AK Ultimate Dental",
    body: `Hi {{patient_name}}! It's been 6 months since your last cleaning at AK Dental. Dr. Chireau recommends staying on schedule — book your next visit here: {{booking_link}} We look forward to seeing you!`,
    approved: false,
    requiresApproval: false,
  },
  {
    type: "recall_overdue",
    label: "Overdue Recall (9 months)",
    group: "Recall & Reactivation",
    channel: "sms",
    body: `Hi {{patient_name}}, it's been a while since we've seen you at AK Dental! Regular checkups help prevent bigger problems. Schedule your cleaning today: {{booking_link}}`,
    approved: false,
    requiresApproval: true,
  },

  // --- TREATMENT ---
  {
    type: "treatment_accepted",
    label: "Treatment Plan Accepted",
    group: "Scheduling",
    channel: "email",
    subject: "Your Treatment Plan Is Confirmed — AK Ultimate Dental",
    body: `Hi {{patient_name}}, thank you for moving forward with your treatment plan. Dr. Chireau and the team are ready for you. Your appointment details: {{appointment_date}} at {{appointment_time}}. Any questions before then, just reply to this email.`,
    approved: false,
    requiresApproval: false,
  },
  {
    type: "treatment_followup",
    label: "Post-Procedure Follow-Up",
    group: "Scheduling",
    channel: "sms",
    body: `Hi {{patient_name}}, checking in after your {{treatment_name}} procedure at AK Dental. How are you feeling? Any discomfort or questions, call us at (702) 935-4395. We're here for you!`,
    approved: false,
    requiresApproval: false,
  },
  {
    type: "treatment_plan_ready",
    label: "Treatment Plan Ready",
    group: "Scheduling",
    channel: "email",
    subject: "Your Treatment Plan Is Ready — AK Ultimate Dental",
    body: `Hi {{patient_name}}, Dr. Chireau has finalized your personalized treatment plan. Log in to review it and ask any questions: {{booking_link}} We're committed to getting you the best outcome possible.`,
    approved: false,
    requiresApproval: false,
  },

  // --- INSURANCE ---
  {
    type: "insurance_verified",
    label: "Insurance Verified",
    group: "Patient Intake",
    channel: "sms",
    body: `Hi {{patient_name}}, great news — your insurance coverage has been verified for your upcoming visit at AK Dental. See you on {{appointment_date}}!`,
    approved: false,
    requiresApproval: false,
  },
  {
    type: "insurance_pending",
    label: "Insurance Issue",
    group: "Patient Intake",
    channel: "sms",
    body: `Hi {{patient_name}}, we ran into an issue verifying your insurance for your upcoming visit at AK Dental. Please call us at (702) 935-4395 so we can get it sorted before your appointment.`,
    approved: false,
    requiresApproval: true,
  },

  // --- REVIEW & REFERRAL ---
  {
    type: "review_request",
    label: "Review Request",
    group: "Review & Referral",
    channel: "sms",
    body: `Hi {{patient_name}} — thank you for visiting AK Dental! If your experience was great, a quick Google review helps others find quality dental care: {{review_link}} Takes 60 seconds and means a lot to us.`,
    approved: false,
    requiresApproval: false,
  },
  {
    type: "referral_thank_you",
    label: "Referral Thank You",
    group: "Review & Referral",
    channel: "email",
    subject: "Thank you for your referral — AK Ultimate Dental",
    body: `Hi {{patient_name}}, thank you so much for referring a friend or family member to AK Ultimate Dental! Referrals like yours are the highest compliment we can receive. We're grateful to have patients like you.`,
    approved: false,
    requiresApproval: false,
  },

  // --- FINANCIAL ---
  {
    type: "payment_receipt",
    label: "Payment Receipt",
    group: "Financial",
    channel: "email",
    subject: "Payment received — AK Ultimate Dental",
    body: `Hi {{patient_name}}, thank you for your payment. Your receipt is attached. If you have any questions about your account, reply to this email or call us at (702) 935-4395.`,
    approved: false,
    requiresApproval: false,
  },
];

export const TEMPLATE_GROUPS: TemplateGroup[] = [
  "Scheduling",
  "Patient Intake",
  "No-Show Recovery",
  "Recall & Reactivation",
  "Review & Referral",
  "Financial",
];

export function getTemplatesByGroup(group: TemplateGroup): MessageTemplate[] {
  return MESSAGE_TEMPLATES.filter((t) => t.group === group);
}

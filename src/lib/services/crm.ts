// CRM Service
// Unified contact management, lifecycle tracking, communication history

import { createServiceSupabase } from "@/lib/supabase/server";

// ─── Types ──────────────────────────────────────────────────────────
export type LifecycleStage =
  | "subscriber"
  | "lead"
  | "qualified_lead"
  | "opportunity"
  | "patient"
  | "active_patient"
  | "inactive_patient"
  | "lost";

export const LIFECYCLE_STAGES: Array<{ value: LifecycleStage; label: string; color: string }> = [
  { value: "subscriber", label: "Subscriber", color: "bg-slate-100 text-slate-700" },
  { value: "lead", label: "Lead", color: "bg-blue-100 text-blue-700" },
  { value: "qualified_lead", label: "Qualified Lead", color: "bg-indigo-100 text-indigo-700" },
  { value: "opportunity", label: "Opportunity", color: "bg-purple-100 text-purple-700" },
  { value: "patient", label: "Patient", color: "bg-emerald-100 text-emerald-700" },
  { value: "active_patient", label: "Active Patient", color: "bg-green-100 text-green-700" },
  { value: "inactive_patient", label: "Inactive", color: "bg-amber-100 text-amber-700" },
  { value: "lost", label: "Lost", color: "bg-red-100 text-red-700" },
];

// ─── Contact Sync ───────────────────────────────────────────────────
// Creates or updates CRM contact from a lead
export async function syncLeadToContact(leadId: string): Promise<string | null> {
  const supabase = createServiceSupabase();

  const { data: lead } = await supabase
    .from("oe_leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (!lead) return null;

  // Check if contact already exists for this lead
  const { data: existing } = await supabase
    .from("oe_crm_contacts")
    .select("id")
    .eq("lead_id", leadId)
    .maybeSingle();

  if (existing) {
    // Update existing contact
    await supabase
      .from("oe_crm_contacts")
      .update({
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        lifecycle_stage: lead.status === "converted" ? "patient" : "lead",
        source: lead.source,
      })
      .eq("id", existing.id);
    return existing.id;
  }

  // Create new contact
  const { data: contact } = await supabase
    .from("oe_crm_contacts")
    .insert({
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      phone: lead.phone,
      lifecycle_stage: "lead",
      source: lead.source,
      lead_id: leadId,
    })
    .select("id")
    .single();

  return contact?.id || null;
}

// Creates or updates CRM contact from a patient
export async function syncPatientToContact(patientId: string): Promise<string | null> {
  const supabase = createServiceSupabase();

  const { data: patient } = await supabase
    .from("oe_patients")
    .select("*")
    .eq("id", patientId)
    .single();

  if (!patient) return null;

  // Check if contact already exists for this patient
  const { data: existing } = await supabase
    .from("oe_crm_contacts")
    .select("id")
    .eq("patient_id", patientId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("oe_crm_contacts")
      .update({
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email,
        phone: patient.phone,
        lifecycle_stage: patient.status === "active" ? "active_patient" : "inactive_patient",
        date_of_birth: patient.date_of_birth,
        address: patient.address,
        city: patient.city,
        state: patient.state,
        zip: patient.zip,
      })
      .eq("id", existing.id);
    return existing.id;
  }

  // Check by email/phone match
  let matchQuery = supabase.from("oe_crm_contacts").select("id");
  if (patient.email) {
    matchQuery = matchQuery.eq("email", patient.email);
  } else if (patient.phone) {
    matchQuery = matchQuery.eq("phone", patient.phone);
  } else {
    matchQuery = matchQuery.eq("first_name", patient.first_name).eq("last_name", patient.last_name);
  }

  const { data: match } = await matchQuery.maybeSingle();

  if (match) {
    await supabase
      .from("oe_crm_contacts")
      .update({
        patient_id: patientId,
        lifecycle_stage: patient.status === "active" ? "active_patient" : "inactive_patient",
      })
      .eq("id", match.id);
    return match.id;
  }

  const { data: contact } = await supabase
    .from("oe_crm_contacts")
    .insert({
      first_name: patient.first_name,
      last_name: patient.last_name,
      email: patient.email,
      phone: patient.phone,
      date_of_birth: patient.date_of_birth,
      address: patient.address,
      city: patient.city,
      state: patient.state,
      zip: patient.zip,
      lifecycle_stage: patient.status === "active" ? "active_patient" : "inactive_patient",
      patient_id: patientId,
      source: "pms_sync",
    })
    .select("id")
    .single();

  return contact?.id || null;
}

// ─── Engagement Scoring ─────────────────────────────────────────────
export async function updateEngagementScore(contactId: string): Promise<number> {
  const supabase = createServiceSupabase();

  const { data: contact } = await supabase
    .from("oe_crm_contacts")
    .select("*, patient:oe_patients(*)")
    .eq("id", contactId)
    .single();

  if (!contact) return 0;

  let score = 0;

  // Recent appointment (+20)
  if (contact.last_appointment_at) {
    const daysSince = Math.floor(
      (Date.now() - new Date(contact.last_appointment_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince < 30) score += 20;
    else if (daysSince < 90) score += 15;
    else if (daysSince < 180) score += 10;
    else if (daysSince < 365) score += 5;
  }

  // Communication engagement (+15)
  if (contact.total_communications > 0) {
    score += Math.min(15, contact.total_communications * 3);
  }

  // Revenue (+20)
  if (contact.total_revenue > 0) {
    if (contact.total_revenue > 5000) score += 20;
    else if (contact.total_revenue > 2000) score += 15;
    else if (contact.total_revenue > 500) score += 10;
    else score += 5;
  }

  // Lifecycle (+15)
  const lifecycleScores: Record<string, number> = {
    active_patient: 15,
    patient: 12,
    opportunity: 10,
    qualified_lead: 8,
    lead: 5,
    subscriber: 2,
    inactive_patient: 3,
    lost: 0,
  };
  score += lifecycleScores[contact.lifecycle_stage] || 0;

  // Cap at 100
  score = Math.min(100, score);

  await supabase
    .from("oe_crm_contacts")
    .update({ engagement_score: score })
    .eq("id", contactId);

  return score;
}

// ─── Log Communication ──────────────────────────────────────────────
export async function logCommunication(
  contactId: string,
  channel: "sms" | "email" | "phone" | "portal" | "in_person" | "mail",
  direction: "inbound" | "outbound",
  content: string,
  subject?: string
): Promise<void> {
  const supabase = createServiceSupabase();

  await supabase.from("oe_crm_communications").insert({
    contact_id: contactId,
    channel,
    direction,
    subject,
    content,
    status: direction === "outbound" ? "sent" : "delivered",
  });

  // Update contact stats
  await supabase.rpc("increment_contact_communications", { contact_id: contactId });

  // Fallback: direct update if RPC doesn't exist
  const { data: contact } = await supabase
    .from("oe_crm_contacts")
    .select("total_communications")
    .eq("id", contactId)
    .single();

  if (contact) {
    await supabase
      .from("oe_crm_contacts")
      .update({
        total_communications: (contact.total_communications || 0) + 1,
        last_communication_at: new Date().toISOString(),
        last_communication_channel: channel,
      })
      .eq("id", contactId);
  }
}

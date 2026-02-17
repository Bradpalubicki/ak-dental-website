import type { SupabaseClient } from "@supabase/supabase-js";

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3600000).toISOString();
}
function minutesAgo(m: number) {
  return new Date(Date.now() - m * 60000).toISOString();
}
function daysAgo(d: number) {
  return new Date(Date.now() - d * 86400000).toISOString().split("T")[0];
}

export async function seedDemo(supabase: SupabaseClient) {
  const inserted: Record<string, number> = {};
  const errors: string[] = [];
  const today = new Date().toISOString().split("T")[0];

  // Clear in dependency order
  for (const table of [
    "oe_ai_actions", "oe_outreach_messages", "oe_insurance_verifications",
    "oe_billing_claims", "oe_treatment_plans", "oe_appointments",
    "oe_lead_nurture_sequences", "oe_patient_reactivation_sequences",
    "oe_leads", "oe_patients", "oe_daily_metrics",
  ]) {
    const { error } = await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) errors.push(`Clear ${table}: ${error.message}`);
  }

  // Patients
  const patients = [
    { id: "a0000001-0000-0000-0000-000000000001", first_name: "Maria", last_name: "Gonzalez", email: "maria.g@email.com", phone: "(702) 555-0101", date_of_birth: "1985-03-15", address: "4521 Spring Mountain Rd", city: "Las Vegas", state: "NV", zip: "89102", insurance_provider: "Delta Dental", insurance_member_id: "DD-892341", insurance_group_number: "GRP-4401", status: "active", last_visit: daysAgo(14), tags: ["cleaning", "loyal"] },
    { id: "a0000001-0000-0000-0000-000000000002", first_name: "James", last_name: "Rodriguez", email: "james.rod@email.com", phone: "(702) 555-0102", date_of_birth: "1978-07-22", address: "8891 W Flamingo Rd", city: "Las Vegas", state: "NV", zip: "89147", insurance_provider: "Cigna Dental", insurance_member_id: "CG-110234", insurance_group_number: "GRP-8800", status: "active", last_visit: daysAgo(45), tags: ["implant-candidate"] },
    { id: "a0000001-0000-0000-0000-000000000003", first_name: "Sarah", last_name: "Chen", email: "sarah.chen@email.com", phone: "(702) 555-0103", date_of_birth: "1992-11-08", address: "3200 S Jones Blvd", city: "Las Vegas", state: "NV", zip: "89146", insurance_provider: "MetLife Dental", insurance_member_id: "ML-556712", insurance_group_number: "GRP-2200", status: "active", last_visit: daysAgo(3), tags: ["cosmetic", "vip"] },
    { id: "a0000001-0000-0000-0000-000000000004", first_name: "Robert", last_name: "Thompson", email: "rthompson@email.com", phone: "(702) 555-0104", date_of_birth: "1965-01-30", address: "7100 W Sahara Ave", city: "Las Vegas", state: "NV", zip: "89117", insurance_provider: "Aetna Dental", insurance_member_id: "AE-334521", insurance_group_number: "GRP-1100", status: "active", last_visit: daysAgo(180), tags: ["recall-overdue"] },
    { id: "a0000001-0000-0000-0000-000000000005", first_name: "Lisa", last_name: "Williams", email: "lisa.w@email.com", phone: "(702) 555-0105", date_of_birth: "1990-06-14", address: "9500 W Tropicana Ave", city: "Las Vegas", state: "NV", zip: "89147", insurance_provider: "Delta Dental", insurance_member_id: "DD-778123", insurance_group_number: "GRP-4401", status: "active", last_visit: daysAgo(7), tags: ["orthodontics"] },
    { id: "a0000001-0000-0000-0000-000000000006", first_name: "Michael", last_name: "Kim", email: "mkim@email.com", phone: "(702) 555-0106", date_of_birth: "1988-09-03", address: "6200 W Charleston Blvd", city: "Las Vegas", state: "NV", zip: "89146", insurance_provider: "Guardian Dental", insurance_member_id: "GD-443211", insurance_group_number: "GRP-5500", status: "active", last_visit: daysAgo(30), tags: ["crown-needed"] },
    { id: "a0000001-0000-0000-0000-000000000007", first_name: "Jennifer", last_name: "Davis", email: "jdavis@email.com", phone: "(702) 555-0107", date_of_birth: "1975-12-19", address: "2100 N Rancho Dr", city: "Las Vegas", state: "NV", zip: "89106", insurance_provider: "Cigna Dental", insurance_member_id: "CG-221567", insurance_group_number: "GRP-8800", status: "active", last_visit: daysAgo(60), tags: ["periodontics"] },
    { id: "a0000001-0000-0000-0000-000000000008", first_name: "David", last_name: "Martinez", email: "dmartinez@email.com", phone: "(702) 555-0108", date_of_birth: "1995-04-25", address: "5500 W Sunset Rd", city: "Las Vegas", state: "NV", zip: "89118", status: "active", last_visit: daysAgo(21), tags: ["cash-pay"] },
    { id: "a0000001-0000-0000-0000-000000000009", first_name: "Emily", last_name: "Nguyen", email: "emily.n@email.com", phone: "(702) 555-0109", date_of_birth: "1983-08-11", address: "3800 S Hualapai Way", city: "Las Vegas", state: "NV", zip: "89147", insurance_provider: "MetLife Dental", insurance_member_id: "ML-889034", insurance_group_number: "GRP-2200", status: "active", last_visit: daysAgo(90), tags: ["whitening"] },
    { id: "a0000001-0000-0000-0000-000000000010", first_name: "Anthony", last_name: "Brown", email: "abrown@email.com", phone: "(702) 555-0110", date_of_birth: "1970-02-28", address: "1800 E Sahara Ave", city: "Las Vegas", state: "NV", zip: "89104", insurance_provider: "Delta Dental", insurance_member_id: "DD-112890", insurance_group_number: "GRP-4401", status: "inactive", last_visit: daysAgo(400), tags: ["lapsed"] },
    { id: "a0000001-0000-0000-0000-000000000011", first_name: "Rachel", last_name: "Taylor", email: "rtaylor@email.com", phone: "(702) 555-0111", date_of_birth: "1998-05-17", address: "4200 S Durango Dr", city: "Las Vegas", state: "NV", zip: "89147", insurance_provider: "Aetna Dental", insurance_member_id: "AE-567890", insurance_group_number: "GRP-1100", status: "prospect", tags: ["new-patient"] },
    { id: "a0000001-0000-0000-0000-000000000012", first_name: "Carlos", last_name: "Reyes", email: "creyes@email.com", phone: "(702) 555-0112", date_of_birth: "1980-10-05", address: "6800 W Cheyenne Ave", city: "Las Vegas", state: "NV", zip: "89129", insurance_provider: "Guardian Dental", insurance_member_id: "GD-998877", insurance_group_number: "GRP-5500", status: "active", last_visit: daysAgo(10), tags: ["family"] },
  ];

  const { error: pErr } = await supabase.from("oe_patients").insert(patients);
  if (pErr) errors.push(`Patients: ${pErr.message}`);
  else inserted.oe_patients = patients.length;

  // Appointments (today)
  const appointments = [
    { patient_id: patients[0].id, provider_name: "Dr. Alexandru Chireu", appointment_date: today, appointment_time: "09:00", duration_minutes: 60, type: "Cleaning & Exam", status: "confirmed", confirmation_sent: true, reminder_24h_sent: true, reminder_2h_sent: true, insurance_verified: true },
    { patient_id: patients[2].id, provider_name: "Dr. Alexandru Chireu", appointment_date: today, appointment_time: "10:30", duration_minutes: 90, type: "Cosmetic Consultation", status: "confirmed", confirmation_sent: true, reminder_24h_sent: true, reminder_2h_sent: false, insurance_verified: true },
    { patient_id: patients[5].id, provider_name: "Dr. Alexandru Chireu", appointment_date: today, appointment_time: "13:00", duration_minutes: 90, type: "Crown Prep", status: "scheduled", confirmation_sent: true, reminder_24h_sent: true, reminder_2h_sent: false, insurance_verified: true },
    { patient_id: patients[4].id, provider_name: "Dr. Alexandru Chireu", appointment_date: today, appointment_time: "14:30", duration_minutes: 60, type: "Orthodontic Check", status: "scheduled", confirmation_sent: true, reminder_24h_sent: false, reminder_2h_sent: false, insurance_verified: false },
    { patient_id: patients[7].id, provider_name: "Dr. Alexandru Chireu", appointment_date: today, appointment_time: "16:00", duration_minutes: 60, type: "Emergency - Toothache", status: "confirmed", confirmation_sent: true, reminder_24h_sent: true, reminder_2h_sent: true, insurance_verified: false },
  ];

  const { error: aErr } = await supabase.from("oe_appointments").insert(appointments);
  if (aErr) errors.push(`Appointments: ${aErr.message}`);
  else inserted.oe_appointments = appointments.length;

  // Future appointments
  const futureAppts = [
    { patient_id: patients[1].id, provider_name: "Dr. Alexandru Chireu", appointment_date: daysAgo(-2), appointment_time: "09:00", duration_minutes: 120, type: "Implant Consultation", status: "scheduled", confirmation_sent: false, insurance_verified: false },
    { patient_id: patients[8].id, provider_name: "Dr. Alexandru Chireu", appointment_date: daysAgo(-3), appointment_time: "11:00", duration_minutes: 60, type: "Teeth Whitening", status: "scheduled", confirmation_sent: false, insurance_verified: true },
    { patient_id: patients[6].id, provider_name: "Dr. Alexandru Chireu", appointment_date: daysAgo(-5), appointment_time: "10:00", duration_minutes: 90, type: "Periodontal Scaling", status: "scheduled", confirmation_sent: false, insurance_verified: true },
  ];
  const { error: faErr } = await supabase.from("oe_appointments").insert(futureAppts);
  if (faErr) errors.push(`Future appointments: ${faErr.message}`);
  else inserted.oe_appointments = (inserted.oe_appointments || 0) + futureAppts.length;

  // Leads
  const leads = [
    { id: "b0000001-0000-0000-0000-000000000001", first_name: "Amanda", last_name: "Foster", email: "amanda.foster@email.com", phone: "(702) 555-0201", source: "website", status: "new", inquiry_type: "cosmetic", message: "Hi, I'm interested in veneers. I have a wedding coming up in April and want my smile to look perfect.", urgency: "medium", ai_response_draft: "Hi Amanda! Congratulations on your upcoming wedding! We'd love to help you achieve the perfect smile. Our cosmetic consultation with Dr. Alexandru is complimentary. Would you like to schedule this week?", created_at: minutesAgo(25) },
    { id: "b0000001-0000-0000-0000-000000000002", first_name: "Kevin", last_name: "Marshall", email: "kevin.m@email.com", phone: "(702) 555-0202", source: "google", status: "new", inquiry_type: "implants", message: "I lost a tooth playing basketball and need to get it replaced. Do you do implants?", urgency: "high", ai_response_draft: "Hi Kevin, sorry to hear about your tooth! Yes, we specialize in dental implants. We'd like to get you in quickly for an evaluation. Can we schedule you this week?", created_at: hoursAgo(2) },
    { id: "b0000001-0000-0000-0000-000000000003", first_name: "Stephanie", last_name: "Park", email: "spark@email.com", phone: "(702) 555-0203", source: "website", status: "contacted", inquiry_type: "cleaning", message: "New to Las Vegas, looking for a family dentist. We have two kids. Do you accept MetLife?", urgency: "low", ai_response_draft: "Welcome to Las Vegas, Stephanie! We'd love to be your family's dental home. We do accept MetLife dental insurance.", created_at: hoursAgo(24) },
    { id: "b0000001-0000-0000-0000-000000000004", first_name: "Marcus", last_name: "Rivera", phone: "(702) 555-0204", source: "phone", status: "new", inquiry_type: "emergency", message: "Severe tooth pain, upper right side. Pain started last night, can't sleep. Needs to be seen ASAP.", urgency: "emergency", ai_response_draft: "Marcus, we understand you're in a lot of pain. We have an emergency opening today. Please come in as soon as possible.", created_at: minutesAgo(15) },
  ];

  const { error: lErr } = await supabase.from("oe_leads").insert(leads);
  if (lErr) errors.push(`Leads: ${lErr.message}`);
  else inserted.oe_leads = leads.length;

  // AI Actions (Approval Queue)
  const aiActions = [
    { action_type: "lead_response_draft", module: "lead_response", description: "Drafted response for lead: Amanda Foster - Cosmetic/Veneers inquiry", input_data: { lead_id: leads[0].id }, output_data: { response: leads[0].ai_response_draft }, status: "pending_approval", lead_id: leads[0].id, confidence_score: 0.92, created_at: minutesAgo(24) },
    { action_type: "lead_response_draft", module: "lead_response", description: "Drafted response for lead: Kevin Marshall - Dental implant inquiry (HIGH URGENCY)", input_data: { lead_id: leads[1].id }, output_data: { response: leads[1].ai_response_draft }, status: "pending_approval", lead_id: leads[1].id, confidence_score: 0.88, created_at: hoursAgo(1.9) },
    { action_type: "lead_response_draft", module: "lead_response", description: "Drafted EMERGENCY response for lead: Marcus Rivera - Severe tooth pain", input_data: { lead_id: leads[3].id }, output_data: { response: leads[3].ai_response_draft }, status: "pending_approval", lead_id: leads[3].id, confidence_score: 0.95, created_at: minutesAgo(14) },
    { action_type: "appointment_reminder", module: "scheduling", description: "Send 2-hour reminder to Michael Kim for Crown Prep at 1:00 PM", input_data: { patient_id: patients[5].id }, output_data: { message: "Hi Michael! Reminder - your Crown Prep is today at 1:00 PM." }, status: "pending_approval", patient_id: patients[5].id, confidence_score: 0.97, created_at: minutesAgo(10) },
    { action_type: "insurance_followup", module: "insurance", description: "Follow up on pending insurance verification for Lisa Williams", input_data: { patient_id: patients[4].id }, output_data: { message: "Insurance verification needed for Lisa Williams (Delta Dental)." }, status: "pending_approval", patient_id: patients[4].id, confidence_score: 0.82, created_at: minutesAgo(45) },
    { action_type: "patient_recall", module: "recall", description: "Recall outreach for Robert Thompson - 6 months overdue", input_data: { patient_id: patients[3].id }, output_data: { message: "Hi Robert! It's been a while since your last visit." }, status: "pending_approval", patient_id: patients[3].id, confidence_score: 0.78, created_at: hoursAgo(3) },
  ];

  const { error: aiErr } = await supabase.from("oe_ai_actions").insert(aiActions);
  if (aiErr) errors.push(`AI actions: ${aiErr.message}`);
  else inserted.oe_ai_actions = aiActions.length;

  // Recent processed actions
  const recentActions = [
    { action_type: "lead_response_draft", module: "lead_response", description: "Drafted response for lead: Stephanie Park", input_data: {}, output_data: {}, status: "executed", confidence_score: 0.91, approved_by: "Dr. Alexandru Chireu", approved_at: hoursAgo(20), created_at: hoursAgo(24) },
    { action_type: "appointment_confirmation", module: "scheduling", description: "Sent confirmation to Maria Gonzalez for Cleaning & Exam", input_data: {}, output_data: {}, status: "executed", confidence_score: 0.96, approved_by: "Dr. Alexandru Chireu", approved_at: hoursAgo(48), created_at: hoursAgo(48) },
    { action_type: "appointment_confirmation", module: "scheduling", description: "Sent confirmation to Sarah Chen for Cosmetic Consultation", input_data: {}, output_data: {}, status: "approved", confidence_score: 0.94, approved_by: "Dr. Alexandru Chireu", approved_at: hoursAgo(24), created_at: hoursAgo(24) },
    { action_type: "patient_recall", module: "recall", description: "Recall outreach for inactive patient: Anthony Brown", input_data: {}, output_data: {}, status: "rejected", confidence_score: 0.65, approved_by: "Dr. Alexandru Chireu", approved_at: hoursAgo(72), created_at: hoursAgo(72) },
  ];

  const { error: raErr } = await supabase.from("oe_ai_actions").insert(recentActions);
  if (raErr) errors.push(`Recent actions: ${raErr.message}`);
  else inserted.oe_ai_actions = (inserted.oe_ai_actions || 0) + recentActions.length;

  // Insurance verifications
  const insuranceVerified = [
    { patient_id: patients[0].id, insurance_provider: "Delta Dental", member_id: "DD-892341", group_number: "GRP-4401", status: "verified", coverage_type: "PPO", deductible: 50, deductible_met: 50, annual_maximum: 2000, annual_used: 320, preventive_coverage: 100, basic_coverage: 80, major_coverage: 50, orthodontic_coverage: 0, verified_by: "System", verified_at: hoursAgo(48) },
    { patient_id: patients[2].id, insurance_provider: "MetLife Dental", member_id: "ML-556712", group_number: "GRP-2200", status: "verified", coverage_type: "PPO", deductible: 75, deductible_met: 75, annual_maximum: 1500, annual_used: 0, preventive_coverage: 100, basic_coverage: 80, major_coverage: 50, orthodontic_coverage: 50, verified_by: "System", verified_at: hoursAgo(24) },
    { patient_id: patients[5].id, insurance_provider: "Guardian Dental", member_id: "GD-443211", group_number: "GRP-5500", status: "verified", coverage_type: "HMO", deductible: 0, deductible_met: 0, annual_maximum: 1000, annual_used: 450, preventive_coverage: 100, basic_coverage: 70, major_coverage: 50, orthodontic_coverage: 0, verified_by: "System", verified_at: hoursAgo(72) },
  ];
  const insurancePending = [
    { patient_id: patients[4].id, insurance_provider: "Delta Dental", member_id: "DD-778123", group_number: "GRP-4401", status: "pending" },
    { patient_id: patients[1].id, insurance_provider: "Cigna Dental", member_id: "CG-110234", group_number: "GRP-8800", status: "pending" },
  ];

  const { error: ivErr } = await supabase.from("oe_insurance_verifications").insert([...insuranceVerified, ...insurancePending]);
  if (ivErr) errors.push(`Insurance: ${ivErr.message}`);
  else inserted.oe_insurance_verifications = insuranceVerified.length + insurancePending.length;

  // Inbox messages
  const messages = [
    { patient_id: patients[0].id, channel: "sms", direction: "outbound", status: "delivered", content: "Hi Maria! Reminder - your cleaning is tomorrow at 9:00 AM. Reply CONFIRM.", created_at: hoursAgo(24) },
    { patient_id: patients[0].id, channel: "sms", direction: "inbound", status: "delivered", content: "CONFIRM - see you tomorrow!", created_at: hoursAgo(23) },
    { patient_id: patients[2].id, channel: "email", direction: "outbound", status: "opened", content: "Dear Sarah, Your cosmetic consultation is confirmed for today at 10:30 AM.", created_at: hoursAgo(48) },
    { patient_id: patients[5].id, channel: "sms", direction: "outbound", status: "delivered", content: "Hi Michael, your crown prep is today at 1:00 PM. Reply C to confirm.", created_at: hoursAgo(24) },
    { patient_id: patients[5].id, channel: "sms", direction: "inbound", status: "delivered", content: "C", created_at: hoursAgo(22) },
    { patient_id: patients[3].id, channel: "sms", direction: "outbound", status: "delivered", content: "Hi Robert, it's been a while! Would you like to schedule a cleaning?", created_at: hoursAgo(120) },
    { patient_id: patients[8].id, channel: "email", direction: "outbound", status: "delivered", content: "Hi Emily, you're due for your 6-month cleaning. Book online or call us!", created_at: hoursAgo(72) },
    { patient_id: patients[7].id, channel: "sms", direction: "inbound", status: "delivered", content: "Hey, I have a really bad toothache. Can I come in today?", created_at: hoursAgo(3) },
    { patient_id: patients[7].id, channel: "sms", direction: "outbound", status: "delivered", content: "Hi David, we can see you today at 4:00 PM. Does that work?", created_at: hoursAgo(2.75) },
    { patient_id: patients[7].id, channel: "sms", direction: "inbound", status: "delivered", content: "Yes please! Thank you so much", created_at: hoursAgo(2.5) },
  ];

  const { error: mErr } = await supabase.from("oe_outreach_messages").insert(messages);
  if (mErr) errors.push(`Messages: ${mErr.message}`);
  else inserted.oe_outreach_messages = messages.length;

  // Daily metrics (7 days)
  const metrics = [
    { date: daysAgo(6), new_leads: 3, leads_converted: 1, appointments_scheduled: 6, appointments_completed: 5, no_shows: 1, cancellations: 0, production: 4200, collections: 3800, claims_submitted: 4, claims_paid: 2, ai_actions_taken: 8, ai_actions_approved: 7, avg_lead_response_seconds: 45, patient_messages_sent: 12, patient_messages_received: 6 },
    { date: daysAgo(5), new_leads: 2, leads_converted: 1, appointments_scheduled: 5, appointments_completed: 5, no_shows: 0, cancellations: 1, production: 3800, collections: 3500, claims_submitted: 3, claims_paid: 3, ai_actions_taken: 6, ai_actions_approved: 6, avg_lead_response_seconds: 38, patient_messages_sent: 10, patient_messages_received: 4 },
    { date: daysAgo(4), new_leads: 4, leads_converted: 2, appointments_scheduled: 7, appointments_completed: 6, no_shows: 0, cancellations: 1, production: 5100, collections: 4800, claims_submitted: 5, claims_paid: 2, ai_actions_taken: 11, ai_actions_approved: 10, avg_lead_response_seconds: 52, patient_messages_sent: 15, patient_messages_received: 8 },
    { date: daysAgo(3), new_leads: 1, leads_converted: 0, appointments_scheduled: 4, appointments_completed: 4, no_shows: 0, cancellations: 0, production: 2900, collections: 2600, claims_submitted: 2, claims_paid: 4, ai_actions_taken: 5, ai_actions_approved: 5, avg_lead_response_seconds: 30, patient_messages_sent: 8, patient_messages_received: 3 },
    { date: daysAgo(2), new_leads: 3, leads_converted: 1, appointments_scheduled: 6, appointments_completed: 5, no_shows: 1, cancellations: 0, production: 4500, collections: 4100, claims_submitted: 4, claims_paid: 1, ai_actions_taken: 9, ai_actions_approved: 8, avg_lead_response_seconds: 41, patient_messages_sent: 14, patient_messages_received: 7 },
    { date: daysAgo(1), new_leads: 2, leads_converted: 1, appointments_scheduled: 5, appointments_completed: 4, no_shows: 0, cancellations: 1, production: 3200, collections: 3000, claims_submitted: 3, claims_paid: 3, ai_actions_taken: 7, ai_actions_approved: 6, avg_lead_response_seconds: 35, patient_messages_sent: 11, patient_messages_received: 5 },
    { date: today, new_leads: 4, leads_converted: 0, appointments_scheduled: 5, appointments_completed: 0, no_shows: 0, cancellations: 0, production: 0, collections: 0, claims_submitted: 0, claims_paid: 0, ai_actions_taken: 6, ai_actions_approved: 3, avg_lead_response_seconds: 22, patient_messages_sent: 6, patient_messages_received: 4 },
  ];

  const { error: dmErr } = await supabase.from("oe_daily_metrics").insert(metrics);
  if (dmErr) errors.push(`Metrics: ${dmErr.message}`);
  else inserted.oe_daily_metrics = metrics.length;

  return { inserted, errors };
}

// Demo seed script - run with: node scripts/seed-demo.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Parse .env.local manually (no dotenv dependency needed)
const envContent = readFileSync(".env.local", "utf-8");
const env = {};
for (const line of envContent.split(/\r?\n/)) {
  const idx = line.indexOf("=");
  if (idx > 0 && !line.startsWith("#")) {
    const key = line.substring(0, idx).trim();
    const val = line.substring(idx + 1).trim();
    env[key] = val;
  }
}
const process_env = { ...process.env, ...env };

const supabase = createClient(
  process_env.NEXT_PUBLIC_SUPABASE_URL,
  process_env.SUPABASE_SERVICE_ROLE_KEY
);

const today = new Date().toISOString().split("T")[0];
const now = new Date();

function hoursAgo(h) {
  return new Date(now.getTime() - h * 3600000).toISOString();
}
function minutesAgo(m) {
  return new Date(now.getTime() - m * 60000).toISOString();
}
function daysAgo(d) {
  return new Date(now.getTime() - d * 86400000).toISOString().split("T")[0];
}

async function seed() {
  console.log("Clearing existing data...");

  // Delete in dependency order
  for (const table of [
    "oe_ai_actions",
    "oe_outreach_messages",
    "oe_insurance_verifications",
    "oe_billing_claims",
    "oe_treatment_plans",
    "oe_appointments",
    "oe_lead_nurture_sequences",
    "oe_patient_reactivation_sequences",
    "oe_leads",
    "oe_patients",
    "oe_daily_metrics",
  ]) {
    const { error } = await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) console.log(`  Warning clearing ${table}: ${error.message}`);
    else console.log(`  Cleared ${table}`);
  }

  // ============================================================================
  // PATIENTS
  // ============================================================================
  console.log("\nSeeding patients...");
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
  if (pErr) { console.error("  Patient insert error:", pErr.message); return; }
  console.log(`  Inserted ${patients.length} patients`);

  // ============================================================================
  // APPOINTMENTS
  // ============================================================================
  console.log("\nSeeding appointments...");
  const appointments = [
    { patient_id: patients[0].id, provider_name: "Dr. Alex", appointment_date: today, appointment_time: "09:00", duration_minutes: 60, type: "Cleaning & Exam", status: "confirmed", confirmation_sent: true, reminder_24h_sent: true, reminder_2h_sent: true, insurance_verified: true },
    { patient_id: patients[2].id, provider_name: "Dr. Alex", appointment_date: today, appointment_time: "10:30", duration_minutes: 90, type: "Cosmetic Consultation", status: "confirmed", confirmation_sent: true, reminder_24h_sent: true, reminder_2h_sent: false, insurance_verified: true },
    { patient_id: patients[5].id, provider_name: "Dr. Alex", appointment_date: today, appointment_time: "13:00", duration_minutes: 90, type: "Crown Prep", status: "scheduled", confirmation_sent: true, reminder_24h_sent: true, reminder_2h_sent: false, insurance_verified: true },
    { patient_id: patients[4].id, provider_name: "Dr. Alex", appointment_date: today, appointment_time: "14:30", duration_minutes: 60, type: "Orthodontic Check", status: "scheduled", confirmation_sent: true, reminder_24h_sent: false, reminder_2h_sent: false, insurance_verified: false },
    { patient_id: patients[7].id, provider_name: "Dr. Alex", appointment_date: today, appointment_time: "16:00", duration_minutes: 60, type: "Emergency - Toothache", status: "confirmed", confirmation_sent: true, reminder_24h_sent: true, reminder_2h_sent: true, insurance_verified: false },
  ];

  const { error: aErr } = await supabase.from("oe_appointments").insert(appointments);
  if (aErr) console.error("  Appointment insert error:", aErr.message);
  else console.log(`  Inserted ${appointments.length} today's appointments`);

  // Future appointments
  const futureAppts = [
    { patient_id: patients[1].id, provider_name: "Dr. Alex", appointment_date: daysAgo(-2), appointment_time: "09:00", duration_minutes: 120, type: "Implant Consultation", status: "scheduled", confirmation_sent: false, insurance_verified: false },
    { patient_id: patients[8].id, provider_name: "Dr. Alex", appointment_date: daysAgo(-3), appointment_time: "11:00", duration_minutes: 60, type: "Teeth Whitening", status: "scheduled", confirmation_sent: false, insurance_verified: true },
    { patient_id: patients[6].id, provider_name: "Dr. Alex", appointment_date: daysAgo(-5), appointment_time: "10:00", duration_minutes: 90, type: "Periodontal Scaling", status: "scheduled", confirmation_sent: false, insurance_verified: true },
  ];
  const { error: faErr } = await supabase.from("oe_appointments").insert(futureAppts);
  if (faErr) console.error("  Future appt insert error:", faErr.message);
  else console.log(`  Inserted ${futureAppts.length} future appointments`);

  // ============================================================================
  // LEADS
  // ============================================================================
  console.log("\nSeeding leads...");
  const leads = [
    {
      id: "b0000001-0000-0000-0000-000000000001",
      first_name: "Amanda", last_name: "Foster",
      email: "amanda.foster@email.com", phone: "(702) 555-0201",
      source: "website", status: "new", inquiry_type: "cosmetic",
      message: "Hi, I'm interested in veneers. I have a wedding coming up in April and want my smile to look perfect. Can you tell me about pricing and how many visits it would take?",
      urgency: "medium",
      ai_response_draft: "Hi Amanda! Congratulations on your upcoming wedding! We'd love to help you achieve the perfect smile for your special day. Our cosmetic consultation with Dr. Alex is complimentary, and veneers typically require just 2-3 visits over 2-3 weeks. We offer flexible financing options to fit any budget. Would you like to schedule a consultation this week? We have openings on Tuesday and Thursday mornings.",
      created_at: minutesAgo(25),
    },
    {
      id: "b0000001-0000-0000-0000-000000000002",
      first_name: "Kevin", last_name: "Marshall",
      email: "kevin.m@email.com", phone: "(702) 555-0202",
      source: "google", status: "new", inquiry_type: "implants",
      message: "I lost a tooth playing basketball and need to get it replaced. My dentist retired and I'm looking for a new office. Do you do implants?",
      urgency: "high",
      ai_response_draft: "Hi Kevin, sorry to hear about your tooth! Yes, we absolutely specialize in dental implants. Dr. Alex has extensive experience with implant placement and restoration. For a missing tooth, a single implant is typically the best long-term solution. We'd like to get you in quickly for an evaluation and X-rays. Can we schedule you this week? We also accept most major insurance plans. Call or text us at (702) 935-4395 to get on the schedule.",
      created_at: hoursAgo(2),
    },
    {
      id: "b0000001-0000-0000-0000-000000000003",
      first_name: "Stephanie", last_name: "Park",
      email: "spark@email.com", phone: "(702) 555-0203",
      source: "website", status: "contacted", inquiry_type: "cleaning",
      message: "New to Las Vegas, looking for a family dentist. We have two kids (ages 8 and 12). Do you accept MetLife?",
      urgency: "low",
      ai_response_draft: "Welcome to Las Vegas, Stephanie! We'd love to be your family's dental home. Great news - we do accept MetLife dental insurance. We see patients ages 6 and up, so both of your children are welcome! We can even schedule back-to-back appointments for the whole family to make it convenient. Our office is right on West Sahara Avenue with easy parking. Would you like to book your family's first visit?",
      created_at: hoursAgo(24),
    },
    {
      id: "b0000001-0000-0000-0000-000000000004",
      first_name: "Marcus", last_name: "Rivera",
      phone: "(702) 555-0204",
      source: "phone", status: "new", inquiry_type: "emergency",
      message: "Called in with severe tooth pain, upper right side. Pain started last night, can't sleep. Needs to be seen ASAP.",
      urgency: "emergency",
      ai_response_draft: "Marcus, we understand you're in a lot of pain and want to help you right away. We have an emergency opening today. Please come in as soon as possible - our address is 7480 West Sahara Avenue. We'll take X-rays, diagnose the issue, and get you comfortable. If the pain becomes unbearable before your visit, you can take over-the-counter ibuprofen (600mg) for temporary relief. We'll text you a confirmation shortly.",
      created_at: minutesAgo(15),
    },
  ];

  const { error: lErr } = await supabase.from("oe_leads").insert(leads);
  if (lErr) console.error("  Lead insert error:", lErr.message);
  else console.log(`  Inserted ${leads.length} leads`);

  // ============================================================================
  // AI ACTIONS (Approval Queue)
  // ============================================================================
  console.log("\nSeeding AI actions...");
  const aiActions = [
    {
      action_type: "lead_response_draft", module: "lead_response",
      description: "Drafted response for lead: Amanda Foster - Cosmetic/Veneers inquiry",
      input_data: { lead_id: leads[0].id, inquiry_type: "cosmetic", message: "Interested in veneers for wedding" },
      output_data: { response: leads[0].ai_response_draft },
      status: "pending_approval", lead_id: leads[0].id, confidence_score: 0.92,
      created_at: minutesAgo(24),
    },
    {
      action_type: "lead_response_draft", module: "lead_response",
      description: "Drafted response for lead: Kevin Marshall - Dental implant inquiry (HIGH URGENCY)",
      input_data: { lead_id: leads[1].id, inquiry_type: "implants", message: "Lost tooth, needs implant" },
      output_data: { response: leads[1].ai_response_draft },
      status: "pending_approval", lead_id: leads[1].id, confidence_score: 0.88,
      created_at: hoursAgo(1.9),
    },
    {
      action_type: "lead_response_draft", module: "lead_response",
      description: "Drafted EMERGENCY response for lead: Marcus Rivera - Severe tooth pain",
      input_data: { lead_id: leads[3].id, inquiry_type: "emergency", message: "Severe tooth pain, ASAP" },
      output_data: { response: leads[3].ai_response_draft },
      status: "pending_approval", lead_id: leads[3].id, confidence_score: 0.95,
      created_at: minutesAgo(14),
    },
    {
      action_type: "appointment_reminder", module: "scheduling",
      description: "Send 2-hour reminder to Michael Kim for Crown Prep at 1:00 PM",
      input_data: { patient_id: patients[5].id, appointment_type: "Crown Prep", time: "1:00 PM" },
      output_data: { message: "Hi Michael! This is a friendly reminder from AK Ultimate Dental - your Crown Prep appointment is today at 1:00 PM with Dr. Alex. Please arrive 10 minutes early. If you need to reschedule, reply to this text or call (702) 935-4395. See you soon!" },
      status: "pending_approval", patient_id: patients[5].id, confidence_score: 0.97,
      created_at: minutesAgo(10),
    },
    {
      action_type: "insurance_followup", module: "insurance",
      description: "Follow up on pending insurance verification for Lisa Williams - Orthodontic Check",
      input_data: { patient_id: patients[4].id, insurance_provider: "Delta Dental", procedure: "Orthodontic Check" },
      output_data: { message: "Insurance verification needed for Lisa Williams (Delta Dental, DD-778123). Orthodontic benefits: Please verify annual max remaining and orthodontic coverage percentage before 2:30 PM appointment today." },
      status: "pending_approval", patient_id: patients[4].id, confidence_score: 0.82,
      created_at: minutesAgo(45),
    },
    {
      action_type: "patient_recall", module: "recall",
      description: "Recall outreach for Robert Thompson - 6 months overdue for cleaning",
      input_data: { patient_id: patients[3].id, last_visit: "180 days ago", type: "recall" },
      output_data: { message: "Hi Robert! It's been a while since your last visit to AK Ultimate Dental. Regular cleanings help prevent costly problems down the road. We have convenient morning and afternoon openings this week. Reply YES to book, or call us at (702) 935-4395. We'd love to see you! - Dr. Alex's Team" },
      status: "pending_approval", patient_id: patients[3].id, confidence_score: 0.78,
      created_at: hoursAgo(3),
    },
  ];

  const { error: aiErr } = await supabase.from("oe_ai_actions").insert(aiActions);
  if (aiErr) console.error("  AI actions insert error:", aiErr.message);
  else console.log(`  Inserted ${aiActions.length} pending AI actions`);

  // Recent processed actions
  const recentActions = [
    { action_type: "lead_response_draft", module: "lead_response", description: "Drafted response for lead: Stephanie Park - New patient family inquiry", input_data: {}, output_data: {}, status: "executed", confidence_score: 0.91, approved_by: "Dr. Alex", approved_at: hoursAgo(20), created_at: hoursAgo(24) },
    { action_type: "appointment_confirmation", module: "scheduling", description: "Sent confirmation to Maria Gonzalez for Cleaning & Exam", input_data: {}, output_data: {}, status: "executed", confidence_score: 0.96, approved_by: "Dr. Alex", approved_at: hoursAgo(48), created_at: hoursAgo(48) },
    { action_type: "appointment_confirmation", module: "scheduling", description: "Sent confirmation to Sarah Chen for Cosmetic Consultation", input_data: {}, output_data: {}, status: "approved", confidence_score: 0.94, approved_by: "Dr. Alex", approved_at: hoursAgo(24), created_at: hoursAgo(24) },
    { action_type: "patient_recall", module: "recall", description: "Recall outreach for inactive patient: Anthony Brown", input_data: {}, output_data: {}, status: "rejected", confidence_score: 0.65, approved_by: "Dr. Alex", approved_at: hoursAgo(72), created_at: hoursAgo(72) },
  ];

  const { error: raErr } = await supabase.from("oe_ai_actions").insert(recentActions);
  if (raErr) console.error("  Recent actions insert error:", raErr.message);
  else console.log(`  Inserted ${recentActions.length} recent actions`);

  // ============================================================================
  // INSURANCE VERIFICATIONS
  // ============================================================================
  console.log("\nSeeding insurance verifications...");
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
  if (ivErr) console.error("  Insurance insert error:", ivErr.message);
  else console.log(`  Inserted ${insuranceVerified.length + insurancePending.length} insurance verifications`);

  // ============================================================================
  // OUTREACH MESSAGES (Inbox)
  // ============================================================================
  console.log("\nSeeding inbox messages...");
  const messages = [
    { patient_id: patients[0].id, channel: "sms", direction: "outbound", status: "delivered", content: "Hi Maria! Just a reminder - your cleaning appointment is tomorrow at 9:00 AM. Reply CONFIRM to confirm. - AK Ultimate Dental", created_at: hoursAgo(24) },
    { patient_id: patients[0].id, channel: "sms", direction: "inbound", status: "delivered", content: "CONFIRM - see you tomorrow!", created_at: hoursAgo(23) },
    { patient_id: patients[2].id, channel: "email", direction: "outbound", status: "opened", content: "Dear Sarah, Thank you for choosing AK Ultimate Dental for your cosmetic consultation. We look forward to discussing your smile goals with Dr. Alex. Your appointment is confirmed for today at 10:30 AM.", created_at: hoursAgo(48) },
    { patient_id: patients[5].id, channel: "sms", direction: "outbound", status: "delivered", content: "Hi Michael, your crown prep appointment is scheduled for today at 1:00 PM with Dr. Alex. Please arrive 10 min early. Reply C to confirm or R to reschedule.", created_at: hoursAgo(24) },
    { patient_id: patients[5].id, channel: "sms", direction: "inbound", status: "delivered", content: "C", created_at: hoursAgo(22) },
    { patient_id: patients[3].id, channel: "sms", direction: "outbound", status: "delivered", content: "Hi Robert, it's been a while since your last visit to AK Ultimate Dental! We miss seeing you. Would you like to schedule a cleaning? Reply YES or call (702) 935-4395.", created_at: hoursAgo(120) },
    { patient_id: patients[8].id, channel: "email", direction: "outbound", status: "delivered", content: "Hi Emily, just a friendly reminder that you're due for your 6-month cleaning. We have several openings next week. Book online or call us at (702) 935-4395!", created_at: hoursAgo(72) },
    { patient_id: patients[7].id, channel: "sms", direction: "inbound", status: "delivered", content: "Hey, I have a really bad toothache on my upper right side. Can I come in today?", created_at: hoursAgo(3) },
    { patient_id: patients[7].id, channel: "sms", direction: "outbound", status: "delivered", content: "Hi David, sorry to hear that! We can definitely see you today. We have an emergency slot at 4:00 PM. Does that work? - AK Ultimate Dental", created_at: hoursAgo(2.75) },
    { patient_id: patients[7].id, channel: "sms", direction: "inbound", status: "delivered", content: "Yes please! Thank you so much", created_at: hoursAgo(2.5) },
  ];

  const { error: mErr } = await supabase.from("oe_outreach_messages").insert(messages);
  if (mErr) console.error("  Messages insert error:", mErr.message);
  else console.log(`  Inserted ${messages.length} messages`);

  // ============================================================================
  // DAILY METRICS
  // ============================================================================
  console.log("\nSeeding daily metrics...");
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
  if (dmErr) console.error("  Metrics insert error:", dmErr.message);
  else console.log(`  Inserted ${metrics.length} days of metrics`);

  console.log("\n✅ Demo seed complete! Dashboard is now populated.");
  console.log("   12 patients | 5 today's appointments | 4 leads | 6 pending approvals");
  console.log("   10 inbox messages | 5 insurance records | 7 days of metrics");
}

seed().catch(console.error);

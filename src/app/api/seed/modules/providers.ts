import type { SupabaseClient } from "@supabase/supabase-js";

const providers = [
  { first_name: "Alex", last_name: "Khachaturian", title: "DDS", specialty: "General Dentistry", npi_number: "1234567890", license_number: "NV-DDS-2015-4821", license_state: "NV", email: "dr.alex@akultimatedental.com", phone: "(702) 555-0100", bio: "Dr. Khachaturian is the founder and lead dentist at AK Ultimate Dental with over 15 years of experience.", accepting_new_patients: true, is_active: true, color: "#2563EB" },
  { first_name: "Sarah", last_name: "Chen", title: "DMD", specialty: "Cosmetic Dentistry", npi_number: "2345678901", license_number: "NV-DMD-2018-7293", license_state: "NV", email: "dr.chen@akultimatedental.com", phone: "(702) 555-0101", bio: "Dr. Chen specializes in cosmetic and restorative dentistry.", accepting_new_patients: true, is_active: true, color: "#7C3AED" },
  { first_name: "Michael", last_name: "Torres", title: "DDS", specialty: "Oral Surgery & Implants", npi_number: "3456789012", license_number: "NV-DDS-2016-5547", license_state: "NV", email: "dr.torres@akultimatedental.com", phone: "(702) 555-0102", bio: "Dr. Torres is a board-certified oral surgeon specializing in dental implants.", accepting_new_patients: true, is_active: true, color: "#059669" },
  { first_name: "Maria", last_name: "Lopez", title: "RDH", specialty: "Hygienist", npi_number: null, license_number: "NV-RDH-2019-3381", license_state: "NV", email: "maria.lopez@akultimatedental.com", phone: "(702) 555-0103", bio: "Maria is a registered dental hygienist with 8 years of experience.", accepting_new_patients: true, is_active: true, color: "#D97706" },
  { first_name: "Jennifer", last_name: "Park", title: "RDH", specialty: "Hygienist", npi_number: null, license_number: "NV-RDH-2020-4412", license_state: "NV", email: "jennifer.park@akultimatedental.com", phone: "(702) 555-0104", bio: "Jennifer specializes in pediatric and geriatric dental hygiene.", accepting_new_patients: true, is_active: true, color: "#DC2626" },
  { first_name: "David", last_name: "Kim", title: "DA", specialty: "Dental Assistant", npi_number: null, license_number: "NV-DA-2021-6678", license_state: "NV", email: "david.kim@akultimatedental.com", phone: "(702) 555-0105", bio: "David is a certified dental assistant with expertise in chairside assisting.", accepting_new_patients: false, is_active: true, color: "#0891B2" },
];

const availabilityTemplates: Record<string, { day_of_week: number; start_time: string; end_time: string }[]> = {
  "Alex Khachaturian": [
    { day_of_week: 1, start_time: "08:00", end_time: "17:00" },
    { day_of_week: 2, start_time: "08:00", end_time: "17:00" },
    { day_of_week: 3, start_time: "08:00", end_time: "17:00" },
    { day_of_week: 4, start_time: "08:00", end_time: "17:00" },
    { day_of_week: 5, start_time: "08:00", end_time: "14:00" },
  ],
  "Sarah Chen": [
    { day_of_week: 1, start_time: "09:00", end_time: "18:00" },
    { day_of_week: 2, start_time: "09:00", end_time: "18:00" },
    { day_of_week: 3, start_time: "09:00", end_time: "13:00" },
    { day_of_week: 4, start_time: "09:00", end_time: "18:00" },
    { day_of_week: 5, start_time: "09:00", end_time: "18:00" },
  ],
  "Michael Torres": [
    { day_of_week: 1, start_time: "07:00", end_time: "15:00" },
    { day_of_week: 2, start_time: "07:00", end_time: "15:00" },
    { day_of_week: 3, start_time: "07:00", end_time: "15:00" },
    { day_of_week: 4, start_time: "07:00", end_time: "15:00" },
  ],
  "Maria Lopez": [
    { day_of_week: 1, start_time: "08:00", end_time: "16:00" },
    { day_of_week: 2, start_time: "08:00", end_time: "16:00" },
    { day_of_week: 3, start_time: "08:00", end_time: "16:00" },
    { day_of_week: 4, start_time: "08:00", end_time: "16:00" },
    { day_of_week: 5, start_time: "08:00", end_time: "16:00" },
  ],
  "Jennifer Park": [
    { day_of_week: 1, start_time: "08:00", end_time: "16:00" },
    { day_of_week: 2, start_time: "10:00", end_time: "18:00" },
    { day_of_week: 3, start_time: "08:00", end_time: "16:00" },
    { day_of_week: 4, start_time: "10:00", end_time: "18:00" },
    { day_of_week: 5, start_time: "08:00", end_time: "14:00" },
  ],
  "David Kim": [
    { day_of_week: 1, start_time: "07:30", end_time: "16:30" },
    { day_of_week: 2, start_time: "07:30", end_time: "16:30" },
    { day_of_week: 3, start_time: "07:30", end_time: "16:30" },
    { day_of_week: 4, start_time: "07:30", end_time: "16:30" },
    { day_of_week: 5, start_time: "07:30", end_time: "12:00" },
  ],
};

const timeOffBlocks = [
  { providerName: "Alex Khachaturian", block_type: "vacation", title: "Family Vacation", start_date: "2026-03-15", end_date: "2026-03-22", all_day: true },
  { providerName: "Sarah Chen", block_type: "meeting", title: "Cosmetic Dentistry Conference", start_date: "2026-03-05", end_date: "2026-03-07", all_day: true },
  { providerName: "Michael Torres", block_type: "personal", title: "Personal Day", start_date: "2026-02-28", end_date: "2026-02-28", all_day: true },
  { providerName: "Maria Lopez", block_type: "sick", title: "Sick Day", start_date: "2026-02-10", end_date: "2026-02-10", all_day: true },
  { providerName: "Alex Khachaturian", block_type: "meeting", title: "Staff Meeting", start_date: "2026-02-20", end_date: "2026-02-20", all_day: false, start_time: "12:00", end_time: "13:00" },
  { providerName: "Jennifer Park", block_type: "holiday", title: "Presidents Day", start_date: "2026-02-16", end_date: "2026-02-16", all_day: true },
  { providerName: "Sarah Chen", block_type: "vacation", title: "Spring Break", start_date: "2026-04-06", end_date: "2026-04-10", all_day: true },
];

const referralDoctors = [
  { name: "Dr. James Mitchell", specialty: "Orthodontics", phone: "(702) 555-2001", fax: "(702) 555-2002", address: "3500 S Las Vegas Blvd, Suite 200" },
  { name: "Dr. Linda Nguyen", specialty: "Endodontics", phone: "(702) 555-2003", fax: "(702) 555-2004", address: "4200 W Flamingo Rd, Suite 110" },
  { name: "Dr. Robert Patel", specialty: "Periodontics", phone: "(702) 555-2005", fax: "(702) 555-2006", address: "2800 E Desert Inn Rd, Suite 300" },
  { name: "Dr. Amanda Foster", specialty: "Oral Surgery", phone: "(702) 555-2007", fax: "(702) 555-2008", address: "5100 W Sahara Ave, Suite 150" },
  { name: "Dr. Kevin Yamamoto", specialty: "Pediatric Dentistry", phone: "(702) 555-2009", fax: "(702) 555-2010", address: "1900 N Rainbow Blvd, Suite 250" },
  { name: "Dr. Rachel Green", specialty: "Prosthodontics", phone: "(702) 555-2011", fax: "(702) 555-2012", address: "6000 S Eastern Ave, Suite 180" },
];

const referralReasons = [
  "Complex root canal treatment needed", "Wisdom teeth extraction referral",
  "Orthodontic evaluation and braces consultation", "Periodontal disease - advanced treatment required",
  "TMJ evaluation and treatment", "Pediatric dental care for anxious child",
  "Complex implant case - bone graft needed", "Oral lesion biopsy required",
];

const referralStatuses = ["pending", "sent", "accepted", "completed", "declined", "cancelled"];
const referralStatusWeights = [25, 20, 20, 20, 10, 5];
const urgencyOptions = ["routine", "urgent", "emergency"];
const urgencyWeights = [70, 25, 5];

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export async function seedProviders(supabase: SupabaseClient) {
  const inserted: Record<string, number> = {};
  const errors: string[] = [];

  // Clear existing
  await supabase.from("oe_referrals").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("oe_provider_blocks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("oe_provider_availability").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("oe_providers").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  // Insert providers
  const { data: insertedProviders, error: provErr } = await supabase.from("oe_providers").insert(providers).select();
  if (provErr || !insertedProviders) {
    errors.push(`Providers: ${provErr?.message || "No data returned"}`);
    return { inserted, errors };
  }
  inserted.oe_providers = insertedProviders.length;

  // Build lookup
  const providerMap: Record<string, string> = {};
  for (const p of insertedProviders) {
    providerMap[`${p.first_name} ${p.last_name}`] = p.id;
  }

  // Availability
  const availabilityRows: Record<string, unknown>[] = [];
  for (const [name, schedule] of Object.entries(availabilityTemplates)) {
    const providerId = providerMap[name];
    if (!providerId) continue;
    for (const slot of schedule) {
      availabilityRows.push({ provider_id: providerId, day_of_week: slot.day_of_week, start_time: slot.start_time, end_time: slot.end_time, is_available: true, location: "Main Office" });
    }
  }

  const { error: availErr } = await supabase.from("oe_provider_availability").insert(availabilityRows);
  if (availErr) errors.push(`Availability: ${availErr.message}`);
  else inserted.oe_provider_availability = availabilityRows.length;

  // Time-off blocks
  const blockRows = timeOffBlocks.map((b) => ({
    provider_id: providerMap[b.providerName],
    block_type: b.block_type,
    title: b.title,
    start_date: b.start_date,
    end_date: b.end_date,
    start_time: ("start_time" in b ? b.start_time : null) as string | null,
    end_time: ("end_time" in b ? b.end_time : null) as string | null,
    all_day: b.all_day,
  }));

  const { error: blockErr } = await supabase.from("oe_provider_blocks").insert(blockRows);
  if (blockErr) errors.push(`Blocks: ${blockErr.message}`);
  else inserted.oe_provider_blocks = blockRows.length;

  // Get patients for referrals
  const { data: patients } = await supabase.from("oe_patients").select("id").is("deleted_at", null).limit(50);
  const patientIds = (patients || []).map((p: { id: string }) => p.id);
  const providerIds = Object.values(providerMap);
  const now = new Date();

  // Referrals
  const referralRows: Record<string, unknown>[] = [];
  for (let i = 0; i < 14; i++) {
    const daysBack = Math.floor(Math.random() * 90);
    const createdDate = new Date(now);
    createdDate.setDate(createdDate.getDate() - daysBack);
    const refDoc = referralDoctors[Math.floor(Math.random() * referralDoctors.length)];
    const status = weightedRandom(referralStatuses, referralStatusWeights);
    const urgency = weightedRandom(urgencyOptions, urgencyWeights);

    referralRows.push({
      patient_id: patientIds.length > 0 ? patientIds[Math.floor(Math.random() * patientIds.length)] : null,
      referring_provider_id: providerIds[Math.floor(Math.random() * providerIds.length)],
      referred_to_name: refDoc.name,
      referred_to_specialty: refDoc.specialty,
      referred_to_phone: refDoc.phone,
      referred_to_fax: refDoc.fax,
      referred_to_address: refDoc.address,
      reason: referralReasons[Math.floor(Math.random() * referralReasons.length)],
      urgency,
      status,
      notes: Math.random() < 0.3 ? "Patient has been informed about the referral." : null,
      sent_at: ["sent", "accepted", "completed", "declined"].includes(status)
        ? new Date(createdDate.getTime() + 86400000).toISOString() : null,
      completed_at: status === "completed"
        ? new Date(createdDate.getTime() + 86400000 * 14).toISOString() : null,
      created_at: createdDate.toISOString(),
    });
  }

  const { error: refErr } = await supabase.from("oe_referrals").insert(referralRows);
  if (refErr) errors.push(`Referrals: ${refErr.message}`);
  else inserted.oe_referrals = referralRows.length;

  return { inserted, errors };
}

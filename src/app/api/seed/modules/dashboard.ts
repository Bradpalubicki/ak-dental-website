import type { SupabaseClient } from "@supabase/supabase-js";

function daysAgo(d: number) {
  return new Date(Date.now() - d * 86400000).toISOString().split("T")[0];
}
function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}
function randomFloat(min: number, max: number) {
  return Number((min + Math.random() * (max - min)).toFixed(2));
}
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const patientIds = [
  "a0000001-0000-0000-0000-000000000001", "a0000001-0000-0000-0000-000000000002",
  "a0000001-0000-0000-0000-000000000003", "a0000001-0000-0000-0000-000000000004",
  "a0000001-0000-0000-0000-000000000005", "a0000001-0000-0000-0000-000000000006",
  "a0000001-0000-0000-0000-000000000007", "a0000001-0000-0000-0000-000000000008",
  "a0000001-0000-0000-0000-000000000009", "a0000001-0000-0000-0000-000000000010",
  "a0000001-0000-0000-0000-000000000011", "a0000001-0000-0000-0000-000000000012",
];

const carriers = ["Delta Dental", "Cigna Dental", "MetLife Dental", "Aetna Dental", "Guardian Dental", "United Healthcare"];
const denialReasons = ["Missing information", "Pre-authorization required", "Exceeds frequency limitation", "Not a covered benefit", "Patient not eligible"];
const procedures = [
  [{ code: "D0150", description: "Comprehensive oral evaluation" }],
  [{ code: "D0120", description: "Periodic oral evaluation" }],
  [{ code: "D1110", description: "Prophylaxis - adult" }],
  [{ code: "D2740", description: "Crown - porcelain/ceramic" }],
  [{ code: "D6010", description: "Surgical placement - endosteal implant" }],
  [{ code: "D4341", description: "Periodontal scaling and root planing" }],
  [{ code: "D0274", description: "Bitewings - four radiographic images" }],
  [{ code: "D7210", description: "Extraction - surgical" }],
];

export async function seedDashboard(supabase: SupabaseClient) {
  const inserted: Record<string, number> = {};
  const errors: string[] = [];
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // 1. Billing Claims
  await supabase.from("oe_billing_claims").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const claims: Record<string, unknown>[] = [];
  const claimStatuses = ["paid", "paid", "paid", "paid", "pending", "submitted", "denied", "appealed", "draft"];

  for (let i = 0; i < 35; i++) {
    const daysBack = randomBetween(0, 180);
    const createdAt = new Date(now.getTime() - daysBack * 86400000).toISOString();
    const status = randomChoice(claimStatuses);
    const billedAmount = randomFloat(120, 3500);

    let insurancePaid = 0, patientResp = 0, adjustment = 0;
    let paidAt: string | null = null, submittedAt: string | null = null, denialReason: string | null = null;
    let agingDays = daysBack;

    if (status === "paid") {
      insurancePaid = randomFloat(billedAmount * 0.6, billedAmount * 0.95);
      patientResp = randomFloat(0, billedAmount - insurancePaid);
      adjustment = billedAmount - insurancePaid - patientResp;
      paidAt = new Date(now.getTime() - randomBetween(0, daysBack) * 86400000).toISOString();
      submittedAt = createdAt;
      agingDays = Math.round((new Date(paidAt).getTime() - new Date(createdAt).getTime()) / 86400000);
    } else if (status === "submitted" || status === "pending") {
      submittedAt = createdAt;
    } else if (status === "denied" || status === "appealed") {
      submittedAt = createdAt;
      denialReason = randomChoice(denialReasons);
    }

    claims.push({
      patient_id: randomChoice(patientIds),
      claim_number: `CLM-${String(2026000 + i).padStart(7, "0")}`,
      insurance_provider: randomChoice(carriers),
      status,
      procedure_codes: randomChoice(procedures),
      billed_amount: billedAmount,
      insurance_paid: insurancePaid,
      patient_responsibility: patientResp,
      adjustment,
      submitted_at: submittedAt,
      paid_at: paidAt,
      denial_reason: denialReason,
      aging_days: Math.max(0, agingDays),
      created_at: createdAt,
    });
  }

  const { error: claimErr } = await supabase.from("oe_billing_claims").insert(claims);
  if (claimErr) errors.push(`Claims: ${claimErr.message}`);
  else inserted.oe_billing_claims = claims.length;

  // 2. Daily Metrics (6 months)
  await supabase.from("oe_daily_metrics").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const metrics: Record<string, unknown>[] = [];
  for (let d = 180; d >= 0; d--) {
    const date = daysAgo(d);
    const dayOfWeek = new Date(date + "T12:00:00").getDay();
    if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) continue;

    const growthFactor = 1 + (180 - d) * 0.001;
    const newLeads = randomBetween(1, 5);
    const appointmentsScheduled = randomBetween(4, 10);
    const baseProduction = randomBetween(3500, 9000);
    const production = Math.round(baseProduction * growthFactor);
    const aiActionsTaken = randomBetween(4, 15);
    const claimsSubmitted = randomBetween(2, 6);

    metrics.push({
      date,
      new_leads: newLeads,
      leads_converted: randomBetween(0, Math.min(newLeads, 2)),
      appointments_scheduled: appointmentsScheduled,
      appointments_completed: randomBetween(Math.round(appointmentsScheduled * 0.7), appointmentsScheduled),
      no_shows: randomBetween(0, 2),
      cancellations: randomBetween(0, 1),
      production,
      collections: Math.round(production * randomFloat(0.85, 0.98)),
      claims_submitted: claimsSubmitted,
      claims_paid: randomBetween(1, claimsSubmitted),
      claims_denied: randomBetween(0, 1),
      ai_actions_taken: aiActionsTaken,
      ai_actions_approved: randomBetween(Math.round(aiActionsTaken * 0.8), aiActionsTaken),
      avg_lead_response_seconds: randomBetween(20, 120),
      patient_messages_sent: randomBetween(5, 20),
      patient_messages_received: randomBetween(2, 10),
    });
  }

  // Batch insert metrics
  let metricsInserted = 0;
  for (let i = 0; i < metrics.length; i += 50) {
    const batch = metrics.slice(i, i + 50);
    const { error } = await supabase.from("oe_daily_metrics").insert(batch);
    if (error) errors.push(`Metrics batch ${i}: ${error.message}`);
    else metricsInserted += batch.length;
  }
  inserted.oe_daily_metrics = metricsInserted;

  // 3. Monthly Expenses
  await supabase.from("oe_monthly_expenses").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toISOString().split("T")[0]);
  }

  const expenseTemplate = [
    { label: "Payroll & Benefits", category: "Labor", baseAmount: 18500 },
    { label: "Dental Supplies", category: "Clinical", baseAmount: 3200 },
    { label: "Lab Fees", category: "Clinical", baseAmount: 4800 },
    { label: "Rent / Lease", category: "Overhead", baseAmount: 5500 },
    { label: "Equipment Leases", category: "Overhead", baseAmount: 1200 },
    { label: "Insurance (Practice)", category: "Overhead", baseAmount: 800 },
    { label: "Marketing", category: "Growth", baseAmount: 1500 },
    { label: "Utilities", category: "Overhead", baseAmount: 650 },
    { label: "Other / Miscellaneous", category: "Other", baseAmount: 450 },
  ];

  const expenses: Record<string, unknown>[] = [];
  for (const month of months) {
    for (const item of expenseTemplate) {
      const isFixed = ["Rent / Lease", "Equipment Leases", "Insurance (Practice)"].includes(item.label);
      const variance = isFixed ? 1.0 : 0.95 + Math.random() * 0.10;
      expenses.push({ month, label: item.label, category: item.category, amount: Math.round(item.baseAmount * variance * 100) / 100 });
    }
  }

  const { error: expErr } = await supabase.from("oe_monthly_expenses").insert(expenses);
  if (expErr) errors.push(`Expenses: ${expErr.message}`);
  else inserted.oe_monthly_expenses = expenses.length;

  // 4. Accounts Payable
  await supabase.from("oe_accounts_payable").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const ap = [
    { vendor: "Henry Schein", description: "Dental Supplies - Monthly Order", amount: 2340, due_date: daysAgo(-5), status: "due_soon" },
    { vendor: "Patterson Dental", description: "Lab Fees - Crown/Bridge", amount: 1850, due_date: daysAgo(-13), status: "upcoming" },
    { vendor: "Nevada Power Co.", description: "Utilities - Current Month", amount: 650, due_date: daysAgo(-2), status: "due_soon" },
    { vendor: "Benco Dental", description: "Gloves & PPE Restock", amount: 780, due_date: daysAgo(-20), status: "upcoming" },
    { vendor: "Google Ads", description: "Marketing - Monthly PPC", amount: 1200, due_date: daysAgo(-15), status: "upcoming" },
    { vendor: "Dentsply Sirona", description: "CEREC Materials", amount: 1420, due_date: daysAgo(-10), status: "upcoming" },
    { vendor: "ADP", description: "Payroll Processing", amount: 385, due_date: daysAgo(-15), status: "upcoming" },
    { vendor: "Yelp Business", description: "Advertising - Monthly", amount: 600, due_date: daysAgo(-25), status: "upcoming" },
  ];

  const { error: apErr } = await supabase.from("oe_accounts_payable").insert(ap);
  if (apErr) errors.push(`AP: ${apErr.message}`);
  else inserted.oe_accounts_payable = ap.length;

  return { inserted, errors };
}

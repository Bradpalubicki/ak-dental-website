// Dashboard data seed script - populates billing claims, daily metrics (6 months), and financial entries
// Run with: node scripts/seed-dashboard-data.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Parse .env.local manually (no dotenv dependency needed)
const envContent = readFileSync(".env.local", "utf-8");
const envVars = {};
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
}

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

const now = new Date();

function daysAgo(d) {
  return new Date(now.getTime() - d * 86400000).toISOString().split("T")[0];
}

function randomBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function randomFloat(min, max, decimals = 2) {
  return Number((min + Math.random() * (max - min)).toFixed(decimals));
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Patient IDs from seed-demo.mjs
const patientIds = [
  "a0000001-0000-0000-0000-000000000001",
  "a0000001-0000-0000-0000-000000000002",
  "a0000001-0000-0000-0000-000000000003",
  "a0000001-0000-0000-0000-000000000004",
  "a0000001-0000-0000-0000-000000000005",
  "a0000001-0000-0000-0000-000000000006",
  "a0000001-0000-0000-0000-000000000007",
  "a0000001-0000-0000-0000-000000000008",
  "a0000001-0000-0000-0000-000000000009",
  "a0000001-0000-0000-0000-000000000010",
  "a0000001-0000-0000-0000-000000000011",
  "a0000001-0000-0000-0000-000000000012",
];

const carriers = [
  "Delta Dental",
  "Cigna Dental",
  "MetLife Dental",
  "Aetna Dental",
  "Guardian Dental",
  "United Healthcare",
];

const denialReasons = [
  "Missing information",
  "Pre-authorization required",
  "Exceeds frequency limitation",
  "Not a covered benefit",
  "Patient not eligible",
  "Incorrect provider info",
];

const procedures = [
  [{ code: "D0150", description: "Comprehensive oral evaluation" }],
  [{ code: "D0120", description: "Periodic oral evaluation" }],
  [{ code: "D1110", description: "Prophylaxis - adult" }],
  [{ code: "D2740", description: "Crown - porcelain/ceramic" }],
  [{ code: "D2750", description: "Crown - porcelain fused to high noble metal" }],
  [{ code: "D2391", description: "Resin-based composite - one surface, posterior" }],
  [{ code: "D2392", description: "Resin-based composite - two surfaces, posterior" }],
  [{ code: "D6010", description: "Surgical placement - endosteal implant" }],
  [{ code: "D4341", description: "Periodontal scaling and root planing" }],
  [{ code: "D0210", description: "Intraoral - complete series" }],
  [{ code: "D0220", description: "Intraoral - periapical first radiographic image" }],
  [{ code: "D0274", description: "Bitewings - four radiographic images" }],
  [{ code: "D5110", description: "Complete denture - maxillary" }],
  [{ code: "D7210", description: "Extraction - surgical" }],
  [{ code: "D9310", description: "Consultation" }],
];

async function seed() {
  console.log("=== Seeding Dashboard Data ===\n");

  // ============================================================================
  // 1. BILLING CLAIMS (35 claims over 6 months)
  // ============================================================================
  console.log("Clearing existing billing claims...");
  await supabase
    .from("oe_billing_claims")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("Seeding billing claims...");
  const claims = [];
  const statuses = ["paid", "paid", "paid", "paid", "pending", "submitted", "denied", "appealed", "draft"];

  for (let i = 0; i < 35; i++) {
    const daysBack = randomBetween(0, 180);
    const createdAt = new Date(now.getTime() - daysBack * 86400000).toISOString();
    const status = randomChoice(statuses);
    const billedAmount = randomFloat(120, 3500);
    const carrier = randomChoice(carriers);
    const patientId = randomChoice(patientIds);

    let insurancePaid = 0;
    let patientResp = 0;
    let adjustment = 0;
    let paidAt = null;
    let submittedAt = null;
    let denialReason = null;
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
      agingDays = daysBack;
    } else if (status === "denied" || status === "appealed") {
      submittedAt = createdAt;
      denialReason = randomChoice(denialReasons);
      agingDays = daysBack;
    }

    const claimNumber = `CLM-${String(2026000 + i).padStart(7, "0")}`;

    claims.push({
      patient_id: patientId,
      claim_number: claimNumber,
      insurance_provider: carrier,
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
  if (claimErr) console.error("  Billing claims error:", claimErr.message);
  else console.log(`  Inserted ${claims.length} billing claims`);

  // ============================================================================
  // 2. DAILY METRICS (6 months of data)
  // ============================================================================
  console.log("\nClearing existing daily metrics...");
  await supabase
    .from("oe_daily_metrics")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("Seeding 6 months of daily metrics...");
  const metrics = [];
  // Generate metrics for ~180 days (weekdays only)
  for (let d = 180; d >= 0; d--) {
    const date = daysAgo(d);
    const dayOfWeek = new Date(date + "T12:00:00").getDay();
    // Skip weekends (the practice is closed Fri-Sun per settings, but let's do Mon-Thu)
    if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) continue;

    // Gradual growth trend
    const growthFactor = 1 + (180 - d) * 0.001; // slight growth over time

    const newLeads = randomBetween(1, 5);
    const leadsConverted = randomBetween(0, Math.min(newLeads, 2));
    const appointmentsScheduled = randomBetween(4, 10);
    const appointmentsCompleted = randomBetween(
      Math.round(appointmentsScheduled * 0.7),
      appointmentsScheduled
    );
    const noShows = randomBetween(0, 2);
    const cancellations = randomBetween(0, 1);
    const baseProduction = randomBetween(3500, 9000);
    const production = Math.round(baseProduction * growthFactor);
    const collections = Math.round(production * randomFloat(0.85, 0.98));
    const claimsSubmitted = randomBetween(2, 6);
    const claimsPaid = randomBetween(1, claimsSubmitted);
    const claimsDenied = randomBetween(0, 1);
    const aiActionsTaken = randomBetween(4, 15);
    const aiActionsApproved = randomBetween(
      Math.round(aiActionsTaken * 0.8),
      aiActionsTaken
    );

    metrics.push({
      date,
      new_leads: newLeads,
      leads_converted: leadsConverted,
      appointments_scheduled: appointmentsScheduled,
      appointments_completed: appointmentsCompleted,
      no_shows: noShows,
      cancellations,
      production,
      collections,
      claims_submitted: claimsSubmitted,
      claims_paid: claimsPaid,
      claims_denied: claimsDenied,
      ai_actions_taken: aiActionsTaken,
      ai_actions_approved: aiActionsApproved,
      avg_lead_response_seconds: randomBetween(20, 120),
      patient_messages_sent: randomBetween(5, 20),
      patient_messages_received: randomBetween(2, 10),
    });
  }

  // Insert in batches to avoid size limits
  const batchSize = 50;
  let insertedCount = 0;
  for (let i = 0; i < metrics.length; i += batchSize) {
    const batch = metrics.slice(i, i + batchSize);
    const { error } = await supabase.from("oe_daily_metrics").insert(batch);
    if (error) {
      console.error(`  Metrics batch error (${i}):`, error.message);
    } else {
      insertedCount += batch.length;
    }
  }
  console.log(`  Inserted ${insertedCount} days of daily metrics`);

  // ============================================================================
  // 3. MONTHLY EXPENSES (6 months)
  // ============================================================================
  console.log("\nClearing existing monthly expenses...");
  await supabase
    .from("oe_monthly_expenses")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("Seeding 6 months of expenses...");
  const months = [];
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

  const expenses = [];
  for (const month of months) {
    for (const item of expenseTemplate) {
      const isFixed = ["Rent / Lease", "Equipment Leases", "Insurance (Practice)"].includes(item.label);
      const variance = isFixed ? 1.0 : 0.95 + Math.random() * 0.10;
      expenses.push({
        month,
        label: item.label,
        category: item.category,
        amount: Math.round(item.baseAmount * variance * 100) / 100,
      });
    }
  }

  const { error: expErr } = await supabase.from("oe_monthly_expenses").insert(expenses);
  if (expErr) console.error("  Expenses error:", expErr.message);
  else console.log(`  Inserted ${expenses.length} expense records`);

  // ============================================================================
  // 4. ACCOUNTS PAYABLE
  // ============================================================================
  console.log("\nClearing existing accounts payable...");
  await supabase
    .from("oe_accounts_payable")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("Seeding accounts payable...");
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
  if (apErr) console.error("  AP error:", apErr.message);
  else console.log(`  Inserted ${ap.length} accounts payable records`);

  // ============================================================================
  // 5. Summary
  // ============================================================================
  const paidClaims = claims.filter((c) => c.status === "paid").length;
  const pendingClaims = claims.filter((c) => c.status === "pending" || c.status === "submitted").length;
  const deniedClaims = claims.filter((c) => c.status === "denied" || c.status === "appealed").length;

  console.log("\n=== Dashboard Data Seed Complete ===");
  console.log(`  ${claims.length} billing claims (${paidClaims} paid, ${pendingClaims} pending, ${deniedClaims} denied/appealed)`);
  console.log(`  ${insertedCount} days of daily metrics`);
  console.log(`  ${expenses.length} expense records (${months.length} months)`);
  console.log(`  ${ap.length} accounts payable records`);
}

seed().catch(console.error);

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Parse .env.local
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

async function seed() {
  console.log("Seeding financials data...");

  // Current month and past months for expense history
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toISOString().split("T")[0]);
  }

  // Expense template with slight monthly variance
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

  // Generate 6 months of expenses with slight variance
  const expenses = [];
  for (const month of months) {
    for (const item of expenseTemplate) {
      // Add +/- 5% variance per month (except fixed costs like rent)
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

  const { error: expError } = await supabase
    .from("oe_monthly_expenses")
    .upsert(expenses, { onConflict: "id" });

  if (expError) {
    console.error("Error seeding expenses:", expError.message);
  } else {
    console.log(`Seeded ${expenses.length} expense records (${months.length} months)`);
  }

  // Accounts payable
  const ap = [
    { vendor: "Henry Schein", description: "Dental Supplies - Monthly Order", amount: 2340, due_date: "2026-02-20", status: "due_soon" },
    { vendor: "Patterson Dental", description: "Lab Fees - Crown/Bridge", amount: 1850, due_date: "2026-02-28", status: "upcoming" },
    { vendor: "Nevada Power Co.", description: "Utilities - January", amount: 650, due_date: "2026-02-15", status: "due_soon" },
    { vendor: "Benco Dental", description: "Gloves & PPE Restock", amount: 780, due_date: "2026-03-05", status: "upcoming" },
    { vendor: "Google Ads", description: "Marketing - February PPC", amount: 1200, due_date: "2026-03-01", status: "upcoming" },
    { vendor: "Dentsply Sirona", description: "CEREC Materials", amount: 1420, due_date: "2026-02-25", status: "upcoming" },
    { vendor: "ADP", description: "Payroll Processing - February", amount: 385, due_date: "2026-03-01", status: "upcoming" },
    { vendor: "Yelp Business", description: "Advertising - February", amount: 600, due_date: "2026-03-10", status: "upcoming" },
  ];

  const { error: apError } = await supabase
    .from("oe_accounts_payable")
    .upsert(ap, { onConflict: "id" });

  if (apError) {
    console.error("Error seeding AP:", apError.message);
  } else {
    console.log(`Seeded ${ap.length} accounts payable records`);
  }

  console.log("Done!");
}

seed().catch(console.error);

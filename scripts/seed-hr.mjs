/**
 * Seed HR module demo data.
 * Pre-requisite: Run supabase/migrations/003_hr_module.sql in Supabase SQL editor first.
 * Usage: node scripts/seed-hr.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Parse .env.local (Windows-safe)
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  env[trimmed.substring(0, eqIdx).trim()] = trimmed.substring(eqIdx + 1).trim();
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// Demo employees
const employees = [
  {
    id: "e0000001-0000-0000-0000-000000000001",
    first_name: "Jessica",
    last_name: "Ramirez",
    email: "jessica.r@akultimatedental.com",
    phone: "(702) 555-0301",
    role: "hygienist",
    hire_date: "2023-03-15",
    status: "active",
  },
  {
    id: "e0000001-0000-0000-0000-000000000002",
    first_name: "Tyler",
    last_name: "Brooks",
    email: "tyler.b@akultimatedental.com",
    phone: "(702) 555-0302",
    role: "assistant",
    hire_date: "2024-01-08",
    status: "active",
  },
  {
    id: "e0000001-0000-0000-0000-000000000003",
    first_name: "Maria",
    last_name: "Santos",
    email: "maria.s@akultimatedental.com",
    phone: "(702) 555-0303",
    role: "front_desk",
    hire_date: "2022-09-01",
    status: "active",
  },
  {
    id: "e0000001-0000-0000-0000-000000000004",
    first_name: "Brandon",
    last_name: "Lee",
    email: "brandon.l@akultimatedental.com",
    phone: "(702) 555-0304",
    role: "assistant",
    hire_date: "2024-06-15",
    status: "active",
  },
  {
    id: "e0000001-0000-0000-0000-000000000005",
    first_name: "Samantha",
    last_name: "Wright",
    email: "samantha.w@akultimatedental.com",
    phone: "(702) 555-0305",
    role: "office_manager",
    hire_date: "2021-11-01",
    status: "active",
  },
];

console.log("Seeding employees...");
const { error: empError } = await supabase.from("oe_employees").upsert(employees, { onConflict: "id" });
if (empError) {
  console.error("Employee seed error:", empError.message);
  console.log("\nMake sure you run supabase/migrations/003_hr_module.sql in the Supabase SQL editor first.");
  process.exit(1);
}
console.log(`  Seeded ${employees.length} employees`);

// Demo HR documents
const hrDocuments = [
  {
    employee_id: employees[1].id,
    type: "coaching_note",
    title: "Coaching: Sterilization Protocol Reminder",
    content: "On February 3, 2026, Tyler was observed not following the full instrument sterilization protocol between patients. Specifically, the autoclave cycle was not completed before instruments were returned to the operatory.\n\nThis was addressed immediately. Tyler acknowledged the oversight and committed to following the complete protocol going forward.\n\nNo patient was at risk as the instruments were caught before use.\n\nAction Required: Tyler will complete a refresher on sterilization procedures by February 14, 2026.",
    severity: "info",
    status: "acknowledged",
    created_by: "Dr. Alex",
  },
  {
    employee_id: employees[3].id,
    type: "disciplinary",
    title: "Written Warning: Repeated Tardiness",
    content: "This is a formal written warning regarding repeated tardiness.\n\nBrandon has been late to his scheduled shift on the following dates:\n- January 15, 2026 — 12 minutes late\n- January 22, 2026 — 8 minutes late\n- January 29, 2026 — 15 minutes late\n- February 5, 2026 — 20 minutes late\n\nPrevious verbal warnings were given on January 15 and January 22.\n\nPer practice policy, continued tardiness may result in further disciplinary action up to and including termination.\n\nBrandon is expected to arrive on time for all scheduled shifts effective immediately.\n\nBy signing below, you acknowledge that you have received and read this written warning.",
    severity: "warning",
    status: "pending_signature",
    created_by: "Dr. Alex",
  },
  {
    employee_id: employees[0].id,
    type: "performance_review",
    title: "Annual Performance Review — 2025",
    content: "Employee: Jessica Ramirez\nRole: Hygienist\nReview Period: January 2025 – December 2025\n\nOverall Rating: Exceeds Expectations\n\nStrengths:\n- Patient satisfaction scores consistently above 95%\n- Completed additional CE credits in periodontal therapy and laser dentistry\n- Excellent clinical precision and attention to detail\n- Outstanding team collaboration and mentorship\n\nAreas for Growth:\n- Continue developing skills in expanded practice procedures\n- Take on mentorship role when new hygienist is hired\n\nGoals for 2026:\n- Mentor new hygienist during onboarding\n- Pursue advanced periodontal certification\n- Continue maintaining patient satisfaction above 95%\n\nComments: Jessica is a valued member of the AK Ultimate Dental team and consistently demonstrates professionalism and clinical excellence.",
    severity: "info",
    status: "acknowledged",
    created_by: "Dr. Alex",
  },
];

console.log("Seeding HR documents...");
const { data: insertedDocs, error: docError } = await supabase.from("oe_hr_documents").insert(hrDocuments).select("id, employee_id, status");
if (docError) {
  console.error("HR document seed error:", docError.message);
  process.exit(1);
}
console.log(`  Seeded ${insertedDocs.length} HR documents`);

// Add acknowledgments for acknowledged documents
const acknowledgedDocs = insertedDocs.filter(d => d.status === "acknowledged");
const acknowledgments = acknowledgedDocs.map(doc => ({
  document_id: doc.id,
  employee_id: doc.employee_id,
  acknowledgment_type: "signature",
  step_label: "Final Acknowledgment",
  typed_name: doc.employee_id === employees[1].id ? "Tyler Brooks" : "Jessica Ramirez",
}));

if (acknowledgments.length > 0) {
  const { error: ackError } = await supabase.from("oe_document_acknowledgments").insert(acknowledgments);
  if (ackError) {
    console.error("Acknowledgment seed error:", ackError.message);
  } else {
    console.log(`  Seeded ${acknowledgments.length} acknowledgments`);
  }
}

console.log("\nHR seed complete!");

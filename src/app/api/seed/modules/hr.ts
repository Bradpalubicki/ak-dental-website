import type { SupabaseClient } from "@supabase/supabase-js";

const employees = [
  { id: "e0000001-0000-0000-0000-000000000001", first_name: "Jessica", last_name: "Ramirez", email: "jessica.r@akultimatedental.com", phone: "(702) 555-0301", role: "hygienist", hire_date: "2023-03-15", status: "active" },
  { id: "e0000001-0000-0000-0000-000000000002", first_name: "Tyler", last_name: "Brooks", email: "tyler.b@akultimatedental.com", phone: "(702) 555-0302", role: "assistant", hire_date: "2024-01-08", status: "active" },
  { id: "e0000001-0000-0000-0000-000000000003", first_name: "Maria", last_name: "Santos", email: "maria.s@akultimatedental.com", phone: "(702) 555-0303", role: "front_desk", hire_date: "2022-09-01", status: "active" },
  { id: "e0000001-0000-0000-0000-000000000004", first_name: "Brandon", last_name: "Lee", email: "brandon.l@akultimatedental.com", phone: "(702) 555-0304", role: "assistant", hire_date: "2024-06-15", status: "active" },
  { id: "e0000001-0000-0000-0000-000000000005", first_name: "Samantha", last_name: "Wright", email: "samantha.w@akultimatedental.com", phone: "(702) 555-0305", role: "office_manager", hire_date: "2021-11-01", status: "active" },
];

export async function seedHr(supabase: SupabaseClient) {
  const inserted: Record<string, number> = {};
  const errors: string[] = [];

  const { error: empError } = await supabase.from("oe_employees").upsert(employees, { onConflict: "id" });
  if (empError) {
    errors.push(`Employees: ${empError.message}`);
    return { inserted, errors };
  }
  inserted.oe_employees = employees.length;

  // HR documents
  const hrDocuments = [
    {
      employee_id: employees[1].id,
      type: "coaching_note",
      title: "Coaching: Sterilization Protocol Reminder",
      content: "On February 3, 2026, Tyler was observed not following the full instrument sterilization protocol between patients. This was addressed immediately. Tyler acknowledged the oversight and committed to following the complete protocol going forward.\n\nAction Required: Tyler will complete a refresher on sterilization procedures by February 14, 2026.",
      severity: "info",
      status: "acknowledged",
      created_by: "Dr. Alex Khachaturian",
    },
    {
      employee_id: employees[3].id,
      type: "disciplinary",
      title: "Written Warning: Repeated Tardiness",
      content: "This is a formal written warning regarding repeated tardiness.\n\nBrandon has been late on:\n- January 15, 2026 — 12 minutes late\n- January 22, 2026 — 8 minutes late\n- January 29, 2026 — 15 minutes late\n- February 5, 2026 — 20 minutes late\n\nContinued tardiness may result in further disciplinary action up to and including termination.",
      severity: "warning",
      status: "pending_signature",
      created_by: "Dr. Alex Khachaturian",
    },
    {
      employee_id: employees[0].id,
      type: "performance_review",
      title: "Annual Performance Review — 2025",
      content: "Employee: Jessica Ramirez\nRole: Hygienist\nOverall Rating: Exceeds Expectations\n\nStrengths:\n- Patient satisfaction scores consistently above 95%\n- Completed additional CE credits\n- Outstanding team collaboration\n\nGoals for 2026:\n- Mentor new hygienist during onboarding\n- Pursue advanced periodontal certification",
      severity: "info",
      status: "acknowledged",
      created_by: "Dr. Alex Khachaturian",
    },
  ];

  const { data: insertedDocs, error: docError } = await supabase.from("oe_hr_documents").insert(hrDocuments).select("id, employee_id, status");
  if (docError) {
    errors.push(`HR documents: ${docError.message}`);
  } else {
    inserted.oe_hr_documents = insertedDocs.length;

    // Add acknowledgments for acknowledged documents
    const acknowledgedDocs = insertedDocs.filter((d: { status: string }) => d.status === "acknowledged");
    const acknowledgments = acknowledgedDocs.map((doc: { id: string; employee_id: string }) => ({
      document_id: doc.id,
      employee_id: doc.employee_id,
      acknowledgment_type: "signature",
      step_label: "Final Acknowledgment",
      typed_name: doc.employee_id === employees[1].id ? "Tyler Brooks" : "Jessica Ramirez",
    }));

    if (acknowledgments.length > 0) {
      const { error: ackError } = await supabase.from("oe_document_acknowledgments").insert(acknowledgments);
      if (ackError) errors.push(`Acknowledgments: ${ackError.message}`);
      else inserted.oe_document_acknowledgments = acknowledgments.length;
    }
  }

  return { inserted, errors };
}

import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/api-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await requirePermission("benefits.edit");
  if (!check.allowed) return check.response!;

  const { id } = await params;
  const supabase = createServiceSupabase();
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  const fields = [
    "benefit_type", "plan_name", "carrier_name", "policy_number",
    "group_number", "monthly_premium", "employer_contribution",
    "employee_contribution", "coverage_tier", "enrollment_status",
    "effective_date", "termination_date", "ichra_allowance_monthly", "notes",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) updates[f] = body[f];
  }

  const { data, error } = await supabase
    .from("oe_employee_benefit_enrollments")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await requirePermission("benefits.delete");
  if (!check.allowed) return check.response!;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { error } = await supabase
    .from("oe_employee_benefit_enrollments")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete enrollment" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const check = await requirePermission("benefits.view");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();
  const employeeId = req.nextUrl.searchParams.get("employee_id");

  let query = supabase
    .from("oe_employee_benefit_enrollments")
    .select("*, employee:oe_employees(first_name, last_name)")
    .order("created_at", { ascending: false });

  if (employeeId) {
    query = query.eq("employee_id", employeeId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const check = await requirePermission("benefits.edit");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();
  const body = await req.json();

  const { data, error } = await supabase
    .from("oe_employee_benefit_enrollments")
    .insert({
      employee_id: body.employee_id,
      benefit_type: body.benefit_type,
      plan_name: body.plan_name || null,
      carrier_name: body.carrier_name || null,
      policy_number: body.policy_number || null,
      group_number: body.group_number || null,
      monthly_premium: body.monthly_premium || null,
      employer_contribution: body.employer_contribution || null,
      employee_contribution: body.employee_contribution || null,
      coverage_tier: body.coverage_tier || null,
      enrollment_status: body.enrollment_status || "active",
      effective_date: body.effective_date || null,
      termination_date: body.termination_date || null,
      ichra_allowance_monthly: body.ichra_allowance_monthly || null,
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

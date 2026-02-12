import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const check = await requirePermission("hr.view");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();
  const employeeId = req.nextUrl.searchParams.get("employee_id");
  const status = req.nextUrl.searchParams.get("status");
  const includeDeleted =
    req.nextUrl.searchParams.get("include_deleted") === "true";

  let query = supabase
    .from("oe_employee_certifications")
    .select("*, employee:oe_employees(first_name, last_name)")
    .order("expiration_date", { ascending: true });

  if (!includeDeleted) {
    query = query.is("deleted_at", null);
  }
  if (employeeId) query = query.eq("employee_id", employeeId);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const check = await requirePermission("hr.edit");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();
  const body = await req.json();

  const { data, error } = await supabase
    .from("oe_employee_certifications")
    .insert({
      employee_id: body.employee_id,
      certification_type: body.certification_type || "certification",
      name: body.name,
      issuing_organization: body.issuing_organization || null,
      credential_number: body.credential_number || null,
      effective_date: body.effective_date || null,
      expiration_date: body.expiration_date || null,
      renewal_frequency: body.renewal_frequency || null,
      status: body.status || "current",
      ce_hours: body.ce_hours || null,
      cost: body.cost || null,
      auto_lookup_enabled: body.auto_lookup_enabled || false,
      auto_lookup_url: body.auto_lookup_url || null,
      notes: body.notes || null,
      metadata: body.metadata || {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

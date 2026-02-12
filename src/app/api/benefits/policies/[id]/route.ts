import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/api-auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await requirePermission("benefits.view");
  if (!check.allowed) return check.response!;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("oe_business_insurance_policies")
    .select("*, documents:oe_policy_documents(*)")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Policy not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

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
    "policy_type", "carrier_name", "policy_number", "coverage_amount",
    "deductible", "annual_premium", "monthly_premium", "effective_date",
    "expiration_date", "renewal_date", "status", "agent_name",
    "agent_phone", "agent_email", "broker_company", "auto_renew", "notes",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) updates[f] = body[f];
  }

  const { data, error } = await supabase
    .from("oe_business_insurance_policies")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update policy" }, { status: 500 });
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

  const { data, error } = await supabase
    .from("oe_business_insurance_policies")
    .update({ status: "cancelled" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to cancel policy" }, { status: 500 });
  }

  return NextResponse.json(data);
}

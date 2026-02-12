import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/api-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await requirePermission("hr.edit");
  if (!check.allowed) return check.response!;

  const { id } = await params;
  const supabase = createServiceSupabase();
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  const allowedFields = [
    "certification_type", "name", "issuing_organization",
    "credential_number", "effective_date", "expiration_date",
    "renewal_frequency", "status", "ce_hours", "cost",
    "auto_lookup_enabled", "auto_lookup_url", "notes",
  ];
  for (const f of allowedFields) {
    if (body[f] !== undefined) updates[f] = body[f];
  }

  if (body.restore === true) {
    updates.deleted_at = null;
  }

  const { data, error } = await supabase
    .from("oe_employee_certifications")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await requirePermission("hr.delete");
  if (!check.allowed) return check.response!;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("oe_employee_certifications")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }

  return NextResponse.json(data);
}

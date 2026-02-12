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
    "filing_type", "title", "filing_entity", "jurisdiction",
    "filing_number", "status", "effective_date", "expiration_date",
    "renewal_frequency", "cost", "responsible_party", "notes",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) updates[f] = body[f];
  }

  const { data, error } = await supabase
    .from("oe_corporate_filings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update filing" }, { status: 500 });
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
    .from("oe_corporate_filings")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete filing" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

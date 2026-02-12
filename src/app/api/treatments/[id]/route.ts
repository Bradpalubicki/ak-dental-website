import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("oe_treatment_plans")
    .select("*, patient:oe_patients(*)")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: "Treatment plan not found" }, { status: 404 });
  return NextResponse.json({ plan: data });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();
  const body = await req.json();

  const allowedFields = [
    "title", "status", "procedures", "total_cost", "insurance_estimate",
    "patient_estimate", "ai_summary", "notes", "decline_reason",
  ];
  const updates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (body.status === "accepted") updates.accepted_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("oe_treatment_plans")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("oe_treatment_plans")
    .update({ deleted_at: new Date().toISOString(), deleted_by: authResult.userName || authResult.userId })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Treatment plan moved to trash", data });
}

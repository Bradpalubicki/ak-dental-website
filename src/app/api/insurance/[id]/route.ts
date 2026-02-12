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
    .from("oe_insurance_verifications")
    .select(
      "*, patient:oe_patients(first_name, last_name, phone, email), appointment:oe_appointments(appointment_date, appointment_time)"
    )
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: "Verification not found" }, { status: 404 });
  return NextResponse.json(data);
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
    "insurance_provider", "member_id", "group_number", "status", "coverage_type",
    "deductible", "deductible_met", "annual_maximum", "annual_used",
    "preventive_coverage", "basic_coverage", "major_coverage", "orthodontic_coverage",
    "flags", "verified_by", "verified_at", "notes",
  ];
  const updates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (body.status === "verified" && !body.verified_at) {
    updates.verified_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("oe_insurance_verifications")
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
    .from("oe_insurance_verifications")
    .update({ deleted_at: new Date().toISOString(), deleted_by: authResult.userName || authResult.userId })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Verification moved to trash", data });
}

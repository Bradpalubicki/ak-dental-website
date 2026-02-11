import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const status = req.nextUrl.searchParams.get("status");
  const patientId = req.nextUrl.searchParams.get("patient_id");
  const deleted = req.nextUrl.searchParams.get("deleted");

  let query = supabase
    .from("oe_insurance_verifications")
    .select(
      "*, patient:oe_patients(first_name, last_name), appointment:oe_appointments(appointment_date, appointment_time)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (deleted === "true") {
    query = query.not("deleted_at", "is", null);
  } else {
    query = query.is("deleted_at", null);
  }

  if (status) query = query.eq("status", status);
  if (patientId) query = query.eq("patient_id", patientId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const body = await req.json();

  const { data, error } = await supabase
    .from("oe_insurance_verifications")
    .insert({
      patient_id: body.patient_id,
      appointment_id: body.appointment_id || null,
      insurance_provider: body.insurance_provider,
      member_id: body.member_id,
      group_number: body.group_number || null,
      status: body.status || "pending",
      coverage_type: body.coverage_type || null,
      deductible: body.deductible || null,
      deductible_met: body.deductible_met || null,
      annual_maximum: body.annual_maximum || null,
      annual_used: body.annual_used || null,
      preventive_coverage: body.preventive_coverage || null,
      basic_coverage: body.basic_coverage || null,
      major_coverage: body.major_coverage || null,
      flags: body.flags || [],
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

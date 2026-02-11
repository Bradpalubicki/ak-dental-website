import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const patientId = req.nextUrl.searchParams.get("patient_id");
  const status = req.nextUrl.searchParams.get("status");
  const deleted = req.nextUrl.searchParams.get("deleted");

  let query = supabase
    .from("oe_treatment_plans")
    .select("*, patient:oe_patients(first_name, last_name, insurance_provider)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (deleted === "true") {
    query = query.not("deleted_at", "is", null);
  } else {
    query = query.is("deleted_at", null);
  }

  if (patientId) query = query.eq("patient_id", patientId);
  if (status) query = query.eq("status", status);

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
    .from("oe_treatment_plans")
    .insert({
      patient_id: body.patient_id,
      provider_name: body.provider_name || "AK Ultimate Dental",
      title: body.title,
      status: body.status || "draft",
      procedures: body.procedures || [],
      total_cost: body.total_cost || 0,
      insurance_estimate: body.insurance_estimate || 0,
      patient_estimate: body.patient_estimate || 0,
      ai_summary: body.ai_summary || null,
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

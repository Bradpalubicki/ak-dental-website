import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

const CreateTreatmentSchema = z.object({
  patient_id: z.string().uuid(),
  provider_name: z.string().max(200).default("AK Ultimate Dental"),
  title: z.string().min(1).max(200),
  status: z.enum(["draft", "presented", "accepted", "declined", "completed"]).default("draft"),
  procedures: z.array(z.unknown()).default([]),
  total_cost: z.number().min(0).default(0),
  insurance_estimate: z.number().min(0).default(0),
  patient_estimate: z.number().min(0).default(0),
  ai_summary: z.string().max(5000).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
});

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

  const parsed = CreateTreatmentSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("oe_treatment_plans")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

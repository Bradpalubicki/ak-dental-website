import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

const CreateInsuranceSchema = z.object({
  patient_id: z.string().uuid(),
  appointment_id: z.string().uuid().optional().nullable(),
  insurance_provider: z.string().min(1).max(200),
  member_id: z.string().min(1).max(100),
  group_number: z.string().max(100).optional().nullable(),
  status: z.enum(["pending", "verified", "failed", "expired"]).default("pending"),
  coverage_type: z.string().max(100).optional().nullable(),
  deductible: z.number().min(0).optional().nullable(),
  deductible_met: z.number().min(0).optional().nullable(),
  annual_maximum: z.number().min(0).optional().nullable(),
  annual_used: z.number().min(0).optional().nullable(),
  preventive_coverage: z.number().min(0).max(100).optional().nullable(),
  basic_coverage: z.number().min(0).max(100).optional().nullable(),
  major_coverage: z.number().min(0).max(100).optional().nullable(),
  flags: z.array(z.string()).default([]),
  notes: z.string().max(5000).optional().nullable(),
});

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

  const parsed = CreateInsuranceSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("oe_insurance_verifications")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

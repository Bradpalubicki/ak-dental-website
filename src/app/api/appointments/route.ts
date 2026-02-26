import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

const CreateAppointmentSchema = z.object({
  patient_id: z.string().uuid(),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointment_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  duration_minutes: z.number().int().min(5).max(480).default(60),
  type: z.string().min(1).max(100),
  provider_name: z.string().max(200).default("AK Ultimate Dental"),
  notes: z.string().max(5000).optional().nullable(),
});

// GET /api/appointments
export async function GET(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabase = createServiceSupabase();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const patientId = searchParams.get("patient_id");
    const deleted = searchParams.get("deleted");

    let query = supabase
      .from("oe_appointments")
      .select("*, oe_patients(first_name, last_name, phone, email)")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (deleted === "true") {
      query = query.not("deleted_at", "is", null);
    } else {
      query = query.is("deleted_at", null);
    }

    if (date) query = query.eq("appointment_date", date);
    if (status) query = query.eq("status", status);
    if (patientId) query = query.eq("patient_id", patientId);

    const { data, error } = await query.limit(200);
    if (error) throw error;

    return NextResponse.json({ appointments: data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/appointments
export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const parsed = CreateAppointmentSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_appointments")
      .insert({ ...parsed.data, status: "scheduled" })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ appointment: data }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

// GET /api/appointments
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceSupabase();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const patientId = searchParams.get("patient_id");

    let query = supabase
      .from("oe_appointments")
      .select("*, oe_patients(first_name, last_name, phone, email)")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (date) query = query.eq("appointment_date", date);
    if (status) query = query.eq("status", status);
    if (patientId) query = query.eq("patient_id", patientId);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ appointments: data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/appointments
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServiceSupabase();

    const {
      patient_id,
      appointment_date,
      appointment_time,
      duration_minutes,
      type,
      provider_name,
      notes,
    } = body;

    if (!patient_id || !appointment_date || !appointment_time || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("oe_appointments")
      .insert({
        patient_id,
        appointment_date,
        appointment_time,
        duration_minutes: duration_minutes || 60,
        type,
        provider_name: provider_name || "Dr. Alexandru Chireu",
        notes: notes || null,
        status: "scheduled",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ appointment: data }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

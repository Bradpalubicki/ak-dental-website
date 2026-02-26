import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

// GET /api/waitlist - List waitlist entries
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceSupabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const patientId = searchParams.get("patient_id");

    let query = supabase
      .from("oe_waitlist")
      .select("*, oe_patients(first_name, last_name, phone, email)")
      .order("created_at", { ascending: true });

    if (status) query = query.eq("status", status);
    if (patientId) query = query.eq("patient_id", patientId);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ waitlist: data });
  } catch (error) {
    console.error("[API] GET /api/waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to fetch waitlist" },
      { status: 500 }
    );
  }
}

// POST /api/waitlist - Add to waitlist
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServiceSupabase();

    const {
      patient_id,
      preferred_provider_id,
      appointment_type_id,
      preferred_days,
      preferred_time_start,
      preferred_time_end,
      urgency,
      notes,
    } = body;

    if (!patient_id) {
      return NextResponse.json(
        { error: "patient_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("oe_waitlist")
      .insert({
        patient_id,
        preferred_provider_id: preferred_provider_id || null,
        appointment_type_id: appointment_type_id || null,
        preferred_days: preferred_days || null,
        preferred_time_start: preferred_time_start || null,
        preferred_time_end: preferred_time_end || null,
        urgency: urgency || "normal",
        status: "waiting",
        notes: notes || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ waitlist_entry: data }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to add to waitlist" },
      { status: 500 }
    );
  }
}

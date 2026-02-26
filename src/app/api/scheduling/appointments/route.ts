import { NextRequest, NextResponse } from "next/server";
import { appointmentService } from "@/lib/scheduling/appointment-service";

// GET /api/scheduling/appointments - List appointments with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const appointments = await appointmentService.list({
      date: searchParams.get("date") || undefined,
      provider_id: searchParams.get("provider_id") || undefined,
      patient_id: searchParams.get("patient_id") || undefined,
      status: searchParams.get("status") || undefined,
      start_date: searchParams.get("start_date") || undefined,
      end_date: searchParams.get("end_date") || undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!, 10)
        : undefined,
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("[API] GET /api/scheduling/appointments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

// POST /api/scheduling/appointments - Create a new appointment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      patient_id,
      provider_id,
      appointment_type_id,
      resource_id,
      appointment_date,
      appointment_time,
      start_time,
      end_time,
      duration_minutes,
      type,
      booking_source,
      price,
      notes,
    } = body;

    if (!patient_id || !provider_id || !appointment_date || !appointment_time || !duration_minutes || !type) {
      return NextResponse.json(
        { error: "Missing required fields: patient_id, provider_id, appointment_date, appointment_time, duration_minutes, type" },
        { status: 400 }
      );
    }

    const appointment = await appointmentService.create({
      patient_id,
      provider_id,
      appointment_type_id: appointment_type_id || undefined,
      resource_id: resource_id || undefined,
      appointment_date,
      appointment_time,
      start_time: start_time || undefined,
      end_time: end_time || undefined,
      duration_minutes,
      type,
      booking_source: booking_source || undefined,
      price: price || undefined,
      notes: notes || undefined,
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/scheduling/appointments error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

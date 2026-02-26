import { NextRequest, NextResponse } from "next/server";
import { appointmentService } from "@/lib/scheduling/appointment-service";

// GET /api/scheduling/appointments/[id] - Get single appointment
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointment = await appointmentService.get(id);

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error("[API] GET /api/scheduling/appointments/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

// PATCH /api/scheduling/appointments/[id] - Update appointment status or details
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // If status is provided, use updateStatus; otherwise treat as general update
    const { status, ...extras } = body;

    if (!status && Object.keys(extras).length === 0) {
      return NextResponse.json(
        { error: "No update fields provided" },
        { status: 400 }
      );
    }

    const appointment = await appointmentService.updateStatus(
      id,
      status || "scheduled",
      extras
    );

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error("[API] PATCH /api/scheduling/appointments/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

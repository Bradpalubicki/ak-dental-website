import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/scheduling/availability";

// GET /api/scheduling/slots - Get available time slots for a date
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const providerId = searchParams.get("provider_id") || undefined;
    const appointmentTypeId = searchParams.get("appointment_type_id") || undefined;
    const duration = searchParams.get("duration")
      ? parseInt(searchParams.get("duration")!, 10)
      : undefined;

    if (!date) {
      return NextResponse.json(
        { error: "date query parameter is required (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const slots = await getAvailableSlots({
      date,
      providerId,
      appointmentTypeId,
      duration,
    });

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("[API] GET /api/scheduling/slots error:", error);
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}

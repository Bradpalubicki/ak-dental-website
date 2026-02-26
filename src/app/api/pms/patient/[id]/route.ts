import { NextRequest, NextResponse } from "next/server";
import { getPatientHistory, getPatient } from "@/lib/pms";

// GET /api/pms/patient/:id — Get patient info + history from PMS (mock)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [patient, history] = await Promise.all([
      getPatient(id),
      getPatientHistory(id),
    ]);

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      patient,
      history: history.appointments,
      last_procedures: history.last_procedures,
    });
  } catch (error) {
    console.error("[API] GET /api/pms/patient/:id error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient" },
      { status: 500 }
    );
  }
}

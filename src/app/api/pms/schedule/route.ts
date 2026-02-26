import { NextRequest, NextResponse } from "next/server";
import { getTodaysSchedule } from "@/lib/pms";

// GET /api/pms/schedule — Get today's schedule from PMS (mock)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || undefined;
    const providerId = searchParams.get("provider_id") || undefined;

    const result = await getTodaysSchedule(providerId, date);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] GET /api/pms/schedule error:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}

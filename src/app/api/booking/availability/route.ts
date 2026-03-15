import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

// GET /api/booking/availability?date=YYYY-MM-DD&type=new_patient|recall|other
// Public endpoint — no auth required
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const serviceType = searchParams.get("type") || "other";

    if (!date) {
      return NextResponse.json({ error: "date parameter is required" }, { status: 400 });
    }

    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
    }

    // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    // getDay() returns based on local time — use UTC to avoid timezone shifts
    const parts = date.split("-");
    const utcDate = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
    const dayOfWeek = utcDate.getUTCDay();

    const supabase = createServiceSupabase();

    // Get all active providers with their availability for this day of week
    const { data: providers, error: provError } = await supabase
      .from("oe_providers")
      .select("id, first_name, last_name, title")
      .eq("status", "active");

    if (provError) {
      return NextResponse.json({ error: provError.message }, { status: 500 });
    }

    if (!providers || providers.length === 0) {
      return NextResponse.json({
        slots: [],
        message: "No providers available. Please call us at (702) 935-4395.",
      });
    }

    // Get availability windows for this day of week
    const providerIds = providers.map((p) => p.id);
    const { data: availabilityWindows, error: avError } = await supabase
      .from("oe_provider_availability")
      .select("*")
      .in("provider_id", providerIds)
      .eq("day_of_week", dayOfWeek);

    if (avError) {
      return NextResponse.json({ error: avError.message }, { status: 500 });
    }

    if (!availabilityWindows || availabilityWindows.length === 0) {
      return NextResponse.json({
        slots: [],
        message: "No availability on this date. Please try another day or call (702) 935-4395.",
      });
    }

    // Get already-booked appointments for this date
    const { data: bookedApts } = await supabase
      .from("oe_appointments")
      .select("provider_id, appointment_time, duration_minutes")
      .eq("appointment_date", date)
      .in("status", ["scheduled", "confirmed"]);

    // Build a set of booked slots: "providerId::HH:MM"
    const bookedSet = new Set<string>();
    for (const apt of bookedApts || []) {
      if (apt.provider_id && apt.appointment_time) {
        // Block out the slot and any overlapping 30-min increments
        const [h, m] = (apt.appointment_time as string).split(":").map(Number);
        const startMin = h * 60 + m;
        const duration = apt.duration_minutes || 30;
        for (let offset = 0; offset < duration; offset += 30) {
          const blockMin = startMin + offset;
          const bh = Math.floor(blockMin / 60).toString().padStart(2, "0");
          const bm = (blockMin % 60).toString().padStart(2, "0");
          bookedSet.add(`${apt.provider_id}::${bh}:${bm}`);
        }
      }
    }

    // Generate slots
    const slots: Array<{
      providerId: string;
      providerName: string;
      date: string;
      time: string;
      durationMinutes: number;
      available: boolean;
    }> = [];

    const providerMap = new Map(providers.map((p) => [p.id, p]));

    for (const window of availabilityWindows) {
      const provider = providerMap.get(window.provider_id);
      if (!provider) continue;

      const [startH, startM] = (window.start_time as string).split(":").map(Number);
      const [endH, endM] = (window.end_time as string).split(":").map(Number);

      const startTotalMin = startH * 60 + startM;
      const endTotalMin = endH * 60 + endM;

      // Generate 30-minute slots
      for (let slotMin = startTotalMin; slotMin + 30 <= endTotalMin; slotMin += 30) {
        const slotH = Math.floor(slotMin / 60).toString().padStart(2, "0");
        const slotM = (slotMin % 60).toString().padStart(2, "0");
        const timeStr = `${slotH}:${slotM}`;

        const isBooked = bookedSet.has(`${window.provider_id}::${timeStr}`);

        if (!isBooked) {
          const providerName = [provider.title, provider.first_name, provider.last_name]
            .filter(Boolean)
            .join(" ");

          slots.push({
            providerId: window.provider_id,
            providerName,
            date,
            time: timeStr,
            durationMinutes: 30,
            available: true,
          });
        }
      }
    }

    if (slots.length === 0) {
      return NextResponse.json({
        slots: [],
        message: "No availability on this date. Please try another day or call (702) 935-4395.",
      });
    }

    // Sort by time
    slots.sort((a, b) => a.time.localeCompare(b.time));

    return NextResponse.json({ slots, serviceType });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

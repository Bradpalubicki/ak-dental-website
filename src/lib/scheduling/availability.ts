import { createServiceSupabase } from "@/lib/supabase/server";
import { getVerticalConfig } from "@/config";
import { generateSlots } from "./slots";
import { removeConflictingSlots } from "./conflicts";
import type { TimeSlot } from "@/types/database";

interface GetSlotsParams {
  date: string; // YYYY-MM-DD
  providerId?: string;
  appointmentTypeId?: string;
  duration?: number; // override default
}

export async function getAvailableSlots(params: GetSlotsParams): Promise<TimeSlot[]> {
  const supabase = createServiceSupabase();
  const vertical = getVerticalConfig();
  const schedulingConfig = vertical.scheduling;

  const dayOfWeek = new Date(params.date).getDay(); // 0=Sunday

  // 1. Get appointment type details if specified
  let duration = params.duration || schedulingConfig.defaultDuration;
  let buffer = schedulingConfig.bufferBetween;

  if (params.appointmentTypeId) {
    const { data: apptType } = await supabase
      .from("oe_appointment_types")
      .select("*")
      .eq("id", params.appointmentTypeId)
      .single();

    if (apptType) {
      duration = apptType.duration_minutes;
      buffer = apptType.buffer_after_minutes || buffer;
    }
  }

  // 2. Get provider availability for this day
  let availQuery = supabase
    .from("oe_provider_availability")
    .select("*, provider:oe_providers(*)")
    .eq("day_of_week", dayOfWeek);

  if (params.providerId) {
    availQuery = availQuery.eq("provider_id", params.providerId);
  }

  const { data: availability } = await availQuery;
  if (!availability?.length) return [];

  // 3. Get time-off blocks for this date
  const dateStart = `${params.date}T00:00:00`;
  const dateEnd = `${params.date}T23:59:59`;

  const providerIds = [...new Set(availability.map((a) => a.provider_id))];

  const { data: timeOff } = await supabase
    .from("oe_provider_time_off")
    .select("*")
    .in("provider_id", providerIds)
    .eq("status", "approved")
    .lte("start_datetime", dateEnd)
    .gte("end_datetime", dateStart);

  // 4. Get existing appointments for this date
  const { data: existingAppts } = await supabase
    .from("oe_appointments")
    .select("start_time, end_time, provider_id, resource_id")
    .eq("appointment_date", params.date)
    .not("status", "in", '("cancelled","rescheduled")');

  // Build bookings from existing appointments + time off
  const bookings = [
    ...(existingAppts || [])
      .filter((a) => a.start_time && a.end_time)
      .map((a) => ({
        start: a.start_time,
        end: a.end_time,
        provider_id: a.provider_id || "",
        resource_id: a.resource_id || undefined,
      })),
    ...(timeOff || []).map((t) => ({
      start: t.start_datetime,
      end: t.end_datetime,
      provider_id: t.provider_id,
    })),
  ];

  // 5. Generate slots per provider availability window
  let allSlots: TimeSlot[] = [];

  for (const avail of availability) {
    const provider = avail.provider as { id: string; first_name: string; last_name: string; status: string } | null;
    if (!provider || provider.status !== "active") continue;

    const slots = generateSlots({
      date: params.date,
      startTime: avail.start_time,
      endTime: avail.end_time,
      duration,
      buffer,
      increment: schedulingConfig.slotIncrement,
      providerId: avail.provider_id,
      providerName: `${provider.first_name} ${provider.last_name}`,
      appointmentTypeId: params.appointmentTypeId,
    });

    allSlots = [...allSlots, ...slots];
  }

  // 6. Remove conflicting slots
  return removeConflictingSlots(allSlots, bookings).filter((s) => s.available);
}

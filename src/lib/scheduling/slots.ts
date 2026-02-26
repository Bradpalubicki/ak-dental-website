import type { TimeSlot } from "@/types/database";

interface SlotGenerationParams {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  duration: number; // minutes
  buffer: number; // minutes after each slot
  increment: number; // minutes between slot starts
  providerId: string;
  providerName: string;
  resourceId?: string;
  resourceName?: string;
  appointmentTypeId?: string;
}

export function generateSlots(params: SlotGenerationParams): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [startH, startM] = params.startTime.split(":").map(Number);
  const [endH, endM] = params.endTime.split(":").map(Number);

  const dayStart = startH * 60 + startM;
  const dayEnd = endH * 60 + endM;
  const slotLength = params.duration + params.buffer;

  for (let mins = dayStart; mins + params.duration <= dayEnd; mins += params.increment) {
    const slotStart = new Date(`${params.date}T${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}:00`);
    const slotEnd = new Date(slotStart.getTime() + slotLength * 60 * 1000);

    slots.push({
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
      provider_id: params.providerId,
      provider_name: params.providerName,
      resource_id: params.resourceId,
      resource_name: params.resourceName,
      appointment_type_id: params.appointmentTypeId,
      available: true,
    });
  }

  return slots;
}

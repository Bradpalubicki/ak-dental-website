import type { TimeSlot } from "@/types/database";

interface Booking {
  start: string; // ISO datetime
  end: string;
  provider_id: string;
  resource_id?: string;
}

export function checkConflicts(
  slot: TimeSlot,
  existingBookings: Booking[]
): boolean {
  const slotStart = new Date(slot.start).getTime();
  const slotEnd = new Date(slot.end).getTime();

  return existingBookings.some((booking) => {
    if (booking.provider_id !== slot.provider_id) return false;

    const bookingStart = new Date(booking.start).getTime();
    const bookingEnd = new Date(booking.end).getTime();

    // Overlap: starts before end AND ends after start
    return slotStart < bookingEnd && slotEnd > bookingStart;
  });
}

export function removeConflictingSlots(
  slots: TimeSlot[],
  existingBookings: Booking[]
): TimeSlot[] {
  return slots.map((slot) => ({
    ...slot,
    available: !checkConflicts(slot, existingBookings),
  }));
}

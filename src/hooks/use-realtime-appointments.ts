"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface AppointmentRow {
  id: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: string;
  provider: string;
  insuranceVerified: boolean;
  eligibilityStatus: "verified" | "expired" | "unverified";
  confirmationSent: boolean;
  reminderSent: boolean;
  notes: string;
  patientName: string;
  patientPhone: string;
}

interface RawAppointmentRecord {
  id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  type: string;
  status: string;
  provider_name: string;
  insurance_verified: boolean;
  confirmation_sent: boolean;
  reminder_24h_sent: boolean;
  notes: string | null;
  deleted_at: string | null;
}

function toAppointmentRow(raw: RawAppointmentRecord): AppointmentRow {
  return {
    id: raw.id,
    date: raw.appointment_date,
    time: raw.appointment_time,
    duration: raw.duration_minutes,
    type: raw.type,
    status: raw.status,
    provider: raw.provider_name,
    insuranceVerified: raw.insurance_verified,
    eligibilityStatus: "unverified",
    confirmationSent: raw.confirmation_sent,
    reminderSent: raw.reminder_24h_sent,
    notes: raw.notes ?? "",
    patientName: "Patient",
    patientPhone: "",
  };
}

interface UseRealtimeAppointmentsOptions {
  onInsert: (row: AppointmentRow) => void;
  onUpdate: (row: AppointmentRow) => void;
  onDelete: (id: string) => void;
}

export function useRealtimeAppointments({
  onInsert,
  onUpdate,
  onDelete,
}: UseRealtimeAppointmentsOptions) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("realtime:oe_appointments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "oe_appointments" },
        (payload) => {
          const raw = payload.new as RawAppointmentRecord;
          if (!raw.deleted_at) {
            onInsert(toAppointmentRow(raw));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "oe_appointments" },
        (payload) => {
          const raw = payload.new as RawAppointmentRecord;
          if (raw.deleted_at) {
            // Soft-deleted — remove from list
            onDelete(raw.id);
          } else {
            onUpdate(toAppointmentRow(raw));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "oe_appointments" },
        (payload) => {
          const old = payload.old as { id: string };
          onDelete(old.id);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [onInsert, onUpdate, onDelete]);
}

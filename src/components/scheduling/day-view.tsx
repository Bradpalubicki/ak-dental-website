"use client";

import { useState, useEffect } from "react";
import { AppointmentCard } from "./appointment-card";

interface DentalAppointment {
  id: string;
  patient_id: string;
  patient_name?: string;
  provider_name: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  type: string;
  status: string;
}

interface DayViewProps {
  date: string;
  onAppointmentClick?: (id: string) => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM – 6 PM

export function DayView({ date, onAppointmentClick }: DayViewProps) {
  const [appointments, setAppointments] = useState<DentalAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/scheduling/appointments?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments ?? data);
      }
      setLoading(false);
    }
    load();
  }, [date]);

  function getAppointmentsForHour(hour: number) {
    return appointments.filter((a) => {
      const [h] = a.appointment_time.split(":").map(Number);
      return h === hour;
    });
  }

  if (loading) {
    return <div className="py-8 text-center text-sm text-slate-400">Loading schedule...</div>;
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {HOURS.map((hour) => {
        const hourAppts = getAppointmentsForHour(hour);
        const timeLabel = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? "12:00 PM" : `${hour}:00 AM`;
        return (
          <div key={hour} className="flex border-b last:border-b-0 min-h-[60px]">
            <div className="w-20 shrink-0 px-2 py-1 text-xs text-slate-400 border-r bg-slate-50 flex items-start pt-2">
              {timeLabel}
            </div>
            <div className="flex-1 p-1 space-y-1">
              {hourAppts.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  id={appt.id}
                  patientName={appt.patient_name ?? appt.patient_id.slice(0, 8)}
                  providerName={appt.provider_name}
                  time={appt.appointment_time}
                  duration={appt.duration_minutes}
                  type={appt.type}
                  status={appt.status}
                  onClick={onAppointmentClick}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

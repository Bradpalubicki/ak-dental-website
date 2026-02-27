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

interface WeekViewProps {
  startDate: string; // YYYY-MM-DD (Monday)
  onAppointmentClick?: (id: string) => void;
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 7);

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function WeekView({ startDate, onAppointmentClick }: WeekViewProps) {
  const [appointments, setAppointments] = useState<DentalAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const endDate = weekDates[6];

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/scheduling/appointments?start_date=${startDate}&end_date=${endDate}`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments ?? data);
      }
      setLoading(false);
    }
    load();
  }, [startDate, endDate]);

  function getAppointments(date: string, hour: number) {
    return appointments.filter((a) => {
      const [h] = a.appointment_time.split(":").map(Number);
      return a.appointment_date === date && h === hour;
    });
  }

  if (loading) {
    return <div className="py-8 text-center text-sm text-slate-400">Loading schedule...</div>;
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Day headers */}
        <div className="flex border-b bg-slate-50">
          <div className="w-20 shrink-0 px-2 py-2 text-xs font-medium text-slate-400 border-r" />
          {weekDates.map((date, i) => {
            const d = new Date(date);
            const isToday = date === new Date().toISOString().split("T")[0];
            return (
              <div
                key={date}
                className={`flex-1 px-2 py-2 text-center text-xs font-medium border-r last:border-r-0 ${
                  isToday ? "bg-cyan-50 text-cyan-700" : "text-slate-500"
                }`}
              >
                <div>{DAY_NAMES[i]}</div>
                <div className={`text-lg font-bold ${isToday ? "text-cyan-600" : "text-slate-800"}`}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        {HOURS.map((hour) => {
          const timeLabel = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? "12:00 PM" : `${hour}:00 AM`;
          return (
            <div key={hour} className="flex border-b last:border-b-0 min-h-[50px]">
              <div className="w-20 shrink-0 px-2 py-1 text-xs text-slate-400 border-r bg-slate-50 pt-1">
                {timeLabel}
              </div>
              {weekDates.map((date) => {
                const appts = getAppointments(date, hour);
                return (
                  <div key={date} className="flex-1 border-r last:border-r-0 p-0.5 space-y-0.5">
                    {appts.map((appt) => (
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
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

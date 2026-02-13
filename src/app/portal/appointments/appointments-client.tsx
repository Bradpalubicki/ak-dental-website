"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Shield,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  type: string;
  status: string;
  provider_name: string;
  duration_minutes: number;
  notes: string | null;
  insurance_verified: boolean;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  scheduled: { label: "Scheduled", color: "bg-blue-50 text-blue-700 border-blue-200", icon: CalendarDays },
  confirmed: { label: "Confirmed", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  completed: { label: "Completed", color: "bg-slate-100 text-slate-600 border-slate-200", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-600 border-red-200", icon: XCircle },
  no_show: { label: "Missed", color: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertCircle },
  rescheduled: { label: "Rescheduled", color: "bg-purple-50 text-purple-700 border-purple-200", icon: CalendarDays },
  checked_in: { label: "Checked In", color: "bg-cyan-50 text-cyan-700 border-cyan-200", icon: CheckCircle2 },
  in_progress: { label: "In Progress", color: "bg-cyan-50 text-cyan-700 border-cyan-200", icon: Clock },
};

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

export function AppointmentsClient({ appointments }: { appointments: Appointment[] }) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const today = new Date().toISOString().split("T")[0];
  const filtered = appointments.filter((a) => {
    if (filter === "upcoming") return a.appointment_date >= today;
    if (filter === "past") return a.appointment_date < today;
    return true;
  });

  const upcoming = appointments.filter((a) => a.appointment_date >= today);
  const past = appointments.filter((a) => a.appointment_date < today);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="mt-1 text-sm text-slate-500">
            {upcoming.length} upcoming &middot; {past.length} completed
          </p>
        </div>
        <Link
          href="/appointment"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-700 transition-colors"
        >
          <CalendarDays className="h-4 w-4" />
          Book New Appointment
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-100/80 p-1">
        {(["all", "upcoming", "past"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all",
              filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Filter className="h-3 w-3" />
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold">
              {f === "all" ? appointments.length : f === "upcoming" ? upcoming.length : past.length}
            </span>
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No appointments found</p>
            <Link href="/appointment" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-cyan-600 hover:underline">
              Book your first appointment <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          filtered.map((apt) => {
            const config = statusConfig[apt.status] || statusConfig.scheduled;
            const StatusIcon = config.icon;
            const isPast = apt.appointment_date < today;

            return (
              <div
                key={apt.id}
                className={cn(
                  "rounded-xl border bg-white p-5 transition-colors",
                  isPast ? "border-slate-100 opacity-75" : "border-slate-200 hover:border-cyan-200"
                )}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                      <span className="text-[9px] font-bold uppercase">
                        {new Date(apt.appointment_date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-lg font-bold leading-none">
                        {new Date(apt.appointment_date + "T00:00:00").getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{apt.type}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(apt.appointment_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(apt.appointment_time)} ({apt.duration_minutes} min)
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] text-slate-400">{apt.provider_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {apt.insurance_verified && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        <Shield className="h-3 w-3" /> Insurance Verified
                      </span>
                    )}
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", config.color)}>
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

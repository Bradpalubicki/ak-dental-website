"use client";

import { Calendar, CalendarPlus, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { DashboardData } from "../dashboard-types";
import { formatTime, statusConfig } from "../dashboard-utils";

export function AppointmentsWidget({ data }: { data: DashboardData }) {
  if (data.appointments.length === 0) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-center">
          <Calendar className="mx-auto h-8 w-8 text-cyan-200 mb-2" />
          <p className="text-sm font-medium text-slate-500">
            No appointments scheduled
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
            Schedule a patient to get started
          </p>
          <Link
            href="/dashboard/appointments"
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-700 transition-colors"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            Schedule Appointment
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-1">
      {data.appointments.slice(0, 8).map((apt) => {
        const sc = statusConfig[apt.status] || statusConfig.scheduled;
        const isUnconfirmed = apt.status === "scheduled";
        return (
          <div
            key={apt.id}
            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors"
          >
            <span className="text-[11px] font-bold text-slate-500 w-16 shrink-0">
              {formatTime(apt.time)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {apt.patientName}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">
                {apt.type.replace(/_/g, " ")}
              </p>
            </div>
            {isUnconfirmed ? (
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href="/dashboard/appointments"
                  className="rounded-md bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700 hover:bg-emerald-200 transition-colors"
                >
                  Confirm
                </a>
                <a
                  href="/dashboard/appointments"
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  Reschedule
                </a>
              </div>
            ) : (
              <span
                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-semibold ring-1 ring-inset ${sc.color}`}
              >
                {sc.label}
              </span>
            )}
          </div>
        );
      })}
      <a
        href="/dashboard/appointments"
        className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors"
      >
        View all <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}

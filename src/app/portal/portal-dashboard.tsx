"use client";

import Link from "next/link";
import {
  CalendarDays,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Stethoscope,
  Mail,
  Phone,
  CreditCard,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PortalDashboardProps {
  patientName: string;
  upcomingAppointments: {
    id: string;
    appointment_date: string;
    appointment_time: string;
    type: string;
    status: string;
    provider_name: string;
    duration_minutes: number;
  }[];
  recentTreatments: {
    id: string;
    title: string;
    status: string;
    total_cost: number;
    patient_estimate: number;
    insurance_estimate: number;
    created_at: string;
  }[];
  recentMessages: {
    id: string;
    subject: string | null;
    channel: string;
    sent_at: string;
    status: string;
  }[];
  stats: {
    upcomingCount: number;
    completedVisits: number;
    activeTreatments: number;
    lastVisit: string | null;
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-slate-50 text-slate-600 border-slate-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
  presented: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  declined: "bg-red-50 text-red-600 border-red-200",
};

export function PortalDashboard({
  patientName,
  upcomingAppointments,
  recentTreatments,
  recentMessages,
  stats,
}: PortalDashboardProps) {
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {greeting}, {patientName}!
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here is a summary of your dental care
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <CalendarDays className="h-5 w-5 text-cyan-600 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.upcomingCount}</p>
          <p className="text-xs text-slate-500">Upcoming Appointments</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.completedVisits}</p>
          <p className="text-xs text-slate-500">Completed Visits</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <FileText className="h-5 w-5 text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.activeTreatments}</p>
          <p className="text-xs text-slate-500">Active Treatments</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Clock className="h-5 w-5 text-amber-600 mb-2" />
          <p className="text-2xl font-bold text-slate-900">
            {stats.lastVisit ? formatDate(stats.lastVisit) : "—"}
          </p>
          <p className="text-xs text-slate-500">Last Visit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-cyan-600" />
              <h2 className="text-sm font-semibold text-slate-900">Upcoming Appointments</h2>
            </div>
            <Link href="/portal/appointments" className="text-xs font-medium text-cyan-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {upcomingAppointments.length === 0 ? (
              <div className="p-8 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">No upcoming appointments</p>
                <Link href="/appointment" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-cyan-600 hover:underline">
                  Book an appointment <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                      <span className="text-[10px] font-bold uppercase">
                        {new Date(apt.appointment_date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-sm font-bold leading-none">
                        {new Date(apt.appointment_date + "T00:00:00").getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{apt.type}</p>
                      <p className="text-[10px] text-slate-500">
                        {formatTime(apt.appointment_time)} &middot; {apt.duration_minutes} min &middot; {apt.provider_name}
                      </p>
                    </div>
                  </div>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", statusColors[apt.status] || statusColors.scheduled)}>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Treatment Plans */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-purple-600" />
              <h2 className="text-sm font-semibold text-slate-900">Treatment Plans</h2>
            </div>
            <Link href="/portal/treatments" className="text-xs font-medium text-cyan-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentTreatments.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">No treatment plans yet</p>
              </div>
            ) : (
              recentTreatments.slice(0, 4).map((tp) => (
                <div key={tp.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{tp.title}</p>
                    <p className="text-[10px] text-slate-500">
                      Your est: ${tp.patient_estimate.toLocaleString()} &middot; Insurance: ${tp.insurance_estimate.toLocaleString()}
                    </p>
                  </div>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", statusColors[tp.status] || "bg-slate-50 text-slate-600 border-slate-200")}>
                    {tp.status.charAt(0).toUpperCase() + tp.status.slice(1).replace("_", " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Communications */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900">Recent Communications</h2>
          </div>
          <Link href="/portal/messages" className="text-xs font-medium text-cyan-600 hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentMessages.length === 0 ? (
            <div className="p-8 text-center">
              <Mail className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">No messages yet</p>
            </div>
          ) : (
            recentMessages.slice(0, 4).map((msg) => (
              <div key={msg.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  {msg.channel === "email" ? (
                    <Mail className="h-4 w-4 text-blue-500" />
                  ) : msg.channel === "sms" ? (
                    <Phone className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Activity className="h-4 w-4 text-slate-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-900">{msg.subject || "Message"}</p>
                    <p className="text-[10px] text-slate-500">
                      {new Date(msg.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  msg.status === "delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"
                )}>
                  {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/appointment"
          className="flex items-center gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-4 hover:bg-cyan-100 transition-colors"
        >
          <CalendarDays className="h-5 w-5 text-cyan-600" />
          <div>
            <p className="text-sm font-semibold text-cyan-900">Book Appointment</p>
            <p className="text-[10px] text-cyan-700">Schedule your next visit</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-cyan-500" />
        </Link>
        <Link
          href="/portal/billing"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 hover:bg-emerald-100 transition-colors"
        >
          <CreditCard className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">Make Payment</p>
            <p className="text-[10px] text-emerald-700">View balance & pay online</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-emerald-500" />
        </Link>
        <Link
          href="/portal/messages"
          className="flex items-center gap-3 rounded-xl border border-purple-200 bg-purple-50 p-4 hover:bg-purple-100 transition-colors"
        >
          <Mail className="h-5 w-5 text-purple-600" />
          <div>
            <p className="text-sm font-semibold text-purple-900">Contact Us</p>
            <p className="text-[10px] text-purple-700">Send a secure message</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-purple-500" />
        </Link>
      </div>
    </div>
  );
}

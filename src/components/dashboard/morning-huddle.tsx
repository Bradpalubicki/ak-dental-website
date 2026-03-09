"use client";

import Link from "next/link";
import {
  Calendar,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Siren,
} from "lucide-react";
import type { DashboardData } from "./dashboard-types";

// ─── KPI Cards (3 only) ───────────────────────────────────────────

function KpiCards({ data }: { data: DashboardData }) {
  const pendingActions =
    data.stats.unconfirmedCount +
    data.stats.pendingApprovals +
    data.stats.pendingInsurance;

  const cards = [
    {
      label: "Today's Appointments",
      value: data.stats.appointmentCount,
      sub: data.stats.unconfirmedCount > 0
        ? `${data.stats.unconfirmedCount} unconfirmed`
        : "All confirmed",
      subColor: data.stats.unconfirmedCount > 0 ? "text-amber-600" : "text-emerald-600",
      icon: Calendar,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      href: "/dashboard/schedule",
    },
    {
      label: "New Leads Today",
      value: data.stats.leadCount,
      sub: data.stats.leadCount > 0 ? "Needs follow-up" : "None today",
      subColor: data.stats.leadCount > 0 ? "text-amber-600" : "text-slate-400",
      icon: UserPlus,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      href: "/dashboard/leads",
    },
    {
      label: "Pending Actions",
      value: pendingActions,
      sub: pendingActions > 0 ? "Needs attention" : "All clear",
      subColor: pendingActions > 0 ? "text-red-600" : "text-emerald-600",
      icon: pendingActions > 0 ? AlertCircle : CheckCircle,
      iconBg: pendingActions > 0 ? "bg-red-50" : "bg-emerald-50",
      iconColor: pendingActions > 0 ? "text-red-600" : "text-emerald-600",
      href: "/dashboard/approvals",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.label}
            href={card.href}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm hover:border-cyan-200 hover:shadow-md transition-all"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}>
              <Icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-xs font-medium text-slate-500 truncate">{card.label}</p>
              <p className={`text-[11px] font-medium ${card.subColor}`}>{card.sub}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-cyan-400 transition-colors shrink-0" />
          </Link>
        );
      })}
    </div>
  );
}

// ─── Today's Schedule (max 6 rows) ───────────────────────────────

function TodaysSchedule({ data }: { data: DashboardData }) {
  const shown = data.appointments.slice(0, 6);

  function formatTime(t: string) {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-cyan-600" />
          <h2 className="text-sm font-semibold text-slate-900">Today&apos;s Schedule</h2>
        </div>
        <Link
          href="/dashboard/schedule"
          className="text-[11px] font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
        >
          View all →
        </Link>
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Calendar className="h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm font-medium text-slate-500">No appointments today</p>
          <Link href="/dashboard/schedule" className="mt-2 text-xs text-cyan-600 hover:underline">
            View schedule
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-slate-50">
          {shown.map((apt) => (
            <li key={apt.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50/60 transition-colors">
              <div className="flex w-16 shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Clock className="h-3 w-3 text-slate-400" />
                {formatTime(apt.time)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{apt.patientName}</p>
                <p className="text-[11px] text-slate-400 truncate capitalize">{apt.type}</p>
              </div>
              <Link
                href="/dashboard/appointments"
                className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  apt.status === "scheduled"
                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {apt.status === "scheduled" ? "Confirm" : "Confirmed"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Action Items ─────────────────────────────────────────────────

function ActionItems({ data }: { data: DashboardData }) {
  const items = data.urgentItems;

  const levelStyles: Record<string, string> = {
    critical: "border-red-200 bg-red-50",
    warning:  "border-amber-200 bg-amber-50",
    info:     "border-blue-100 bg-blue-50",
  };

  const labelStyles: Record<string, string> = {
    critical: "text-red-800",
    warning:  "text-amber-800",
    info:     "text-blue-800",
  };

  const btnStyles: Record<string, string> = {
    critical: "bg-red-600 hover:bg-red-700 text-white",
    warning:  "bg-amber-500 hover:bg-amber-600 text-white",
    info:     "bg-blue-600 hover:bg-blue-700 text-white",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {items.some(i => i.level === "critical") && (
            <Siren className="h-4 w-4 text-red-500 animate-pulse" />
          )}
          {!items.some(i => i.level === "critical") && (
            <AlertCircle className="h-4 w-4 text-amber-500" />
          )}
          <h2 className="text-sm font-semibold text-slate-900">Action Items</h2>
          {items.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-700">
              {items.length}
            </span>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <CheckCircle className="h-8 w-8 text-emerald-400 mb-2" />
          <p className="text-sm font-medium text-slate-500">All clear — nothing needs attention</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-50">
          {items.map((item, i) => (
            <li
              key={i}
              className={`flex items-center gap-3 px-4 py-3 border-l-4 ${levelStyles[item.level] || levelStyles.info}`}
            >
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold truncate ${labelStyles[item.level] || labelStyles.info}`}>
                  {item.label}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{item.detail}</p>
              </div>
              <Link
                href={item.href}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-colors ${btnStyles[item.level] || btnStyles.info}`}
              >
                Fix
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Morning Huddle (main export) ────────────────────────────────

export function MorningHuddle({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-5">
      <KpiCards data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TodaysSchedule data={data} />
        <ActionItems data={data} />
      </div>
    </div>
  );
}

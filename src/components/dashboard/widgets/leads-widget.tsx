"use client";

import { UserPlus, ArrowRight, Phone, FileText, Plus } from "lucide-react";
import Link from "next/link";
import type { DashboardData } from "../dashboard-types";
import { timeAgo } from "../dashboard-utils";

export function LeadsWidget({ data }: { data: DashboardData }) {
  if (data.leads.length === 0) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-center">
          <UserPlus className="mx-auto h-8 w-8 text-emerald-200 mb-2" />
          <p className="text-sm font-medium text-slate-500">No new leads</p>
          <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
            Leads from your website and phone will appear here
          </p>
          <div className="flex items-center gap-2 justify-center">
            <Link
              href="/dashboard/leads"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Lead
            </Link>
            <Link
              href="/dashboard/leads"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-1">
      {data.leads.slice(0, 6).map((lead) => (
        <div
          key={lead.id}
          className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-700">
            {lead.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {lead.name}
            </p>
            <p className="text-[10px] text-slate-400">
              {lead.source.replace(/_/g, " ")} &middot;{" "}
              {timeAgo(lead.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <a
              href="/dashboard/leads"
              className="rounded-md bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700 hover:bg-indigo-200 transition-colors flex items-center gap-0.5"
              title="Send Intake Form"
            >
              <FileText className="h-2.5 w-2.5" />
              Intake
            </a>
            <a
              href="/dashboard/leads"
              className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 hover:bg-slate-200 transition-colors"
              title="Schedule Call"
            >
              <Phone className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      ))}
      <a
        href="/dashboard/leads"
        className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors"
      >
        View all <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}

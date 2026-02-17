"use client";

import { UsersRound, ArrowRight } from "lucide-react";

export function HrWidget() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
            Active Staff
          </p>
          <p className="text-xl font-bold text-slate-900">5</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <UsersRound className="h-5 w-5 text-blue-600" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Pending Signatures</span>
          <span className="font-semibold text-amber-600">1</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Next Payroll</span>
          <span className="font-semibold text-slate-900">Feb 14</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">OT This Period</span>
          <span className="font-semibold text-red-600">4.5 hrs</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Avg Hours/Week</span>
          <span className="font-semibold text-slate-900">38.2</span>
        </div>
      </div>
      <a
        href="/dashboard/hr"
        className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors"
      >
        HR dashboard <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}

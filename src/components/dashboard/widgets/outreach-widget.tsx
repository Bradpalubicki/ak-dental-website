"use client";

import { Send, ArrowRight } from "lucide-react";

export function OutreachWidget() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
            Sent This Week
          </p>
          <p className="text-xl font-bold text-slate-900">24</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
          <Send className="h-5 w-5 text-indigo-600" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Recall Campaigns</span>
          <span className="font-semibold text-slate-900">3 active</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Open Rate</span>
          <span className="font-semibold text-emerald-600">68%</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Reactivated</span>
          <span className="font-semibold text-cyan-600">4 patients</span>
        </div>
      </div>
      <a
        href="/dashboard/outreach"
        className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors"
      >
        Outreach hub <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}

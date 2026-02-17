"use client";

import { TrendingUp, ArrowRight } from "lucide-react";

export function FinancialsWidget() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
            Revenue MTD
          </p>
          <p className="text-xl font-bold text-slate-900">$47,850</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Collections</span>
          <span className="font-semibold text-slate-900">$43,250</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Outstanding AR</span>
          <span className="font-semibold text-amber-600">$18,430</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Collection Rate</span>
          <span className="font-semibold text-emerald-600">96.1%</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Net Income</span>
          <span className="font-semibold text-slate-900">$12,940</span>
        </div>
      </div>
      <a
        href="/dashboard/financials"
        className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors"
      >
        Full financials <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}

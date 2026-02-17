"use client";

import { Shield, ArrowRight } from "lucide-react";

export function InsuranceWidget() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
            Pending Verifications
          </p>
          <p className="text-xl font-bold text-slate-900">3</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
          <Shield className="h-5 w-5 text-purple-600" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Active Carriers</span>
          <span className="font-semibold text-slate-900">7</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Policies Uploaded</span>
          <span className="font-semibold text-emerald-600">4 / 7</span>
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-slate-500">Claims Pending</span>
          <span className="font-semibold text-amber-600">12</span>
        </div>
      </div>
      <a
        href="/dashboard/insurance"
        className="flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-cyan-600 hover:bg-cyan-50 transition-colors"
      >
        Insurance hub <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}

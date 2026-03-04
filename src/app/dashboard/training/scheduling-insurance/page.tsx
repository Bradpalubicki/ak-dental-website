"use client";

import { useState } from "react";
import { Calendar, Shield, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const SECTIONS = [
  {
    title: "How Appointment Booking Triggers Reminders",
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <p>When a patient books an appointment, the system automatically queues:</p>
        <div className="space-y-1">
          {["Confirmation SMS + email → sent immediately", "48-hour reminder email → 48h before", "24-hour reminder SMS + email → 24h before", "2-hour reminder SMS → 2h before"].map((item, i) => (
            <div key={i} className="flex items-start gap-2 bg-slate-50 rounded px-3 py-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              {item}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400">All sends go through the Approvals queue if the template requires it.</p>
      </div>
    ),
  },
  {
    title: "Insurance Eligibility Verification",
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <p>Insurance is automatically verified through Vyne Dental Trellis at intake and check-in.</p>
        <div className="space-y-1">
          {["Coverage active → green badge, insurance_verified SMS sent", "Issue found → insurance_pending SMS sent, alert in dashboard", "Manual override available on patient record → Insurance tab"].map((item, i) => (
            <div key={i} className="flex items-start gap-2 bg-slate-50 rounded px-3 py-2">
              <Shield className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Coverage Issues — Where to See Them",
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <p>Three places to track insurance issues:</p>
        <div className="space-y-2">
          <a href="/dashboard/insurance" className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-700 hover:bg-blue-100">
            <span className="font-medium">Insurance Dashboard</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          <a href="/dashboard/patients" className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100">
            <span className="font-medium">Patient Records → Insurance tab</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          <a href="/dashboard" className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100">
            <span className="font-medium">Main Dashboard → Insurance Issues widget</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    ),
  },
];

export default function SchedulingInsurancePage() {
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleComplete() {
    setCompleting(true);
    try {
      await fetch("/api/training/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "scheduling_insurance", score: 3, passed: true }),
      });
      setDone(true);
      toast.success("Module complete!");
    } catch {
      toast.error("Failed to save — try again");
    } finally {
      setCompleting(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center space-y-4 p-6">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Module Complete!</h2>
        <p className="text-slate-500">Scheduling & Insurance training recorded.</p>
        <a href="/dashboard/training" className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-cyan-700">
          Back to Training <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-cyan-600" />
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Scheduling & Insurance</h1>
          <p className="text-sm text-slate-500">For front desk and office managers</p>
        </div>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((s, i) => (
          <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-800">{s.title}</h2>
            </div>
            <div className="p-4">{s.content}</div>
          </div>
        ))}
      </div>

      <button
        onClick={handleComplete}
        disabled={completing}
        className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl text-sm flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="h-4 w-4" />
        {completing ? "Saving..." : "Mark as Complete"}
      </button>
    </div>
  );
}

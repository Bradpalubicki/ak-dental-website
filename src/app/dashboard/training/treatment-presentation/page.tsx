"use client";

import { useState } from "react";
import { FileText, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const STEPS_CONTENT = [
  { label: "Generate plan", detail: "After diagnosis, go to Treatments → New Plan → add procedures + costs" },
  { label: "Review with patient", detail: "Open /treatments/[id]/present on iPad — shows visual breakdown" },
  { label: "Patient accepts", detail: "Patient taps Accept → triggers treatment_accepted message template" },
  { label: "Track acceptance", detail: "Accepted plans show in Treatments list with status badge" },
];

export default function TreatmentPresentationPage() {
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleComplete() {
    setCompleting(true);
    try {
      await fetch("/api/training/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "treatment_presentation", score: 4, passed: true }),
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
        <a href="/dashboard/training" className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-cyan-700">
          Back to Training <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-cyan-600" />
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Treatment Plan Presentation</h1>
          <p className="text-sm text-slate-500">For dentists — iPad presentation flow</p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-800">Treatment Plan Flow</h2>
        </div>
        <div className="p-4 space-y-3">
          {STEPS_CONTENT.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="h-6 w-6 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <div>
                <p className="text-sm font-medium text-slate-800">{s.label}</p>
                <p className="text-xs text-slate-500">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-800">Patient Acceptance Tracking</h2>
        </div>
        <div className="p-4 space-y-2 text-sm text-slate-600">
          <p>When a patient accepts a treatment plan:</p>
          {["Status changes to \"Accepted\" in your Treatments list", "treatment_accepted email automatically queued", "Appointment can be scheduled directly from the plan", "Accepted % shown in your analytics dashboard"].map((item, i) => (
            <div key={i} className="flex items-start gap-2 bg-slate-50 rounded px-3 py-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              {item}
            </div>
          ))}
          <a href="/dashboard/treatments" className="flex items-center gap-1 text-cyan-600 hover:underline text-xs mt-2">
            <ExternalLink className="h-3.5 w-3.5" /> Open Treatments
          </a>
        </div>
      </div>

      <button onClick={handleComplete} disabled={completing} className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl text-sm flex items-center justify-center gap-2">
        <CheckCircle2 className="h-4 w-4" />
        {completing ? "Saving..." : "Mark as Complete"}
      </button>
    </div>
  );
}

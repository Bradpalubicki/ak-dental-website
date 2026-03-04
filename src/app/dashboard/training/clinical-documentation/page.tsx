"use client";

import { useState } from "react";
import Link from "next/link";
import { Stethoscope, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const SECTIONS = [
  {
    title: "CDT Code System Overview",
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <p>CDT (Current Dental Terminology) codes are the standard billing codes for dental procedures. Each procedure note must include the correct CDT code.</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[["D0100-D0999", "Diagnostic"], ["D1000-D1999", "Preventive"], ["D2000-D2999", "Restorative"], ["D3000-D3999", "Endodontics"], ["D4000-D4999", "Periodontics"], ["D6000-D6199", "Implants"]].map(([code, label]) => (
            <div key={code} className="bg-slate-50 rounded px-3 py-2">
              <span className="font-mono text-slate-500">{code}</span>
              <p className="text-slate-700 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Selecting the Right Procedure Template",
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <p>In Clinical Notes → New Note → select procedure from the dropdown. The AI pre-fills a SOAP note template.</p>
        {["Search by CDT code or procedure name", "Template auto-populates: Subjective, Objective, Assessment, Plan", "Verify all AI-filled content before provider signs", "Add any specific findings or complications manually"].map((item, i) => (
          <div key={i} className="flex items-start gap-2 bg-slate-50 rounded px-3 py-2">
            <span className="text-slate-400 text-xs font-mono mt-0.5">{i + 1}.</span>
            {item}
          </div>
        ))}
        <Link href="/dashboard/clinical-notes" className="flex items-center gap-1 text-cyan-600 hover:underline text-xs">
          <ExternalLink className="h-3.5 w-3.5" /> Open Clinical Notes
        </Link>
      </div>
    ),
  },
  {
    title: "Signing Requirements",
    content: (
      <div className="space-y-3 text-sm text-slate-600">
        <p>All clinical notes must be signed by the provider before end of day. No exceptions.</p>
        {["Unsigned notes appear in the \"Needs Signature\" alert on the dashboard", "Provider reviews → clicks Sign → note is locked", "Locked notes cannot be edited — corrections require an addendum", "Missing signatures flagged in compliance report"].map((item, i) => (
          <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded px-3 py-2 text-amber-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            {item}
          </div>
        ))}
      </div>
    ),
  },
];

export default function ClinicalDocumentationPage() {
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleComplete() {
    setCompleting(true);
    try {
      await fetch("/api/training/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "clinical_documentation", score: 3, passed: true }),
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
        <Stethoscope className="h-6 w-6 text-cyan-600" />
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Clinical Documentation & CDT Codes</h1>
          <p className="text-sm text-slate-500">For dentists and dental assistants</p>
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
      <button onClick={handleComplete} disabled={completing} className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl text-sm flex items-center justify-center gap-2">
        <CheckCircle2 className="h-4 w-4" />
        {completing ? "Saving..." : "Mark as Complete"}
      </button>
    </div>
  );
}

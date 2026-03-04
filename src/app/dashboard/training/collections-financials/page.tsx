"use client";

import { useState } from "react";
import { DollarSign, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function CollectionsFinancialsPage() {
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleComplete() {
    setCompleting(true);
    try {
      await fetch("/api/training/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "collections_financials", score: 4, passed: true }),
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

  const sections = [
    {
      title: "Daily Briefing Email",
      items: ["Sent every morning at your configured time", "Includes: yesterday's production, collections, upcoming schedule, alerts", "No-show patients flagged with recovery options", "Action items ranked by priority"],
    },
    {
      title: "Production vs. Collections",
      items: ["Production = value of procedures completed", "Collections = cash actually received", "Gap = outstanding A/R (monitor weekly)", "Target: collections ≥ 95% of production"],
    },
    {
      title: "Stripe Payment Flow",
      items: ["Patients pay online via Stripe at checkout", "Payment appears in Billing dashboard within seconds", "payment_receipt email sent automatically", "Refunds processed from Billing → Patient → Refund"],
    },
    {
      title: "Outstanding Balances",
      items: ["View in Billing → Outstanding tab", "Aged A/R: 30/60/90/120+ day buckets", "Send payment reminder from patient record", "Collection escalation: contact NuStack for guidance"],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="h-6 w-6 text-cyan-600" />
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Collections & Financials</h1>
          <p className="text-sm text-slate-500">For owner dentist and office managers</p>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((s) => (
          <div key={s.title} className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-800">{s.title}</h2>
            </div>
            <div className="p-4 space-y-2">
              {s.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 rounded px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <a href="/dashboard/financials" className="flex-1 flex items-center justify-center gap-2 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
          <ExternalLink className="h-4 w-4" /> Financials
        </a>
        <a href="/dashboard/billing" className="flex-1 flex items-center justify-center gap-2 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
          <ExternalLink className="h-4 w-4" /> Billing
        </a>
      </div>

      <button onClick={handleComplete} disabled={completing} className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl text-sm flex items-center justify-center gap-2">
        <CheckCircle2 className="h-4 w-4" />
        {completing ? "Saving..." : "Mark as Complete"}
      </button>
    </div>
  );
}

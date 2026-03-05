"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Phone,
  Loader2,
  CalendarDays,
  X,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProposalItem {
  id: string;
  procedure_name: string;
  procedure_description?: string | null;
  tooth_number?: string | null;
  cdt_code?: string | null;
  fee: number;
  insurance_pays: number;
  patient_pays: number;
  tier?: string | null;
  sort_order: number;
}

interface Proposal {
  id: string;
  title: string;
  status: string;
  total_fee: number;
  insurance_estimate: number;
  patient_estimate: number;
  financing_provider?: string | null;
  financing_monthly?: number | null;
  financing_term_months?: number | null;
  tier?: string | null;
  sign_token: string;
  signed_at?: string | null;
  signature_name?: string | null;
  expires_at: string;
  created_at: string;
  patient: { first_name: string; last_name: string; email?: string | null } | null;
  provider: { first_name: string; last_name: string } | null;
}

interface Props {
  proposal: Proposal;
  items: ProposalItem[];
  token: string;
  expired: boolean;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);

const TIER_LABELS: Record<string, string> = {
  good: "Good",
  better: "Better",
  best: "Best (Recommended)",
};

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    good: "bg-slate-100 text-slate-700",
    better: "bg-blue-100 text-blue-700",
    best: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold", colors[tier] ?? "bg-slate-100 text-slate-600")}>
      {TIER_LABELS[tier] ?? tier}
    </span>
  );
}

export function ProposalClient({ proposal, items, token, expired }: Props) {
  const [sigName, setSigName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"accepted" | "declined" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(
    proposal.tier ?? (items.some((i) => i.tier) ? "best" : null)
  );
  const [showAllProcedures, setShowAllProcedures] = useState(false);

  const patient = proposal.patient;
  const provider = proposal.provider;
  const providerName = provider
    ? `Dr. ${provider.first_name} ${provider.last_name}`
    : "your dental provider";

  const hasTiers = items.some((i) => i.tier);

  // Filter items by selected tier
  const displayedItems = hasTiers && selectedTier
    ? items.filter((i) => !i.tier || i.tier === selectedTier)
    : items;

  // Recalculate totals for displayed items
  const displayFee = displayedItems.reduce((s, i) => s + (i.fee ?? 0), 0);
  const displayIns = displayedItems.reduce((s, i) => s + (i.insurance_pays ?? 0), 0);
  const displayPt = displayedItems.reduce((s, i) => s + (i.patient_pays ?? 0), 0);

  const visibleItems = showAllProcedures ? displayedItems : displayedItems.slice(0, 4);

  const submit = async (accepted: boolean) => {
    if (accepted && sigName.trim().length < 2) {
      setError("Please type your full legal name to sign");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/proposals/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, signature_name: sigName.trim(), accepted }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setResult(accepted ? "accepted" : "declined");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
      setShowDeclineConfirm(false);
    }
  };

  // ── States ───────────────────────────────────────────────────────────────────

  if (result === "accepted") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-5">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            You&apos;re all set, {patient?.first_name ?? ""}!
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Your treatment plan has been accepted. A signed copy will be emailed to you shortly.
            Our team will contact you to schedule your procedures.
          </p>
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-cyan-800 font-semibold">{proposal.title}</p>
            <p className="text-xs text-cyan-600 mt-1">Estimated patient cost: {fmt(displayPt || proposal.patient_estimate)}</p>
          </div>
          <a
            href="tel:+17029354395"
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-700 transition-colors w-full"
          >
            <Phone className="h-4 w-4" />
            Call to Schedule — (702) 935-4395
          </a>
          <p className="text-xs text-slate-400 mt-4">
            AK Ultimate Dental · 7480 W Sahara Ave, Las Vegas, NV 89117
          </p>
        </div>
      </div>
    );
  }

  if (result === "declined") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mx-auto mb-4">
            <X className="h-8 w-8 text-slate-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Plan Declined</h1>
          <p className="text-slate-600 text-sm mb-6">
            No problem. If you have questions or want to revisit this plan, please give us a call.
          </p>
          <a href="tel:+17029354395" className="text-cyan-600 font-semibold text-sm hover:underline">
            (702) 935-4395
          </a>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 mx-auto mb-4">
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">This Plan Has Expired</h1>
          <p className="text-slate-600 text-sm mb-6">
            Treatment plan estimates are valid for 30 days. Please contact our office for an updated plan.
          </p>
          <a href="tel:+17029354395" className="text-cyan-600 font-semibold text-sm hover:underline">
            (702) 935-4395
          </a>
        </div>
      </div>
    );
  }

  if (proposal.status === "accepted") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Already Accepted</h1>
          <p className="text-slate-600 text-sm">
            This plan was accepted by <strong>{proposal.signature_name}</strong> on{" "}
            {proposal.signed_at
              ? new Date(proposal.signed_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "record"}.
          </p>
        </div>
      </div>
    );
  }

  if (proposal.status === "declined") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mx-auto mb-4">
            <X className="h-8 w-8 text-slate-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Plan Declined</h1>
          <p className="text-slate-600 text-sm mb-4">
            You previously declined this plan. If you have questions or changed your mind, please contact us.
          </p>
          <a href="tel:+17029354395" className="text-cyan-600 font-semibold text-sm">
            (702) 935-4395
          </a>
        </div>
      </div>
    );
  }

  // ── Main proposal view ───────────────────────────────────────────────────────

  const isDraftPreview = proposal.status === "draft";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      {/* Draft preview banner */}
      {isDraftPreview && (
        <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-500 px-4 py-2">
          <span className="text-xs font-semibold text-white">Preview Mode — This plan has not been sent to the patient yet</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-600 flex-shrink-0">
            <span className="text-white text-xs font-bold">AK</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">AK Ultimate Dental</p>
            <p className="text-[10px] text-slate-500">Las Vegas, NV · (702) 935-4395</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6 pb-24">

        {/* Greeting */}
        <div>
          <p className="text-xs font-semibold text-cyan-600 uppercase tracking-widest mb-1">
            Your Personalized Treatment Plan
          </p>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            Hi {patient?.first_name ?? "there"},
          </h1>
          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
            {providerName} has prepared this treatment plan for you.
            Review the recommended procedures below, then accept at the bottom.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(proposal.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span>·</span>
            <span>{items.length} procedure{items.length !== 1 ? "s" : ""}</span>
            <span>·</span>
            <span>
              Expires {new Date(proposal.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Good/Better/Best Tier Selector */}
        {hasTiers && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Choose Your Plan
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["good", "better", "best"] as const).map((t) => {
                const tierItems = items.filter((i) => !i.tier || i.tier === t);
                const tierPt = tierItems.reduce((s, i) => s + (i.patient_pays ?? 0), 0);
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedTier(t)}
                    className={cn(
                      "rounded-xl border-2 px-3 py-3 text-center transition-all",
                      selectedTier === t
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <p className={cn(
                      "text-xs font-bold uppercase tracking-wide",
                      selectedTier === t ? "text-cyan-700" : "text-slate-500"
                    )}>
                      {t === "best" ? "⭐ Best" : t.charAt(0).toUpperCase() + t.slice(1)}
                    </p>
                    <p className={cn(
                      "text-lg font-extrabold mt-1",
                      selectedTier === t ? "text-cyan-800" : "text-slate-700"
                    )}>
                      {fmt(tierPt)}
                    </p>
                    {t === "best" && (
                      <p className="text-[10px] text-cyan-600 mt-0.5 font-medium">Recommended</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* What We Recommend */}
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            What We Recommend
          </h2>

          <div className="space-y-3">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 flex-shrink-0 mt-0.5">
                      <span className="text-base">🦷</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-900">{item.procedure_name}</p>
                        {item.tooth_number && (
                          <span className="text-xs text-slate-400">Tooth #{item.tooth_number}</span>
                        )}
                        {item.tier && <TierBadge tier={item.tier} />}
                      </div>
                      {item.procedure_description && (
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                          {item.procedure_description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Practice Fee</span>
                    <span className="text-slate-700">{fmt(item.fee)}</span>
                  </div>
                  {item.insurance_pays > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Insurance covers</span>
                      <span className="text-emerald-600 font-medium">−{fmt(item.insurance_pays)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-1.5 flex justify-between">
                    <span className="text-sm font-semibold text-slate-800">Your cost</span>
                    <span className="text-lg font-extrabold text-cyan-700">{fmt(item.patient_pays)}</span>
                  </div>
                </div>
              </div>
            ))}

            {displayedItems.length > 4 && (
              <button
                onClick={() => setShowAllProcedures(!showAllProcedures)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {showAllProcedures ? (
                  <>Show less <ChevronUp className="h-4 w-4" /></>
                ) : (
                  <>Show all {displayedItems.length} procedures <ChevronDown className="h-4 w-4" /></>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Your Total
          </h2>

          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Practice Fee</span>
              <span className="text-slate-700">{fmt(displayFee)}</span>
            </div>
            {displayIns > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Insurance Estimate</span>
                <span className="text-emerald-600 font-medium">−{fmt(displayIns)}</span>
              </div>
            )}
            <div className="border-t-2 border-slate-900/10 pt-3 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Your Estimated Cost</span>
              <span className="text-3xl font-extrabold text-cyan-700">{fmt(displayPt)}</span>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-400">
            Insurance estimates are based on your current benefits and are not a guarantee of coverage.
          </p>
        </div>

        {/* Financing */}
        {proposal.financing_provider && proposal.financing_monthly && (
          <div className="rounded-2xl bg-emerald-600 p-5 text-white shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">💳</span>
              <p className="font-bold text-base">
                As low as {fmt(proposal.financing_monthly)}/mo
              </p>
            </div>
            <p className="text-emerald-100 text-sm mb-4">
              with {
                proposal.financing_provider === "cherry"
                  ? "Cherry Financing"
                  : proposal.financing_provider === "sunbit"
                  ? "Sunbit"
                  : "CareCredit"
              }
              {proposal.financing_term_months ? ` · ${proposal.financing_term_months}-month term` : ""}
            </p>

            {proposal.financing_provider === "cherry" && (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-100">
                  <span className="flex items-center gap-1">✓ 80%+ approval rate</span>
                  <span className="flex items-center gap-1">✓ No hard credit check</span>
                  <span className="flex items-center gap-1">✓ 60-second application</span>
                </div>
                <a
                  href="https://www.withcherry.com/patient"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors w-full mt-3"
                >
                  Apply with Cherry →
                </a>
              </div>
            )}

            <p className="text-[10px] text-emerald-200 mt-3">
              Also accepted: CareCredit · Sunbit · All major cards
            </p>
          </div>
        )}

        {/* Accept / Sign */}
        <div className="rounded-2xl border-2 border-cyan-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Accept Your Plan</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              By signing below, you authorize AK Ultimate Dental to perform the procedures listed above.
              Insurance estimates are not a guarantee of coverage.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Full Legal Name <span className="text-xs font-normal text-slate-400">(your electronic signature)</span>
            </label>
            <input
              type="text"
              value={sigName}
              onChange={(e) => setSigName(e.target.value)}
              placeholder={patient ? `${patient.first_name} ${patient.last_name}` : "Your full name"}
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-slate-900 text-base font-medium italic focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => submit(true)}
              disabled={submitting || sigName.trim().length < 2}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-4 text-base font-bold text-white hover:from-cyan-700 hover:to-cyan-800 disabled:opacity-50 transition-all shadow-lg shadow-cyan-200"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
              Accept Treatment Plan
            </button>

            <a
              href="tel:+17029354395"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Have a question? Call us
            </a>

            <button
              type="button"
              onClick={() => setShowDeclineConfirm(true)}
              className="text-xs text-slate-400 hover:text-slate-600 text-center transition-colors"
            >
              Decline this plan
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 justify-center">
            <Shield className="h-3 w-3" />
            <span>
              Signed electronically · Legally binding under Nevada ESIGN Act (NRS 719.240)
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 pb-4">
          AK Ultimate Dental · 7480 W Sahara Ave, Las Vegas, NV 89117 · (702) 935-4395
        </p>
      </div>

      {/* Decline confirm modal */}
      {showDeclineConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Decline this plan?</h3>
            <p className="text-sm text-slate-600">
              Our team will be notified. You can always call us to discuss options or get a revised plan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => submit(false)}
                disabled={submitting}
                className="flex-1 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Yes, Decline"}
              </button>
              <button
                onClick={() => setShowDeclineConfirm(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

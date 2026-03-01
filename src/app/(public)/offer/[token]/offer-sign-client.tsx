"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2, FileText, MapPin, Clock, DollarSign, Calendar } from "lucide-react";

interface Offer {
  id: string;
  candidate_first_name: string;
  candidate_last_name: string;
  job_title: string;
  department: string;
  employment_type: string;
  start_date: string | null;
  salary_amount: number | null;
  salary_unit: string;
  hourly_rate: number | null;
  letter_body: string;
  custom_message: string | null;
  status: string;
  expires_at: string | null;
  signed_at: string | null;
  signature_name: string | null;
}

interface Props {
  offer: Offer;
  token: string;
  expired: boolean;
  practicePhone: string;
  practiceEmail: string;
}

function employmentLabel(t: string) {
  return ({ FULL_TIME: "Full-Time", PART_TIME: "Part-Time", CONTRACTOR: "Contract", TEMPORARY: "Temporary", INTERN: "Internship" })[t] ?? t;
}

function salaryDisplay(offer: Offer): string | null {
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  if (offer.salary_amount) return `${fmt(offer.salary_amount)} / year`;
  if (offer.hourly_rate) return `$${offer.hourly_rate.toFixed(2)} / hour`;
  return null;
}

export function OfferSignClient({ offer, token, expired, practicePhone, practiceEmail }: Props) {
  const [sigName, setSigName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"signed" | "declined" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);

  const alreadySigned = offer.status === "signed";
  const withdrawn = offer.status === "withdrawn";
  const salary = salaryDisplay(offer);

  const submit = async (accepted: boolean) => {
    if (accepted && sigName.trim().length < 2) {
      setError("Please type your full name to sign.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/hr/offer-letters/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, signature_name: sigName.trim(), accepted }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
      setResult(data.status === "signed" ? "signed" : "declined");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
      setShowDeclineConfirm(false);
    }
  };

  if (result === "signed") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Offer Accepted!</h1>
          <p className="text-slate-600 mb-4">
            Welcome to AK Ultimate Dental, {offer.candidate_first_name}! Your offer has been signed and our team has been notified.
          </p>
          {offer.start_date && (
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-cyan-800 font-medium">Your start date: {new Date(offer.start_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          )}
          <p className="text-sm text-slate-500">
            Expect an email from our team within 24 hours with next steps and onboarding information.
          </p>
          <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-400">
            Questions? Call us at {practicePhone} or email {practiceEmail}
          </div>
        </div>
      </div>
    );
  }

  if (result === "declined") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mx-auto mb-4">
            <XCircle className="h-8 w-8 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Offer Declined</h1>
          <p className="text-slate-600 mb-6">We have noted your decision. Thank you for your time and interest in joining our team.</p>
          <p className="text-sm text-slate-500">If you have questions or changed your mind, please contact us at {practicePhone}.</p>
        </div>
      </div>
    );
  }

  if (expired || withdrawn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 mx-auto mb-4">
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{expired ? "Link Expired" : "Offer Withdrawn"}</h1>
          <p className="text-slate-600 mb-6">
            {expired ? "This offer link has expired. Please contact our team for an updated link." : "This offer is no longer available."}
          </p>
          <p className="text-sm text-slate-500">Contact us: {practicePhone}</p>
        </div>
      </div>
    );
  }

  if (alreadySigned) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Already Signed</h1>
          <p className="text-slate-600">
            This offer was signed by <strong>{offer.signature_name}</strong> on{" "}
            {offer.signed_at ? new Date(offer.signed_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "record"}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-600">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">AK Ultimate Dental</p>
              <p className="text-xs text-slate-500">Offer Letter</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-6">

        {/* Greeting */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Hi {offer.candidate_first_name}, you have an offer!
          </h1>
          <p className="text-slate-500 mt-1">Please review your offer letter below and sign at the bottom.</p>
        </div>

        {/* Details card */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 flex-shrink-0">
              <FileText className="h-4 w-4 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Position</p>
              <p className="text-sm font-semibold text-slate-900">{offer.job_title}</p>
              <p className="text-xs text-slate-500">{offer.department} · {employmentLabel(offer.employment_type)}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 flex-shrink-0">
              <MapPin className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Location</p>
              <p className="text-sm font-semibold text-slate-900">Las Vegas, NV</p>
              <p className="text-xs text-slate-500">7480 W Sahara Ave, 89117</p>
            </div>
          </div>
          {offer.start_date && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 flex-shrink-0">
                <Calendar className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Start Date</p>
                <p className="text-sm font-semibold text-slate-900">
                  {new Date(offer.start_date).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
          )}
          {salary && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 flex-shrink-0">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Compensation</p>
                <p className="text-sm font-semibold text-slate-900">{salary}</p>
              </div>
            </div>
          )}
        </div>

        {/* Custom message */}
        {offer.custom_message && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-cyan-700 uppercase tracking-wider mb-2">A note from our team</p>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{offer.custom_message}</p>
          </div>
        )}

        {/* Letter body */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Offer Details</h2>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-serif">
            {offer.letter_body}
          </div>
        </div>

        {/* Signature */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Sign Your Offer</h2>
          <p className="text-sm text-slate-600">
            By typing your full legal name below and clicking &ldquo;Accept Offer,&rdquo; you acknowledge that you have read and agree to the terms of this offer letter.
          </p>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">{error}</div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Full Legal Name (your electronic signature)
            </label>
            <input
              type="text"
              value={sigName}
              onChange={(e) => setSigName(e.target.value)}
              placeholder={`${offer.candidate_first_name} ${offer.candidate_last_name}`}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 italic"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => submit(true)}
              disabled={submitting || sigName.trim().length < 2}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-50 transition-colors flex-1"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Accept Offer
            </button>
            <button
              onClick={() => setShowDeclineConfirm(true)}
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Decline
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center">
            This offer expires on {offer.expires_at ? new Date(offer.expires_at).toLocaleDateString() : "7 days from issue"}.
            Your signature is legally binding under Nevada ESIGN Act (NRS 719.240).
          </p>
        </div>

        <div className="text-center text-xs text-slate-400 pb-8">
          AK Ultimate Dental · {practicePhone} · {practiceEmail}
        </div>
      </div>

      {/* Decline confirm modal */}
      {showDeclineConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Decline this offer?</h3>
            <p className="text-sm text-slate-600">Are you sure you want to decline? Our team will be notified. You can always reach out to us if you change your mind.</p>
            <div className="flex gap-3">
              <button
                onClick={() => submit(false)}
                disabled={submitting}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
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

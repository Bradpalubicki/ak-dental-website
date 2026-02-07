"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ClipboardList,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  AlertTriangle,
  Shield,
  Star,
  MessageSquare,
  Loader2,
} from "lucide-react";

interface DocumentData {
  id: string;
  type: string;
  title: string;
  content: string;
  severity: string | null;
  status: string;
  created_by: string;
  created_at: string;
  employee: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
  };
}

type Step = "welcome" | "review" | "acknowledge" | "complete";
const STEPS: Step[] = ["welcome", "review", "acknowledge", "complete"];

const typeLabels: Record<string, string> = {
  disciplinary: "Disciplinary Write-up",
  incident_report: "Incident Report",
  performance_review: "Performance Review",
  coaching_note: "Coaching Note",
  general: "General Document",
  advisor_conversation: "Advisor Consultation",
};

const typeIcons: Record<string, typeof FileText> = {
  disciplinary: AlertTriangle,
  incident_report: Shield,
  performance_review: Star,
  coaching_note: MessageSquare,
  general: FileText,
  advisor_conversation: MessageSquare,
};

const severityColors: Record<string, string> = {
  info: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  serious: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  critical: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function PresentDocumentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [initials, setInitials] = useState("");
  const [hasReadDoc, setHasReadDoc] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/hr/documents/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setDoc(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const stepIndex = STEPS.indexOf(currentStep);

  function goNext() {
    if (stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1]);
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1]);
    }
  }

  async function submitInitials() {
    if (!doc || !initials.trim()) return;
    await fetch(`/api/hr/documents/${doc.id}/acknowledge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_id: doc.employee.id,
        acknowledgment_type: "initial",
        step_label: "Document Review",
        typed_name: initials.trim().toUpperCase(),
      }),
    });
    goNext();
  }

  async function submitSignature() {
    if (!doc || !typedName.trim() || !confirmed) return;
    setSubmitting(true);
    await fetch(`/api/hr/documents/${doc.id}/acknowledge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_id: doc.employee.id,
        acknowledgment_type: "signature",
        step_label: "Final Acknowledgment",
        typed_name: typedName.trim(),
      }),
    });
    setSubmitting(false);
    goNext();
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900">
        <p className="text-white">Document not found.</p>
      </div>
    );
  }

  const DocIcon = typeIcons[doc.type] || FileText;
  const employeeName = `${doc.employee.first_name} ${doc.employee.last_name}`;
  const suggestedInitials = `${doc.employee.first_name[0]}${doc.employee.last_name[0]}`.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {STEPS.map((step, i) => (
            <div
              key={step}
              className={`h-2 w-12 rounded-full transition-colors ${
                i <= stepIndex ? "bg-amber-500" : "bg-white/10"
              }`}
            />
          ))}
        </div>
        {/* Exit */}
        <button
          onClick={() => router.push("/dashboard/hr")}
          className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/20"
        >
          <X className="h-3.5 w-3.5" />
          Exit
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8">
        {/* Step 1: Welcome */}
        {currentStep === "welcome" && (
          <div className="max-w-2xl text-center animate-in fade-in duration-500">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/20">
              <DocIcon className="h-10 w-10 text-amber-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Employee Document Review
            </h1>
            <div className="mb-6">
              <p className="text-2xl text-amber-400 font-semibold">
                {employeeName}
              </p>
              <div className="mt-3 flex items-center justify-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-sm font-medium ${
                    severityColors[doc.severity || "info"] ||
                    severityColors.info
                  }`}
                >
                  {typeLabels[doc.type] || "Document"}
                </span>
              </div>
            </div>
            <p className="text-white/50 text-sm">
              Prepared by {doc.created_by} &middot;{" "}
              {new Date(doc.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="mt-6 text-white/40 text-xs max-w-md mx-auto">
              Please review the following document carefully. You will be
              asked to initial and sign to acknowledge receipt.
            </p>
          </div>
        )}

        {/* Step 2: Review */}
        {currentStep === "review" && (
          <div className="w-full max-w-3xl animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              {doc.title}
            </h2>
            <p className="text-center text-white/40 text-sm mb-6">
              Please read the document below carefully
            </p>

            <div className="rounded-xl bg-white/5 border border-white/10 p-8 max-h-[50vh] overflow-y-auto">
              <div className="text-white/90 text-base leading-relaxed whitespace-pre-line">
                {doc.content}
              </div>
            </div>

            {/* Initials */}
            <div className="mt-6 rounded-xl bg-white/5 border border-white/10 p-6">
              <label className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={hasReadDoc}
                  onChange={(e) => setHasReadDoc(e.target.checked)}
                  className="h-5 w-5 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-white/80 text-sm">
                  I have read the above document in its entirety
                </span>
              </label>

              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-white/50 mb-1.5">
                    Your Initials
                  </label>
                  <input
                    type="text"
                    value={initials}
                    onChange={(e) =>
                      setInitials(e.target.value.toUpperCase().slice(0, 4))
                    }
                    placeholder={suggestedInitials}
                    maxLength={4}
                    className="w-32 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-center text-2xl font-bold text-white placeholder:text-white/20 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={submitInitials}
                  disabled={!hasReadDoc || !initials.trim()}
                  className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Acknowledge */}
        {currentStep === "acknowledge" && (
          <div className="w-full max-w-2xl animate-in fade-in duration-500">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20">
              <ClipboardList className="h-8 w-8 text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
              Acknowledgment & Signature
            </h2>
            <p className="text-center text-white/50 text-sm mb-8">
              Please type your full name to acknowledge this document
            </p>

            <div className="rounded-xl bg-white/5 border border-white/10 p-8">
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                I, <strong className="text-amber-400">{typedName || "________"}</strong>,
                acknowledge that I have read and understand the document titled
                &ldquo;{doc.title}&rdquo;. I understand that signing this
                acknowledgment does not necessarily mean I agree with the contents
                of this document.
              </p>

              <div className="mb-6">
                <label className="block text-xs text-white/50 mb-1.5">
                  Type your full legal name
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder={employeeName}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-xl text-white placeholder:text-white/20 focus:border-amber-400 focus:outline-none font-serif italic"
                />
              </div>

              <label className="flex items-center gap-3 mb-6">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="h-5 w-5 rounded border-white/20 bg-white/10 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-white/80 text-sm">
                  I confirm I have read and understand this document
                </span>
              </label>

              <button
                onClick={submitSignature}
                disabled={!typedName.trim() || !confirmed || submitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-base font-bold text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
                Sign & Submit Acknowledgment
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {currentStep === "complete" && (
          <div className="max-w-lg text-center animate-in fade-in duration-500">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/20">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Document Acknowledged
            </h2>
            <p className="text-white/60 mb-2">
              Thank you, {doc.employee.first_name}. Your acknowledgment has
              been recorded.
            </p>
            <p className="text-white/40 text-sm mb-8">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              at{" "}
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <button
              onClick={() => router.push("/dashboard/hr")}
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/20"
            >
              Return to Dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      {currentStep !== "complete" && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <button
            onClick={goBack}
            disabled={stepIndex === 0}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm text-white hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <p className="text-xs text-white/30">
            Step {stepIndex + 1} of {STEPS.length}
          </p>
          {currentStep === "welcome" && (
            <button
              onClick={goNext}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Begin Review
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
          {currentStep !== "welcome" && (
            <div className="w-28" /> /* spacer */
          )}
        </div>
      )}
    </div>
  );
}

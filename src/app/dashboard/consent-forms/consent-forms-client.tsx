"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  FileSignature,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Edit,
  Plus,
  Shield,
  Zap,
  Copy,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

type ConsentStatus = "pending" | "signed" | "draft" | "template";

interface ConsentFormBase {
  id: string;
  treatment: string;
  state: string;
  status: ConsentStatus;
}

interface PatientForm extends ConsentFormBase {
  patient: string;
  dob: string;
}

interface PendingForm extends PatientForm {
  status: "pending";
  sentAgo: string;
}

interface SignedForm extends PatientForm {
  status: "signed";
  signedAt: string;
}

interface DraftForm extends PatientForm {
  status: "draft";
  createdAt: string;
}

interface TemplateForm extends ConsentFormBase {
  status: "template";
  patient: null;
  uses: number;
}

type ConsentForm = PendingForm | SignedForm | DraftForm | TemplateForm;

// -----------------------------------------------------------------------
// Demo data
// -----------------------------------------------------------------------

const DEMO_FORMS: ConsentForm[] = [
  {
    id: "1",
    patient: "Sarah Mitchell",
    treatment: "Dental Implant Procedure",
    state: "NV",
    status: "pending",
    sentAgo: "2 days ago",
    dob: "1984-03-12",
  },
  {
    id: "2",
    patient: "James Kowalski",
    treatment: "Root Canal Treatment",
    state: "NV",
    status: "signed",
    signedAt: "Mar 1, 2026",
    dob: "1971-07-22",
  },
  {
    id: "3",
    patient: "Maria Gonzalez",
    treatment: "Tooth Extraction",
    state: "NV",
    status: "signed",
    signedAt: "Feb 28, 2026",
    dob: "1995-11-05",
  },
  {
    id: "4",
    patient: "Robert Chen",
    treatment: "Dental Crown Placement",
    state: "NV",
    status: "pending",
    sentAgo: "5 hours ago",
    dob: "1968-09-30",
  },
  {
    id: "5",
    patient: "Lisa Thompson",
    treatment: "Teeth Whitening",
    state: "NV",
    status: "draft",
    createdAt: "Today",
    dob: "1990-04-15",
  },
  {
    id: "6",
    patient: "David Park",
    treatment: "Dental Implant Procedure",
    state: "NV",
    status: "pending",
    sentAgo: "1 hour ago",
    dob: "1979-08-19",
  },
  {
    id: "7",
    patient: null,
    treatment: "HIPAA Notice of Privacy Practices",
    state: "Universal",
    status: "template",
    uses: 47,
  },
  {
    id: "8",
    patient: null,
    treatment: "Financial Responsibility Agreement",
    state: "Universal",
    status: "template",
    uses: 31,
  },
  {
    id: "9",
    patient: null,
    treatment: "Anesthesia Consent",
    state: "NV",
    status: "template",
    uses: 18,
  },
];

// -----------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------

const STATUS_CONFIG: Record<
  ConsentStatus,
  { label: string; color: string; icon: typeof CheckCircle2 }
> = {
  pending: {
    label: "Pending Signature",
    color: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  signed: {
    label: "Signed",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
  },
  draft: {
    label: "Draft",
    color: "bg-slate-100 text-slate-600",
    icon: FileText,
  },
  template: {
    label: "Template",
    color: "bg-violet-100 text-violet-700",
    icon: Copy,
  },
};

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending Signature" },
  { key: "signed", label: "Signed" },
  { key: "draft", label: "Draft" },
  { key: "template", label: "Templates" },
] as const;

type FilterKey = (typeof FILTER_TABS)[number]["key"];

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

export function ConsentFormsClient() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered =
    filter === "all"
      ? DEMO_FORMS
      : DEMO_FORMS.filter((f) => f.status === filter);

  const pendingCount = DEMO_FORMS.filter((f) => f.status === "pending").length;
  const signedThisMonth = DEMO_FORMS.filter((f) => f.status === "signed").length;
  const totalGenerated = DEMO_FORMS.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
            <FileSignature className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Consent Forms</h1>
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <Zap className="h-3.5 w-3.5 text-cyan-500" />
              AI-generated
              <span className="text-slate-300">&middot;</span>
              <Shield className="h-3.5 w-3.5 text-cyan-500" />
              State-compliant
              <span className="text-slate-300">&middot;</span>
              <FileSignature className="h-3.5 w-3.5 text-cyan-500" />
              E-signature ready
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/consent-forms/generate"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-cyan-700 hover:to-blue-700 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Generate New Form
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-amber-700 font-medium">Pending Signatures</p>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-800">{pendingCount}</p>
          <p className="text-xs text-amber-600 mt-0.5">Awaiting patient action</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Signed This Month</p>
          <p className="text-2xl font-bold text-emerald-600">{signedThisMonth}</p>
          <p className="text-xs text-slate-400 mt-0.5">March 2026</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Forms Generated</p>
          <p className="text-2xl font-bold text-slate-900">{totalGenerated}</p>
          <p className="text-xs text-slate-400 mt-0.5">All time</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Avg. Time to Sign</p>
          <p className="text-2xl font-bold text-slate-900">4.2 hrs</p>
          <p className="text-xs text-slate-400 mt-0.5">After link sent</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 w-fit">
        {FILTER_TABS.map((tab) => {
          const count =
            tab.key === "all"
              ? DEMO_FORMS.length
              : DEMO_FORMS.filter((f) => f.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                filter === tab.key
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                  filter === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
            <FileSignature className="h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-semibold text-slate-900">No forms found</h3>
            <p className="mt-1 text-sm text-slate-500">
              Try a different filter or generate a new consent form.
            </p>
          </div>
        ) : (
          filtered.map((form) => <ConsentFormRow key={form.id} form={form} />)
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// Row component
// -----------------------------------------------------------------------

function ConsentFormRow({ form }: { form: ConsentForm }) {
  const config = STATUS_CONFIG[form.status];
  const StatusIcon = config.icon;
  const isTemplate = form.status === "template";

  function getTimeInfo(): string {
    if (form.status === "pending") return `Sent ${form.sentAgo}`;
    if (form.status === "signed") return `Signed ${form.signedAt}`;
    if (form.status === "draft") return `Created ${form.createdAt}`;
    if (form.status === "template") {
      const t = form as TemplateForm;
      return `Used ${t.uses} times`;
    }
    return "";
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 hover:bg-slate-50 transition-colors">
      {/* Left: icon + info */}
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            isTemplate
              ? "bg-violet-100"
              : form.status === "pending"
              ? "bg-amber-100"
              : form.status === "signed"
              ? "bg-emerald-100"
              : "bg-slate-100"
          }`}
        >
          {isTemplate ? (
            <FileText
              className={`h-4 w-4 ${
                isTemplate ? "text-violet-600" : "text-slate-500"
              }`}
            />
          ) : (
            <FileSignature
              className={`h-4 w-4 ${
                form.status === "pending"
                  ? "text-amber-600"
                  : form.status === "signed"
                  ? "text-emerald-600"
                  : "text-slate-500"
              }`}
            />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {form.patient ? (
              <span className="text-sm font-semibold text-slate-900">
                {form.patient}
              </span>
            ) : (
              <span className="text-sm font-semibold text-slate-900">
                {form.treatment}
              </span>
            )}
            {form.patient && (
              <span className="text-sm text-slate-500 truncate">
                &mdash; {form.treatment}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2 flex-wrap">
            {/* State badge */}
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                form.state === "Universal"
                  ? "bg-slate-100 text-slate-600"
                  : "bg-cyan-100 text-cyan-700"
              }`}
            >
              {form.state}
            </span>
            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.color}`}
            >
              <StatusIcon className="h-2.5 w-2.5" />
              {config.label}
            </span>
            {/* Time info */}
            <span className="text-xs text-slate-400">{getTimeInfo()}</span>
          </div>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-2 shrink-0 ml-4">
        <ActionButtons form={form} />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// Action buttons per status
// -----------------------------------------------------------------------

function ActionButtons({ form }: { form: ConsentForm }) {
  const [sending, setSending] = useState(false);

  function notifyConsentEngine(message: string) {
    toast.info(message, { description: "Configure consent engine key in Settings → Integrations" });
  }

  async function handleResend() {
    setSending(true);
    try {
      const res = await fetch(`/api/consent-forms?action=send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.treatment,
          recipients: form.patient ? [{ name: form.patient, email: "" }] : [],
        }),
      });
      if (res.ok) {
        toast.success("Signature link resent successfully");
      } else {
        notifyConsentEngine("Consent engine not connected — resend unavailable");
      }
    } catch {
      notifyConsentEngine("Consent engine not connected — resend unavailable");
    } finally {
      setSending(false);
    }
  }

  if (form.status === "pending") {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={sending}
          onClick={handleResend}
        >
          <Send className="h-3.5 w-3.5" />
          {sending ? "Sending…" : "Resend Link"}
        </Button>
        <button
          onClick={() => notifyConsentEngine("Form viewer — connect consent engine key to view. Configure in Settings → Integrations")}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <FileSignature className="h-3.5 w-3.5" />
          View Form
        </button>
      </>
    );
  }

  if (form.status === "signed") {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => notifyConsentEngine("Signed document viewer — connect consent engine key to view")}
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          View Signed
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => notifyConsentEngine("PDF download — connect consent engine key to download")}
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </Button>
      </>
    );
  }

  if (form.status === "draft") {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => notifyConsentEngine("Form editor — connect consent engine key to edit")}
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          size="sm"
          className="gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 border-0"
          onClick={() => notifyConsentEngine("E-signature send — connect consent engine key to send")}
        >
          <Send className="h-3.5 w-3.5" />
          Send for Signature
        </Button>
      </>
    );
  }

  if (form.status === "template") {
    return (
      <>
        <Link
          href="/dashboard/consent-forms/generate"
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors h-8"
        >
          <Copy className="h-3.5 w-3.5" />
          Use Template
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => notifyConsentEngine("Template editor — connect consent engine key to edit")}
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </Button>
      </>
    );
  }

  return null;
}

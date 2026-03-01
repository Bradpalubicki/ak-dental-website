"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Shield,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  ExternalLink,
  Lock,
  Info,
  Download,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { markDocumentSent } from "./actions";
import type { LegalDocument } from "./page";

const CATEGORY_LABELS: Record<string, string> = {
  master_platform_agreement: "Master Platform Agreement",
  technology_services_authorization: "Technology Services Authorization",
  state_addendum: "State Addendum",
  sub_ba: "Sub-BA Agreement",
  nda: "NDA",
  term_sheet: "Term Sheet",
  subscription_agreement: "Subscription Agreement",
  ip_assignment: "IP Assignment",
  other: "Other",
};

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dotColor: "bg-amber-400",
  },
  sent: {
    label: "Sent",
    icon: Send,
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-400",
  },
  signed: {
    label: "Signed",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-400",
  },
  expired: {
    label: "Expired",
    icon: AlertTriangle,
    className: "bg-slate-50 text-slate-500 border-slate-200",
    dotColor: "bg-slate-400",
  },
  voided: {
    label: "Voided",
    icon: AlertTriangle,
    className: "bg-rose-50 text-rose-600 border-rose-200",
    dotColor: "bg-rose-400",
  },
};

function StatusBadge({ status }: { status: LegalDocument["status"] }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        config.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function DocumentCard({
  doc,
  isInternal,
}: {
  doc: LegalDocument;
  isInternal: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState(doc.status);
  const [downloading, setDownloading] = useState(false);

  function handleMarkSent() {
    startTransition(async () => {
      const result = await markDocumentSent(doc.id);
      if (result.success) {
        setLocalStatus("sent");
      }
    });
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/documents/generate?agreement=${encodeURIComponent(doc.agreement_number)}`);
      if (!res.ok) throw new Error("Generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.agreement_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // silently fail — user will see no download
    } finally {
      setDownloading(false);
    }
  }

  const categoryLabel = CATEGORY_LABELS[doc.category] ?? doc.category;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              doc.baa_included
                ? "bg-cyan-50 text-cyan-600"
                : "bg-slate-100 text-slate-500"
            )}
          >
            {doc.baa_included ? (
              <Shield className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-slate-900 text-sm">{doc.name}</p>
              {isInternal && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  <Lock className="h-2.5 w-2.5" />
                  Internal
                </span>
              )}
              {doc.baa_included && (
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-700">
                  <Shield className="h-2.5 w-2.5" />
                  BAA
                </span>
              )}
            </div>

            <p className="mt-0.5 text-[11px] font-mono text-slate-400">
              {doc.agreement_number}
            </p>

            <div className="mt-1.5 flex items-center gap-3 flex-wrap text-xs text-slate-500">
              <span>{categoryLabel}</span>
              <span className="text-slate-300">·</span>
              <span>{doc.client_entity}</span>
              {doc.effective_date && (
                <>
                  <span className="text-slate-300">·</span>
                  <span>
                    Effective{" "}
                    {new Date(doc.effective_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>

            {doc.description && (
              <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                {doc.description}
              </p>
            )}

            {doc.notes && (
              <div className="mt-2 flex items-start gap-1.5 rounded-md bg-amber-50 border border-amber-100 px-2.5 py-1.5">
                <Info className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  {doc.notes}
                </p>
              </div>
            )}

            {doc.signed_at && (
              <p className="mt-1.5 text-[11px] text-emerald-600 font-medium">
                Signed{" "}
                {new Date(doc.signed_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
            {!doc.signed_at && doc.sent_at && (
              <p className="mt-1.5 text-[11px] text-blue-600 font-medium">
                Sent{" "}
                {new Date(doc.sent_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={localStatus} />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Download className="h-3 w-3" />
              )}
              {downloading ? "Generating…" : "Download PDF"}
            </Button>
            {doc.document_url && (
              <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                  <ExternalLink className="h-3 w-3" />
                  View
                </Button>
              </a>
            )}
            {localStatus === "pending" && !isInternal && (
              <Button
                size="sm"
                className="h-7 gap-1.5 text-xs bg-cyan-600 hover:bg-cyan-700"
                onClick={handleMarkSent}
                disabled={isPending}
              >
                <Send className="h-3 w-3" />
                {isPending ? "Saving…" : "Mark Sent"}
              </Button>
            )}
            {localStatus === "sent" && !isInternal && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                disabled
              >
                <CheckCircle2 className="h-3 w-3" />
                Awaiting Signature
              </Button>
            )}
            {localStatus === "signed" && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 text-xs border-emerald-200 text-emerald-700"
                disabled
              >
                <CheckCircle2 className="h-3 w-3" />
                Executed
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DocumentsClient({
  documents,
  error,
}: {
  documents: LegalDocument[];
  error: string | null;
}) {
  const clientDocs = documents.filter((d) => d.category !== "sub_ba");
  const internalDocs = documents.filter((d) => d.category === "sub_ba");

  const signedCount = documents.filter((d) => d.status === "signed").length;
  const sentCount = documents.filter((d) => d.status === "sent").length;
  const pendingCount = documents.filter((d) => d.status === "pending").length;
  const allSigned = pendingCount === 0 && sentCount === 0 && documents.length > 0;

  const [activeTab, setActiveTab] = useState<"client" | "internal">("client");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Legal Documents
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Platform agreements and compliance documents with Dental Engine Partners LLC.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {allSigned ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              All Documents Executed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              {pendingCount + sentCount} Document{pendingCount + sentCount !== 1 ? "s" : ""} Pending
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: documents.length, color: "text-slate-700", bg: "bg-slate-50" },
          { label: "Signed", value: signedCount, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Pending", value: pendingCount + sentCount, color: "text-amber-700", bg: "bg-amber-50" },
        ].map((stat) => (
          <div key={stat.label} className={cn("rounded-xl border border-slate-200 px-4 py-3", stat.bg)}>
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {internalDocs.some((d) => d.status === "pending") && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-rose-700">
              HIPAA Compliance Gap — Sub-BA Agreement Not Executed
            </p>
            <p className="text-xs text-rose-600 mt-0.5">
              The Sub-Business Associate Agreement between Dental Engine Partners LLC and NuStack Digital Ventures LLC
              is required by 45 CFR 164.308(b)(2) before any PHI flows through the platform.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Database error: {error}
        </div>
      )}

      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          {(
            [
              { key: "client", label: "Your Documents", count: clientDocs.length },
              { key: "internal", label: "Internal", count: internalDocs.length },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "border-cyan-600 text-cyan-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
              <span className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                activeTab === tab.key ? "bg-cyan-100 text-cyan-600" : "bg-slate-100 text-slate-500"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "client" && (
        <div className="space-y-3">
          {clientDocs.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-slate-400">
                <FileText className="mx-auto h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No documents yet.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                AK Ultimate Dental LLC — Phase 0 Agreements
              </p>
              {clientDocs.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} isInternal={false} />
              ))}
              <p className="text-[11px] text-slate-400 pt-1">
                All documents must be executed before PHI flows to the platform.
              </p>
            </>
          )}
        </div>
      )}

      {activeTab === "internal" && (
        <div className="space-y-3">
          {internalDocs.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-slate-400">
                <Lock className="mx-auto h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No internal documents.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Lock className="h-3 w-3 text-slate-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Internal — Not shared with AK Ultimate Dental
                </p>
              </div>
              {internalDocs.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} isInternal={true} />
              ))}
            </>
          )}
        </div>
      )}

      {documents.some((d) => d.status === "pending") && (
        <Card className="border-cyan-100 bg-cyan-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-cyan-700 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Execution Order
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-cyan-600 space-y-1.5">
            {[
              "Sub-BA Agreement (DEP ↔ NuStack) — executed internally first",
              "Master Platform Agreement + BAA — AK Ultimate Dental signs",
              "Technology Services Authorization — AK Ultimate Dental signs",
              "Nevada SB 370 Processing Addendum — AK Ultimate Dental signs",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-200 text-[9px] font-bold text-cyan-700">
                  {i + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

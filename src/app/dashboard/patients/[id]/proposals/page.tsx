export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { createServiceSupabase } from "@/lib/supabase/server";
import { Plus, FileText } from "lucide-react";
import { ProposalStatusBadge } from "./proposal-status-badge";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);

export default async function PatientProposalsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServiceSupabase();

  const [patientRes, proposalsRes] = await Promise.all([
    supabase
      .from("oe_patients")
      .select("id, first_name, last_name")
      .eq("id", id)
      .single(),
    supabase
      .from("oe_proposals")
      .select(`
        id, title, status, total_fee, insurance_estimate, patient_estimate,
        sign_token, sent_at, signed_at, signature_name, expires_at, created_at,
        provider:oe_providers(first_name, last_name)
      `)
      .eq("patient_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!patientRes.data) notFound();

  const patient = patientRes.data;
  const proposals = proposalsRes.data ?? [];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/dashboard/patients" className="hover:text-slate-700">Patients</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">{patient.first_name} {patient.last_name}</span>
            <span>/</span>
            <span>Proposals</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Treatment Proposals</h1>
          <p className="text-sm text-slate-500 mt-0.5">{proposals.length} proposal{proposals.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href={`/dashboard/patients/${id}/proposals/new`}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Proposal
        </Link>
      </div>

      {/* Proposals List */}
      {proposals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mx-auto mb-4">
            <FileText className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700 mb-1">No proposals yet</h3>
          <p className="text-xs text-slate-500 mb-4">Create a chairside treatment proposal and send it directly to the patient.</p>
          <Link
            href={`/dashboard/patients/${id}/proposals/new`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Create First Proposal
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((p) => {
            const providerData = Array.isArray(p.provider) ? p.provider[0] : p.provider;
            const providerName = providerData
              ? `Dr. ${(providerData as { first_name: string; last_name: string }).first_name} ${(providerData as { first_name: string; last_name: string }).last_name}`
              : "—";

            return (
              <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 flex-shrink-0">
                      <FileText className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{p.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 flex-wrap">
                        <span>{providerName}</span>
                        <span>·</span>
                        <span>{new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        {p.sent_at && (
                          <>
                            <span>·</span>
                            <span>Sent {new Date(p.sent_at).toLocaleDateString()}</span>
                          </>
                        )}
                        {p.signed_at && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-600">Signed by {p.signature_name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-slate-900">{fmt(p.patient_estimate)}</p>
                      <p className="text-[10px] text-slate-400">patient cost</p>
                    </div>
                    <ProposalStatusBadge status={p.status} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 flex-wrap">
                  {appUrl && (
                    <a
                      href={`${appUrl}/proposal/${p.sign_token}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      View Patient Link
                    </a>
                  )}
                  <a
                    href={`/api/proposals/${p.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Download PDF
                  </a>
                  {(p.status === "draft" || p.status === "sent") && (
                    <SendProposalButton proposalId={p.id} patientId={id} />
                  )}
                  {p.status === "draft" && (
                    <Link
                      href={`/dashboard/patients/${id}/proposals/new?edit=${p.id}`}
                      className="rounded-lg border border-cyan-200 px-3 py-1.5 text-xs font-medium text-cyan-600 hover:bg-cyan-50 transition-colors"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Server-rendered send button placeholder — client interactivity via proposal-actions.tsx
function SendProposalButton({ proposalId, patientId }: { proposalId: string; patientId: string }) {
  return (
    <Link
      href={`/dashboard/patients/${patientId}/proposals/new?send=${proposalId}`}
      className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700 transition-colors"
    >
      Send to Patient
    </Link>
  );
}

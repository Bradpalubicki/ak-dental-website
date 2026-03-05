export const dynamic = "force-dynamic";

import Link from "next/link";
import { createServiceSupabase } from "@/lib/supabase/server";
import { FileText, Plus, Clock, CheckCircle2, Send } from "lucide-react";
import { ProposalStatusBadge } from "../patients/[id]/proposals/proposal-status-badge";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

export default async function ProposalsDashboardPage() {
  const supabase = createServiceSupabase();

  const { data: proposals } = await supabase
    .from("oe_proposals")
    .select(`
      id, title, status, patient_estimate, total_fee, insurance_estimate,
      sign_token, sent_at, signed_at, signature_name, created_at, expires_at,
      patient:oe_patients(id, first_name, last_name),
      provider:oe_providers(first_name, last_name)
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  const allProposals = proposals ?? [];

  const stats = {
    draft: allProposals.filter((p) => p.status === "draft").length,
    sent: allProposals.filter((p) => p.status === "sent" || p.status === "viewed").length,
    accepted: allProposals.filter((p) => p.status === "accepted").length,
    total: allProposals.length,
    revenue: allProposals
      .filter((p) => p.status === "accepted")
      .reduce((s, p) => s + (p.patient_estimate ?? 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Treatment Proposals</h1>
          <p className="text-sm text-slate-500 mt-0.5">{stats.total} total · {stats.sent} pending patient response</p>
        </div>
        <Link
          href="/dashboard/patients"
          className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Proposal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-slate-400" />
            <p className="text-xs text-slate-500">Draft</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.draft}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Send className="h-4 w-4 text-blue-400" />
            <p className="text-xs text-slate-500">Awaiting Response</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <p className="text-xs text-slate-500">Accepted</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{stats.accepted}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <p className="text-xs text-slate-500">Accepted Revenue</p>
          </div>
          <p className="text-2xl font-bold text-amber-600">{fmt(stats.revenue)}</p>
        </div>
      </div>

      {/* Proposals Table */}
      {allProposals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mx-auto mb-3">
            <FileText className="h-6 w-6 text-slate-300" />
          </div>
          <p className="text-sm font-medium text-slate-600">No proposals yet</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Open a patient profile and click &quot;New Proposal&quot; to create your first chairside treatment plan.
          </p>
          <Link
            href="/dashboard/patients"
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Go to Patients
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Patient Cost</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allProposals.map((p) => {
                const patientData = Array.isArray(p.patient) ? p.patient[0] : p.patient;
                const patientName = patientData
                  ? `${(patientData as { first_name: string; last_name: string }).first_name} ${(patientData as { first_name: string; last_name: string }).last_name}`
                  : "—";
                const patientId = patientData ? (patientData as { id: string }).id : null;

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      {patientId ? (
                        <Link href={`/dashboard/patients/${patientId}/proposals`} className="text-sm font-medium text-slate-900 hover:text-cyan-600">
                          {patientName}
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-500">{patientName}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-slate-700 max-w-[200px] truncate">{p.title}</p>
                    </td>
                    <td className="px-5 py-3">
                      <ProposalStatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-sm font-semibold text-slate-900">{fmt(p.patient_estimate)}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-xs text-slate-400">
                        {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/api/proposals/${p.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          PDF
                        </a>
                        {patientId && (
                          <Link
                            href={`/dashboard/patients/${patientId}/proposals`}
                            className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

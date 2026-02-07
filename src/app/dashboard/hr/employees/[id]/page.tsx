export const dynamic = "force-dynamic";

import Link from "next/link";
import { createServiceSupabase } from "@/lib/supabase/server";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  FileText,
  AlertTriangle,
  Star,
  MessageSquare,
  Shield,
  Clock,
  CheckCircle2,
  Monitor,
  Plus,
} from "lucide-react";

const roleLabels: Record<string, string> = {
  dentist: "Dentist",
  hygienist: "Hygienist",
  assistant: "Dental Assistant",
  front_desk: "Front Desk",
  office_manager: "Office Manager",
  staff: "Staff",
};

const typeConfig: Record<string, { label: string; color: string; icon: typeof FileText }> = {
  disciplinary: { label: "Disciplinary", color: "bg-red-100 text-red-700", icon: AlertTriangle },
  incident_report: { label: "Incident Report", color: "bg-orange-100 text-orange-700", icon: Shield },
  performance_review: { label: "Performance Review", color: "bg-blue-100 text-blue-700", icon: Star },
  coaching_note: { label: "Coaching Note", color: "bg-cyan-100 text-cyan-700", icon: MessageSquare },
  general: { label: "General", color: "bg-slate-100 text-slate-600", icon: FileText },
  advisor_conversation: { label: "Advisor Consultation", color: "bg-purple-100 text-purple-700", icon: MessageSquare },
};

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-600", icon: FileText },
  pending_signature: { label: "Pending Signature", color: "bg-amber-100 text-amber-700", icon: Clock },
  acknowledged: { label: "Acknowledged", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-700", icon: AlertTriangle },
};

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServiceSupabase();

  const [empRes, docsRes] = await Promise.all([
    supabase.from("oe_employees").select("*").eq("id", id).single(),
    supabase
      .from("oe_hr_documents")
      .select("*, acknowledgments:oe_document_acknowledgments(*)")
      .eq("employee_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const employee = empRes.data;
  const documents = docsRes.data || [];

  if (!employee) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-500">Employee not found.</p>
      </div>
    );
  }

  const hireDate = employee.hire_date
    ? new Date(employee.hire_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/hr/employees"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4 text-slate-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">
            {employee.first_name} {employee.last_name}
          </h1>
          <p className="text-sm text-slate-500">
            {roleLabels[employee.role] || employee.role} &middot;{" "}
            <span className="capitalize">{employee.status}</span>
          </p>
        </div>
        <Link
          href={`/dashboard/hr/documents/new?employee=${id}`}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-cyan-700 hover:to-blue-700 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New Document
        </Link>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xl">
            {employee.first_name[0]}
            {employee.last_name[0]}
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 flex-1">
            {employee.email && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" />
                {employee.email}
              </div>
            )}
            {employee.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="h-4 w-4 text-slate-400" />
                {employee.phone}
              </div>
            )}
            {hireDate && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4 text-slate-400" />
                Hired {hireDate}
              </div>
            )}
          </div>
        </div>
        {employee.notes && (
          <p className="mt-4 text-sm text-slate-500 border-t border-slate-100 pt-4">
            {employee.notes}
          </p>
        )}
      </div>

      {/* HR File */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            HR File ({documents.length} document{documents.length !== 1 ? "s" : ""})
          </h2>
        </div>

        {documents.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {/* eslint-disable @typescript-eslint/no-explicit-any */}
            {documents.map((doc: any) => {
              const tConf = typeConfig[doc.type] || typeConfig.general;
              const sConf = statusConfig[doc.status] || statusConfig.draft;
              const TypeIcon = tConf.icon;
              const StatusIcon = sConf.icon;

              return (
                <div key={doc.id} className="px-6 py-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tConf.color}`}>
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {doc.title}
                        </h3>
                        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${sConf.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {sConf.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {tConf.label} &middot; Created by {doc.created_by} &middot;{" "}
                        {new Date(doc.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2 whitespace-pre-line">
                        {doc.content}
                      </p>
                      {doc.acknowledgments && doc.acknowledgments.length > 0 && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" />
                          Signed by {doc.acknowledgments[0].typed_name} on{" "}
                          {new Date(doc.acknowledgments[0].acknowledged_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {doc.status === "pending_signature" && (
                      <Link
                        href={`/dashboard/hr/documents/${doc.id}/present`}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-100"
                      >
                        <Monitor className="h-3.5 w-3.5" />
                        Present for Signature
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
            {/* eslint-enable @typescript-eslint/no-explicit-any */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">No documents on file.</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { CheckCircle2, XCircle, AlertTriangle, Send, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  isClinical: boolean;
  oshaRequired: boolean;
  hipaaComplete: boolean;
  oshaComplete: boolean;
  completedRequired: number;
  totalRequired: number;
  modules: Record<string, { passed: boolean; completed_at: string } | null>;
  alertOsha: boolean;
  createdAt: number;
}

const MODULE_LABELS: Record<string, string> = {
  hipaa: "HIPAA",
  osha: "OSHA",
  scheduling_insurance: "Scheduling",
  clinical_documentation: "Clinical Docs",
  treatment_presentation: "Treatment Pres.",
  collections_financials: "Collections",
};

const ROLE_LABELS: Record<string, string> = {
  "owner-dentist": "Owner Dentist",
  "associate-dentist": "Associate Dentist",
  "office-manager": "Office Manager",
  "front-desk": "Front Desk",
  "dental-assistant": "Dental Assistant",
};

async function sendReminder(email: string, name: string) {
  try {
    const res = await fetch("/api/training/send-reminder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    if (res.ok) {
      toast.success(`Reminder sent to ${name}`);
    } else {
      toast.error("Failed to send reminder");
    }
  } catch {
    toast.error("Failed to send reminder");
  }
}

export function StaffTrainingClient({ staff }: { staff: StaffMember[] }) {
  const alertCount = staff.filter((s) => s.alertOsha).length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-5 w-5 text-cyan-600" />
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Staff Training Tracker</h1>
          <p className="text-sm text-slate-500">{staff.length} team members · Track HIPAA, OSHA, and platform training.</p>
        </div>
      </div>

      {alertCount > 0 && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-800 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span><strong>{alertCount} clinical staff</strong> {alertCount === 1 ? "has" : "have"} not completed OSHA training and {alertCount === 1 ? "has" : "have"} been active for more than 7 days.</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium text-slate-700">Staff Member</th>
              <th className="text-left px-4 py-3 font-medium text-slate-700">Role</th>
              <th className="text-center px-3 py-3 font-medium text-slate-700">HIPAA</th>
              <th className="text-center px-3 py-3 font-medium text-slate-700">OSHA</th>
              <th className="text-center px-3 py-3 font-medium text-slate-700">Scheduling</th>
              <th className="text-center px-3 py-3 font-medium text-slate-700">Clinical</th>
              <th className="text-center px-3 py-3 font-medium text-slate-700">Progress</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map((s) => (
              <tr
                key={s.id}
                className={cn(
                  "hover:bg-slate-50 transition-colors",
                  s.alertOsha ? "bg-red-50/50" : ""
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {s.alertOsha && <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                    <div>
                      <p className="font-medium text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                    {ROLE_LABELS[s.role] || s.role}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  {s.hipaaComplete
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto" />
                    : <XCircle className="h-4 w-4 text-red-400 mx-auto" />}
                </td>
                <td className="px-3 py-3 text-center">
                  {!s.oshaRequired
                    ? <span className="text-slate-300 text-xs">N/A</span>
                    : s.oshaComplete
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto" />
                    : <XCircle className={cn("h-4 w-4 mx-auto", s.alertOsha ? "text-red-500" : "text-red-400")} />}
                </td>
                <td className="px-3 py-3 text-center">
                  {s.modules.scheduling_insurance?.passed
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto" />
                    : <span className="text-slate-300">—</span>}
                </td>
                <td className="px-3 py-3 text-center">
                  {s.modules.clinical_documentation?.passed
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto" />
                    : <span className="text-slate-300">—</span>}
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: s.totalRequired > 0 ? `${(s.completedRequired / s.totalRequired) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{s.completedRequired}/{s.totalRequired}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {(!s.hipaaComplete || (s.oshaRequired && !s.oshaComplete)) && (
                    <button
                      onClick={() => sendReminder(s.email, s.name)}
                      className="flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                      <Send className="h-3 w-3" /> Remind
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Complete</span>
        <span className="flex items-center gap-1"><XCircle className="h-3.5 w-3.5 text-red-400" /> Not complete</span>
        <span className="flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5 text-red-500" /> Overdue (&gt;7 days)</span>
        <span className="flex items-center gap-1 ml-2 text-slate-300">— N/A for role</span>
      </div>
    </div>
  );
}

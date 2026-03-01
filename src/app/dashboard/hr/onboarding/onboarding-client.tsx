"use client";

import { useState } from "react";
import {
  Send, Plus, CheckCircle2, Clock, XCircle, Eye, FileText,
  Copy, Loader2, Users, ChevronDown, ChevronRight, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────── */
interface OfferLetter {
  id: string;
  created_at: string;
  candidate_first_name: string;
  candidate_last_name: string;
  candidate_email: string;
  job_title: string;
  department: string;
  employment_type: string;
  start_date: string | null;
  salary_amount: number | null;
  salary_unit: string;
  hourly_rate: number | null;
  status: string;
  sent_at: string | null;
  signed_at: string | null;
  expires_at: string | null;
  employee_id: string | null;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  hire_date: string | null;
  status: string;
}

interface OnboardingTask {
  id: string;
  employee_id: string;
  task_key: string;
  task_label: string;
  category: string;
  status: string;
  completed_at: string | null;
}

interface Props {
  initialOffers: OfferLetter[];
  recentEmployees: Employee[];
  onboardingTasks: OnboardingTask[];
}

/* ─── Helpers ────────────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft:     { label: "Draft",     color: "bg-slate-100 text-slate-600",     icon: FileText   },
  sent:      { label: "Sent",      color: "bg-blue-100 text-blue-700",       icon: Send       },
  viewed:    { label: "Viewed",    color: "bg-amber-100 text-amber-700",     icon: Eye        },
  signed:    { label: "Signed",    color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  declined:  { label: "Declined",  color: "bg-red-100 text-red-700",         icon: XCircle    },
  expired:   { label: "Expired",   color: "bg-slate-100 text-slate-500",     icon: Clock      },
  withdrawn: { label: "Withdrawn", color: "bg-slate-100 text-slate-400",     icon: XCircle    },
};

const DEPT_OPTIONS = ["Clinical", "Administrative", "Management"];
const TYPE_OPTIONS = [
  { value: "FULL_TIME",   label: "Full-Time"   },
  { value: "PART_TIME",   label: "Part-Time"   },
  { value: "CONTRACTOR",  label: "Contract"    },
  { value: "TEMPORARY",   label: "Temporary"   },
];

const DEFAULT_LETTER = `Dear [Candidate Name],

We are pleased to offer you the position of [Job Title] at AK Ultimate Dental. We believe your skills and experience make you an excellent addition to our team.

This offer includes:
• Position: [Job Title]
• Department: [Department]
• Employment Type: [Employment Type]
• Start Date: [Start Date]
• Compensation: [Salary]

This offer is contingent upon successful completion of a background check and verification of your eligibility to work in the United States.

Please review the details of this offer carefully. By signing below, you confirm your acceptance of this position and the terms described above.

We look forward to welcoming you to the AK Ultimate Dental family. If you have any questions, please do not hesitate to reach out.

Warm regards,
The AK Ultimate Dental Team`;

/* ─── New Offer Form ─────────────────────────────────────────────────── */
function NewOfferForm({ onCreated }: { onCreated: (offer: OfferLetter) => void }) {
  const [form, setForm] = useState({
    candidate_first_name: "", candidate_last_name: "", candidate_email: "", candidate_phone: "",
    job_title: "", department: "Clinical", employment_type: "FULL_TIME",
    start_date: "", salary_amount: "", salary_unit: "YEAR", hourly_rate: "",
    letter_body: DEFAULT_LETTER, custom_message: "", send_now: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));
  const inputCls = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500";
  const labelCls = "block text-xs font-medium text-slate-700 mb-1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const body = {
      ...form,
      salary_amount: form.salary_amount ? parseInt(form.salary_amount) : null,
      hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : null,
      start_date: form.start_date || null,
      candidate_phone: form.candidate_phone || null,
      custom_message: form.custom_message || null,
    };
    const res = await fetch("/api/hr/offer-letters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error?.letter_body?.[0] || data.error || "Failed to create"); return; }
    onCreated(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-slate-900">New Offer Letter</h3>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Candidate</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>First Name *</label>
            <input className={inputCls} value={form.candidate_first_name} onChange={(e) => set("candidate_first_name", e.target.value)} required placeholder="Jane" />
          </div>
          <div>
            <label className={labelCls}>Last Name *</label>
            <input className={inputCls} value={form.candidate_last_name} onChange={(e) => set("candidate_last_name", e.target.value)} required placeholder="Smith" />
          </div>
          <div>
            <label className={labelCls}>Email *</label>
            <input className={inputCls} type="email" value={form.candidate_email} onChange={(e) => set("candidate_email", e.target.value)} required placeholder="jane@email.com" />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input className={inputCls} value={form.candidate_phone} onChange={(e) => set("candidate_phone", e.target.value)} placeholder="(702) 555-0100" />
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Position</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={labelCls}>Job Title *</label>
            <input className={inputCls} value={form.job_title} onChange={(e) => set("job_title", e.target.value)} required placeholder="Dental Hygienist" />
          </div>
          <div>
            <label className={labelCls}>Department</label>
            <select className={inputCls} value={form.department} onChange={(e) => set("department", e.target.value)}>
              {DEPT_OPTIONS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Type</label>
            <select className={inputCls} value={form.employment_type} onChange={(e) => set("employment_type", e.target.value)}>
              {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Start Date</label>
            <input className={inputCls} type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Salary (annual USD)</label>
            <input className={inputCls} type="number" value={form.salary_amount} onChange={(e) => set("salary_amount", e.target.value)} placeholder="75000" />
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Letter</p>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Personal Note (optional — shown above the letter)</label>
            <textarea className={inputCls} rows={2} value={form.custom_message} onChange={(e) => set("custom_message", e.target.value)} placeholder="We were really impressed by your interview and can&apos;t wait to have you on the team..." />
          </div>
          <div>
            <label className={labelCls}>Letter Body *</label>
            <textarea className={inputCls} rows={12} value={form.letter_body} onChange={(e) => set("letter_body", e.target.value)} required />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 transition-colors">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          Save as Draft
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => { set("send_now", true); setTimeout(() => document.getElementById("offer-submit-send")?.click(), 50); }}
          className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Create & Send Link
        </button>
        <input id="offer-submit-send" type="submit" className="hidden" />
      </div>
    </form>
  );
}

/* ─── Onboarding Checklist ───────────────────────────────────────────── */
function OnboardingChecklist({ employee, tasks, onTaskComplete }: {
  employee: Employee;
  tasks: OnboardingTask[];
  onTaskComplete: (taskId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const completed = tasks.filter((t) => t.status === "completed").length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const CATEGORY_ORDER = ["paperwork", "compliance", "systems", "training"];

  const grouped = CATEGORY_ORDER.reduce<Record<string, OnboardingTask[]>>((acc, cat) => {
    acc[cat] = tasks.filter((t) => t.category === cat);
    return acc;
  }, {});

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 flex-shrink-0">
            <Users className="h-4 w-4 text-cyan-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{employee.first_name} {employee.last_name}</p>
            <p className="text-xs text-slate-500">{employee.role} · Hired {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : "recently"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">{completed}/{total}</p>
            <p className="text-xs text-slate-500">tasks done</p>
          </div>
          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-4">
          {CATEGORY_ORDER.map((cat) => {
            const catTasks = grouped[cat];
            if (!catTasks?.length) return null;
            return (
              <div key={cat}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 capitalize">{cat}</p>
                <div className="space-y-1.5">
                  {catTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3">
                      <button
                        onClick={() => task.status !== "completed" && onTaskComplete(task.id)}
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border-2 flex-shrink-0 transition-colors",
                          task.status === "completed"
                            ? "border-emerald-500 bg-emerald-500 cursor-default"
                            : "border-slate-300 hover:border-cyan-500"
                        )}
                      >
                        {task.status === "completed" && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                      </button>
                      <span className={cn("text-sm flex-1", task.status === "completed" ? "text-slate-400 line-through" : "text-slate-700")}>
                        {task.task_label}
                      </span>
                      {task.completed_at && (
                        <span className="text-[10px] text-slate-400">{new Date(task.completed_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────── */
export function HrOnboardingClient({ initialOffers, recentEmployees, onboardingTasks }: Props) {
  const [offers, setOffers] = useState<OfferLetter[]>(initialOffers);
  const [tasks, setTasks] = useState<OnboardingTask[]>(onboardingTasks);
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const sentCount   = offers.filter((o) => o.status === "sent").length;
  const signedCount = offers.filter((o) => o.status === "signed").length;
  const pendingCount = offers.filter((o) => ["sent","viewed"].includes(o.status)).length;

  const copyLink = (offer: OfferLetter) => {
    const url = `${window.location.origin}/offer/${offer.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(offer.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendOffer = async (id: string) => {
    setSendingId(id);
    await fetch(`/api/hr/offer-letters/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "sent" }),
    });
    setOffers((prev) => prev.map((o) => o.id === id ? { ...o, status: "sent", sent_at: new Date().toISOString() } : o));
    setSendingId(null);
  };

  const withdrawOffer = async (id: string) => {
    if (!confirm("Withdraw this offer? The candidate link will stop working.")) return;
    await fetch(`/api/hr/offer-letters/${id}`, { method: "DELETE" });
    setOffers((prev) => prev.map((o) => o.id === id ? { ...o, status: "withdrawn" } : o));
  };

  const completeTask = async (taskId: string) => {
    await fetch(`/api/hr/onboarding-tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: "completed", completed_at: new Date().toISOString() } : t));
  };

  // Group tasks by employee
  const employeeTaskMap = recentEmployees.reduce<Record<string, OnboardingTask[]>>((acc, emp) => {
    acc[emp.id] = tasks.filter((t) => t.employee_id === emp.id);
    return acc;
  }, {});

  const employeesWithTasks = recentEmployees.filter((e) => (employeeTaskMap[e.id]?.length ?? 0) > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Offers & Onboarding</h1>
          <p className="text-sm text-slate-500 mt-1">
            {pendingCount} pending · {signedCount} signed · {offers.length} total offers
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Offer Letter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending Signature", value: pendingCount, color: "text-amber-600" },
          { label: "Signed",            value: signedCount,  color: "text-emerald-600" },
          { label: "Total Sent",        value: sentCount + signedCount, color: "text-cyan-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* New offer form */}
      {showForm && (
        <NewOfferForm
          onCreated={(offer) => {
            setOffers((prev) => [offer, ...prev]);
            setShowForm(false);
          }}
        />
      )}

      {/* Offer letters list */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Offer Letters</h2>
        {offers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            <FileText className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p className="font-medium text-sm">No offer letters yet</p>
            <p className="text-xs mt-1">Create your first offer letter above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map((offer) => {
              const sc = STATUS_CONFIG[offer.status] ?? STATUS_CONFIG.draft;
              const Icon = sc.icon;
              const isExpiringSoon = offer.expires_at && new Date(offer.expires_at) < new Date(Date.now() + 86400000 * 2) && !["signed","declined","expired","withdrawn"].includes(offer.status);

              return (
                <div key={offer.id} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium", sc.color)}>
                          <Icon className="h-3 w-3" />
                          {sc.label}
                        </span>
                        {isExpiringSoon && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
                            <AlertCircle className="h-3 w-3" />
                            Expiring soon
                          </span>
                        )}
                      </div>
                      <p className="text-base font-semibold text-slate-900">
                        {offer.candidate_first_name} {offer.candidate_last_name}
                      </p>
                      <p className="text-sm text-slate-600">{offer.job_title} · {offer.department}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span>{offer.candidate_email}</span>
                        {offer.start_date && <span>Start: {new Date(offer.start_date).toLocaleDateString()}</span>}
                        {offer.signed_at && <span className="text-emerald-600">Signed {new Date(offer.signed_at).toLocaleDateString()}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Copy link */}
                      {!["declined","expired","withdrawn"].includes(offer.status) && (
                        <button
                          onClick={() => copyLink(offer)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                          title="Copy signing link"
                        >
                          <Copy className="h-3 w-3" />
                          {copiedId === offer.id ? "Copied!" : "Copy Link"}
                        </button>
                      )}
                      {/* Send */}
                      {offer.status === "draft" && (
                        <button
                          onClick={() => sendOffer(offer.id)}
                          disabled={sendingId === offer.id}
                          className="flex items-center gap-1 rounded-lg bg-cyan-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-cyan-700 disabled:opacity-50 transition-colors"
                        >
                          {sendingId === offer.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                          Send
                        </button>
                      )}
                      {/* Withdraw */}
                      {["sent","viewed"].includes(offer.status) && (
                        <button
                          onClick={() => withdrawOffer(offer.id)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                        >
                          <XCircle className="h-3 w-3" />
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Onboarding checklists */}
      {employeesWithTasks.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">New Hire Onboarding</h2>
          <div className="space-y-3">
            {employeesWithTasks.map((emp) => (
              <OnboardingChecklist
                key={emp.id}
                employee={emp}
                tasks={employeeTaskMap[emp.id] ?? []}
                onTaskComplete={completeTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

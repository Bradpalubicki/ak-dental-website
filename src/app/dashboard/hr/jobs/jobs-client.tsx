"use client";

import { useState } from "react";
import {
  Briefcase, Plus, Eye, Pause, CheckCircle2, Archive,
  ExternalLink, Loader2, AlertCircle, Zap, RefreshCw,
  Building2, Unlink, Download,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface JobPosting {
  id: string;
  title: string;
  slug: string;
  employment_type: string;
  department: string;
  description: string;
  tags: string[];
  salary_min: number | null;
  salary_max: number | null;
  salary_unit: string;
  status: string;
  posted_at: string | null;
  views: number;
  applications: number;
}

interface GustoConnection {
  status: string;
  gusto_company_name?: string;
  last_synced_at?: string;
  error_message?: string;
}

interface Props {
  initialJobs: JobPosting[];
  gustoConnection: GustoConnection;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  active:   { label: "Active",   color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  draft:    { label: "Draft",    color: "bg-slate-50  text-slate-600   border-slate-200",    dot: "bg-slate-400"  },
  paused:   { label: "Paused",   color: "bg-amber-50  text-amber-700   border-amber-200",    dot: "bg-amber-500"  },
  filled:   { label: "Filled",   color: "bg-cyan-50   text-cyan-700    border-cyan-200",     dot: "bg-cyan-500"   },
  archived: { label: "Archived", color: "bg-rose-50   text-rose-700    border-rose-200",     dot: "bg-rose-400"   },
};

function employmentLabel(t: string) {
  return ({ FULL_TIME: "Full-Time", PART_TIME: "Part-Time", CONTRACTOR: "Contract", TEMPORARY: "Temp", INTERN: "Intern" })[t] ?? t;
}

function salaryLabel(job: JobPosting): string | null {
  if (!job.salary_min && !job.salary_max) return null;
  const unit = job.salary_unit === "YEAR" ? "/yr" : job.salary_unit === "HOUR" ? "/hr" : "";
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  if (job.salary_min && job.salary_max) return `${fmt(job.salary_min)}–${fmt(job.salary_max)}${unit}`;
  if (job.salary_min) return `From ${fmt(job.salary_min)}${unit}`;
  return `Up to ${fmt(job.salary_max!)}${unit}`;
}

/* ─── Gusto Connection Card ─────────────────────────────────────────── */
function GustoCard({ conn, onExport }: { conn: GustoConnection; onExport: () => void }) {
  const [disconnecting, setDisconnecting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleDisconnect = async () => {
    if (!confirm("Disconnect Gusto? You can reconnect at any time.")) return;
    setDisconnecting(true);
    await fetch("/api/hr/gusto/disconnect", { method: "POST" });
    window.location.reload();
  };

  const handleExport = async () => {
    setExporting(true);
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
    const end = today.toISOString().split("T")[0];

    const res = await fetch("/api/hr/gusto/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pay_period_start: start, pay_period_end: end }),
    });
    const data = await res.json();
    setExporting(false);
    onExport();

    // Download CSV if not sent to Gusto directly
    if (!data.connected || data.status !== "sent") {
      const rows = [
        ["First Name", "Last Name", "Email", "Role", "Regular Hours", "OT Hours", "Hourly Rate", "Regular Pay", "OT Pay", "Gross Pay"],
        ...(data.payload || []).map((e: Record<string, unknown>) => [
          e.first_name, e.last_name, e.email ?? "", e.role,
          e.regular_hours, e.overtime_hours, e.hourly_rate,
          e.regular_pay, e.overtime_pay, e.gross_pay,
        ]),
      ];
      const csv = rows.map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payroll-export-${start}.csv`;
      a.click();
    }
  };

  const isConnected = conn.status === "connected";
  const isError = conn.status === "error";

  return (
    <div className={cn(
      "rounded-xl border p-5",
      isConnected ? "border-emerald-200 bg-emerald-50/40" : isError ? "border-red-200 bg-red-50/40" : "border-slate-200 bg-white"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", isConnected ? "bg-emerald-100" : "bg-slate-100")}>
            <Building2 className={cn("h-5 w-5", isConnected ? "text-emerald-600" : "text-slate-500")} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">Gusto Payroll</p>
              {isConnected && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Connected
                </span>
              )}
              {isError && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">Error</span>
              )}
              {!isConnected && !isError && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">Not Connected</span>
              )}
            </div>
            {isConnected && conn.gusto_company_name && (
              <p className="text-xs text-slate-500 mt-0.5">{conn.gusto_company_name}</p>
            )}
            {isConnected && conn.last_synced_at && (
              <p className="text-[11px] text-slate-400">Last synced {new Date(conn.last_synced_at).toLocaleDateString()}</p>
            )}
            {isError && conn.error_message && (
              <p className="text-xs text-red-600 mt-0.5">{conn.error_message}</p>
            )}
            {!isConnected && !isError && (
              <p className="text-xs text-slate-500 mt-0.5">Connect to sync employees and export payroll directly</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {isConnected ? (
            <>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-700 disabled:opacity-50 transition-colors"
              >
                {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                {exporting ? "Exporting…" : "Export Payroll"}
              </button>
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                {disconnecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Unlink className="h-3.5 w-3.5" />}
                Disconnect
              </button>
            </>
          ) : (
            <a
              href="/api/hr/gusto/connect"
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 transition-colors"
            >
              <Zap className="h-3.5 w-3.5" />
              Connect Gusto
            </a>
          )}
        </div>
      </div>

      {!isConnected && (
        <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 space-y-1">
          <p className="font-medium text-slate-700">How it works:</p>
          <p>1. Click &ldquo;Connect Gusto&rdquo; — you will be redirected to Gusto to authorize access.</p>
          <p>2. Your practice pays Gusto directly. We only connect to sync data.</p>
          <p>3. Once connected, export payroll as CSV or push directly to Gusto each pay period.</p>
          <p className="text-slate-400 pt-1">Don&apos;t have Gusto? <a href="https://gusto.com" target="_blank" rel="noopener noreferrer" className="text-cyan-600 underline hover:no-underline">Sign up at gusto.com →</a></p>
        </div>
      )}
    </div>
  );
}

/* ─── New Job Form ───────────────────────────────────────────────────── */
function NewJobForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({
    title: "", slug: "", employment_type: "FULL_TIME", department: "Clinical",
    description: "", requirements: "", tags: "", salary_min: "", salary_max: "",
    salary_unit: "YEAR", status: "draft",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
    "-" + form.employment_type.toLowerCase().replace("_", "");

  const set = (k: string, v: string) => {
    setForm((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "title") next.slug = autoSlug(v);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/hr/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        salary_min: form.salary_min ? parseInt(form.salary_min) : undefined,
        salary_max: form.salary_max ? parseInt(form.salary_max) : undefined,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Failed to create"); return; }
    onCreated();
  };

  const inputCls = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500";
  const labelCls = "block text-xs font-medium text-slate-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-900">New Job Posting</h3>
      {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={labelCls}>Job Title *</label>
          <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="Dental Hygienist" />
        </div>
        <div>
          <label className={labelCls}>URL Slug *</label>
          <input className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} required placeholder="dental-hygienist-fulltime" />
        </div>
        <div>
          <label className={labelCls}>Department</label>
          <select className={inputCls} value={form.department} onChange={(e) => set("department", e.target.value)}>
            <option value="Clinical">Clinical</option>
            <option value="Administrative">Administrative</option>
            <option value="Management">Management</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Type</label>
          <select className={inputCls} value={form.employment_type} onChange={(e) => set("employment_type", e.target.value)}>
            <option value="FULL_TIME">Full-Time</option>
            <option value="PART_TIME">Part-Time</option>
            <option value="CONTRACTOR">Contract</option>
            <option value="TEMPORARY">Temporary</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="draft">Draft</option>
            <option value="active">Active (live)</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Min Salary (USD/yr)</label>
          <input className={inputCls} type="number" value={form.salary_min} onChange={(e) => set("salary_min", e.target.value)} placeholder="65000" />
        </div>
        <div>
          <label className={labelCls}>Max Salary (USD/yr)</label>
          <input className={inputCls} type="number" value={form.salary_max} onChange={(e) => set("salary_max", e.target.value)} placeholder="90000" />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Description *</label>
          <textarea className={inputCls} rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} required placeholder="Role overview..." />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Requirements (one per line, use &ldquo;- &rdquo; prefix)</label>
          <textarea className={inputCls} rows={3} value={form.requirements} onChange={(e) => set("requirements", e.target.value)} placeholder="- Active Nevada RDH license required&#10;- CPR/BLS current" />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Tags (comma-separated)</label>
          <input className={inputCls} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="RDH Required, Full Benefits, Mon-Thu Schedule" />
        </div>
      </div>

      <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50 transition-colors">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {saving ? "Creating…" : "Create Posting"}
      </button>
    </form>
  );
}

/* ─── Main Client ────────────────────────────────────────────────────── */
export function HrJobsClient({ initialJobs, gustoConnection }: Props) {
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs);
  const [showNewForm, setShowNewForm] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  const reload = async () => {
    const res = await fetch("/api/hr/jobs");
    const data = await res.json();
    setJobs(data);
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await fetch(`/api/hr/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await reload();
    setUpdatingId(null);
  };

  const activeCount = jobs.filter((j) => j.status === "active").length;
  const draftCount = jobs.filter((j) => j.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jobs & Payroll</h1>
          <p className="text-sm text-slate-500 mt-1">
            {activeCount} active posting{activeCount !== 1 ? "s" : ""} · {draftCount} draft{draftCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/careers"
            target="_blank"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View Careers Page
          </Link>
          <button
            onClick={() => setShowNewForm((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Posting
          </button>
        </div>
      </div>

      {/* Google for Jobs info banner */}
      <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-4 flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 flex-shrink-0 mt-0.5">
          <RefreshCw className="h-4 w-4 text-cyan-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-cyan-900">Google for Jobs — Active</p>
          <p className="text-xs text-cyan-700 mt-0.5">
            All <strong>Active</strong> postings automatically appear in Google Search job results via JSON-LD structured data.
            No additional setup required. Activating a posting makes it live on the careers page and indexed by Google.
          </p>
        </div>
      </div>

      {/* Gusto Card */}
      <GustoCard conn={gustoConnection} onExport={() => setExportMsg("Export logged. Check your downloads.")} />
      {exportMsg && (
        <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-4 py-2 border border-emerald-200">
          ✓ {exportMsg}
        </p>
      )}

      {/* New Job Form */}
      {showNewForm && (
        <NewJobForm
          onCreated={() => {
            setShowNewForm(false);
            reload();
          }}
        />
      )}

      {/* Job Listings */}
      <div className="space-y-3">
        {jobs.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            <Briefcase className="h-10 w-10 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No job postings yet</p>
            <p className="text-sm mt-1">Create your first posting above</p>
          </div>
        )}

        {jobs.map((job) => {
          const sc = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.draft;
          const salary = salaryLabel(job);
          const isUpdating = updatingId === job.id;

          return (
            <div key={job.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium", sc.color)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                      {sc.label}
                    </span>
                    <span className="text-xs text-slate-500">{employmentLabel(job.employment_type)}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{job.department}</span>
                    {salary && <span className="text-xs text-cyan-700 font-medium">{salary}</span>}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mt-2">{job.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{job.description}</p>
                  {job.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {job.tags.map((t) => (
                        <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {job.views} views</span>
                    {job.posted_at && <span>Posted {new Date(job.posted_at).toLocaleDateString()}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {job.status === "active" && (
                    <Link
                      href={`/careers/${job.slug}`}
                      target="_blank"
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </Link>
                  )}
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  ) : (
                    <>
                      {job.status === "draft" && (
                        <button onClick={() => updateStatus(job.id, "active")} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors">
                          <Zap className="h-3 w-3" /> Publish
                        </button>
                      )}
                      {job.status === "active" && (
                        <button onClick={() => updateStatus(job.id, "paused")} className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors">
                          <Pause className="h-3 w-3" /> Pause
                        </button>
                      )}
                      {job.status === "paused" && (
                        <button onClick={() => updateStatus(job.id, "active")} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors">
                          <Zap className="h-3 w-3" /> Re-publish
                        </button>
                      )}
                      {["active", "paused"].includes(job.status) && (
                        <button onClick={() => updateStatus(job.id, "filled")} className="flex items-center gap-1 rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100 transition-colors">
                          <CheckCircle2 className="h-3 w-3" /> Filled
                        </button>
                      )}
                      {job.status !== "archived" && (
                        <button onClick={() => updateStatus(job.id, "archived")} className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-50 transition-colors">
                          <Archive className="h-3 w-3" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {job.status === "active" && (
                <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-cyan-50 border border-cyan-100 px-3 py-1.5 text-[11px] text-cyan-700">
                  <AlertCircle className="h-3 w-3" />
                  Live on careers page · JSON-LD active for Google for Jobs
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

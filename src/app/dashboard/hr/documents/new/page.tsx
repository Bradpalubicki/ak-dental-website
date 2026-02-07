"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Send,
  Loader2,
} from "lucide-react";

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}

const docTypes = [
  { value: "disciplinary", label: "Disciplinary Write-up" },
  { value: "incident_report", label: "Incident Report" },
  { value: "performance_review", label: "Performance Review" },
  { value: "coaching_note", label: "Coaching Note" },
  { value: "general", label: "General Documentation" },
];

const severities = [
  { value: "info", label: "Informational" },
  { value: "warning", label: "Warning" },
  { value: "serious", label: "Serious" },
  { value: "critical", label: "Critical" },
];

export default function NewDocumentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedEmployee = searchParams.get("employee");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState(preselectedEmployee || "");
  const [type, setType] = useState("disciplinary");
  const [severity, setSeverity] = useState("warning");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/hr/employees?status=active")
      .then((r) => r.json())
      .then(setEmployees)
      .catch(() => {});
  }, []);

  async function handleSubmit(status: "draft" | "pending_signature") {
    if (!employeeId || !title || !content) return;
    setLoading(true);

    try {
      const res = await fetch("/api/hr/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employeeId,
          type,
          title,
          content,
          severity,
          status,
        }),
      });

      if (!res.ok) throw new Error("Failed to create document");

      const doc = await res.json();

      if (status === "pending_signature") {
        router.push(`/dashboard/hr/documents/${doc.id}/present`);
      } else {
        router.push("/dashboard/hr");
      }
    } catch {
      alert("Failed to create document. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isValid = employeeId && title.trim() && content.trim();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/hr"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            New Document
          </h1>
          <p className="text-sm text-slate-500">
            Create a write-up, incident report, or other HR document
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
        {/* Employee */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Employee
          </label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
          >
            <option value="">Select employee...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name} — {emp.role}
              </option>
            ))}
          </select>
        </div>

        {/* Type & Severity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Document Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            >
              {docTypes.map((dt) => (
                <option key={dt.value} value={dt.value}>
                  {dt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            >
              {severities.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Written Warning: Repeated Tardiness"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Document Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="Describe the situation, dates, previous warnings, expectations going forward..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 resize-y"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={!isValid || loading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit("pending_signature")}
            disabled={!isValid || loading}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:from-amber-600 hover:to-orange-600 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Save & Present for Signature
          </button>
        </div>
      </div>
    </div>
  );
}

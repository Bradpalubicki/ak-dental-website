"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Send,
  Loader2,
  Brain,
  Sparkles,
  GraduationCap,
  Award,
  AlertTriangle,
  Shield,
  Star,
  MessageSquare,
  FileText,
} from "lucide-react";

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}

/* ------------------------------------------------------------------ */
/*  Category → Document Type mapping                                   */
/* ------------------------------------------------------------------ */
const categoryConfig: Record<
  string,
  {
    label: string;
    description: string;
    icon: typeof FileText;
    defaultType: string;
    showSeverity: boolean;
    showTrainingFields: boolean;
    showCredentialFields: boolean;
    showAiLookup: boolean;
    titlePlaceholder: string;
    contentPlaceholder: string;
    contentLabel: string;
  }
> = {
  disciplinary: {
    label: "Write-Up",
    description: "Disciplinary or coaching write-up",
    icon: AlertTriangle,
    defaultType: "disciplinary",
    showSeverity: true,
    showTrainingFields: false,
    showCredentialFields: false,
    showAiLookup: false,
    titlePlaceholder: "e.g., Written Warning: Repeated Tardiness",
    contentPlaceholder:
      "Describe the situation, dates, previous warnings, expectations going forward...",
    contentLabel: "Document Content",
  },
  training_record: {
    label: "Training Record",
    description: "Track completed or required training",
    icon: GraduationCap,
    defaultType: "training_record",
    showSeverity: false,
    showTrainingFields: true,
    showCredentialFields: false,
    showAiLookup: true,
    titlePlaceholder: "e.g., OSHA Bloodborne Pathogens Training 2026",
    contentPlaceholder:
      "Training description, objectives covered, assessment results...",
    contentLabel: "Training Details",
  },
  certificate: {
    label: "Certificate / Credential",
    description: "License, certification, or credential",
    icon: Award,
    defaultType: "certificate",
    showSeverity: false,
    showTrainingFields: false,
    showCredentialFields: true,
    showAiLookup: true,
    titlePlaceholder: "e.g., CPR/BLS Certification",
    contentPlaceholder: "Additional notes about this credential...",
    contentLabel: "Notes",
  },
  incident_report: {
    label: "Incident Report",
    description: "Document a workplace incident",
    icon: Shield,
    defaultType: "incident_report",
    showSeverity: true,
    showTrainingFields: false,
    showCredentialFields: false,
    showAiLookup: false,
    titlePlaceholder: "e.g., Patient Incident - Feb 10, 2026",
    contentPlaceholder:
      "Describe what happened, when, who was involved, and actions taken...",
    contentLabel: "Incident Details",
  },
  performance_review: {
    label: "Performance Review",
    description: "Annual or periodic review",
    icon: Star,
    defaultType: "performance_review",
    showSeverity: false,
    showTrainingFields: false,
    showCredentialFields: false,
    showAiLookup: false,
    titlePlaceholder: "e.g., Annual Performance Review — 2026",
    contentPlaceholder:
      "Strengths, areas for improvement, goals, overall assessment...",
    contentLabel: "Review Content",
  },
  coaching_note: {
    label: "Coaching Note",
    description: "Informal coaching or feedback",
    icon: MessageSquare,
    defaultType: "coaching_note",
    showSeverity: false,
    showTrainingFields: false,
    showCredentialFields: false,
    showAiLookup: false,
    titlePlaceholder: "e.g., Sterilization Protocol Refresher",
    contentPlaceholder: "Topics discussed, action items, follow-up plan...",
    contentLabel: "Coaching Notes",
  },
  general: {
    label: "General Document",
    description: "Other HR documentation",
    icon: FileText,
    defaultType: "general",
    showSeverity: false,
    showTrainingFields: false,
    showCredentialFields: false,
    showAiLookup: false,
    titlePlaceholder: "e.g., Policy Acknowledgment",
    contentPlaceholder: "Document content...",
    contentLabel: "Content",
  },
};

const docTypes = [
  { value: "disciplinary", label: "Disciplinary Write-up" },
  { value: "incident_report", label: "Incident Report" },
  { value: "performance_review", label: "Performance Review" },
  { value: "coaching_note", label: "Coaching Note" },
  { value: "general", label: "General Documentation" },
  { value: "training_record", label: "Training Record" },
  { value: "certificate", label: "Certificate" },
  { value: "credential", label: "Credential" },
];

const severities = [
  { value: "info", label: "Informational" },
  { value: "warning", label: "Warning" },
  { value: "serious", label: "Serious" },
  { value: "critical", label: "Critical" },
];

const trainingProviders = [
  "ADA (American Dental Association)",
  "OSHA",
  "AHA (American Heart Association)",
  "State Board of Dental Examiners",
  "DANB (Dental Assisting National Board)",
  "AGD (Academy of General Dentistry)",
  "In-House Training",
  "Other",
];

const credentialTypes = [
  "DDS / DMD License",
  "RDH License",
  "Dental Assistant Certification",
  "DEA Registration",
  "NPI Number",
  "CPR / BLS Certification",
  "OSHA Training Certificate",
  "HIPAA Training Certificate",
  "Radiation Safety Certification",
  "Conscious Sedation Permit",
  "Local Anesthesia Permit",
  "Business License",
  "Malpractice Insurance",
  "Other",
];

export default function NewDocumentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedEmployee = searchParams.get("employee");
  const categoryParam = searchParams.get("category") || "disciplinary";

  const config = categoryConfig[categoryParam] || categoryConfig.disciplinary;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState(preselectedEmployee || "");
  const [type, setType] = useState(config.defaultType);
  const [severity, setSeverity] = useState("warning");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Training-specific fields
  const [trainingProvider, setTrainingProvider] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");

  // Credential-specific fields
  const [credentialType, setCredentialType] = useState("");
  const [issuingBody, setIssuingBody] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credExpDate, setCredExpDate] = useState("");

  useEffect(() => {
    fetch("/api/hr/employees?status=active")
      .then((r) => r.json())
      .then(setEmployees)
      .catch(() => {});
  }, []);

  // Update type when category changes
  useEffect(() => {
    setType(config.defaultType);
  }, [config.defaultType]);

  async function handleAiLookup() {
    const selectedEmployee = employees.find((e) => e.id === employeeId);
    if (!selectedEmployee && !title) {
      toast.error("Please select an employee and/or enter a title to help AI find relevant information.");
      return;
    }

    setAiLoading(true);
    try {
      const lookupTitle = title || credentialType || "general certification";
      const employeeName = selectedEmployee
        ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
        : "the employee";
      const employeeRole = selectedEmployee?.role || "staff";

      const res = await fetch("/api/hr/ai-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: categoryParam,
          title: lookupTitle,
          credentialType,
          employeeName,
          employeeRole,
          state: "Nevada",
        }),
      });

      if (!res.ok) throw new Error("AI lookup failed");

      const data = await res.json();

      // Auto-fill fields from AI response
      if (data.title && !title) setTitle(data.title);
      if (data.content) setContent(data.content);
      if (data.issuingBody && !issuingBody) setIssuingBody(data.issuingBody);
      if (data.trainingProvider && !trainingProvider) setTrainingProvider(data.trainingProvider);
      if (data.expirationInfo) {
        // Show a note about typical expiration
        setContent((prev) =>
          prev
            ? `${prev}\n\n---\nAI Note: ${data.expirationInfo}`
            : `AI Note: ${data.expirationInfo}`
        );
      }
    } catch {
      toast.error("AI lookup failed. Please enter information manually.");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(status: "draft" | "pending_signature" | "active") {
    if (!employeeId || !title) return;

    // For training/certs, content is optional (metadata carries the details)
    if (!config.showTrainingFields && !config.showCredentialFields && !content) return;

    setLoading(true);

    try {
      // Build metadata from category-specific fields
      const metadata: Record<string, string> = {};
      if (config.showTrainingFields) {
        if (trainingProvider) metadata.training_provider = trainingProvider;
        if (completionDate) metadata.completion_date = completionDate;
        if (expirationDate) metadata.expiration_date = expirationDate;
        if (certificateUrl) metadata.certificate_url = certificateUrl;
      }
      if (config.showCredentialFields) {
        if (credentialType) metadata.credential_type = credentialType;
        if (issuingBody) metadata.issuing_body = issuingBody;
        if (licenseNumber) metadata.license_number = licenseNumber;
        if (issueDate) metadata.issue_date = issueDate;
        if (credExpDate) metadata.expiration_date = credExpDate;
      }

      const finalContent =
        content ||
        buildAutoContent(config, {
          trainingProvider,
          completionDate,
          expirationDate,
          credentialType,
          issuingBody,
          licenseNumber,
          issueDate,
          credExpDate,
        });

      const res = await fetch("/api/hr/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employeeId,
          type,
          title,
          content: finalContent,
          severity: config.showSeverity ? severity : null,
          status,
          metadata,
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
      toast.error("Failed to create document. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isValid =
    employeeId &&
    title.trim() &&
    (content.trim() ||
      config.showTrainingFields ||
      config.showCredentialFields);

  const CategoryIcon = config.icon;

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
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
            <CategoryIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              New {config.label}
            </h1>
            <p className="text-sm text-slate-500">{config.description}</p>
          </div>
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

        {/* Type & Severity (for write-ups/incidents) */}
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
          {config.showSeverity && (
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
          )}
        </div>

        {/* ============================================ */}
        {/* TRAINING-SPECIFIC FIELDS                     */}
        {/* ============================================ */}
        {config.showTrainingFields && (
          <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-800">
                Training Details
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Training Provider
                </label>
                <select
                  value={trainingProvider}
                  onChange={(e) => setTrainingProvider(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">Select provider...</option>
                  {trainingProviders.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Certificate URL (optional)
                </label>
                <input
                  type="url"
                  value={certificateUrl}
                  onChange={(e) => setCertificateUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Completion Date
                </label>
                <input
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Expiration Date (if applicable)
                </label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* CREDENTIAL-SPECIFIC FIELDS                   */}
        {/* ============================================ */}
        {config.showCredentialFields && (
          <div className="rounded-lg border border-teal-200 bg-teal-50/50 p-4 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-800">
                Credential Details
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Credential Type
                </label>
                <select
                  value={credentialType}
                  onChange={(e) => {
                    setCredentialType(e.target.value);
                    if (!title) setTitle(e.target.value);
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">Select type...</option>
                  {credentialTypes.map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Issuing Body
                </label>
                <input
                  type="text"
                  value={issuingBody}
                  onChange={(e) => setIssuingBody(e.target.value)}
                  placeholder="e.g., Nevada State Board of Dental Examiners"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  License / Cert Number
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g., #DEN-12345"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={credExpDate}
                  onChange={(e) => setCredExpDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* AI Auto-Lookup */}
        {config.showAiLookup && (
          <div className="rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                  <Brain className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-purple-800">
                    AI Auto-Fill
                  </p>
                  <p className="text-xs text-purple-600">
                    Let One Engine look up requirements, renewal info, and
                    issuing details
                  </p>
                </div>
              </div>
              <button
                onClick={handleAiLookup}
                disabled={aiLoading}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {aiLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {aiLoading ? "Looking up..." : "AI Lookup"}
              </button>
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={config.titlePlaceholder}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {config.contentLabel}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={config.showTrainingFields || config.showCredentialFields ? 6 : 12}
            placeholder={config.contentPlaceholder}
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
          {(config.showTrainingFields || config.showCredentialFields) && (
            <button
              onClick={() => handleSubmit("active")}
              disabled={!isValid || loading}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-medium text-white hover:from-emerald-600 hover:to-teal-600 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Award className="h-4 w-4" />
              )}
              Save as Active
            </button>
          )}
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

/* ------------------------------------------------------------------ */
/*  Helper: Auto-generate content from metadata fields                 */
/* ------------------------------------------------------------------ */
function buildAutoContent(
  config: (typeof categoryConfig)[string],
  fields: Record<string, string>
): string {
  if (config.showTrainingFields) {
    const lines: string[] = ["Training Record"];
    if (fields.trainingProvider) lines.push(`Provider: ${fields.trainingProvider}`);
    if (fields.completionDate) lines.push(`Completed: ${fields.completionDate}`);
    if (fields.expirationDate) lines.push(`Expires: ${fields.expirationDate}`);
    return lines.join("\n");
  }
  if (config.showCredentialFields) {
    const lines: string[] = ["Credential Record"];
    if (fields.credentialType) lines.push(`Type: ${fields.credentialType}`);
    if (fields.issuingBody) lines.push(`Issued by: ${fields.issuingBody}`);
    if (fields.licenseNumber) lines.push(`License #: ${fields.licenseNumber}`);
    if (fields.issueDate) lines.push(`Issue Date: ${fields.issueDate}`);
    if (fields.credExpDate) lines.push(`Expiration: ${fields.credExpDate}`);
    return lines.join("\n");
  }
  return "";
}

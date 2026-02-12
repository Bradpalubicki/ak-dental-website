"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Sparkles,
} from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";

interface UploadedFile {
  path: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}

const certTypes = [
  { value: "license", label: "Professional License" },
  { value: "certification", label: "Certification" },
  { value: "training", label: "Training Completion" },
  { value: "continuing_education", label: "Continuing Education" },
];

const renewalOptions = [
  { value: "", label: "Not applicable" },
  { value: "annual", label: "Annual" },
  { value: "biennial", label: "Every 2 Years" },
  { value: "triennial", label: "Every 3 Years" },
  { value: "one_time", label: "One-time" },
  { value: "other", label: "Other" },
];

export default function NewCertificationPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [certType, setCertType] = useState("certification");
  const [name, setName] = useState("");
  const [issuingOrg, setIssuingOrg] = useState("");
  const [credentialNumber, setCredentialNumber] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [renewalFrequency, setRenewalFrequency] = useState("");
  const [ceHours, setCeHours] = useState("");
  const [cost, setCost] = useState("");
  const [autoLookup, setAutoLookup] = useState(false);
  const [autoLookupUrl, setAutoLookupUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    fetch("/api/hr/employees?status=active")
      .then((r) => r.json())
      .then(setEmployees)
      .catch(() => {});
  }, []);

  async function handleSubmit() {
    if (!employeeId || !name) return;
    setLoading(true);

    try {
      const res = await fetch("/api/hr/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employeeId,
          certification_type: certType,
          name,
          issuing_organization: issuingOrg || null,
          credential_number: credentialNumber || null,
          effective_date: effectiveDate || null,
          expiration_date: expirationDate || null,
          renewal_frequency: renewalFrequency || null,
          ce_hours: ceHours ? parseFloat(ceHours) : null,
          cost: cost ? parseFloat(cost) : null,
          auto_lookup_enabled: autoLookup,
          auto_lookup_url: autoLookup ? autoLookupUrl || null : null,
          notes: notes || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to create certification");

      router.push("/dashboard/hr");
    } catch {
      alert("Failed to create certification. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isValid = employeeId && name.trim();

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
            Add Certification / Training
          </h1>
          <p className="text-sm text-slate-500">
            Track licenses, certifications, and training completions
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
        {/* Employee */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Employee / Holder
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

        {/* Type & Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Type
            </label>
            <select
              value={certType}
              onChange={(e) => setCertType(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            >
              {certTypes.map((ct) => (
                <option key={ct.value} value={ct.value}>
                  {ct.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Credential Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., DDS License, OSHA Training"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
        </div>

        {/* Issuing Org & Credential # */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Issuing Organization
            </label>
            <input
              type="text"
              value={issuingOrg}
              onChange={(e) => setIssuingOrg(e.target.value)}
              placeholder="e.g., Nevada State Board of Dental Examiners"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Credential / License #
            </label>
            <input
              type="text"
              value={credentialNumber}
              onChange={(e) => setCredentialNumber(e.target.value)}
              placeholder="e.g., DDS-12345-NV"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Effective Date
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Expiration Date
            </label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Renewal Frequency
            </label>
            <select
              value={renewalFrequency}
              onChange={(e) => setRenewalFrequency(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            >
              {renewalOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CE Hours & Cost */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              CE Hours (if applicable)
            </label>
            <input
              type="number"
              step="0.5"
              value={ceHours}
              onChange={(e) => setCeHours(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Cost ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
        </div>

        {/* AI Auto-Lookup */}
        <div className="rounded-lg border border-cyan-200 bg-cyan-50/50 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoLookup}
                onChange={(e) => setAutoLookup(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-sm font-medium text-slate-900">
                Enable AI Auto-Lookup
              </span>
            </label>
            <Sparkles className="h-4 w-4 text-cyan-500" />
          </div>
          <p className="text-xs text-slate-600">
            When enabled, One Engine will periodically check online registries
            to verify credential status and update expiration dates
            automatically.
          </p>
          {autoLookup && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Registry / Verification URL (optional)
              </label>
              <input
                type="url"
                value={autoLookupUrl}
                onChange={(e) => setAutoLookupUrl(e.target.value)}
                placeholder="e.g., https://dental.nv.gov/licensee-search"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              />
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Additional details, requirements, or reminders..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 resize-y"
          />
        </div>

        {/* File Attachments */}
        <FileUpload
          folder="licenses"
          label="Attach License/Certification Documents"
          onUpload={(result) => {
            setUploadedFiles((prev) => [...prev, result]);
          }}
        />
        {uploadedFiles.length > 0 && (
          <div className="space-y-1">
            {uploadedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                <span className="text-emerald-600">&#10003;</span>
                <span>{f.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
          <Link
            href="/dashboard/hr"
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:from-cyan-700 hover:to-blue-700 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Certification
          </button>
        </div>
      </div>
    </div>
  );
}

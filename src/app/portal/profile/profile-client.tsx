"use client";

import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  Save,
  Loader2,
  CheckCircle2,
  Calendar,
} from "lucide-react";

interface PatientProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  insurance_provider: string;
  insurance_member_id: string;
  insurance_group_number: string;
}

export function ProfileClient({ patient }: { patient: PatientProfile }) {
  const [form, setForm] = useState(patient);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/portal/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof PatientProfile, value: string) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update your personal information and insurance details
        </p>
      </div>

      {/* Personal Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="h-5 w-5 text-cyan-600" />
          <h2 className="text-sm font-semibold text-slate-900">Personal Information</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">First Name</label>
            <input
              type="text"
              value={form.first_name}
              onChange={(e) => updateField("first_name", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Last Name</label>
            <input
              type="text"
              value={form.last_name}
              onChange={(e) => updateField("last_name", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Calendar className="inline h-3 w-3 mr-1" />Date of Birth
            </label>
            <input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => updateField("date_of_birth", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-5">
          <Phone className="h-5 w-5 text-cyan-600" />
          <h2 className="text-sm font-semibold text-slate-900">Contact Information</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Mail className="inline h-3 w-3 mr-1" />Email
            </label>
            <input
              type="email"
              value={form.email}
              disabled
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-400 mt-1">Contact the office to update your email</p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Phone className="inline h-3 w-3 mr-1" />Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="(702) 555-0123"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="h-5 w-5 text-cyan-600" />
          <h2 className="text-sm font-semibold text-slate-900">Address</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Street Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="123 Main St"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="Las Vegas"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
                placeholder="NV"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">ZIP</label>
              <input
                type="text"
                value={form.zip}
                onChange={(e) => updateField("zip", e.target.value)}
                placeholder="89145"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="h-5 w-5 text-cyan-600" />
          <h2 className="text-sm font-semibold text-slate-900">Insurance Information</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Insurance Provider</label>
            <input
              type="text"
              value={form.insurance_provider}
              onChange={(e) => updateField("insurance_provider", e.target.value)}
              placeholder="Delta Dental"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Member ID</label>
            <input
              type="text"
              value={form.insurance_member_id}
              onChange={(e) => updateField("insurance_member_id", e.target.value)}
              placeholder="ID Number"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Group Number</label>
            <input
              type="text"
              value={form.insurance_group_number}
              onChange={(e) => updateField("insurance_group_number", e.target.value)}
              placeholder="Group #"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? "Saved!" : "Save Changes"}
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            Profile updated successfully
          </span>
        )}
        {error && (
          <span className="text-xs font-medium text-red-600">{error}</span>
        )}
      </div>
    </div>
  );
}

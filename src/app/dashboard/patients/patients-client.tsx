"use client";

import { useState, useRef, useEffect } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  Eye,
  Download,
  Plus,
  Trash2,
  RotateCcw,
  X,
  ChevronDown,
} from "lucide-react";
import type { Patient } from "@/types/database";

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
  prospect: "bg-blue-100 text-blue-700",
};

interface Props {
  initialPatients: Patient[];
  stats: {
    active: number;
    prospect: number;
    inactive: number;
    total: number;
  };
}

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  address: "",
  insurance_provider: "",
  insurance_member_id: "",
  status: "prospect" as "active" | "inactive" | "prospect",
  notes: "",
};

export function PatientsClient({ initialPatients, stats }: Props) {
  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [trashItems, setTrashItems] = useState<Patient[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = patients.filter((p) => {
    const matchesSearch =
      search === "" ||
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      (p.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (p.phone?.includes(search) ?? false);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newPatient = await res.json();
        setPatients((prev) => [newPatient, ...prev]);
        setForm(emptyForm);
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPatients((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  async function loadTrash() {
    const res = await fetch("/api/patients?deleted=true");
    if (res.ok) {
      const data = await res.json();
      setTrashItems(data);
    }
    setShowTrash(true);
  }

  async function handleRestore(id: string) {
    const res = await fetch(`/api/patients/${id}/restore`, { method: "POST" });
    if (res.ok) {
      const { data } = await res.json();
      setTrashItems((prev) => prev.filter((p) => p.id !== id));
      setPatients((prev) => [data, ...prev]);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="text-sm text-slate-500">{stats.total} total patients</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadTrash}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
          >
            <Trash2 className="h-4 w-4" /> Trash
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" /> Export
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
          >
            <Plus className="h-4 w-4" /> Add Patient
          </button>
        </div>
      </div>

      {/* Add Patient Form */}
      {showForm && (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">New Patient</h2>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 hover:bg-slate-200">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                <input
                  required
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                <input
                  required
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  placeholder="(702) 555-1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={form.date_of_birth}
                  onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" | "prospect" })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="prospect">Prospect</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Provider</label>
                <input
                  value={form.insurance_provider}
                  onChange={(e) => setForm({ ...form, insurance_provider: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  placeholder="Delta Dental, MetLife, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Member ID</label>
                <input
                  value={form.insurance_member_id}
                  onChange={(e) => setForm({ ...form, insurance_member_id: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                placeholder="Street, City, State ZIP"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Add Patient"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter(statusFilter === "active" ? "all" : "active")}
          className={`rounded-xl border p-4 text-left transition-colors ${
            statusFilter === "active"
              ? "border-emerald-300 bg-emerald-50"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
          <p className="text-sm text-slate-500">Active Patients</p>
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === "prospect" ? "all" : "prospect")}
          className={`rounded-xl border p-4 text-left transition-colors ${
            statusFilter === "prospect"
              ? "border-blue-300 bg-blue-50"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <p className="text-2xl font-bold text-blue-600">{stats.prospect}</p>
          <p className="text-sm text-slate-500">Prospects</p>
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === "inactive" ? "all" : "inactive")}
          className={`rounded-xl border p-4 text-left transition-colors ${
            statusFilter === "inactive"
              ? "border-slate-400 bg-slate-50"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <p className="text-2xl font-bold text-slate-600">{stats.inactive}</p>
          <p className="text-sm text-slate-500">Inactive</p>
        </button>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-sm text-slate-500">Total</p>
        </div>
      </div>

      {/* Patient Table */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-slate-500">Patient</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500">Contact</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500">Insurance</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500">Last Visit</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500">Tags</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <p className="text-sm font-medium text-slate-900">
                        {patient.first_name} {patient.last_name}
                      </p>
                    </td>
                    <td className="px-6 py-3">
                      <p className="text-sm text-slate-600">{patient.phone || "—"}</p>
                      <p className="text-xs text-slate-400">{patient.email || "—"}</p>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {patient.insurance_provider || "Self-Pay"}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusColors[patient.status] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {patient.last_visit
                        ? new Date(patient.last_visit).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "Never"}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {(patient.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1">
                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient.id)}
                          disabled={deleting === patient.id}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-sm text-slate-400">
            {initialPatients.length === 0
              ? "No patients yet. Patients will appear here when leads are converted or added manually."
              : "No patients match your search"}
          </div>
        )}
      </div>

      {/* Trash Panel */}
      {showTrash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Trash</h2>
                <p className="text-sm text-slate-500">Deleted patients are kept for 30 days</p>
              </div>
              <button onClick={() => setShowTrash(false)} className="rounded-lg p-1 hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            {trashItems.length > 0 ? (
              <div className="space-y-2">
                {trashItems.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{p.first_name} {p.last_name}</p>
                      <p className="text-xs text-slate-400">{p.email || p.phone || "No contact"}</p>
                    </div>
                    <button
                      onClick={() => handleRestore(p.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-sm text-slate-400">
                Trash is empty
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  Eye,
  Download,
  Plus,
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

export function PatientsClient({ initialPatients, stats }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = initialPatients.filter((p) => {
    const matchesSearch =
      search === "" ||
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      (p.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (p.phone?.includes(search) ?? false);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="text-sm text-slate-500">{stats.total} total patients</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" /> Export
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
            <Plus className="h-4 w-4" /> Add Patient
          </button>
        </div>
      </div>

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
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                        <Eye className="h-4 w-4" />
                      </button>
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
    </div>
  );
}

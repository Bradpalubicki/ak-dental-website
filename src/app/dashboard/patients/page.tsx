"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  Shield,
  FileText,
  Eye,
  Filter,
  Download,
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  insurance: string;
  status: "active" | "inactive" | "prospect";
  lastVisit: string;
  nextAppointment: string | null;
  balance: number;
  tags: string[];
}

const patients: Patient[] = [
  { id: "1", name: "Maria Santos", email: "maria.s@email.com", phone: "(702) 555-0101", insurance: "Cigna Dental", status: "active", lastVisit: "Today", nextAppointment: "Today, 8:00 AM", balance: 0, tags: ["Regular"] },
  { id: "2", name: "Robert Kim", email: "rkim@email.com", phone: "(702) 555-0102", insurance: "MetLife Dental", status: "active", lastVisit: "Jan 15", nextAppointment: "Today, 9:00 AM", balance: 120, tags: ["Treatment in Progress"] },
  { id: "3", name: "Jennifer Liu", email: "jliu@email.com", phone: "(702) 555-0103", insurance: "Delta Dental PPO", status: "prospect", lastVisit: "Never", nextAppointment: "Today, 10:30 AM", balance: 0, tags: ["New Patient", "Implant"] },
  { id: "4", name: "David Martinez", email: "dmartinez@email.com", phone: "(702) 555-0104", insurance: "Aetna Dental", status: "active", lastVisit: "Jan 20", nextAppointment: "Today, 11:30 AM", balance: 0, tags: [] },
  { id: "5", name: "Sarah Thompson", email: "sarah.t@email.com", phone: "(702) 555-0105", insurance: "Self-Pay", status: "active", lastVisit: "Dec 10", nextAppointment: "Today, 1:00 PM", balance: 250, tags: ["Cosmetic"] },
  { id: "6", name: "James Wilson", email: "jwilson@email.com", phone: "(702) 555-0106", insurance: "Guardian", status: "active", lastVisit: "Jan 5", nextAppointment: "Today, 2:00 PM", balance: 0, tags: ["Surgical"] },
  { id: "7", name: "Amanda Patel", email: "apatel@email.com", phone: "(702) 555-0107", insurance: "Cigna Dental", status: "active", lastVisit: "Jul 15", nextAppointment: "Today, 3:30 PM", balance: 0, tags: ["Perio Maintenance"] },
  { id: "8", name: "Karen Davis", email: "kdavis@email.com", phone: "(702) 555-0108", insurance: "Guardian", status: "active", lastVisit: "Nov 20", nextAppointment: "Tomorrow, 10:00 AM", balance: 350, tags: ["Denied Claim"] },
  { id: "9", name: "William Chang", email: "wchang@email.com", phone: "(702) 555-0109", insurance: "United Concordia", status: "inactive", lastVisit: "Jun 2024", nextAppointment: null, balance: 0, tags: ["Lapsed"] },
  { id: "10", name: "David Park", email: "dpark@email.com", phone: "(702) 555-0156", insurance: "Aetna Dental", status: "active", lastVisit: "Jan 22", nextAppointment: "Tomorrow, 2:00 PM", balance: 0, tags: ["Ortho Consult"] },
];

const statusColors = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
  prospect: "bg-blue-100 text-blue-700",
};

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="text-sm text-slate-500">{patients.length} total patients</p>
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
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-emerald-600">{patients.filter((p) => p.status === "active").length}</p>
          <p className="text-sm text-slate-500">Active Patients</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-blue-600">{patients.filter((p) => p.status === "prospect").length}</p>
          <p className="text-sm text-slate-500">Prospects</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-slate-600">{patients.filter((p) => p.status === "inactive").length}</p>
          <p className="text-sm text-slate-500">Inactive</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-amber-600">${patients.reduce((sum, p) => sum + p.balance, 0).toLocaleString()}</p>
          <p className="text-sm text-slate-500">Outstanding Balances</p>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-6 py-3 text-xs font-medium text-slate-500">Patient</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500">Contact</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500">Insurance</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500">Last Visit</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500">Next Appt</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500">Balance</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <p className="text-sm font-medium text-slate-900">{patient.name}</p>
                    <div className="mt-0.5 flex gap-1">
                      {patient.tags.map((tag) => (
                        <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-sm text-slate-600">{patient.phone}</p>
                    <p className="text-xs text-slate-400">{patient.email}</p>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{patient.insurance}</td>
                  <td className="px-6 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[patient.status]}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{patient.lastVisit}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{patient.nextAppointment || "—"}</td>
                  <td className="px-6 py-3 text-sm font-medium">
                    {patient.balance > 0 ? (
                      <span className="text-amber-600">${patient.balance}</span>
                    ) : (
                      <span className="text-slate-400">$0</span>
                    )}
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
      </div>
    </div>
  );
}

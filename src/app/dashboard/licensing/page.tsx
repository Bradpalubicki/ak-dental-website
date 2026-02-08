"use client";

import {
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  Bell,
  Shield,
  Sparkles,
  ArrowRight,
  Calendar,
  User,
  Users,
  FileText,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

interface License {
  id: string;
  holder: string;
  role: string;
  type: string;
  licenseNumber: string;
  issuedBy: string;
  issueDate: string;
  expirationDate: string;
  status: "current" | "expiring_soon" | "expired";
  daysUntilExpiry: number;
}

const licenses: License[] = [
  { id: "1", holder: "Dr. Alexandru Chireu", role: "Owner / Dentist", type: "DDS License", licenseNumber: "DEN-12345-NV", issuedBy: "Nevada State Board of Dental Examiners", issueDate: "2021-06-15", expirationDate: "2027-06-15", status: "current", daysUntilExpiry: 493 },
  { id: "2", holder: "Dr. Alexandru Chireu", role: "Owner / Dentist", type: "DEA Registration", licenseNumber: "BK1234567", issuedBy: "U.S. Drug Enforcement Administration", issueDate: "2023-03-28", expirationDate: "2026-03-28", status: "expiring_soon", daysUntilExpiry: 49 },
  { id: "3", holder: "Dr. Alexandru Chireu", role: "Owner / Dentist", type: "NPI Number", licenseNumber: "1234567890", issuedBy: "CMS / NPPES", issueDate: "2018-01-01", expirationDate: "N/A", status: "current", daysUntilExpiry: 9999 },
  { id: "4", holder: "Dr. Alexandru Chireu", role: "Owner / Dentist", type: "Radiation Safety Certificate", licenseNumber: "RAD-NV-5678", issuedBy: "Nevada Radiation Control Program", issueDate: "2022-02-10", expirationDate: "2026-02-10", status: "expired", daysUntilExpiry: -3 },
  { id: "5", holder: "Dr. Alexandru Chireu", role: "Owner / Dentist", type: "Conscious Sedation Permit", licenseNumber: "SED-NV-9012", issuedBy: "Nevada State Board of Dental Examiners", issueDate: "2024-08-01", expirationDate: "2027-08-01", status: "current", daysUntilExpiry: 540 },
  { id: "6", holder: "Maria Santos", role: "Hygienist", type: "RDH License", licenseNumber: "HYG-54321-NV", issuedBy: "Nevada State Board of Dental Examiners", issueDate: "2022-12-01", expirationDate: "2026-12-01", status: "current", daysUntilExpiry: 297 },
  { id: "7", holder: "Maria Santos", role: "Hygienist", type: "Local Anesthesia Permit", licenseNumber: "LA-NV-6789", issuedBy: "Nevada State Board of Dental Examiners", issueDate: "2022-12-01", expirationDate: "2026-12-01", status: "current", daysUntilExpiry: 297 },
  { id: "8", holder: "Jessica Chen", role: "Dental Assistant", type: "DA Certification", licenseNumber: "DA-98765-NV", issuedBy: "DANB / Nevada Board", issueDate: "2023-08-15", expirationDate: "2026-08-15", status: "current", daysUntilExpiry: 189 },
  { id: "9", holder: "Jessica Chen", role: "Dental Assistant", type: "Radiology Certificate", licenseNumber: "XR-NV-3456", issuedBy: "Nevada Board", issueDate: "2023-08-15", expirationDate: "2026-08-15", status: "current", daysUntilExpiry: 189 },
  { id: "10", holder: "All Staff", role: "Team", type: "CPR/BLS Certification", licenseNumber: "AHA-GRP-2024", issuedBy: "American Heart Association", issueDate: "2024-09-15", expirationDate: "2026-09-15", status: "current", daysUntilExpiry: 220 },
  { id: "11", holder: "All Staff", role: "Team", type: "OSHA Training", licenseNumber: "OSHA-2025", issuedBy: "OSHA / Compliance Provider", issueDate: "2025-01-10", expirationDate: "2027-01-10", status: "current", daysUntilExpiry: 337 },
  { id: "12", holder: "All Staff", role: "Team", type: "HIPAA Training", licenseNumber: "HIPAA-2025", issuedBy: "Compliance Provider", issueDate: "2025-01-10", expirationDate: "2026-01-10", status: "current", daysUntilExpiry: 337 },
  { id: "13", holder: "Practice", role: "Business", type: "Business License", licenseNumber: "BL-LV-2024-8901", issuedBy: "City of Las Vegas", issueDate: "2024-07-01", expirationDate: "2026-06-30", status: "current", daysUntilExpiry: 143 },
  { id: "14", holder: "Practice", role: "Business", type: "DEA Registration (Practice)", licenseNumber: "AP1234567", issuedBy: "U.S. DEA", issueDate: "2023-05-01", expirationDate: "2026-05-01", status: "current", daysUntilExpiry: 83 },
];

const statusConfig = {
  current: { label: "Current", color: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", icon: CheckCircle2, dot: "bg-emerald-500" },
  expiring_soon: { label: "Expiring Soon", color: "bg-amber-50 text-amber-700 ring-amber-600/20", icon: Clock, dot: "bg-amber-500" },
  expired: { label: "EXPIRED", color: "bg-red-50 text-red-700 ring-red-600/20", icon: XCircle, dot: "bg-red-500" },
};

export default function LicensingPage() {
  const expired = licenses.filter((l) => l.status === "expired");
  const expiringSoon = licenses.filter((l) => l.status === "expiring_soon");
  const current = licenses.filter((l) => l.status === "current");

  const grouped = [
    { label: "Dr. Alexandru Chireu", items: licenses.filter((l) => l.holder === "Dr. Alexandru Chireu") },
    { label: "Maria Santos", items: licenses.filter((l) => l.holder === "Maria Santos") },
    { label: "Jessica Chen", items: licenses.filter((l) => l.holder === "Jessica Chen") },
    { label: "Team Certifications", items: licenses.filter((l) => l.holder === "All Staff") },
    { label: "Practice Licenses", items: licenses.filter((l) => l.holder === "Practice") },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Licensing & Credentials</h1>
          <p className="text-sm text-slate-500">Track all professional licenses, certifications, and compliance documents</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-cyan-700 hover:to-blue-700 shadow-sm">
          <Upload className="h-4 w-4" />
          Upload License
        </button>
      </div>

      {/* AI Alert */}
      {(expired.length > 0 || expiringSoon.length > 0) && (
        <div className="rounded-2xl border border-red-200/80 bg-gradient-to-br from-red-50 via-orange-50/30 to-amber-50/30 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-900">One Engine Compliance Alert</h3>
              <div className="mt-2 space-y-1.5">
                {expired.map((l) => (
                  <p key={l.id} className="text-sm text-red-800">
                    <span className="font-semibold">EXPIRED:</span> {l.holder}&apos;s {l.type} ({l.licenseNumber}) expired {Math.abs(l.daysUntilExpiry)} days ago. Immediate renewal required.
                  </p>
                ))}
                {expiringSoon.map((l) => (
                  <p key={l.id} className="text-sm text-amber-800">
                    <span className="font-semibold">Expiring Soon:</span> {l.holder}&apos;s {l.type} ({l.licenseNumber}) expires in {l.daysUntilExpiry} days. One Engine has drafted a renewal reminder.
                  </p>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">One Engine continuously monitors all licenses and will alert you 90, 60, and 30 days before expiration.</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard
          title="Total Licenses"
          value={String(licenses.length)}
          icon={Award}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Current"
          value={String(current.length)}
          change="In good standing"
          trend="up"
          icon={CheckCircle2}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Expiring Soon"
          value={String(expiringSoon.length)}
          change={expiringSoon.length > 0 ? "Needs attention" : "None"}
          trend={expiringSoon.length > 0 ? "down" : "up"}
          icon={Clock}
          iconColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Expired"
          value={String(expired.length)}
          change={expired.length > 0 ? "ACTION REQUIRED" : "None"}
          trend={expired.length > 0 ? "down" : "up"}
          icon={XCircle}
          iconColor="bg-red-50 text-red-600"
        />
      </div>

      {/* License Groups */}
      {grouped.map((group) => (
        <div key={group.label} className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              {group.label.includes("Team") || group.label.includes("Practice") ? (
                <Users className="h-4 w-4 text-slate-600" />
              ) : (
                <User className="h-4 w-4 text-slate-600" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{group.label}</h2>
              <p className="text-[11px] text-slate-400">{group.items.length} license{group.items.length !== 1 ? "s" : ""} / certification{group.items.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {group.items.map((license) => {
              const sc = statusConfig[license.status];
              const StatusIcon = sc.icon;
              return (
                <div key={license.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    license.status === "expired" ? "bg-red-100" : license.status === "expiring_soon" ? "bg-amber-100" : "bg-emerald-50"
                  }`}>
                    <Award className={`h-4 w-4 ${
                      license.status === "expired" ? "text-red-600" : license.status === "expiring_soon" ? "text-amber-600" : "text-emerald-600"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{license.type}</p>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${sc.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="font-mono">{license.licenseNumber}</span>
                      <span>{license.issuedBy}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-slate-900">
                      {license.expirationDate === "N/A" ? "No Expiration" : `Exp: ${new Date(license.expirationDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                    </p>
                    {license.expirationDate !== "N/A" && (
                      <p className={`text-[11px] font-medium ${
                        license.status === "expired" ? "text-red-600" : license.status === "expiring_soon" ? "text-amber-600" : "text-slate-400"
                      }`}>
                        {license.status === "expired"
                          ? `${Math.abs(license.daysUntilExpiry)} days overdue`
                          : `${license.daysUntilExpiry} days remaining`}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Compliance Calendar Preview */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50">
            <Calendar className="h-4 w-4 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Upcoming Renewal Timeline</h2>
            <p className="text-[11px] text-slate-400">Next 12 months</p>
          </div>
        </div>
        <div className="space-y-2">
          {[...licenses]
            .filter((l) => l.expirationDate !== "N/A" && l.daysUntilExpiry <= 365)
            .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
            .slice(0, 6)
            .map((l) => (
              <div key={l.id} className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-2.5">
                <div className={`h-2 w-2 rounded-full ${
                  l.status === "expired" ? "bg-red-500" : l.status === "expiring_soon" ? "bg-amber-500" : "bg-emerald-500"
                }`} />
                <span className="text-xs font-medium text-slate-900 w-32">
                  {new Date(l.expirationDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <span className="text-xs text-slate-600 flex-1">{l.holder} — {l.type}</span>
                <span className={`text-[11px] font-semibold ${
                  l.daysUntilExpiry < 0 ? "text-red-600" : l.daysUntilExpiry < 90 ? "text-amber-600" : "text-slate-400"
                }`}>
                  {l.daysUntilExpiry < 0 ? `${Math.abs(l.daysUntilExpiry)}d overdue` : `${l.daysUntilExpiry}d`}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

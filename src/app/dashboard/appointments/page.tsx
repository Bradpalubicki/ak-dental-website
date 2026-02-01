"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Filter,
} from "lucide-react";

interface Appointment {
  id: string;
  time: string;
  endTime: string;
  patient: string;
  type: string;
  provider: string;
  status: "scheduled" | "confirmed" | "checked_in" | "in_progress" | "completed" | "no_show" | "cancelled";
  insuranceVerified: boolean;
  phone: string;
  notes: string;
}

const appointments: Appointment[] = [
  { id: "1", time: "8:00 AM", endTime: "8:45 AM", patient: "Maria Santos", type: "Cleaning & Exam", provider: "Dr. Chireu", status: "confirmed", insuranceVerified: true, phone: "(702) 555-0101", notes: "Regular 6-month cleaning" },
  { id: "2", time: "9:00 AM", endTime: "10:30 AM", patient: "Robert Kim", type: "Crown Prep - #14", provider: "Dr. Chireu", status: "confirmed", insuranceVerified: true, phone: "(702) 555-0102", notes: "PFM crown, insurance pre-auth obtained" },
  { id: "3", time: "10:30 AM", endTime: "11:30 AM", patient: "Jennifer Liu", type: "Implant Consultation", provider: "Dr. Chireu", status: "scheduled", insuranceVerified: false, phone: "(702) 555-0103", notes: "New patient, referred by Dr. Smith" },
  { id: "4", time: "11:30 AM", endTime: "12:30 PM", patient: "David Martinez", type: "Root Canal - #19", provider: "Dr. Chireu", status: "confirmed", insuranceVerified: true, phone: "(702) 555-0104", notes: "Started last visit, completing today" },
  { id: "5", time: "1:00 PM", endTime: "2:00 PM", patient: "Sarah Thompson", type: "In-Office Whitening", provider: "Dr. Chireu", status: "confirmed", insuranceVerified: false, phone: "(702) 555-0105", notes: "Cosmetic - patient paying out of pocket" },
  { id: "6", time: "2:00 PM", endTime: "3:00 PM", patient: "James Wilson", type: "Extraction - #32", provider: "Dr. Chireu", status: "checked_in", insuranceVerified: true, phone: "(702) 555-0106", notes: "Impacted wisdom tooth" },
  { id: "7", time: "3:30 PM", endTime: "4:15 PM", patient: "Amanda Patel", type: "Cleaning & Exam", provider: "Dr. Chireu", status: "confirmed", insuranceVerified: true, phone: "(702) 555-0107", notes: "Periodontal maintenance" },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-700", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  checked_in: { label: "Checked In", color: "bg-purple-100 text-purple-700", icon: User },
  in_progress: { label: "In Progress", color: "bg-cyan-100 text-cyan-700", icon: Clock },
  completed: { label: "Completed", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  no_show: { label: "No Show", color: "bg-red-100 text-red-700", icon: XCircle },
  cancelled: { label: "Cancelled", color: "bg-slate-100 text-slate-500", icon: XCircle },
};

const timeSlots = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
];

export default function AppointmentsPage() {
  const [view, setView] = useState<"list" | "schedule">("list");

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    unconfirmed: appointments.filter((a) => a.status === "scheduled").length,
    checkedIn: appointments.filter((a) => a.status === "checked_in").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-500">Manage schedule, confirmations, and no-show recovery</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-slate-200">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 text-sm font-medium ${view === "list" ? "bg-slate-100 text-slate-900" : "text-slate-500"}`}
            >
              List
            </button>
            <button
              onClick={() => setView("schedule")}
              className={`px-3 py-1.5 text-sm font-medium ${view === "schedule" ? "bg-slate-100 text-slate-900" : "text-slate-500"}`}
            >
              Schedule
            </button>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
            <Plus className="h-4 w-4" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-3">
        <button className="rounded-lg p-1 hover:bg-slate-100">
          <ChevronLeft className="h-5 w-5 text-slate-400" />
        </button>
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
          <div className="mt-1 flex items-center justify-center gap-4 text-sm text-slate-500">
            <span>{stats.total} appointments</span>
            <span className="text-emerald-600">{stats.confirmed} confirmed</span>
            <span className="text-amber-600">{stats.unconfirmed} unconfirmed</span>
            <span className="text-purple-600">{stats.checkedIn} checked in</span>
          </div>
        </div>
        <button className="rounded-lg p-1 hover:bg-slate-100">
          <ChevronRight className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      {/* Appointment List */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="divide-y divide-slate-100">
          {appointments.map((apt) => {
            const config = statusConfig[apt.status];
            const StatusIcon = config.icon;
            return (
              <div key={apt.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50">
                {/* Time */}
                <div className="w-24 shrink-0">
                  <p className="text-sm font-semibold text-slate-900">{apt.time}</p>
                  <p className="text-xs text-slate-400">{apt.endTime}</p>
                </div>

                {/* Patient Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{apt.patient}</p>
                    {!apt.insuranceVerified && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-600">
                        <AlertCircle className="h-3 w-3" />
                        Insurance
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{apt.type}</p>
                  {apt.notes && <p className="mt-0.5 text-xs text-slate-400">{apt.notes}</p>}
                </div>

                {/* Provider */}
                <div className="hidden sm:block w-32">
                  <p className="text-sm text-slate-600">{apt.provider}</p>
                </div>

                {/* Status */}
                <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  {config.label}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {apt.status === "scheduled" && (
                    <button className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
                      Send Reminder
                    </button>
                  )}
                  {apt.status === "confirmed" && (
                    <button className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100">
                      Check In
                    </button>
                  )}
                  {apt.status === "no_show" && (
                    <button className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100">
                      AI Follow-Up
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Waitlist */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Waitlist</h2>
        <div className="flex items-center justify-center py-8 text-sm text-slate-400">
          <p>3 patients on waitlist. AI will auto-fill cancellations from this list.</p>
        </div>
      </div>
    </div>
  );
}

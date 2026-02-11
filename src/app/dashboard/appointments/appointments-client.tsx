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
  Trash2,
  RotateCcw,
  X,
} from "lucide-react";

interface AppointmentRow {
  id: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: string;
  provider: string;
  insuranceVerified: boolean;
  confirmationSent: boolean;
  reminderSent: boolean;
  notes: string;
  patientName: string;
  patientPhone: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-700", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  checked_in: { label: "Checked In", color: "bg-purple-100 text-purple-700", icon: User },
  in_progress: { label: "In Progress", color: "bg-cyan-100 text-cyan-700", icon: Clock },
  completed: { label: "Completed", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  no_show: { label: "No Show", color: "bg-red-100 text-red-700", icon: XCircle },
  cancelled: { label: "Cancelled", color: "bg-slate-100 text-slate-500", icon: XCircle },
  rescheduled: { label: "Rescheduled", color: "bg-amber-100 text-amber-700", icon: Calendar },
};

const appointmentTypes = [
  "New Patient Exam",
  "Routine Cleaning",
  "Deep Cleaning",
  "Crown Prep",
  "Root Canal",
  "Filling",
  "Extraction",
  "Whitening",
  "Consultation",
  "Emergency",
  "Follow-Up",
  "Implant Consult",
];

function formatTime(time: string): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${minutes} ${ampm}`;
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return formatTime(`${Math.floor(total / 60).toString().padStart(2, "0")}:${(total % 60).toString().padStart(2, "0")}:00`);
}

const emptyForm = {
  patient_id: "",
  appointment_date: "",
  appointment_time: "09:00",
  duration_minutes: "60",
  type: "Routine Cleaning",
  provider_name: "Dr. Alexandru Chireu",
  notes: "",
};

interface Props {
  initialAppointments: AppointmentRow[];
  today: string;
}

export function AppointmentsClient({ initialAppointments, today }: Props) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [view, setView] = useState<"list" | "schedule">("list");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm, appointment_date: today });
  const [saving, setSaving] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [trashItems, setTrashItems] = useState<AppointmentRow[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  const todayAppointments = appointments.filter((a) => a.date === today);
  const futureAppointments = appointments.filter((a) => a.date > today);

  const stats = {
    total: todayAppointments.length,
    confirmed: todayAppointments.filter((a) => a.status === "confirmed").length,
    unconfirmed: todayAppointments.filter((a) => a.status === "scheduled").length,
    checkedIn: todayAppointments.filter((a) => a.status === "checked_in").length,
  };

  const todayFormatted = new Date(today + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          duration_minutes: parseInt(form.duration_minutes),
        }),
      });
      if (res.ok) {
        const { appointment } = await res.json();
        const newRow: AppointmentRow = {
          id: appointment.id,
          date: appointment.appointment_date,
          time: appointment.appointment_time,
          duration: appointment.duration_minutes,
          type: appointment.type,
          status: appointment.status,
          provider: appointment.provider_name,
          insuranceVerified: appointment.insurance_verified,
          confirmationSent: appointment.confirmation_sent,
          reminderSent: appointment.reminder_24h_sent,
          notes: appointment.notes || "",
          patientName: "New Patient",
          patientPhone: "",
        };
        setAppointments((prev) => [newRow, ...prev]);
        setForm({ ...emptyForm, appointment_date: today });
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  async function loadTrash() {
    const res = await fetch("/api/appointments?deleted=true");
    if (res.ok) {
      const data = await res.json();
      const items = (data.appointments || []).map((apt: Record<string, unknown>) => ({
        id: apt.id as string,
        date: apt.appointment_date as string,
        time: apt.appointment_time as string,
        duration: apt.duration_minutes as number,
        type: apt.type as string,
        status: apt.status as string,
        provider: apt.provider_name as string,
        insuranceVerified: apt.insurance_verified as boolean,
        confirmationSent: false,
        reminderSent: false,
        notes: (apt.notes || "") as string,
        patientName: "Deleted",
        patientPhone: "",
      }));
      setTrashItems(items);
    }
    setShowTrash(true);
  }

  async function handleRestore(id: string) {
    const res = await fetch(`/api/appointments/${id}/restore`, { method: "POST" });
    if (res.ok) {
      setTrashItems((prev) => prev.filter((a) => a.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-500">
            Manage schedule, confirmations, and no-show recovery
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadTrash}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
          >
            <Trash2 className="h-4 w-4" /> Trash
          </button>
          <div className="flex rounded-lg border border-slate-200">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 text-sm font-medium ${
                view === "list" ? "bg-slate-100 text-slate-900" : "text-slate-500"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView("schedule")}
              className={`px-3 py-1.5 text-sm font-medium ${
                view === "schedule" ? "bg-slate-100 text-slate-900" : "text-slate-500"
              }`}
            >
              Schedule
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
          >
            <Plus className="h-4 w-4" />
            New Appointment
          </button>
        </div>
      </div>

      {/* New Appointment Form */}
      {showForm && (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">New Appointment</h2>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 hover:bg-slate-200">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient ID *</label>
                <input
                  required
                  value={form.patient_id}
                  onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  placeholder="Enter patient UUID or search"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                >
                  {appointmentTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={form.appointment_date}
                  onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time *</label>
                <input
                  type="time"
                  required
                  value={form.appointment_time}
                  onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (min)</label>
                <select
                  value={form.duration_minutes}
                  onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Provider</label>
                <input
                  value={form.provider_name}
                  onChange={(e) => setForm({ ...form, provider_name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
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
                {saving ? "Saving..." : "Schedule Appointment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Date Navigation */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-3">
        <button className="rounded-lg p-1 hover:bg-slate-100">
          <ChevronLeft className="h-5 w-5 text-slate-400" />
        </button>
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900">{todayFormatted}</p>
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

      {/* Today's Appointments */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-3">
          <h2 className="text-sm font-semibold text-slate-700">Today</h2>
        </div>
        {todayAppointments.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {todayAppointments.map((apt) => {
              const config = statusConfig[apt.status] || statusConfig.scheduled;
              const StatusIcon = config.icon;
              return (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50"
                >
                  <div className="w-24 shrink-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatTime(apt.time)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {addMinutes(apt.time, apt.duration)}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900">
                        {apt.patientName}
                      </p>
                      {!apt.insuranceVerified && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-600">
                          <AlertCircle className="h-3 w-3" />
                          Insurance
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">{apt.type}</p>
                    {apt.notes && (
                      <p className="mt-0.5 text-xs text-slate-400">{apt.notes}</p>
                    )}
                  </div>
                  <div className="hidden sm:block w-32">
                    <p className="text-sm text-slate-600">{apt.provider}</p>
                  </div>
                  <span
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.color}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {config.label}
                  </span>
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
                    <button
                      onClick={() => handleDelete(apt.id)}
                      disabled={deleting === apt.id}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-sm text-slate-400">
            No appointments scheduled for today
          </div>
        )}
      </div>

      {/* Upcoming Appointments */}
      {futureAppointments.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-3">
            <h2 className="text-sm font-semibold text-slate-700">Upcoming</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {futureAppointments.slice(0, 10).map((apt) => {
              const config = statusConfig[apt.status] || statusConfig.scheduled;
              const StatusIcon = config.icon;
              const dateStr = new Date(apt.date + "T12:00:00").toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" }
              );
              return (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50"
                >
                  <div className="w-24 shrink-0">
                    <p className="text-sm font-semibold text-slate-900">{dateStr}</p>
                    <p className="text-xs text-slate-400">{formatTime(apt.time)}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {apt.patientName}
                    </p>
                    <p className="text-xs text-slate-500">{apt.type}</p>
                  </div>
                  <span
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.color}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {config.label}
                  </span>
                  <button
                    onClick={() => handleDelete(apt.id)}
                    disabled={deleting === apt.id}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trash Panel */}
      {showTrash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Trash</h2>
                <p className="text-sm text-slate-500">Deleted appointments are kept for 30 days</p>
              </div>
              <button onClick={() => setShowTrash(false)} className="rounded-lg p-1 hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            {trashItems.length > 0 ? (
              <div className="space-y-2">
                {trashItems.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{apt.type}</p>
                      <p className="text-xs text-slate-400">{apt.date} at {formatTime(apt.time)}</p>
                    </div>
                    <button
                      onClick={() => handleRestore(apt.id)}
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

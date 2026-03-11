"use client";

import { useState } from "react";
import { Clock, Users, Bell, Calendar, Plus, X } from "lucide-react";

export default function WaitlistPage() {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<Array<{
    name: string; phone: string; reason: string; preferred: string;
  }>>([]);
  const [form, setForm] = useState({ name: "", phone: "", reason: "", preferred: "" });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setEntries((prev) => [form, ...prev]);
    setForm({ name: "", phone: "", reason: "", preferred: "" });
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Waitlist Management</h1>
          <p className="text-sm text-slate-500">
            Track patients waiting for appointments and manage cancellation fill-ins
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add to Waitlist
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Add Patient to Waitlist</h2>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 hover:bg-slate-200">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="First Last"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(702) 555-1234"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time Window</label>
              <input
                value={form.preferred}
                onChange={(e) => setForm({ ...form, preferred: e.target.value })}
                placeholder="e.g. Mornings, ASAP, Weekdays"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
              <input
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="e.g. Cancellation fill-in, earlier opening"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">Add to Waitlist</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "On Waitlist", value: String(entries.length), icon: Users, color: "text-cyan-600 bg-cyan-50" },
          { label: "Notified Today", value: "0", icon: Bell, color: "text-amber-600 bg-amber-50" },
          { label: "Filled This Week", value: "0", icon: Calendar, color: "text-emerald-600 bg-emerald-50" },
          { label: "Avg Wait Time", value: "—", icon: Clock, color: "text-violet-600 bg-violet-50" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {entries.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Waitlist</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {entries.map((e, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-[11px] font-bold text-cyan-700">
                  {e.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{e.name}</p>
                  <p className="text-[11px] text-slate-400">{e.phone} {e.preferred && `· ${e.preferred}`} {e.reason && `· ${e.reason}`}</p>
                </div>
                <button
                  onClick={() => setEntries((prev) => prev.filter((_, j) => j !== i))}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  Filled
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white/50 p-12 text-center">
          <div className="rounded-full bg-slate-100 p-4 mb-4">
            <Clock className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No Patients on Waitlist</h2>
          <p className="text-sm text-slate-500 max-w-md">
            When patients request earlier appointments or cancellation fill-ins,
            they&apos;ll appear here. One Engine will automatically notify waitlisted
            patients when slots open up.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add First Patient
          </button>
        </div>
      )}
    </div>
  );
}

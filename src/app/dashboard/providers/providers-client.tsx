"use client";

import { useState, useMemo } from "react";
import {
  UserCog,
  Search,
  Plus,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  MapPin,
  Shield,
  UserCheck,
  AlertTriangle,
  ExternalLink,
  X,
  Edit3,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import type { Provider, Referral, ProviderAvailability, ProviderBlock } from "@/types/database";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

interface Props {
  initialProviders: Provider[];
  initialReferrals: Referral[];
  stats: {
    total: number;
    active: number;
    accepting: number;
    totalReferrals: number;
    pendingReferrals: number;
  };
}

const TABS = [
  { id: "directory" as const, label: "Provider Directory" },
  { id: "referrals" as const, label: "Referral Tracking" },
  { id: "schedule" as const, label: "Schedule Overview" },
];
type TabId = (typeof TABS)[number]["id"];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SPECIALTIES = [
  "General Dentistry", "Cosmetic Dentistry", "Oral Surgery & Implants",
  "Orthodontics", "Endodontics", "Periodontics", "Pediatric Dentistry",
  "Prosthodontics", "Hygienist", "Dental Assistant",
];

const TITLES = ["DDS", "DMD", "RDH", "DA", "EFDA", "CDA"];

const PROVIDER_COLORS = [
  "#2563EB", "#7C3AED", "#059669", "#D97706", "#DC2626",
  "#0891B2", "#DB2777", "#4F46E5", "#0D9488", "#CA8A04",
];

const BLOCK_TYPES = [
  { value: "vacation", label: "Vacation" },
  { value: "sick", label: "Sick" },
  { value: "meeting", label: "Meeting" },
  { value: "lunch", label: "Lunch" },
  { value: "personal", label: "Personal" },
  { value: "holiday", label: "Holiday" },
  { value: "other", label: "Other" },
];

const urgencyColors: Record<string, string> = {
  routine: "bg-blue-100 text-blue-700",
  urgent: "bg-amber-100 text-amber-700",
  emergency: "bg-red-100 text-red-700",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  sent: "bg-blue-100 text-blue-700",
  accepted: "bg-emerald-100 text-emerald-700",
  completed: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
};

const blockTypeColors: Record<string, string> = {
  vacation: "bg-blue-100 text-blue-700 border-blue-200",
  sick: "bg-red-100 text-red-700 border-red-200",
  meeting: "bg-purple-100 text-purple-700 border-purple-200",
  lunch: "bg-amber-100 text-amber-700 border-amber-200",
  personal: "bg-teal-100 text-teal-700 border-teal-200",
  holiday: "bg-emerald-100 text-emerald-700 border-emerald-200",
  other: "bg-slate-100 text-slate-600 border-slate-200",
};

const emptyProviderForm = {
  first_name: "",
  last_name: "",
  title: "",
  specialty: "",
  npi_number: "",
  license_number: "",
  license_state: "NV",
  email: "",
  phone: "",
  bio: "",
  accepting_new_patients: true,
  color: "#3B82F6",
};

const emptyReferralForm = {
  patient_id: "",
  referring_provider_id: "",
  referred_to_name: "",
  referred_to_specialty: "",
  referred_to_phone: "",
  referred_to_fax: "",
  referred_to_address: "",
  reason: "",
  urgency: "routine" as "routine" | "urgent" | "emergency",
  notes: "",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitials(first: string, last: string) {
  return `${first[0] || ""}${last[0] || ""}`.toUpperCase();
}

function formatTime(time: string) {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function ProvidersClient({ initialProviders, initialReferrals, stats }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("directory");
  const [providers, setProviders] = useState(initialProviders);
  const [referrals, setReferrals] = useState(initialReferrals);
  const [search, setSearch] = useState("");
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [providerDetails, setProviderDetails] = useState<Record<string, { availability: ProviderAvailability[]; blocks: ProviderBlock[] }>>({});
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [providerForm, setProviderForm] = useState(emptyProviderForm);
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [referralForm, setReferralForm] = useState(emptyReferralForm);
  const [saving, setSaving] = useState(false);
  const [referralStatusFilter, setReferralStatusFilter] = useState("all");
  const [showBlockForm, setShowBlockForm] = useState<string | null>(null);
  const [blockForm, setBlockForm] = useState({
    block_type: "vacation",
    title: "",
    start_date: "",
    end_date: "",
    all_day: true,
    start_time: "",
    end_time: "",
    notes: "",
  });

  const activeProviders = useMemo(
    () => providers.filter((p) => p.is_active),
    [providers]
  );

  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      if (!p.is_active) return false;
      if (search === "") return true;
      const q = search.toLowerCase();
      return (
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
        (p.specialty?.toLowerCase().includes(q) ?? false) ||
        (p.title?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [providers, search]);

  const filteredReferrals = useMemo(() => {
    if (referralStatusFilter === "all") return referrals;
    return referrals.filter((r) => r.status === referralStatusFilter);
  }, [referrals, referralStatusFilter]);

  /* ---- Provider CRUD ---- */
  async function loadProviderDetails(id: string) {
    if (providerDetails[id]) return;
    try {
      const res = await fetch(`/api/providers/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProviderDetails((prev) => ({
          ...prev,
          [id]: { availability: data.availability || [], blocks: data.blocks || [] },
        }));
      }
    } catch {
      // Silent fail
    }
  }

  function handleExpandProvider(id: string) {
    if (expandedProvider === id) {
      setExpandedProvider(null);
    } else {
      setExpandedProvider(id);
      loadProviderDetails(id);
    }
  }

  function handleEditProvider(provider: Provider) {
    setEditingProvider(provider);
    setProviderForm({
      first_name: provider.first_name,
      last_name: provider.last_name,
      title: provider.title || "",
      specialty: provider.specialty || "",
      npi_number: provider.npi_number || "",
      license_number: provider.license_number || "",
      license_state: provider.license_state || "NV",
      email: provider.email || "",
      phone: provider.phone || "",
      bio: provider.bio || "",
      accepting_new_patients: provider.accepting_new_patients,
      color: provider.color,
    });
    setShowProviderForm(true);
  }

  async function handleProviderSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProvider) {
        const res = await fetch(`/api/providers/${editingProvider.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(providerForm),
        });
        if (res.ok) {
          const updated = await res.json();
          setProviders((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
          );
          setShowProviderForm(false);
          setEditingProvider(null);
          setProviderForm(emptyProviderForm);
        }
      } else {
        const res = await fetch("/api/providers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(providerForm),
        });
        if (res.ok) {
          const newProvider = await res.json();
          setProviders((prev) => [...prev, newProvider]);
          setShowProviderForm(false);
          setProviderForm(emptyProviderForm);
        }
      }
    } finally {
      setSaving(false);
    }
  }

  /* ---- Referral CRUD ---- */
  async function handleReferralSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(referralForm),
      });
      if (res.ok) {
        const newReferral = await res.json();
        setReferrals((prev) => [newReferral, ...prev]);
        setShowReferralForm(false);
        setReferralForm(emptyReferralForm);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleReferralStatusChange(id: string, newStatus: string) {
    const res = await fetch(`/api/referrals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setReferrals((prev) =>
        prev.map((r) => (r.id === updated.id ? { ...r, status: updated.status, sent_at: updated.sent_at, completed_at: updated.completed_at } : r))
      );
    }
  }

  /* ---- Block CRUD ---- */
  async function handleBlockSubmit(e: React.FormEvent, providerId: string) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/providers/${providerId}/blocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...blockForm,
          start_time: blockForm.all_day ? null : blockForm.start_time,
          end_time: blockForm.all_day ? null : blockForm.end_time,
        }),
      });
      if (res.ok) {
        const newBlock = await res.json();
        setProviderDetails((prev) => ({
          ...prev,
          [providerId]: {
            ...prev[providerId],
            blocks: [...(prev[providerId]?.blocks || []), newBlock],
          },
        }));
        setShowBlockForm(null);
        setBlockForm({
          block_type: "vacation",
          title: "",
          start_date: "",
          end_date: "",
          all_day: true,
          start_time: "",
          end_time: "",
          notes: "",
        });
      }
    } finally {
      setSaving(false);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  PROVIDER DIRECTORY TAB                                           */
  /* ---------------------------------------------------------------- */
  const renderDirectory = () => (
    <div className="space-y-4">
      {/* Search & Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, specialty, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
          />
        </div>
        <button
          onClick={() => {
            setEditingProvider(null);
            setProviderForm(emptyProviderForm);
            setShowProviderForm(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Provider
        </button>
      </div>

      <div className="text-xs text-slate-500">
        {filteredProviders.length} active provider{filteredProviders.length !== 1 ? "s" : ""}
      </div>

      {/* Provider Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProviders.map((provider) => {
          const isExpanded = expandedProvider === provider.id;
          const details = providerDetails[provider.id];

          return (
            <div
              key={provider.id}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-all"
            >
              {/* Color bar */}
              <div className="h-1" style={{ backgroundColor: provider.color }} />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shrink-0"
                    style={{ backgroundColor: provider.color }}
                  >
                    {getInitials(provider.first_name, provider.last_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">
                        {provider.first_name} {provider.last_name}
                      </h3>
                      {provider.title && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                          {provider.title}
                        </span>
                      )}
                    </div>
                    {provider.specialty && (
                      <p className="text-xs text-slate-500 mt-0.5">{provider.specialty}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      {provider.accepting_new_patients ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                          <UserCheck className="h-3 w-3" /> Accepting Patients
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                          Not Accepting
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditProvider(provider)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>

                {/* Credentials */}
                <div className="mt-3 space-y-1">
                  {provider.npi_number && (
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Shield className="h-3 w-3 text-slate-400" />
                      NPI: {provider.npi_number}
                    </p>
                  )}
                  {provider.license_number && (
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Shield className="h-3 w-3 text-slate-400" />
                      License: {provider.license_number} ({provider.license_state})
                    </p>
                  )}
                </div>

                {/* Contact */}
                <div className="mt-3 space-y-1">
                  {provider.phone && (
                    <p className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Phone className="h-3 w-3 text-slate-400" />
                      {provider.phone}
                    </p>
                  )}
                  {provider.email && (
                    <p className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
                      <Mail className="h-3 w-3 text-slate-400" />
                      {provider.email}
                    </p>
                  )}
                </div>

                {/* Expand toggle */}
                <button
                  onClick={() => handleExpandProvider(provider.id)}
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 py-1.5 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  {isExpanded ? (
                    <>Less <ChevronUp className="h-3.5 w-3.5" /></>
                  ) : (
                    <>Details <ChevronDown className="h-3.5 w-3.5" /></>
                  )}
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-3 space-y-4 border-t border-slate-100 pt-3">
                    {/* Bio */}
                    {provider.bio && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Bio</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{provider.bio}</p>
                      </div>
                    )}

                    {/* Availability */}
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Weekly Schedule</p>
                      {details?.availability && details.availability.length > 0 ? (
                        <div className="space-y-1">
                          {details.availability.map((slot) => (
                            <div
                              key={slot.id}
                              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5"
                            >
                              <span className="text-xs font-medium text-slate-700 w-12">
                                {DAY_NAMES[slot.day_of_week]}
                              </span>
                              <span className="text-xs text-slate-600">
                                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                <MapPin className="h-2.5 w-2.5" />
                                {slot.location}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No schedule configured</p>
                      )}
                    </div>

                    {/* Upcoming Time Off */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Upcoming Time Off</p>
                        <button
                          onClick={() => setShowBlockForm(provider.id)}
                          className="text-[10px] font-medium text-cyan-600 hover:text-cyan-700"
                        >
                          + Add Block
                        </button>
                      </div>
                      {details?.blocks && details.blocks.length > 0 ? (
                        <div className="space-y-1.5">
                          {details.blocks.map((block) => (
                            <div
                              key={block.id}
                              className={cn(
                                "rounded-lg border px-3 py-2",
                                blockTypeColors[block.block_type] || blockTypeColors.other
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">{block.title || block.block_type}</span>
                                <span className="text-[10px] capitalize">{block.block_type}</span>
                              </div>
                              <p className="text-[10px] mt-0.5 opacity-80">
                                {formatDate(block.start_date)}
                                {block.start_date !== block.end_date && ` - ${formatDate(block.end_date)}`}
                                {!block.all_day && block.start_time && block.end_time && (
                                  <> ({formatTime(block.start_time)} - {formatTime(block.end_time)})</>
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No upcoming time off</p>
                      )}

                      {/* Block form inline */}
                      {showBlockForm === provider.id && (
                        <form
                          onSubmit={(e) => handleBlockSubmit(e, provider.id)}
                          className="mt-3 rounded-lg border border-cyan-200 bg-cyan-50/30 p-3 space-y-3"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Type</label>
                              <select
                                value={blockForm.block_type}
                                onChange={(e) => setBlockForm({ ...blockForm, block_type: e.target.value })}
                                className="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:border-cyan-500 focus:outline-none"
                              >
                                {BLOCK_TYPES.map((bt) => (
                                  <option key={bt.value} value={bt.value}>{bt.label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Title</label>
                              <input
                                value={blockForm.title}
                                onChange={(e) => setBlockForm({ ...blockForm, title: e.target.value })}
                                className="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:border-cyan-500 focus:outline-none"
                                placeholder="e.g. Vacation"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Start Date</label>
                              <input
                                type="date"
                                required
                                value={blockForm.start_date}
                                onChange={(e) => setBlockForm({ ...blockForm, start_date: e.target.value })}
                                className="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:border-cyan-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-medium text-slate-600 mb-0.5">End Date</label>
                              <input
                                type="date"
                                required
                                value={blockForm.end_date}
                                onChange={(e) => setBlockForm({ ...blockForm, end_date: e.target.value })}
                                className="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:border-cyan-500 focus:outline-none"
                              />
                            </div>
                          </div>
                          <label className="flex items-center gap-2 text-xs text-slate-600">
                            <input
                              type="checkbox"
                              checked={blockForm.all_day}
                              onChange={(e) => setBlockForm({ ...blockForm, all_day: e.target.checked })}
                              className="rounded"
                            />
                            All Day
                          </label>
                          {!blockForm.all_day && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Start Time</label>
                                <input
                                  type="time"
                                  value={blockForm.start_time}
                                  onChange={(e) => setBlockForm({ ...blockForm, start_time: e.target.value })}
                                  className="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:border-cyan-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-medium text-slate-600 mb-0.5">End Time</label>
                                <input
                                  type="time"
                                  value={blockForm.end_time}
                                  onChange={(e) => setBlockForm({ ...blockForm, end_time: e.target.value })}
                                  className="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:border-cyan-500 focus:outline-none"
                                />
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setShowBlockForm(null)}
                              className="rounded border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={saving}
                              className="rounded bg-cyan-600 px-3 py-1 text-xs text-white hover:bg-cyan-700 disabled:opacity-50"
                            >
                              {saving ? "Saving..." : "Add Block"}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProviders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-sm text-slate-400">
          <UserCog className="h-8 w-8 mb-2 text-slate-300" />
          {providers.length === 0
            ? "No providers yet. Add your first provider to get started."
            : "No providers match your search"}
        </div>
      )}
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  REFERRAL TRACKING TAB                                            */
  /* ---------------------------------------------------------------- */
  const renderReferrals = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {["all", "pending", "sent", "accepted", "completed", "declined"].map((s) => (
            <button
              key={s}
              onClick={() => setReferralStatusFilter(s)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-all capitalize",
                referralStatusFilter === s
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button
          onClick={() => {
            setReferralForm(emptyReferralForm);
            setShowReferralForm(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Referral
        </button>
      </div>

      <div className="text-xs text-slate-500">
        {filteredReferrals.length} referral{filteredReferrals.length !== 1 ? "s" : ""}
        {referralStatusFilter !== "all" && ` (${referralStatusFilter})`}
      </div>

      {/* Referrals Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {filteredReferrals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Date</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Patient</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Referred To</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Specialty</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Reason</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Urgency</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReferrals.map((referral) => {
                  const patient = referral.patient as { id: string; first_name: string; last_name: string } | null;
                  return (
                    <tr key={referral.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 text-xs text-slate-600 whitespace-nowrap">
                        {new Date(referral.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3">
                        {patient ? (
                          <span className="text-xs font-medium text-slate-900">
                            {patient.first_name} {patient.last_name}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">--</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-xs font-medium text-slate-900">{referral.referred_to_name}</p>
                          {referral.referred_to_phone && (
                            <p className="text-[10px] text-slate-400">{referral.referred_to_phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-600">
                        {referral.referred_to_specialty || "--"}
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-xs text-slate-600 max-w-[200px] truncate">{referral.reason}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize",
                          urgencyColors[referral.urgency] || "bg-slate-100 text-slate-600"
                        )}>
                          {referral.urgency}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={referral.status}
                          onChange={(e) => handleReferralStatusChange(referral.id, e.target.value)}
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500",
                            statusColors[referral.status] || "bg-slate-100 text-slate-600"
                          )}
                        >
                          <option value="pending">Pending</option>
                          <option value="sent">Sent</option>
                          <option value="accepted">Accepted</option>
                          <option value="completed">Completed</option>
                          <option value="declined">Declined</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-slate-400">
            <ExternalLink className="h-8 w-8 mb-2 text-slate-300" />
            No referrals{referralStatusFilter !== "all" ? ` with status "${referralStatusFilter}"` : " yet"}
          </div>
        )}
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  SCHEDULE OVERVIEW TAB                                            */
  /* ---------------------------------------------------------------- */
  const renderSchedule = () => {
    // Build schedule grid: hours 7am-7pm, all active providers
    const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7am to 6pm

    return (
      <div className="space-y-4">
        <div className="text-xs text-slate-500">
          Weekly schedule overview for {activeProviders.length} active providers
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3">
          {activeProviders.map((p) => (
            <div key={p.id} className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-xs text-slate-600">
                {p.first_name} {p.last_name[0]}.
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-3">
            <span className="h-3 w-6 rounded bg-slate-200" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)" }} />
            <span className="text-xs text-slate-500">Time Off</span>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-16">
                  Time
                </th>
                {DAY_NAMES_FULL.slice(1, 7).map((day) => (
                  <th key={day} className="px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {hours.map((hour) => (
                <tr key={hour}>
                  <td className="px-3 py-2 text-xs text-slate-500 font-medium whitespace-nowrap border-r border-slate-100">
                    {hour === 0 ? "12 AM" : hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
                    {hour === 12 && " PM"}
                  </td>
                  {[1, 2, 3, 4, 5, 6].map((dayOfWeek) => (
                    <td key={dayOfWeek} className="px-1 py-1 border-r border-slate-50">
                      <div className="flex flex-wrap gap-0.5 min-h-[24px]">
                        {activeProviders.map((provider) => {
                          const details = providerDetails[provider.id];
                          const avail = details?.availability?.find(
                            (a) => a.day_of_week === dayOfWeek
                          );
                          if (!avail) return null;

                          const startHour = parseInt(avail.start_time.split(":")[0]);
                          const endHour = parseInt(avail.end_time.split(":")[0]);

                          if (hour < startHour || hour >= endHour) return null;

                          // Check for time-off blocks on this day
                          const hasBlock = details?.blocks?.some((b) => {
                            // Simplified check - would need more logic for partial day blocks
                            return b.all_day && dayOfWeek >= 1 && dayOfWeek <= 6;
                          });

                          return (
                            <div
                              key={provider.id}
                              className={cn(
                                "h-5 w-5 rounded-sm flex items-center justify-center text-[8px] font-bold text-white",
                                hasBlock && "opacity-50"
                              )}
                              style={{
                                backgroundColor: provider.color,
                                backgroundImage: hasBlock
                                  ? "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)"
                                  : undefined,
                              }}
                              title={`${provider.first_name} ${provider.last_name}: ${formatTime(avail.start_time)} - ${formatTime(avail.end_time)}`}
                            >
                              {provider.first_name[0]}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-400">
          Expand individual provider cards in the Directory tab to view and manage detailed availability and time-off blocks.
          Schedule data loads when you expand each provider card.
        </p>
      </div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Providers</h1>
          <p className="text-sm text-slate-500">
            {stats.active} active providers · {stats.accepting} accepting new patients · {stats.totalReferrals} referrals
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Active Providers"
          value={stats.active.toString()}
          change={`${stats.total} total`}
          trend="neutral"
          icon={UserCog}
          iconColor="text-cyan-600 bg-cyan-50"
          accentColor="#0891b2"
        />
        <StatCard
          title="Accepting Patients"
          value={stats.accepting.toString()}
          change={`${Math.round((stats.accepting / Math.max(stats.active, 1)) * 100)}% of active`}
          trend="up"
          icon={UserCheck}
          iconColor="text-emerald-600 bg-emerald-50"
          accentColor="#059669"
        />
        <StatCard
          title="Total Referrals"
          value={stats.totalReferrals.toString()}
          change="last 90 days"
          trend="neutral"
          icon={Send}
          iconColor="text-blue-600 bg-blue-50"
          accentColor="#2563eb"
        />
        <StatCard
          title="Pending Referrals"
          value={stats.pendingReferrals.toString()}
          change={stats.pendingReferrals > 0 ? "needs attention" : "all clear"}
          trend={stats.pendingReferrals > 0 ? "down" : "up"}
          icon={AlertTriangle}
          iconColor="text-amber-600 bg-amber-50"
          accentColor="#d97706"
          pulse={stats.pendingReferrals > 3}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              // Pre-load provider details when switching to schedule
              if (tab.id === "schedule") {
                activeProviders.forEach((p) => loadProviderDetails(p.id));
              }
            }}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "directory" && renderDirectory()}
      {activeTab === "referrals" && renderReferrals()}
      {activeTab === "schedule" && renderSchedule()}

      {/* Add/Edit Provider Modal */}
      {showProviderForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingProvider ? "Edit Provider" : "Add Provider"}
              </h2>
              <button
                onClick={() => {
                  setShowProviderForm(false);
                  setEditingProvider(null);
                  setProviderForm(emptyProviderForm);
                }}
                className="rounded-lg p-1 hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleProviderSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                  <input
                    required
                    value={providerForm.first_name}
                    onChange={(e) => setProviderForm({ ...providerForm, first_name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                  <input
                    required
                    value={providerForm.last_name}
                    onChange={(e) => setProviderForm({ ...providerForm, last_name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <select
                    value={providerForm.title}
                    onChange={(e) => setProviderForm({ ...providerForm, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="">Select title...</option>
                    {TITLES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                  <select
                    value={providerForm.specialty}
                    onChange={(e) => setProviderForm({ ...providerForm, specialty: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="">Select specialty...</option>
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">NPI Number</label>
                  <input
                    value={providerForm.npi_number}
                    onChange={(e) => setProviderForm({ ...providerForm, npi_number: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder="10 digits"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">License Number</label>
                  <input
                    value={providerForm.license_number}
                    onChange={(e) => setProviderForm({ ...providerForm, license_number: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">License State</label>
                  <input
                    value={providerForm.license_state}
                    onChange={(e) => setProviderForm({ ...providerForm, license_state: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder="NV"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={providerForm.email}
                    onChange={(e) => setProviderForm({ ...providerForm, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    value={providerForm.phone}
                    onChange={(e) => setProviderForm({ ...providerForm, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder="(702) 555-0100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Calendar Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={providerForm.color}
                      onChange={(e) => setProviderForm({ ...providerForm, color: e.target.value })}
                      className="h-9 w-12 cursor-pointer rounded border border-slate-200"
                    />
                    <div className="flex gap-1">
                      {PROVIDER_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setProviderForm({ ...providerForm, color: c })}
                          className={cn(
                            "h-6 w-6 rounded-full border-2 transition-all",
                            providerForm.color === c ? "border-slate-900 scale-110" : "border-transparent"
                          )}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea
                  value={providerForm.bio}
                  onChange={(e) => setProviderForm({ ...providerForm, bio: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  rows={3}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={providerForm.accepting_new_patients}
                  onChange={(e) =>
                    setProviderForm({ ...providerForm, accepting_new_patients: e.target.checked })
                  }
                  className="rounded"
                />
                Accepting new patients
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowProviderForm(false);
                    setEditingProvider(null);
                    setProviderForm(emptyProviderForm);
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingProvider ? "Update Provider" : "Add Provider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Referral Modal */}
      {showReferralForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">New Referral</h2>
              <button
                onClick={() => {
                  setShowReferralForm(false);
                  setReferralForm(emptyReferralForm);
                }}
                className="rounded-lg p-1 hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleReferralSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Referring Provider</label>
                  <select
                    value={referralForm.referring_provider_id}
                    onChange={(e) =>
                      setReferralForm({ ...referralForm, referring_provider_id: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="">Select provider...</option>
                    {activeProviders.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.first_name} {p.last_name}, {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Urgency</label>
                  <select
                    value={referralForm.urgency}
                    onChange={(e) =>
                      setReferralForm({
                        ...referralForm,
                        urgency: e.target.value as "routine" | "urgent" | "emergency",
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Referred To Name *</label>
                  <input
                    required
                    value={referralForm.referred_to_name}
                    onChange={(e) =>
                      setReferralForm({ ...referralForm, referred_to_name: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder="Dr. James Mitchell"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                  <input
                    value={referralForm.referred_to_specialty}
                    onChange={(e) =>
                      setReferralForm({ ...referralForm, referred_to_specialty: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder="Orthodontics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    value={referralForm.referred_to_phone}
                    onChange={(e) =>
                      setReferralForm({ ...referralForm, referred_to_phone: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder="(702) 555-2001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fax</label>
                  <input
                    value={referralForm.referred_to_fax}
                    onChange={(e) =>
                      setReferralForm({ ...referralForm, referred_to_fax: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder="(702) 555-2002"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input
                    value={referralForm.referred_to_address}
                    onChange={(e) =>
                      setReferralForm({ ...referralForm, referred_to_address: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason *</label>
                <textarea
                  required
                  value={referralForm.reason}
                  onChange={(e) => setReferralForm({ ...referralForm, reason: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  rows={2}
                  placeholder="Reason for referral..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  value={referralForm.notes}
                  onChange={(e) => setReferralForm({ ...referralForm, notes: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReferralForm(false);
                    setReferralForm(emptyReferralForm);
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Create Referral"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

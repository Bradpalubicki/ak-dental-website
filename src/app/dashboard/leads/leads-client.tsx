"use client";

import { useState } from "react";
import {
  UserPlus,
  Search,
  Plus,
  Clock,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  Zap,
  Send,
  Eye,
  Calendar,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import type { Lead } from "@/types/database";

type LeadStatus = "new" | "contacted" | "qualified" | "appointment_booked" | "converted" | "lost";

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-700" },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-700" },
  qualified: { label: "Qualified", color: "bg-purple-100 text-purple-700" },
  appointment_booked: { label: "Booked", color: "bg-emerald-100 text-emerald-700" },
  converted: { label: "Converted", color: "bg-green-100 text-green-700" },
  lost: { label: "Lost", color: "bg-slate-100 text-slate-500" },
};

const urgencyColors: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
  emergency: "bg-red-200 text-red-800",
};

const sourceIcons: Record<string, typeof Globe> = {
  website: Globe,
  google: Globe,
  phone: Phone,
  referral: MessageSquare,
  social: Globe,
  walk_in: UserPlus,
  other: Globe,
};

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function formatResponseTime(seconds: number | null): string {
  if (!seconds) return "—";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

interface Props {
  initialLeads: Lead[];
}

export function LeadsClient({ initialLeads }: Props) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [editingDraft, setEditingDraft] = useState(false);
  const [draftText, setDraftText] = useState("");

  const filteredLeads = leads.filter((l) => {
    const matchesFilter = filter === "all" || l.status === filter;
    const matchesSearch =
      search === "" ||
      `${l.first_name} ${l.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      (l.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (l.phone?.includes(search) ?? false);
    return matchesFilter && matchesSearch;
  });

  const pipelineCounts = {
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    appointment_booked: leads.filter((l) => l.status === "appointment_booked").length,
  };

  async function handleApproveAndSend(channel: "email" | "sms" | "both") {
    if (!selectedLead) return;
    setSending(true);
    try {
      const responseText = editingDraft ? draftText : selectedLead.ai_response_draft;
      const res = await fetch(`/api/leads/${selectedLead.id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response_text: responseText, channel }),
      });
      if (res.ok) {
        const updated = leads.map((l) =>
          l.id === selectedLead.id
            ? { ...l, status: "contacted", ai_response_sent: true, ai_response_approved: true }
            : l
        );
        setLeads(updated);
        setSelectedLead({
          ...selectedLead,
          status: "contacted",
          ai_response_sent: true,
          ai_response_approved: true,
        });
        setEditingDraft(false);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
          <p className="text-sm text-slate-500">
            Speed-to-lead AI response system &middot; {leads.length} total leads
          </p>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-4 gap-4">
        {(
          Object.entries(pipelineCounts) as [LeadStatus, number][]
        ).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilter(filter === status ? "all" : status)}
            className={`rounded-xl border p-4 text-left transition-colors ${
              filter === status
                ? "border-cyan-300 bg-cyan-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-2xl font-bold text-slate-900">{count}</p>
            <p className="text-sm text-slate-500">
              {statusConfig[status]?.label || status}
            </p>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Lead List */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => {
                const SourceIcon = sourceIcons[lead.source] || Globe;
                return (
                  <button
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead);
                      setEditingDraft(false);
                    }}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      selectedLead?.id === lead.id ? "bg-cyan-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {lead.first_name} {lead.last_name}
                        </p>
                        <p className="text-xs text-slate-500">{lead.inquiry_type || "General"}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          urgencyColors[lead.urgency] || urgencyColors.medium
                        }`}
                      >
                        {lead.urgency}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <SourceIcon className="h-3 w-3" />
                        <span>{lead.source}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            statusConfig[lead.status]?.color || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {statusConfig[lead.status]?.label || lead.status}
                        </span>
                        <span className="text-xs text-slate-400">
                          {timeAgo(lead.created_at)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="flex items-center justify-center py-12 text-sm text-slate-400">
                {leads.length === 0
                  ? "No leads yet. New leads will appear here automatically."
                  : "No leads match your search"}
              </div>
            )}
          </div>
        </div>

        {/* Lead Detail */}
        <div className="lg:col-span-3 space-y-4">
          {selectedLead ? (
            <>
              {/* Lead Info */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {selectedLead.first_name} {selectedLead.last_name}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {selectedLead.inquiry_type || "General Inquiry"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      statusConfig[selectedLead.status]?.color || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {statusConfig[selectedLead.status]?.label || selectedLead.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {selectedLead.email || "No email"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {selectedLead.phone || "No phone"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{selectedLead.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      Response: {formatResponseTime(selectedLead.response_time_seconds)}
                    </span>
                  </div>
                </div>

                {selectedLead.message && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-700">Patient Message</p>
                    <p className="mt-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                      {selectedLead.message}
                    </p>
                  </div>
                )}
              </div>

              {/* AI Response Draft */}
              {selectedLead.ai_response_draft && !selectedLead.ai_response_sent && (
                <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-cyan-600" />
                    <h3 className="text-sm font-semibold text-cyan-900">
                      AI-Drafted Response
                    </h3>
                    <span className="ml-auto rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-700">
                      Awaiting Approval
                    </span>
                  </div>
                  {editingDraft ? (
                    <textarea
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      rows={8}
                      className="w-full rounded-lg border border-cyan-200 bg-white p-4 text-sm text-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  ) : (
                    <div className="rounded-lg bg-white p-4 text-sm text-slate-700 whitespace-pre-line">
                      {selectedLead.ai_response_draft}
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => handleApproveAndSend("email")}
                      disabled={sending}
                      className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {selectedLead.email ? "Approve & Email" : "Approve & SMS"}
                    </button>
                    {selectedLead.phone && selectedLead.email && (
                      <button
                        onClick={() => handleApproveAndSend("both")}
                        disabled={sending}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        Send Both
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (editingDraft) {
                          setEditingDraft(false);
                        } else {
                          setDraftText(selectedLead.ai_response_draft || "");
                          setEditingDraft(true);
                        }
                      }}
                      className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="h-4 w-4" />
                      {editingDraft ? "Cancel Edit" : "Edit Draft"}
                    </button>
                  </div>
                </div>
              )}

              {/* Sent confirmation */}
              {selectedLead.ai_response_sent && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-sm font-semibold text-emerald-900">
                      Response Sent
                    </h3>
                    <span className="ml-auto text-xs text-emerald-600">
                      Response time: {formatResponseTime(selectedLead.response_time_seconds)}
                    </span>
                  </div>
                  {selectedLead.ai_response_draft && (
                    <div className="mt-3 rounded-lg bg-white p-4 text-sm text-slate-700 whitespace-pre-line">
                      {selectedLead.ai_response_draft}
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm hover:bg-slate-50">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Book Appointment
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm hover:bg-slate-50">
                    <Phone className="h-4 w-4 text-green-500" />
                    Call Patient
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm hover:bg-slate-50">
                    <Mail className="h-4 w-4 text-purple-500" />
                    Send Email
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm hover:bg-slate-50">
                    <MessageSquare className="h-4 w-4 text-cyan-500" />
                    Send SMS
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
              <p className="text-sm text-slate-400">
                {leads.length === 0
                  ? "No leads yet. Submit the website contact form to create your first lead."
                  : "Select a lead to view details"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

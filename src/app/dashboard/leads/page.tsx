"use client";

import { useState } from "react";
import {
  UserPlus,
  Search,
  Filter,
  Plus,
  Clock,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  Zap,
  CheckCircle2,
  Eye,
  Send,
  ChevronDown,
} from "lucide-react";

type LeadStatus = "new" | "contacted" | "qualified" | "appointment_booked" | "converted" | "lost";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  sourceIcon: typeof Globe;
  status: LeadStatus;
  inquiry: string;
  message: string;
  urgency: "low" | "medium" | "high" | "emergency";
  responseTime: string;
  aiDraft: string | null;
  createdAt: string;
}

const leads: Lead[] = [
  {
    id: "1",
    name: "Michael Rodriguez",
    email: "michael.r@email.com",
    phone: "(702) 555-0142",
    source: "Website Form",
    sourceIcon: Globe,
    status: "new",
    inquiry: "Dental Implants",
    message: "I've been missing my front tooth for 2 years and want to discuss implant options. Do you accept Delta Dental?",
    urgency: "high",
    responseTime: "—",
    aiDraft: "Thank you for reaching out, Michael! We'd love to help you explore dental implant options. Dr. Chireu has extensive experience with implant procedures. Yes, we do accept Delta Dental. I'd like to schedule a complimentary implant consultation for you. Would any of these times work?\n\n• Tuesday 10:00 AM\n• Wednesday 2:00 PM\n• Thursday 9:00 AM\n\nYou can also call us at (702) 935-4395.",
    createdAt: "12 min ago",
  },
  {
    id: "2",
    name: "Lisa Hernandez",
    email: "lisah@gmail.com",
    phone: "(702) 555-0198",
    source: "Google Ad",
    sourceIcon: Globe,
    status: "new",
    inquiry: "Teeth Whitening",
    message: "How much does teeth whitening cost? I have a wedding coming up in 3 weeks.",
    urgency: "medium",
    responseTime: "—",
    aiDraft: "Congratulations on the upcoming wedding, Lisa! We offer professional teeth whitening that can brighten your smile by several shades. Our in-office whitening starts at $399 and takes about an hour. With 3 weeks until the big day, we have plenty of time to get your smile wedding-ready! Would you like to book a consultation?",
    createdAt: "45 min ago",
  },
  {
    id: "3",
    name: "Tom Baker",
    email: "tom.baker@email.com",
    phone: "(702) 555-0167",
    source: "Phone Call",
    sourceIcon: Phone,
    status: "appointment_booked",
    inquiry: "Emergency - Toothache",
    message: "Called about severe toothache on lower right side. Pain started last night.",
    urgency: "high",
    responseTime: "1m 23s",
    aiDraft: null,
    createdAt: "2 hours ago",
  },
  {
    id: "4",
    name: "Amanda Chen",
    email: "achen22@email.com",
    phone: "(702) 555-0234",
    source: "Referral",
    sourceIcon: MessageSquare,
    status: "contacted",
    inquiry: "New Patient Exam",
    message: "Referred by Sarah Thompson. Looking for a new family dentist.",
    urgency: "low",
    responseTime: "4m 12s",
    aiDraft: null,
    createdAt: "Yesterday",
  },
  {
    id: "5",
    name: "David Park",
    email: "dpark@email.com",
    phone: "(702) 555-0156",
    source: "Website Form",
    sourceIcon: Globe,
    status: "qualified",
    inquiry: "Invisalign",
    message: "Interested in Invisalign. Had braces as a kid but teeth shifted. Do you offer payment plans?",
    urgency: "medium",
    responseTime: "2m 05s",
    aiDraft: null,
    createdAt: "Yesterday",
  },
];

const statusConfig: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-700" },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-700" },
  qualified: { label: "Qualified", color: "bg-purple-100 text-purple-700" },
  appointment_booked: { label: "Booked", color: "bg-emerald-100 text-emerald-700" },
  converted: { label: "Converted", color: "bg-green-100 text-green-700" },
  lost: { label: "Lost", color: "bg-slate-100 text-slate-500" },
};

const urgencyColors = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
  emergency: "bg-red-200 text-red-800",
};

export default function LeadsPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0]);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");

  const filteredLeads = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const pipelineCounts = {
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    appointment_booked: leads.filter((l) => l.status === "appointment_booked").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
          <p className="text-sm text-slate-500">Speed-to-lead AI response system</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
          <Plus className="h-4 w-4" />
          Add Lead
        </button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-4 gap-4">
        {(Object.entries(pipelineCounts) as [LeadStatus, number][]).map(([status, count]) => (
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
            <p className="text-sm text-slate-500">{statusConfig[status].label}</p>
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
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredLeads.map((lead) => (
              <button
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  selectedLead?.id === lead.id ? "bg-cyan-50" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.inquiry}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${urgencyColors[lead.urgency]}`}>
                      {lead.urgency}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <lead.sourceIcon className="h-3 w-3" />
                    <span>{lead.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig[lead.status].color}`}>
                      {statusConfig[lead.status].label}
                    </span>
                    <span className="text-xs text-slate-400">{lead.createdAt}</span>
                  </div>
                </div>
              </button>
            ))}
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
                    <h2 className="text-lg font-semibold text-slate-900">{selectedLead.name}</h2>
                    <p className="text-sm text-slate-500">{selectedLead.inquiry}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusConfig[selectedLead.status].color}`}>
                    {statusConfig[selectedLead.status].label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{selectedLead.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{selectedLead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <selectedLead.sourceIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{selectedLead.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      Response: {selectedLead.responseTime}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-700">Patient Message</p>
                  <p className="mt-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    {selectedLead.message}
                  </p>
                </div>
              </div>

              {/* AI Response Draft */}
              {selectedLead.aiDraft && (
                <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-cyan-600" />
                    <h3 className="text-sm font-semibold text-cyan-900">AI-Drafted Response</h3>
                    <span className="ml-auto rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-700">
                      Awaiting Approval
                    </span>
                  </div>
                  <div className="rounded-lg bg-white p-4 text-sm text-slate-700 whitespace-pre-line">
                    {selectedLead.aiDraft}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
                      <Send className="h-4 w-4" />
                      Approve & Send
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      <Eye className="h-4 w-4" />
                      Edit Draft
                    </button>
                    <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100">
                      Regenerate
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
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
              <p className="text-sm text-slate-400">Select a lead to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Calendar(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
    </svg>
  );
}

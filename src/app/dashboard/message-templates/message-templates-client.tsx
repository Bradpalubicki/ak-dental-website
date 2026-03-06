"use client";

import { useState, useTransition } from "react";
import {
  MessageSquare, CheckCircle, Clock, AlertTriangle,
  Mail, Phone, ChevronDown, ChevronUp, Send, Edit3, Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { TemplateGroup } from "@/config/message-templates";

interface TemplateRow {
  id: string | null;
  type: string;
  label: string;
  group: TemplateGroup;
  channel: string;
  subject?: string;
  body: string;
  approved: boolean;
  approved_at: string | null;
  approved_by: string | null;
  requiresApproval: boolean;
}

interface Props {
  templates: TemplateRow[];
  approvedCount?: number;
  totalCount: number;
}

const GROUP_ORDER: TemplateGroup[] = [
  "Scheduling",
  "Patient Intake",
  "No-Show Recovery",
  "Recall & Reactivation",
  "Review & Referral",
  "Financial",
];

function ChannelBadge({ channel }: { channel: string }) {
  if (channel === "both") return (
    <span className="flex gap-1">
      <Badge variant="outline" className="text-xs gap-1"><Mail className="h-3 w-3" />Email</Badge>
      <Badge variant="outline" className="text-xs gap-1"><Phone className="h-3 w-3" />SMS</Badge>
    </span>
  );
  if (channel === "email") return <Badge variant="outline" className="text-xs gap-1"><Mail className="h-3 w-3" />Email</Badge>;
  return <Badge variant="outline" className="text-xs gap-1"><Phone className="h-3 w-3" />SMS</Badge>;
}

function StatusBadge({ template }: { template: TemplateRow }) {
  if (template.approved) {
    return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs gap-1"><CheckCircle className="h-3 w-3" />Approved</Badge>;
  }
  return <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs gap-1"><Clock className="h-3 w-3" />Pending Review</Badge>;
}

function TemplateCard({ template, onApprove, onEdit, onTestSend }: {
  template: TemplateRow;
  onApprove: (type: string) => void;
  onEdit: (type: string, body: string, subject?: string) => void;
  onTestSend: (type: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(template.body);
  const [editSubject, setEditSubject] = useState(template.subject || "");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const res = await fetch("/api/message-templates/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: template.type, body: editBody, subject: editSubject || undefined }),
      });
      if (res.ok) {
        onEdit(template.type, editBody, editSubject || undefined);
        setEditing(false);
        toast.success("Template saved");
      } else {
        toast.error("Failed to save template");
      }
    });
  };

  return (
    <div className={cn(
      "border rounded-lg p-4 transition-colors",
      template.approved ? "border-emerald-200 bg-emerald-50/30" : "border-amber-200 bg-amber-50/20"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-medium text-sm">{template.label}</span>
            <ChannelBadge channel={template.channel} />
            <StatusBadge template={template} />
            {template.requiresApproval && (
              <Badge variant="outline" className="text-xs text-violet-700 border-violet-300">Approval required per send</Badge>
            )}
          </div>
          {template.subject && !editing && (
            <p className="text-xs text-slate-500 mb-1">Subject: <span className="text-slate-700">{template.subject}</span></p>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 hover:text-slate-600 shrink-0"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {(expanded || editing) && (
        <div className="mt-3 space-y-3">
          {editing ? (
            <div className="space-y-2">
              {(template.channel === "email" || template.channel === "both") && (
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Subject line</label>
                  <input
                    className="w-full text-sm border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    placeholder="Email subject..."
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Message body</label>
                <Textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={5}
                  className="text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Merge fields: {"{{patient_name}}"} {"{{appointment_date}}"} {"{{appointment_time}}"} {"{{provider_name}}"} {"{{booking_link}}"} {"{{cancel_link}}"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={isPending}>
                  <Check className="h-3.5 w-3.5 mr-1" />Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setEditing(false); setEditBody(template.body); setEditSubject(template.subject || ""); }}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded p-3 text-sm text-slate-700 whitespace-pre-wrap">
              {template.body}
            </div>
          )}

          {!editing && (
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(true)}
              >
                <Edit3 className="h-3.5 w-3.5 mr-1" />Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onTestSend(template.type)}
              >
                <Send className="h-3.5 w-3.5 mr-1" />Test Send
              </Button>
              {!template.approved && (
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => onApprove(template.type)}
                >
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />Approve
                </Button>
              )}
              {template.approved && template.approved_at && (
                <span className="text-xs text-slate-400 self-center">
                  Approved {new Date(template.approved_at).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MessageTemplatesClient({ templates: initialTemplates, totalCount }: Props) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [isPending, startTransition] = useTransition();
  const [recentlyEdited, setRecentlyEdited] = useState<Set<string>>(new Set());

  const approvedCount = templates.filter((t) => t.approved).length;
  const unapprovedCount = totalCount - approvedCount;

  const handleApprove = (type: string) => {
    startTransition(async () => {
      const res = await fetch("/api/message-templates/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        setTemplates((prev) => prev.map((t) => t.type === type ? { ...t, approved: true, approved_at: new Date().toISOString() } : t));
        setRecentlyEdited((prev) => { const next = new Set(prev); next.delete(type); return next; });
        toast.success("Template approved");
      } else {
        toast.error("Failed to approve template");
      }
    });
  };

  const handleApproveAll = () => {
    startTransition(async () => {
      const res = await fetch("/api/message-templates/approve-all", { method: "POST" });
      if (res.ok) {
        const now = new Date().toISOString();
        setTemplates((prev) => prev.map((t) => ({ ...t, approved: true, approved_at: now })));
        setRecentlyEdited(new Set());
        toast.success("All templates approved");
      } else {
        toast.error("Failed to approve all templates");
      }
    });
  };

  const handleEdit = (type: string, body: string, subject?: string) => {
    setTemplates((prev) => prev.map((t) => t.type === type ? { ...t, body, subject: subject || t.subject, approved: false, approved_at: null } : t));
    setRecentlyEdited((prev) => new Set([...prev, type]));
  };

  const handleTestSend = async (type: string) => {
    const res = await fetch("/api/message-templates/test-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    if (res.ok) {
      toast.success("Test message sent to your contact");
    } else {
      toast.error("Test send failed — check your contact info in Settings");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-5 w-5 text-cyan-600" />
            <h1 className="text-xl font-semibold text-slate-900">Message Templates</h1>
          </div>
          <p className="text-sm text-slate-500">
            Review and approve all patient communications before they go live.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-slate-900">{approvedCount}<span className="text-slate-400 text-lg">/{totalCount}</span></div>
          <div className="text-xs text-slate-500">Approved</div>
        </div>
      </div>

      {/* Warning banner */}
      {unapprovedCount > 0 && (
        <div className="flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2 text-amber-800 text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span><strong>{unapprovedCount} of {totalCount}</strong> messages need your approval before automations run</span>
          </div>
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
            onClick={handleApproveAll}
            disabled={isPending}
          >
            Approve All
          </Button>
        </div>
      )}

      {unapprovedCount === 0 && recentlyEdited.size === 0 && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-emerald-800 text-sm">
          <CheckCircle className="h-4 w-4" />
          All templates approved — automations are active.
        </div>
      )}

      {recentlyEdited.size > 0 && unapprovedCount > 0 && (
        <div className="flex items-center justify-between gap-4 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2 text-orange-800 text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>You edited {recentlyEdited.size} template{recentlyEdited.size > 1 ? "s" : ""} — <strong>re-approval required</strong> before the updated version goes live</span>
          </div>
          <Button
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white shrink-0"
            onClick={handleApproveAll}
            disabled={isPending}
          >
            Re-Approve All
          </Button>
        </div>
      )}

      {/* Groups */}
      {GROUP_ORDER.map((group) => {
        const groupTemplates = templates.filter((t) => t.group === group);
        if (groupTemplates.length === 0) return null;
        const groupApproved = groupTemplates.filter((t) => t.approved).length;
        return (
          <div key={group} className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{group}</h2>
              <span className="text-xs text-slate-400">{groupApproved}/{groupTemplates.length} approved</span>
            </div>
            <div className="space-y-2">
              {groupTemplates.map((t) => (
                <TemplateCard
                  key={t.type}
                  template={t}
                  onApprove={handleApprove}
                  onEdit={handleEdit}
                  onTestSend={handleTestSend}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

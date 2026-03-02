"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, CheckCircle, XCircle, Edit2, Send, RefreshCw, Clock } from "lucide-react";

interface SourceMessage {
  id: string;
  from_email: string;
  from_name: string | null;
  subject: string | null;
  classification: string | null;
}

interface Draft {
  id: string;
  to_email: string;
  subject: string;
  body: string;
  status: string;
  created_at: string;
  source_message: SourceMessage | null;
}

export function DraftsQueue() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const [sending, setSending] = useState<string | null>(null);

  const loadDrafts = useCallback(async () => {
    try {
      const res = await fetch("/api/email/drafts?status=pending");
      const data = await res.json();
      setDrafts(data.drafts ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDrafts();
    const interval = setInterval(loadDrafts, 30000);
    return () => clearInterval(interval);
  }, [loadDrafts]);

  async function approveDraft(id: string, bodyOverride?: string) {
    setSending(id);
    try {
      const res = await fetch(`/api/email/drafts/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyOverride ? { body: bodyOverride } : {}),
      });
      if (res.ok) {
        setDrafts((prev) => prev.filter((d) => d.id !== id));
        setEditing(null);
      }
    } finally {
      setSending(null);
    }
  }

  async function rejectDraft(id: string) {
    try {
      await fetch(`/api/email/drafts/${id}`, { method: "DELETE" });
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    } catch {
      // ignore
    }
  }

  async function saveEdit(id: string) {
    try {
      await fetch(`/api/email/drafts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: editBody }),
      });
      setDrafts((prev) =>
        prev.map((d) => (d.id === id ? { ...d, body: editBody } : d))
      );
      setEditing(null);
    } catch {
      // ignore
    }
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
        <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Loading drafts...
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-sm">
        <CheckCircle className="h-8 w-8 mb-2 text-emerald-400" />
        <p className="font-medium text-slate-600">All caught up</p>
        <p>No pending drafts</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{drafts.length} pending approval{drafts.length !== 1 ? "s" : ""}</p>
        <button
          onClick={loadDrafts}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600"
        >
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </div>

      {drafts.map((draft) => (
        <div
          key={draft.id}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 shrink-0">
                <Mail className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">To: {draft.to_email}</p>
                <p className="text-xs text-slate-500">{draft.subject}</p>
                {draft.source_message && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    In reply to: {draft.source_message.from_name || draft.source_message.from_email}
                    {draft.source_message.classification && (
                      <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 uppercase">
                        {draft.source_message.classification}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
              <Clock className="h-3 w-3" /> {timeAgo(draft.created_at)}
            </div>
          </div>

          {/* Draft body */}
          {editing === draft.id ? (
            <div className="mb-3">
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:outline-none resize-none"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => saveEdit(draft.id)}
                  className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-3 rounded-lg bg-slate-50 border border-slate-100 px-4 py-3">
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {draft.body}
              </p>
            </div>
          )}

          {/* Actions */}
          {editing !== draft.id && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => approveDraft(draft.id)}
                disabled={sending === draft.id}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {sending === draft.id ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <Send className="h-3 w-3" />
                )}
                Approve & Send
              </button>
              <button
                onClick={() => {
                  setEditing(draft.id);
                  setEditBody(draft.body);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
              <button
                onClick={() => rejectDraft(draft.id)}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-3 w-3" /> Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

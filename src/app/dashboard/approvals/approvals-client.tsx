"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Zap,
  CheckCircle2,
  XCircle,
  Pencil,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface PendingAction {
  id: string;
  actionType: string;
  module: string;
  description: string;
  inputData: Record<string, unknown> | null;
  outputData: Record<string, unknown> | null;
  status: string;
  confidenceScore: number | null;
  patientId: string | null;
  leadId: string | null;
  createdAt: string;
}

interface RecentAction {
  id: string;
  actionType: string;
  module: string;
  description: string;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
}

interface Props {
  pendingActions: PendingAction[];
  recentActions: RecentAction[];
}

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getConfidenceColor(score: number | null): string {
  if (score === null) return "bg-slate-100 text-slate-600";
  if (score >= 0.8) return "bg-emerald-100 text-emerald-700";
  if (score >= 0.5) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

function getOutputContent(action: PendingAction): string {
  if (!action.outputData) return "";
  if (typeof action.outputData === "string") return action.outputData;
  if (action.outputData.response) return String(action.outputData.response);
  if (action.outputData.content) return String(action.outputData.content);
  if (action.outputData.message) return String(action.outputData.message);
  return JSON.stringify(action.outputData, null, 2);
}

function getModuleLabel(module: string): string {
  const labels: Record<string, string> = {
    lead_response: "Lead Response",
    scheduling: "Scheduling",
    insurance: "Insurance",
    outreach: "Outreach",
    analytics: "Analytics",
    recall: "Recall",
  };
  return labels[module] || module.replace(/_/g, " ");
}

export function ApprovalsClient({ pendingActions, recentActions }: Props) {
  const [pending, setPending] = useState(pendingActions);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [showRecent, setShowRecent] = useState(false);

  const selected = pending[selectedIndex] || null;

  const handleApprove = useCallback(
    async (actionId: string) => {
      setProcessing(actionId);
      try {
        const res = await fetch("/api/approvals/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action_id: actionId,
            decision: "approve",
            edited_content: editingId === actionId ? editText : undefined,
          }),
        });
        if (res.ok) {
          setPending((prev) => prev.filter((a) => a.id !== actionId));
          setEditingId(null);
          setSelectedIndex((i) => Math.min(i, pending.length - 2));
        }
      } finally {
        setProcessing(null);
      }
    },
    [editingId, editText, pending.length]
  );

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (showRejectModal || editingId) return;
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, pending.length - 1));
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "a" && selected) {
        e.preventDefault();
        handleApprove(selected.id);
      } else if (e.key === "e" && selected) {
        e.preventDefault();
        startEditing(selected);
      } else if (e.key === "r" && selected) {
        e.preventDefault();
        setShowRejectModal(selected.id);
      }
    },
    [pending, selected, showRejectModal, editingId, handleApprove]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  async function handleReject(actionId: string) {
    setProcessing(actionId);
    try {
      const res = await fetch("/api/approvals/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action_id: actionId,
          decision: "reject",
          reason: rejectReason,
        }),
      });
      if (res.ok) {
        setPending((prev) => prev.filter((a) => a.id !== actionId));
        setShowRejectModal(null);
        setRejectReason("");
        setSelectedIndex((i) => Math.min(i, pending.length - 2));
      }
    } finally {
      setProcessing(null);
    }
  }

  function startEditing(action: PendingAction) {
    setEditText(getOutputContent(action));
    setEditingId(action.id);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Approval Queue</h1>
          <p className="text-sm text-slate-500">
            Review and approve AI-generated actions before they&apos;re sent
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500">
            <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono">a</kbd>
            approve
            <kbd className="ml-2 rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono">e</kbd>
            edit
            <kbd className="ml-2 rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono">r</kbd>
            reject
            <kbd className="ml-2 rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono">j/k</kbd>
            navigate
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-2xl font-bold text-amber-700">{pending.length}</p>
          <p className="text-sm text-amber-600">Pending Review</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-emerald-600">
            {recentActions.filter((a) => a.status === "approved" || a.status === "executed").length}
          </p>
          <p className="text-sm text-slate-500">Recently Approved</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-red-600">
            {recentActions.filter((a) => a.status === "rejected").length}
          </p>
          <p className="text-sm text-slate-500">Recently Rejected</p>
        </div>
      </div>

      {/* Pending Queue */}
      {pending.length > 0 ? (
        <div className="space-y-4">
          {pending.map((action, index) => {
            const content = getOutputContent(action);
            const isSelected = index === selectedIndex;
            const isEditing = editingId === action.id;
            const isProcessing = processing === action.id;

            return (
              <div
                key={action.id}
                onClick={() => setSelectedIndex(index)}
                className={`rounded-xl border bg-white transition-all ${
                  isSelected
                    ? "border-cyan-300 ring-2 ring-cyan-100"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Action header */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50">
                    <Zap className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {action.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {getModuleLabel(action.module)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {timeAgo(action.createdAt)}
                      </span>
                      {action.confidenceScore !== null && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${getConfidenceColor(
                            action.confidenceScore
                          )}`}
                        >
                          {Math.round(action.confidenceScore * 100)}% confidence
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {action.leadId && (
                      <a
                        href="/dashboard/leads"
                        className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      >
                        View Lead
                      </a>
                    )}
                  </div>
                </div>

                {/* Content preview */}
                {content && (
                  <div className="px-6 py-4">
                    {isEditing ? (
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={6}
                        className="w-full rounded-lg border border-cyan-200 bg-white p-4 text-sm text-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    ) : (
                      <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-line">
                        {content}
                      </div>
                    )}
                  </div>
                )}

                {/* Context from input data */}
                {action.inputData && (
                  <div className="px-6 pb-2">
                    <details className="text-xs text-slate-400">
                      <summary className="cursor-pointer hover:text-slate-600">
                        View context
                      </summary>
                      <pre className="mt-2 rounded-lg bg-slate-50 p-3 overflow-auto">
                        {JSON.stringify(action.inputData, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(action.id);
                    }}
                    disabled={isProcessing}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Approve & Send
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isEditing) {
                        setEditingId(null);
                      } else {
                        startEditing(action);
                      }
                    }}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="h-4 w-4" />
                    {isEditing ? "Cancel Edit" : "Edit"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRejectModal(action.id);
                    }}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">All caught up!</h3>
          <p className="mt-1 text-sm text-slate-500">
            No pending approvals. AI actions will appear here when they need review.
          </p>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Reject Action</h3>
            <p className="mt-1 text-sm text-slate-500">
              Provide a reason for rejecting this AI action.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              rows={3}
              className="mt-4 w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason("");
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={processing === showRejectModal}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {processing === showRejectModal && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <button
          onClick={() => setShowRecent(!showRecent)}
          className="flex w-full items-center justify-between px-6 py-4"
        >
          <h2 className="text-base font-semibold text-slate-900">Recent Decisions</h2>
          {showRecent ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </button>
        {showRecent && (
          <div className="divide-y divide-slate-100 border-t border-slate-100">
            {recentActions.length > 0 ? (
              recentActions.map((action) => (
                <div key={action.id} className="flex items-center gap-4 px-6 py-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      action.status === "rejected" ? "bg-red-50" : "bg-emerald-50"
                    }`}
                  >
                    {action.status === "rejected" ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{action.description}</p>
                    <p className="text-xs text-slate-500">
                      {action.status === "rejected" ? "Rejected" : "Approved"}{" "}
                      {action.approvedAt ? timeAgo(action.approvedAt) : timeAgo(action.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      action.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {action.status === "rejected" ? "Rejected" : "Approved"}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-8 text-sm text-slate-400">
                No recent decisions
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

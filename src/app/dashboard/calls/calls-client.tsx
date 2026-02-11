"use client";

import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Voicemail,
  Zap,
  Play,
  FileText,
  AlertCircle,
} from "lucide-react";
import type { Call } from "@/types/database";

const directionIcons = {
  inbound: PhoneIncoming,
  outbound: PhoneOutgoing,
};

const statusConfig: Record<string, { color: string; icon: typeof Phone }> = {
  answered: { color: "text-emerald-500", icon: Phone },
  missed: { color: "text-red-500", icon: PhoneMissed },
  voicemail: { color: "text-amber-500", icon: Voicemail },
  abandoned: { color: "text-slate-400", icon: PhoneMissed },
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export function CallsClient({ initialCalls }: { initialCalls: Call[] }) {
  const calls = initialCalls;
  const totalCalls = calls.length;
  const answered = calls.filter((c) => c.status === "answered").length;
  const missed = calls.filter((c) => c.status === "missed").length;
  const aiHandled = calls.filter((c) => c.ai_handled).length;
  const needFollowUp = calls.filter((c) => c.follow_up_required && !c.follow_up_completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Call Intelligence</h1>
          <p className="text-sm text-slate-500">AI-powered call handling, transcription, and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-emerald-700">Vapi AI Active</span>
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{totalCalls}</p>
          <p className="text-sm text-slate-500">Total Calls</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{answered}</p>
          <p className="text-sm text-slate-500">Answered</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{missed}</p>
          <p className="text-sm text-slate-500">Missed</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-cyan-600">{aiHandled}</p>
          <p className="text-sm text-slate-500">AI Handled</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{needFollowUp}</p>
          <p className="text-sm text-slate-500">Need Follow-Up</p>
        </div>
      </div>

      {/* Empty state */}
      {calls.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <Phone className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-semibold text-slate-900">No calls recorded yet</h3>
          <p className="mt-1 text-sm text-slate-500">Calls will appear here once Vapi/Twilio is configured.</p>
        </div>
      )}

      {/* Call Log */}
      {calls.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">Call Log</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {calls.map((call) => {
              const DirIcon = directionIcons[call.direction as keyof typeof directionIcons] || PhoneIncoming;
              const config = statusConfig[call.status] || statusConfig.missed;
              const StatusIcon = config.icon;
              return (
                <div key={call.id} className="px-6 py-4 hover:bg-slate-50">
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 ${config.color}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900">
                          {call.caller_name || "Unknown Caller"}
                        </p>
                        <DirIcon className="h-3.5 w-3.5 text-slate-400" />
                        {call.ai_handled && (
                          <span className="flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-xs text-cyan-700">
                            <Zap className="h-3 w-3" /> AI
                          </span>
                        )}
                        {call.after_hours && (
                          <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">After Hours</span>
                        )}
                        {call.follow_up_required && !call.follow_up_completed && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                            <AlertCircle className="h-3 w-3" /> Follow-up needed
                          </span>
                        )}
                      </div>
                      {call.ai_summary && (
                        <p className="mt-1 text-sm text-slate-600">{call.ai_summary}</p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                        <span>{call.caller_phone || "—"}</span>
                        <span>{formatTime(call.created_at)}</span>
                        <span>{formatDuration(call.duration_seconds)}</span>
                        {call.intent && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{call.intent}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {call.recording_url && (
                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" title="Play recording">
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      {call.transcription && (
                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" title="View transcript">
                          <FileText className="h-4 w-4" />
                        </button>
                      )}
                      {call.follow_up_required && !call.follow_up_completed && (
                        <button className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100">
                          Follow Up
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

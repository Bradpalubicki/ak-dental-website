"use client";

import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Voicemail,
  Clock,
  Zap,
  Play,
  FileText,
  AlertCircle,
  CheckCircle2,
  User,
} from "lucide-react";

interface Call {
  id: string;
  callerName: string;
  callerPhone: string;
  direction: "inbound" | "outbound";
  status: "answered" | "missed" | "voicemail";
  duration: string;
  afterHours: boolean;
  aiHandled: boolean;
  intent: string;
  urgency: "low" | "medium" | "high" | "emergency";
  summary: string;
  hasRecording: boolean;
  hasTranscript: boolean;
  followUpRequired: boolean;
  time: string;
}

const calls: Call[] = [
  { id: "1", callerName: "Michael Rodriguez", callerPhone: "(702) 555-0142", direction: "inbound", status: "answered", duration: "3:42", afterHours: false, aiHandled: false, intent: "Appointment Request", urgency: "medium", summary: "New patient inquiring about dental implant consultation. Booked for next Thursday.", hasRecording: true, hasTranscript: true, followUpRequired: false, time: "10:15 AM" },
  { id: "2", callerName: "Unknown Caller", callerPhone: "(702) 555-0299", direction: "inbound", status: "voicemail", duration: "0:45", afterHours: true, aiHandled: true, intent: "Emergency", urgency: "high", summary: "AI handled: Patient reporting severe tooth pain. Provided emergency instructions and scheduled callback for 8 AM.", hasRecording: true, hasTranscript: true, followUpRequired: true, time: "11:23 PM (last night)" },
  { id: "3", callerName: "Lisa Hernandez", callerPhone: "(702) 555-0198", direction: "outbound", status: "answered", duration: "2:15", afterHours: false, aiHandled: false, intent: "Appointment Reminder", urgency: "low", summary: "Confirmed tomorrow's whitening appointment. Patient has no questions.", hasRecording: true, hasTranscript: true, followUpRequired: false, time: "9:30 AM" },
  { id: "4", callerName: "Tom Baker", callerPhone: "(702) 555-0167", direction: "inbound", status: "missed", duration: "—", afterHours: false, aiHandled: false, intent: "Unknown", urgency: "medium", summary: "Missed call during lunch. AI sent automatic callback text.", hasRecording: false, hasTranscript: false, followUpRequired: true, time: "12:15 PM" },
  { id: "5", callerName: "Amanda Patel", callerPhone: "(702) 555-0234", direction: "inbound", status: "answered", duration: "5:20", afterHours: false, aiHandled: false, intent: "Insurance Question", urgency: "low", summary: "Patient asking about insurance coverage for upcoming cleaning. Confirmed Cigna in-network.", hasRecording: true, hasTranscript: true, followUpRequired: false, time: "2:00 PM" },
];

const directionIcons = {
  inbound: PhoneIncoming,
  outbound: PhoneOutgoing,
};

const statusConfig: Record<string, { color: string; icon: typeof Phone }> = {
  answered: { color: "text-emerald-500", icon: Phone },
  missed: { color: "text-red-500", icon: PhoneMissed },
  voicemail: { color: "text-amber-500", icon: Voicemail },
};

export default function CallsPage() {
  const totalCalls = calls.length;
  const answered = calls.filter((c) => c.status === "answered").length;
  const missed = calls.filter((c) => c.status === "missed").length;
  const aiHandled = calls.filter((c) => c.aiHandled).length;
  const needFollowUp = calls.filter((c) => c.followUpRequired).length;

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

      {/* Call Log */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Call Log</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {calls.map((call) => {
            const DirIcon = directionIcons[call.direction];
            const config = statusConfig[call.status];
            const StatusIcon = config.icon;
            return (
              <div key={call.id} className="px-6 py-4 hover:bg-slate-50">
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 ${config.color}`}>
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900">{call.callerName}</p>
                      <DirIcon className="h-3.5 w-3.5 text-slate-400" />
                      {call.aiHandled && (
                        <span className="flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-xs text-cyan-700">
                          <Zap className="h-3 w-3" /> AI
                        </span>
                      )}
                      {call.afterHours && (
                        <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700">After Hours</span>
                      )}
                      {call.followUpRequired && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                          <AlertCircle className="h-3 w-3" /> Follow-up needed
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{call.summary}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                      <span>{call.callerPhone}</span>
                      <span>{call.time}</span>
                      <span>{call.duration}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{call.intent}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {call.hasRecording && (
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" title="Play recording">
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                    {call.hasTranscript && (
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" title="View transcript">
                        <FileText className="h-4 w-4" />
                      </button>
                    )}
                    {call.followUpRequired && (
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
    </div>
  );
}

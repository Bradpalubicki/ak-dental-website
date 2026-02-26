"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  subject: string | null;
  channel: string;
  campaign_type: string | null;
  status: string;
  sent_at: string;
  opened: boolean;
  opened_at: string | null;
}

const channelIcons: Record<string, typeof Mail> = {
  email: Mail,
  sms: Phone,
  phone: Phone,
};

const typeLabels: Record<string, string> = {
  welcome: "Welcome",
  recall: "Recall Reminder",
  treatment_followup: "Treatment Follow-Up",
  reactivation: "We Miss You",
  no_show: "Missed Appointment",
  review_request: "Review Request",
  birthday: "Birthday",
  custom: "Message",
};

export function MessagesClient({
  messages,
  patientId,
}: {
  messages: Message[];
  patientId: string;
}) {
  const [showCompose, setShowCompose] = useState(false);
  const [composing, setComposing] = useState(false);
  const [composed, setComposed] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) return;
    setComposing(true);

    try {
      const res = await fetch("/api/portal/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientId, subject, body }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setComposed(true);
      setSubject("");
      setBody("");
      setTimeout(() => {
        setShowCompose(false);
        setComposed(false);
      }, 2000);
    } catch {
      toast.error("Failed to send message. Please try again or call the office.");
    } finally {
      setComposing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="mt-1 text-sm text-slate-500">
            {messages.length} message{messages.length !== 1 ? "s" : ""} from our team
          </p>
        </div>
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-700 transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          Send a Message
        </button>
      </div>

      {/* Compose Form */}
      {showCompose && (
        <div className="rounded-xl border border-cyan-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">New Message to AK Ultimate Dental</h3>
          {composed ? (
            <div className="flex items-center gap-3 py-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <p className="text-sm text-emerald-700 font-medium">Message sent! We will get back to you shortly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Question about my treatment plan"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Message</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  placeholder="Type your message here..."
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSend}
                  disabled={composing || !subject.trim() || !body.trim()}
                  className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50 transition-colors"
                >
                  {composing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send Message
                </button>
                <button
                  onClick={() => setShowCompose(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                For urgent matters, please call us directly. Messages are checked during business hours.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Messages List */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="divide-y divide-slate-100">
          {messages.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-500">No messages yet</p>
              <p className="text-xs text-slate-400 mt-1">Communications from our team will appear here</p>
            </div>
          ) : (
            messages.map((msg) => {
              const ChannelIcon = channelIcons[msg.channel] || Mail;
              const typeLabel = typeLabels[msg.campaign_type || "custom"] || "Message";
              return (
                <div key={msg.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      msg.channel === "email" ? "bg-blue-50" : "bg-emerald-50"
                    )}>
                      <ChannelIcon className={cn(
                        "h-4 w-4",
                        msg.channel === "email" ? "text-blue-600" : "text-emerald-600"
                      )} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{msg.subject || typeLabel}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500">
                          {new Date(msg.sent_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-[10px] text-slate-400">&middot;</span>
                        <span className="text-[10px] text-slate-400 capitalize">{msg.channel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {msg.opened ? (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" /> Read
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        <Clock className="h-3 w-3" /> Delivered
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

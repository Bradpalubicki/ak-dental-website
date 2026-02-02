"use client";

import { useState } from "react";
import {
  Inbox,
  Search,
  Mail,
  MessageSquare,
  Phone,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  User,
} from "lucide-react";

interface Message {
  id: string;
  createdAt: string;
  channel: string;
  direction: string;
  status: string;
  subject: string | null;
  content: string;
  metadata: Record<string, unknown> | null;
  patientId: string | null;
  patientName: string;
  patientPhone: string | null;
  patientEmail: string | null;
}

interface Conversation {
  patientId: string | null;
  patientName: string;
  patientPhone: string | null;
  patientEmail: string | null;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

interface Props {
  conversations: Conversation[];
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
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const channelIcons: Record<string, typeof Mail> = {
  email: Mail,
  sms: MessageSquare,
  call: Phone,
  portal: Inbox,
};

export function InboxClient({ conversations }: Props) {
  const [selected, setSelected] = useState<Conversation | null>(
    conversations[0] || null
  );
  const [search, setSearch] = useState("");

  const filtered = conversations.filter(
    (c) =>
      search === "" ||
      c.patientName.toLowerCase().includes(search.toLowerCase()) ||
      c.patientPhone?.includes(search) ||
      c.patientEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inbox</h1>
          <p className="text-sm text-slate-500">
            {conversations.length} conversations{" "}
            {totalUnread > 0 && (
              <span className="font-medium text-cyan-600">
                &middot; {totalUnread} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-5 rounded-xl border border-slate-200 bg-white overflow-hidden" style={{ height: "calc(100vh - 240px)" }}>
        {/* Conversation List */}
        <div className="lg:col-span-2 border-r border-slate-200 flex flex-col">
          <div className="border-b border-slate-200 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filtered.length > 0 ? (
              filtered.map((conv) => {
                const ChannelIcon =
                  channelIcons[conv.lastMessage.channel] || MessageSquare;
                const isSelected =
                  selected?.patientId === conv.patientId &&
                  selected?.patientName === conv.patientName;

                return (
                  <button
                    key={conv.patientId || conv.patientName}
                    onClick={() => setSelected(conv)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      isSelected ? "bg-cyan-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 shrink-0">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {conv.patientName}
                          </p>
                          <span className="text-xs text-slate-400 shrink-0 ml-2">
                            {timeAgo(conv.lastMessage.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <ChannelIcon className="h-3 w-3 text-slate-400 shrink-0" />
                          <p className="text-xs text-slate-500 truncate">
                            {conv.lastMessage.direction === "inbound" ? "" : "You: "}
                            {conv.lastMessage.content.substring(0, 60)}
                            {conv.lastMessage.content.length > 60 ? "..." : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {conv.unreadCount > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-600 px-1.5 text-[10px] font-bold text-white">
                              {conv.unreadCount}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 uppercase">
                            {conv.lastMessage.channel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-sm text-slate-400">
                <Inbox className="h-8 w-8 mb-2" />
                {conversations.length === 0
                  ? "No messages yet"
                  : "No conversations match your search"}
              </div>
            )}
          </div>
        </div>

        {/* Conversation Detail */}
        <div className="lg:col-span-3 flex flex-col">
          {selected ? (
            <>
              {/* Conversation Header */}
              <div className="border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      {selected.patientName}
                    </h2>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                      {selected.patientPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {selected.patientPhone}
                        </span>
                      )}
                      {selected.patientEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {selected.patientEmail}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      {selected.messages.length} message{selected.messages.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {[...selected.messages].reverse().map((msg) => {
                  const isInbound = msg.direction === "inbound";
                  const ChannelIcon = channelIcons[msg.channel] || MessageSquare;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isInbound ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-xl px-4 py-3 ${
                          isInbound
                            ? "bg-slate-100 text-slate-900"
                            : "bg-cyan-600 text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {isInbound ? (
                            <ArrowDownLeft className="h-3 w-3 opacity-60" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 opacity-60" />
                          )}
                          <ChannelIcon className="h-3 w-3 opacity-60" />
                          <span
                            className={`text-[10px] uppercase ${
                              isInbound ? "text-slate-400" : "text-cyan-100"
                            }`}
                          >
                            {msg.channel} &middot; {isInbound ? "received" : "sent"}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                        <p
                          className={`text-[10px] mt-1 ${
                            isInbound ? "text-slate-400" : "text-cyan-100"
                          }`}
                        >
                          {formatDateTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="border-t border-slate-200 px-6 py-3 flex items-center gap-3">
                <a
                  href="/dashboard/approvals"
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Check Approvals
                </a>
                <a
                  href="/dashboard/patients"
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  View Patient
                </a>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-sm text-slate-400">
              <Inbox className="h-8 w-8 mb-2" />
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

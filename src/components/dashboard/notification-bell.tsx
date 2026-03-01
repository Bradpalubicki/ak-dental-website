"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  X,
  CheckCheck,
  UserPlus,
  Calendar,
  Bot,
  Shield,
  Users,
  CreditCard,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";

interface Notification {
  id: string;
  created_at: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  actor: string | null;
}

function typeIcon(type: string) {
  const cls = "h-3.5 w-3.5";
  switch (type) {
    case "lead":        return <UserPlus className={`${cls} text-blue-500`} />;
    case "appointment": return <Calendar className={`${cls} text-cyan-500`} />;
    case "ai":          return <Bot className={`${cls} text-purple-500`} />;
    case "insurance":   return <Shield className={`${cls} text-amber-500`} />;
    case "hr":          return <Users className={`${cls} text-emerald-500`} />;
    case "billing":     return <CreditCard className={`${cls} text-green-500`} />;
    case "warning":     return <AlertTriangle className={`${cls} text-orange-500`} />;
    case "critical":    return <AlertTriangle className={`${cls} text-red-500`} />;
    case "success":     return <CheckCircle2 className={`${cls} text-green-500`} />;
    default:            return <Info className={`${cls} text-slate-400`} />;
  }
}

function typeBg(type: string) {
  switch (type) {
    case "lead":        return "bg-blue-50";
    case "appointment": return "bg-cyan-50";
    case "ai":          return "bg-purple-50";
    case "insurance":   return "bg-amber-50";
    case "hr":          return "bg-emerald-50";
    case "billing":     return "bg-green-50";
    case "warning":     return "bg-orange-50";
    case "critical":    return "bg-red-50";
    case "success":     return "bg-green-50";
    default:            return "bg-slate-50";
  }
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json() as { notifications: Notification[]; unread: number };
      setNotifications(data.notifications);
      setUnread(data.unread);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotifications();
    // Poll every 30s for new notifications
    const interval = setInterval(() => void fetchNotifications(), 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnread((prev) => Math.max(0, prev - 1));
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-[9px] font-bold text-white shadow-sm">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-900">Notifications</span>
              {unread > 0 && (
                <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                  {unread} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                >
                  <CheckCheck className="h-3 w-3" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                <p className="text-sm font-medium text-slate-600">All caught up!</p>
                <p className="text-xs text-slate-400">No notifications right now.</p>
              </div>
            ) : (
              notifications.map((n) => {
                const inner = (
                  <div
                    key={n.id}
                    className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${!n.read ? "bg-blue-50/40" : ""}`}
                    onClick={() => { if (!n.read) void markRead(n.id); }}
                  >
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${typeBg(n.type)}`}>
                      {typeIcon(n.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1">
                        <p className={`text-xs font-semibold leading-snug ${!n.read ? "text-slate-900" : "text-slate-600"}`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        )}
                      </div>
                      {n.body && (
                        <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                          {n.body}
                        </p>
                      )}
                      <p className="mt-1 text-[10px] text-slate-400">{timeAgo(n.created_at)}</p>
                    </div>
                  </div>
                );

                return n.link ? (
                  <Link key={n.id} href={n.link} onClick={() => { if (!n.read) void markRead(n.id); setOpen(false); }}>
                    {inner}
                  </Link>
                ) : (
                  <div key={n.id}>{inner}</div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-4 py-2">
            <p className="text-center text-[10px] text-slate-400">
              Showing last 20 notifications
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

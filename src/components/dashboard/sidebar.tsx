"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  Shield,
  FileText,
  Phone,
  DollarSign,
  BarChart3,
  Send,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Inbox,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface SidebarBadges {
  approvals: number;
  leads: number;
  inbox: number;
  insurance: number;
  appointments: number;
  hrPending: number;
}

const navigation: Array<{
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  badgeKey?: keyof SidebarBadges;
  badgeColor?: string;
  badgeLabel?: string;
}> = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Business Advisor", href: "/dashboard/advisor", icon: Sparkles },
  { name: "HR & Team", href: "/dashboard/hr", icon: UsersRound, badgeKey: "hrPending", badgeColor: "bg-rose-500 text-white", badgeLabel: "pending" },
  { name: "Approvals", href: "/dashboard/approvals", icon: CheckSquare, badgeKey: "approvals", badgeColor: "bg-amber-500 text-white", badgeLabel: "pending" },
  { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, badgeKey: "inbox", badgeColor: "bg-blue-500 text-white", badgeLabel: "new" },
  { name: "Leads", href: "/dashboard/leads", icon: UserPlus, badgeKey: "leads", badgeColor: "bg-emerald-500 text-white", badgeLabel: "new" },
  { name: "Patients", href: "/dashboard/patients", icon: Users },
  { name: "Appointments", href: "/dashboard/appointments", icon: Calendar, badgeKey: "appointments", badgeColor: "bg-orange-500 text-white", badgeLabel: "unconfirmed" },
  { name: "Insurance", href: "/dashboard/insurance", icon: Shield, badgeKey: "insurance", badgeColor: "bg-purple-500 text-white", badgeLabel: "pending" },
  { name: "Treatments", href: "/dashboard/treatments", icon: FileText },
  { name: "Calls", href: "/dashboard/calls", icon: Phone },
  { name: "Billing", href: "/dashboard/billing", icon: DollarSign },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Outreach", href: "/dashboard/outreach", icon: Send },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ badges = {} as SidebarBadges }: { badges?: SidebarBadges }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-slate-200 bg-white transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/ak-logo.png"
              alt="AK Ultimate Dental"
              width={990}
              height={329}
              className="h-10 w-auto"
            />
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 text-white">
            <Zap className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            const badgeCount = item.badgeKey ? badges[item.badgeKey] || 0 : 0;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative",
                    isActive
                      ? "bg-cyan-50 text-cyan-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="relative shrink-0">
                    <item.icon className={cn("h-5 w-5", isActive ? "text-cyan-600" : "text-slate-400")} />
                    {/* Dot badge when collapsed */}
                    {collapsed && badgeCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                        <span className={`relative inline-flex h-3 w-3 rounded-full ${item.badgeColor || "bg-amber-500"}`} />
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {badgeCount > 0 && (
                        <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${item.badgeColor || "bg-cyan-100 text-cyan-700"}`}>
                          {badgeCount}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-sm font-semibold text-cyan-700">
            AK
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">AK Ultimate Dental</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-8 items-center justify-center border-t border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}

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
  Activity,
  Wallet,
  Award,
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

interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  badgeKey?: keyof SidebarBadges;
  badgeColor?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    label: "Command Center",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Business Advisor", href: "/dashboard/advisor", icon: Sparkles },
      { name: "Approvals", href: "/dashboard/approvals", icon: CheckSquare, badgeKey: "approvals", badgeColor: "bg-amber-400 text-amber-950" },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Leads", href: "/dashboard/leads", icon: UserPlus, badgeKey: "leads", badgeColor: "bg-emerald-400 text-emerald-950" },
      { name: "Patients", href: "/dashboard/patients", icon: Users },
      { name: "Appointments", href: "/dashboard/appointments", icon: Calendar, badgeKey: "appointments", badgeColor: "bg-orange-400 text-orange-950" },
      { name: "Treatments", href: "/dashboard/treatments", icon: FileText },
      { name: "Insurance", href: "/dashboard/insurance", icon: Shield, badgeKey: "insurance", badgeColor: "bg-violet-400 text-violet-950" },
    ],
  },
  {
    label: "Business Hub",
    items: [
      { name: "Financials", href: "/dashboard/financials", icon: Wallet },
      { name: "Billing", href: "/dashboard/billing", icon: DollarSign },
      { name: "HR & Payroll", href: "/dashboard/hr", icon: UsersRound, badgeKey: "hrPending", badgeColor: "bg-rose-400 text-rose-950" },
      { name: "Licensing", href: "/dashboard/licensing", icon: Award },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { name: "Inbox", href: "/dashboard/inbox", icon: Inbox, badgeKey: "inbox", badgeColor: "bg-blue-400 text-blue-950" },
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { name: "Calls", href: "/dashboard/calls", icon: Phone },
      { name: "Outreach", href: "/dashboard/outreach", icon: Send },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function Sidebar({ badges = {} as SidebarBadges }: { badges?: SidebarBadges }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 transition-all duration-300 relative",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Subtle side accent line */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/20 via-cyan-500/5 to-transparent" />

      {/* Logo Area */}
      <div className={cn(
        "flex items-center border-b border-white/[0.06] transition-all duration-300",
        collapsed ? "h-16 justify-center px-2" : "h-16 px-5"
      )}>
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image
              src="/ak-logo-gold.jpg"
              alt="AK Ultimate Dental"
              width={990}
              height={329}
              className="h-9 w-auto rounded"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white tracking-tight leading-tight">One Engine</p>
              <p className="text-[9px] font-medium text-amber-400/80 uppercase tracking-widest">Platform</p>
            </div>
          </Link>
        ) : (
          <Image
            src="/ak-logo-gold.jpg"
            alt="AK"
            width={990}
            height={329}
            className="h-9 w-auto rounded"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                {section.label}
              </p>
            )}
            {collapsed && <div className="mb-1 mx-auto h-px w-6 bg-white/[0.06]" />}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
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
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 relative",
                        isActive
                          ? "bg-white/[0.08] text-white shadow-sm"
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                      )}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-cyan-400 to-blue-500" />
                      )}

                      <div className="relative shrink-0">
                        <item.icon className={cn(
                          "h-[18px] w-[18px] transition-colors",
                          isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
                        )} />
                        {/* Dot badge when collapsed */}
                        {collapsed && badgeCount > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${item.badgeColor || "bg-amber-400"}`} />
                          </span>
                        )}
                      </div>
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {badgeCount > 0 && (
                            <span className={cn(
                              "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                              item.badgeColor || "bg-cyan-400/20 text-cyan-300"
                            )}>
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
          </div>
        ))}
      </nav>

      {/* System Status */}
      <div className={cn(
        "border-t border-white/[0.06] transition-all duration-300",
        collapsed ? "px-2 py-3" : "px-4 py-3"
      )}>
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-lg bg-white/[0.04] px-3 py-2.5">
            <div className="relative">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-300">System Online</p>
              <p className="text-[10px] text-slate-500">All services operational</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative">
              <span className="flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Practice Info */}
      <div className={cn(
        "border-t border-white/[0.06] transition-all duration-300",
        collapsed ? "px-2 py-3" : "px-4 py-3"
      )}>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-xs font-bold text-cyan-400 ring-1 ring-cyan-500/20">
            AK
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium text-slate-300">AK Ultimate Dental</p>
              <p className="text-[10px] text-slate-500">Dr. Alex Khachaturian</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-9 items-center justify-center border-t border-white/[0.06] text-slate-500 hover:bg-white/[0.04] hover:text-slate-300 transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
    </aside>
  );
}

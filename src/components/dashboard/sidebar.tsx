"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
// UserButton conditionally imported when Clerk is configured
const CLERK_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = CLERK_KEY && !CLERK_KEY.includes("PLACEHOLDER");
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
  Bell,
  CheckSquare,
  Inbox,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation: Array<{
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}> = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Business Advisor", href: "/dashboard/advisor", icon: Sparkles },
  { name: "Approvals", href: "/dashboard/approvals", icon: CheckSquare },
  { name: "Inbox", href: "/dashboard/inbox", icon: Inbox },
  { name: "Leads", href: "/dashboard/leads", icon: UserPlus },
  { name: "Patients", href: "/dashboard/patients", icon: Users },
  { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { name: "Insurance", href: "/dashboard/insurance", icon: Shield },
  { name: "Treatments", href: "/dashboard/treatments", icon: FileText },
  { name: "Calls", href: "/dashboard/calls", icon: Phone },
  { name: "Billing", href: "/dashboard/billing", icon: DollarSign },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Outreach", href: "/dashboard/outreach", icon: Send },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
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

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-cyan-50 text-cyan-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-cyan-600" : "text-slate-400")} />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-100 px-1.5 text-xs font-semibold text-cyan-700">
                          {item.badge}
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

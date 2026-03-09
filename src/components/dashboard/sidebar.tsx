"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  DollarSign,
  MessageSquare,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Activity,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, createContext, useContext } from "react";

export const MobileSidebarContext = createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
}>({ open: false, setOpen: () => {} });

export function useMobileSidebar() {
  return useContext(MobileSidebarContext);
}

export interface SidebarBadges {
  approvals: number;
  leads: number;
  inbox: number;
  insurance: number;
  appointments: number;
  hrPending: number;
  pendingDocs: number;
  consentPending: number;
}

interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  badgeKey?: keyof SidebarBadges;
  badgeColor?: string;
  requiredPermission?: string;
}

// Primary 7-item nav — each top-level item links to the section landing page
// Sub-pages within each section are accessible from those pages, not the sidebar
const primaryNav: NavItem[] = [
  { name: "Dashboard",       href: "/dashboard",                    icon: LayoutDashboard },
  { name: "Patients",        href: "/dashboard/patients",           icon: Users,          badgeKey: "approvals",     badgeColor: "bg-amber-400 text-amber-950" },
  { name: "Schedule",        href: "/dashboard/schedule",           icon: Calendar,       badgeKey: "appointments",  badgeColor: "bg-orange-400 text-orange-950" },
  { name: "Clinical",        href: "/dashboard/clinical-notes",     icon: Stethoscope,    badgeKey: "consentPending", badgeColor: "bg-cyan-400 text-cyan-950" },
  { name: "Billing",         href: "/dashboard/billing",            icon: DollarSign,     badgeKey: "insurance",     badgeColor: "bg-violet-400 text-violet-950" },
  { name: "Communications",  href: "/dashboard/inbox",              icon: MessageSquare,  badgeKey: "inbox",         badgeColor: "bg-blue-400 text-blue-950" },
  { name: "Analytics",       href: "/dashboard/analytics",          icon: BarChart3,      requiredPermission: "analytics.view" },
];

const bottomNav: NavItem[] = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help",     href: "/dashboard/help",     icon: HelpCircle },
];


function NavLink({
  item,
  badges,
  pathname,
  collapsed,
}: {
  item: NavItem;
  badges: SidebarBadges;
  pathname: string;
  collapsed: boolean;
}) {
  const isActive =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href);
  const badgeCount = item.badgeKey ? badges[item.badgeKey] || 0 : 0;

  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 relative",
          isActive
            ? "bg-white/[0.08] text-white shadow-sm"
            : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
        )}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-cyan-400 to-blue-500" />
        )}
        <div className="relative shrink-0">
          <item.icon className={cn(
            "h-[18px] w-[18px] transition-colors",
            isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
          )} />
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
}

export function Sidebar({ badges = {} as SidebarBadges }: { badges?: SidebarBadges }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { open: mobileOpen, setOpen: setMobileOpen } = useMobileSidebar();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

    <aside
      className={cn(
        "flex flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 transition-all duration-300 relative z-50",
        // Desktop: collapsible
        collapsed ? "lg:w-[68px]" : "lg:w-64",
        // Mobile: fixed drawer
        "fixed inset-y-0 left-0 lg:relative",
        mobileOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0"
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
              src="/ak-logo-sidebar.png"
              alt="AK Ultimate Dental"
              width={384}
              height={150}
              className="h-8 w-auto"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white tracking-tight leading-tight">AK Ultimate</p>
              <p className="text-[9px] font-medium text-amber-400/80 uppercase tracking-widest">Dental</p>
            </div>
          </Link>
        ) : (
          <Image
            src="/ak-logo-sidebar.png"
            alt="AK"
            width={384}
            height={150}
            className="h-7 w-auto"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col justify-between">
        {/* Primary 7 items */}
        <ul className="space-y-0.5">
          {primaryNav.map((item) => (
            <NavLink key={item.name} item={item} badges={badges} pathname={pathname} collapsed={collapsed} />
          ))}
        </ul>

        {/* Bottom: Settings + Help */}
        <ul className="space-y-0.5 mt-4 pt-4 border-t border-white/[0.06]">
          {bottomNav.map((item) => (
            <NavLink key={item.name} item={item} badges={badges} pathname={pathname} collapsed={collapsed} />
          ))}
        </ul>
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
              <p className="text-[10px] text-slate-500">Dr. Alex Chireau</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle (desktop) / Close button (mobile) */}
      <button
        onClick={() => {
          if (mobileOpen) {
            setMobileOpen(false);
          } else {
            setCollapsed(!collapsed);
          }
        }}
        className="flex h-9 items-center justify-center border-t border-white/[0.06] text-slate-500 hover:bg-white/[0.04] hover:text-slate-300 transition-colors"
      >
        {mobileOpen
          ? <X className="h-3.5 w-3.5" />
          : collapsed
            ? <ChevronRight className="h-3.5 w-3.5" />
            : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
    </aside>
    </>
  );
}

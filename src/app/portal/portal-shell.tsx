"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  CreditCard,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/portal/treatments", label: "Treatment Plans", icon: FileText },
  { href: "/portal/billing", label: "Billing & Payments", icon: CreditCard },
  { href: "/portal/messages", label: "Messages", icon: MessageSquare },
  { href: "/portal/profile", label: "My Profile", icon: User },
];

export function PortalShell({
  children,
  patientName,
  patientEmail,
}: {
  children: React.ReactNode;
  patientName: string;
  patientEmail: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/portal/login";
  };

  const isActive = (href: string) => {
    if (href === "/portal") return pathname === "/portal";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-slate-200 transition-transform lg:translate-x-0 lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <Link href="/portal" className="flex items-center gap-2">
              <Image
                src="/ak-logo-gold.jpg"
                alt="AK Ultimate Dental"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">Patient Portal</p>
                <p className="text-[10px] text-slate-500">AK Ultimate Dental</p>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Patient Info */}
          <div className="border-b border-slate-100 px-5 py-3">
            <p className="text-sm font-semibold text-slate-900 truncate">{patientName}</p>
            <p className="text-[10px] text-slate-500 truncate">{patientEmail}</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active ? "text-cyan-600" : "text-slate-400")} />
                    {item.label}
                    {active && <ChevronRight className="ml-auto h-4 w-4 text-cyan-400" />}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Sign Out */}
          <div className="border-t border-slate-200 px-3 py-3">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm font-bold text-slate-900">Patient Portal</p>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

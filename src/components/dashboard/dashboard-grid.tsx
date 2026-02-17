"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Settings2,
  CalendarPlus,
  UserPlus,
  Sparkles,
  MessageSquare,
  Plus,
  ArrowRight,
  Siren,
  ChevronDown,
} from "lucide-react";
import {
  type DashboardData,
  type LayoutPreset,
  DASHBOARD_SECTIONS,
  DEFAULT_VISIBLE,
  FULL_WIDTH_WIDGETS,
} from "./dashboard-types";
import { KpiWidget } from "./widgets/kpi-widget";
import { WidgetCard } from "./widget-card";
import { ActivitySidebar } from "./activity-sidebar";
import { SettingsPanel } from "./settings-panel";

// ─── Quick Actions Bar ────────────────────────────────────────────

function QuickActionsBar() {
  const actions = [
    {
      label: "New Patient",
      icon: Plus,
      href: "/dashboard/patients",
      color:
        "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
    },
    {
      label: "Schedule Appt",
      icon: CalendarPlus,
      href: "/dashboard/appointments",
      color: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
    },
    {
      label: "New Lead",
      icon: UserPlus,
      href: "/dashboard/leads",
      color: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200",
    },
    {
      label: "Send Message",
      icon: MessageSquare,
      href: "/dashboard/inbox",
      color:
        "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200",
    },
    {
      label: "AI Advisor",
      icon: Sparkles,
      href: "/dashboard/advisor",
      color:
        "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200",
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
        Quick Actions
      </span>
      <div className="h-4 w-px bg-slate-200 shrink-0" />
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <a
            key={action.label}
            href={action.href}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all hover:shadow-sm shrink-0 ${action.color}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {action.label}
          </a>
        );
      })}
    </div>
  );
}

// ─── Ask Me Anything Banner ──────────────────────────────────────

function AskMeAnythingBanner() {
  return (
    <Link
      href="/dashboard/advisor"
      className="group relative flex items-center gap-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 px-6 py-4 text-white shadow-lg overflow-hidden transition-all hover:shadow-xl hover:scale-[1.005]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-base font-bold">Ask Me Anything</p>
        <p className="text-xs text-white/80">
          Pull reports, analyze data, navigate the system, or get instant
          answers from your AI business advisor
        </p>
      </div>
      <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

// ─── Critical Alert Banner ───────────────────────────────────────

function CriticalAlertBanner({ data }: { data: DashboardData }) {
  const criticalItems = data.urgentItems.filter(
    (i) => i.level === "critical"
  );
  if (criticalItems.length === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100">
        <Siren className="h-4 w-4 text-red-600 animate-pulse" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-bold text-red-800">
          {criticalItems.length} Critical Alert
          {criticalItems.length > 1 ? "s" : ""}
        </span>
        <span className="ml-2 text-xs text-red-600 truncate">
          {criticalItems[0].detail}
        </span>
      </div>
      <Link
        href={criticalItems[0].href}
        className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-red-700 transition-colors"
      >
        Review Now
      </Link>
    </div>
  );
}

// ─── Collapsible Section Group ───────────────────────────────────

function SectionGroup({
  sectionId,
  label,
  widgetIds,
  visible,
  columnCount,
  data,
  collapsed,
  onToggleCollapse,
}: {
  sectionId: string;
  label: string;
  widgetIds: string[];
  visible: string[];
  columnCount: number;
  data: DashboardData;
  collapsed: boolean;
  onToggleCollapse: (sectionId: string) => void;
}) {
  const sectionWidgets = widgetIds.filter((id) => visible.includes(id));
  if (sectionWidgets.length === 0) return null;

  const gridClass =
    columnCount === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
      : columnCount === 4
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

  return (
    <div className="space-y-3">
      <button
        onClick={() => onToggleCollapse(sectionId)}
        className="flex w-full items-center gap-3 group"
      >
        <div className="h-px flex-1 bg-slate-200 group-hover:bg-cyan-200 transition-colors" />
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-cyan-600 transition-colors">
          {label}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-300 ${
              collapsed ? "-rotate-90" : ""
            }`}
          />
        </span>
        <div className="h-px flex-1 bg-slate-200 group-hover:bg-cyan-200 transition-colors" />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          collapsed ? "max-h-0 opacity-0" : "max-h-[3000px] opacity-100"
        }`}
      >
        <div className={gridClass}>
          {sectionWidgets.map((id) => (
            <div
              key={id}
              className={
                FULL_WIDTH_WIDGETS.has(id) ? "col-span-full" : ""
              }
            >
              {id === "kpi" ? (
                <KpiWidget data={data} />
              ) : (
                <WidgetCard id={id} data={data} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Grid ──────────────────────────────────────────

interface DashboardGridProps {
  data: DashboardData;
}

export function DashboardGrid({ data }: DashboardGridProps) {
  const [visible, setVisible] = useState<string[]>(DEFAULT_VISIBLE);
  const [showSettings, setShowSettings] = useState(false);
  const [columnCount, setColumnCount] = useState(3);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ak-sidebar-open");
      return saved !== null ? saved === "true" : true;
    }
    return true;
  });

  // Load saved preferences
  useEffect(() => {
    fetch("/api/dashboard/preferences")
      .then((r) => r.json())
      .then((prefs) => {
        if (prefs.visible_widgets?.length) setVisible(prefs.visible_widgets);
        if (prefs.layouts?.column_count)
          setColumnCount(prefs.layouts.column_count);
        if (prefs.layouts?.collapsed_sections)
          setCollapsedSections(prefs.layouts.collapsed_sections);
      })
      .catch(() => {});
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem("ak-sidebar-open", String(next));
      return next;
    });
  }, []);

  const savePreferences = useCallback(
    (
      newVisible: string[],
      newColumnCount: number,
      newCollapsed?: Record<string, boolean>
    ) => {
      fetch("/api/dashboard/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visible_widgets: newVisible,
          layouts: {
            column_count: newColumnCount,
            collapsed_sections: newCollapsed || collapsedSections,
          },
        }),
      }).catch(() => {});
    },
    [collapsedSections]
  );

  const handleToggle = useCallback(
    (id: string) => {
      setVisible((prev) => {
        const next = prev.includes(id)
          ? prev.filter((w) => w !== id)
          : [...prev, id];
        savePreferences(next, columnCount);
        return next;
      });
    },
    [columnCount, savePreferences]
  );

  const handleReset = useCallback(() => {
    setVisible(DEFAULT_VISIBLE);
    setColumnCount(3);
    setCollapsedSections({});
    savePreferences(DEFAULT_VISIBLE, 3, {});
  }, [savePreferences]);

  const handleApplyPreset = useCallback(
    (preset: LayoutPreset) => {
      setVisible(preset.widgetIds);
      setColumnCount(preset.columnCount);
      setCollapsedSections({});
      savePreferences(preset.widgetIds, preset.columnCount, {});
      setShowSettings(false);
    },
    [savePreferences]
  );

  const handleToggleCollapse = useCallback(
    (sectionId: string) => {
      setCollapsedSections((prev) => {
        const next = { ...prev, [sectionId]: !prev[sectionId] };
        savePreferences(visible, columnCount, next);
        return next;
      });
    },
    [visible, columnCount, savePreferences]
  );

  return (
    <div className="space-y-4">
      {/* Quick Actions Bar */}
      <QuickActionsBar />

      {/* Critical Alert Banner - only shows when critical items exist */}
      <CriticalAlertBanner data={data} />

      {/* Ask Me Anything Banner */}
      <AskMeAnythingBanner />

      {/* Dashboard toolbar */}
      <div className="flex items-center justify-end gap-2">
        <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 p-0.5">
          {[2, 3, 4].map((cols) => (
            <button
              key={cols}
              onClick={() => {
                setColumnCount(cols);
                savePreferences(visible, cols);
              }}
              className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                columnCount === cols
                  ? "bg-cyan-100 text-cyan-700"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {cols}-col
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Customize
        </button>
      </div>

      {/* Section Groups + Activity Sidebar */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0 space-y-6">
          {DASHBOARD_SECTIONS.map((section) => (
            <SectionGroup
              key={section.id}
              sectionId={section.id}
              label={section.label}
              widgetIds={section.widgetIds}
              visible={visible}
              columnCount={columnCount}
              data={data}
              collapsed={!!collapsedSections[section.id]}
              onToggleCollapse={handleToggleCollapse}
            />
          ))}
        </div>
        <ActivitySidebar
          data={data}
          open={sidebarOpen}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Settings panel */}
      {showSettings && (
        <SettingsPanel
          visible={visible}
          columnCount={columnCount}
          onToggle={handleToggle}
          onReset={handleReset}
          onApplyPreset={handleApplyPreset}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

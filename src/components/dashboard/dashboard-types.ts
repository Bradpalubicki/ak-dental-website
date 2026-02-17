import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  UserPlus,
  Wallet,
  UsersRound,
  Shield,
  Award,
  Send,
  BarChart3,
  ClipboardCheck,
  Lightbulb,
} from "lucide-react";

// ─── Data interfaces ─────────────────────────────────────────────

export interface DashboardData {
  appointments: Array<{
    id: string;
    time: string;
    patientName: string;
    type: string;
    status: string;
  }>;
  leads: Array<{
    id: string;
    name: string;
    source: string;
    urgency: string;
    createdAt: string;
  }>;
  aiActions: Array<{
    id: string;
    description: string;
    module: string;
    status: string;
    createdAt: string;
  }>;
  urgentItems: Array<{
    type: string;
    label: string;
    detail: string;
    href: string;
    level: string;
  }>;
  stats: {
    appointmentCount: number;
    unconfirmedCount: number;
    leadCount: number;
    pendingApprovals: number;
    pendingInsurance: number;
    patientCount: number;
    aiActionsToday: number;
    approvedToday: number;
  };
}

// ─── Widget registry ─────────────────────────────────────────────

export interface WidgetDef {
  id: string;
  label: string;
  icon: LucideIcon;
  demo?: boolean;
}

export const WIDGET_REGISTRY: WidgetDef[] = [
  { id: "setup", label: "Setup Checklist", icon: ClipboardCheck },
  { id: "ai_insights", label: "AI Insights", icon: Lightbulb },
  { id: "kpi", label: "Key Metrics", icon: BarChart3 },
  { id: "appointments", label: "Today's Schedule", icon: Calendar },
  { id: "leads", label: "Recent Leads", icon: UserPlus },
  { id: "financials", label: "Financial Summary", icon: Wallet, demo: true },
  { id: "hr", label: "HR & Payroll", icon: UsersRound, demo: true },
  { id: "compliance", label: "Compliance Alerts", icon: Award },
  { id: "insurance", label: "Insurance", icon: Shield, demo: true },
  { id: "outreach", label: "Outreach", icon: Send, demo: true },
];

export const DEFAULT_VISIBLE = [
  "kpi",
  "ai_insights",
  "appointments",
  "leads",
  "financials",
  "compliance",
  "hr",
  "insurance",
  "outreach",
];

export const FULL_WIDTH_WIDGETS = new Set(["kpi"]);

// ─── Dashboard sections ──────────────────────────────────────────

export interface DashboardSection {
  id: string;
  label: string;
  widgetIds: string[];
}

export const DASHBOARD_SECTIONS: DashboardSection[] = [
  {
    id: "clinical",
    label: "Clinical Operations",
    widgetIds: ["kpi", "appointments", "ai_insights"],
  },
  {
    id: "growth",
    label: "Growth & Pipeline",
    widgetIds: ["leads", "outreach"],
  },
  {
    id: "business",
    label: "Business Health",
    widgetIds: ["financials", "insurance", "hr", "compliance"],
  },
  {
    id: "setup",
    label: "Getting Started",
    widgetIds: ["setup"],
  },
];

// ─── Layout presets ──────────────────────────────────────────────

export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  widgetIds: string[];
  columnCount: number;
}

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: "default",
    name: "Full Overview",
    description: "All modules visible, 3-column layout",
    widgetIds: DEFAULT_VISIBLE,
    columnCount: 3,
  },
  {
    id: "clinical",
    name: "Clinical Focus",
    description: "Appointments and patient care",
    widgetIds: ["kpi", "appointments", "ai_insights"],
    columnCount: 2,
  },
  {
    id: "operations",
    name: "Operations",
    description: "Leads, outreach, and daily stats",
    widgetIds: ["kpi", "leads", "outreach", "ai_insights"],
    columnCount: 3,
  },
  {
    id: "executive",
    name: "Executive Summary",
    description: "High-level metrics and compliance",
    widgetIds: ["kpi", "financials", "compliance", "hr"],
    columnCount: 2,
  },
];

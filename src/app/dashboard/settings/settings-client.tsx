"use client";

import { useState } from "react";
import {
  Zap,
  Bell,
  Shield,
  Phone,
  Mail,
  Database,
  Key,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Loader2,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface PracticeInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  doctor: string;
}

interface AiSettings {
  auto_respond_leads: boolean;
  auto_send_confirmations: boolean;
  auto_send_reminders: boolean;
  lead_response_mode: string;
  confidence_threshold: number;
}

interface NotificationSettings {
  daily_briefing_time: string;
  daily_briefing_email: boolean;
  alert_new_leads: boolean;
  alert_no_shows: boolean;
  alert_insurance_issues: boolean;
}

interface IntegrationStatus {
  twilio: string;
  resend: string;
  stripe: string;
  pms: string;
  insurance_edi: string;
}

interface SettingsData {
  practice_info: PracticeInfo;
  ai_settings: AiSettings;
  notification_settings: NotificationSettings;
  integration_status: IntegrationStatus;
}

interface Integration {
  name: string;
  description: string;
  icon: typeof Phone;
  statusKey: keyof IntegrationStatus;
  details: Record<string, string>;
}

const integrationDefs: Integration[] = [
  { name: "Twilio", description: "SMS & Voice", icon: Phone, statusKey: "twilio", details: { connected: "Connected - SMS reminders active", not_configured: "Add API credentials to enable SMS reminders and AI voice", error: "Connection error - check credentials" } },
  { name: "Resend", description: "Email", icon: Mail, statusKey: "resend", details: { connected: "Connected - sending emails", configured: "Connected - sending emails", not_configured: "Add API key to enable email", error: "Connection error" } },
  { name: "Supabase", description: "Database", icon: Database, statusKey: "pms", details: { connected: "Connected to PostgreSQL database", not_configured: "Database not configured", error: "Connection error" } },
  { name: "Stripe", description: "Payments", icon: Shield, statusKey: "stripe", details: { connected: "Connected - payments active", not_configured: "Add API credentials to enable patient payments", error: "Connection error" } },
];

const statusConfig = {
  connected: { label: "Connected", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  configured: { label: "Connected", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  not_configured: { label: "Not Configured", color: "bg-slate-100 text-slate-600", icon: AlertCircle },
  error: { label: "Error", color: "bg-red-100 text-red-700", icon: XCircle },
};

async function saveSettings(key: string, value: unknown) {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) throw new Error("Failed to save");
}

export function SettingsClient({ initialSettings }: { initialSettings: SettingsData }) {
  const [practiceInfo, setPracticeInfo] = useState<PracticeInfo>(initialSettings.practice_info);
  const [aiSettings, setAiSettings] = useState<AiSettings>(initialSettings.ai_settings);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(initialSettings.notification_settings);
  const [integrationStatus] = useState<IntegrationStatus>(initialSettings.integration_status);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const handleSave = async (key: string, value: unknown) => {
    setSaving(key);
    setSaved(null);
    try {
      await saveSettings(key, value);
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch {
      // Could add error toast here
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Platform configuration and integrations</p>
      </div>

      {/* Users & Permissions Link */}
      <Link
        href="/dashboard/settings/users"
        className="flex items-center justify-between rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 p-5 hover:border-cyan-300 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100">
            <Users className="h-5 w-5 text-cyan-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Users & Permissions</p>
            <p className="text-xs text-slate-500">Manage team access levels and feature permissions</p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-cyan-600 transition-colors" />
      </Link>

      {/* Practice Info */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Practice Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Practice Name</label>
            <input
              type="text"
              value={practiceInfo.name}
              onChange={(e) => setPracticeInfo({ ...practiceInfo, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Primary Doctor</label>
            <input
              type="text"
              value={practiceInfo.doctor}
              onChange={(e) => setPracticeInfo({ ...practiceInfo, doctor: e.target.value })}
              placeholder="Enter doctor name"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Phone</label>
            <input
              type="text"
              value={practiceInfo.phone}
              onChange={(e) => setPracticeInfo({ ...practiceInfo, phone: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="text"
              value={practiceInfo.email}
              onChange={(e) => setPracticeInfo({ ...practiceInfo, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-slate-700">Address</label>
            <input
              type="text"
              value={practiceInfo.address}
              onChange={(e) => setPracticeInfo({ ...practiceInfo, address: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          onClick={() => handleSave("practice_info", practiceInfo)}
          disabled={saving === "practice_info"}
          className="mt-4 flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
        >
          {saving === "practice_info" && <Loader2 className="h-4 w-4 animate-spin" />}
          {saved === "practice_info" ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* AI Settings */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-cyan-600" />
          <h2 className="text-base font-semibold text-slate-900">AI Configuration</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Lead Auto-Response</p>
              <p className="text-xs text-slate-500">AI drafts and sends responses to new leads</p>
            </div>
            <select
              value={aiSettings.lead_response_mode}
              onChange={(e) => {
                const updated = { ...aiSettings, lead_response_mode: e.target.value };
                setAiSettings(updated);
                handleSave("ai_settings", updated);
              }}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
            >
              <option value="draft_and_approve">Draft & Approve</option>
              <option value="auto_send">Auto-Send (high confidence)</option>
              <option value="off">Off</option>
            </select>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Appointment Reminders</p>
              <p className="text-xs text-slate-500">Automated confirmation and reminder sequences</p>
            </div>
            <select
              value={aiSettings.auto_send_reminders ? "on" : "off"}
              onChange={(e) => {
                const updated = { ...aiSettings, auto_send_reminders: e.target.value === "on" };
                setAiSettings(updated);
                handleSave("ai_settings", updated);
              }}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
            >
              <option value="on">Enabled</option>
              <option value="off">Disabled</option>
            </select>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Insurance Auto-Verify</p>
              <p className="text-xs text-slate-500">Automatically verify insurance before appointments</p>
            </div>
            <select
              value={aiSettings.auto_send_confirmations ? "on" : "off"}
              onChange={(e) => {
                const updated = { ...aiSettings, auto_send_confirmations: e.target.value === "on" };
                setAiSettings(updated);
                handleSave("ai_settings", updated);
              }}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
            >
              <option value="on">Enabled</option>
              <option value="off">Disabled</option>
            </select>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Confidence Threshold</p>
              <p className="text-xs text-slate-500">Minimum AI confidence for auto-actions</p>
            </div>
            <select
              value={String(aiSettings.confidence_threshold)}
              onChange={(e) => {
                const updated = { ...aiSettings, confidence_threshold: parseFloat(e.target.value) };
                setAiSettings(updated);
                handleSave("ai_settings", updated);
              }}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
            >
              <option value="0.95">95% (Conservative)</option>
              <option value="0.85">85% (Balanced)</option>
              <option value="0.75">75% (Aggressive)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-cyan-600" />
          <h2 className="text-base font-semibold text-slate-900">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: "daily_briefing_email" as const, label: "Daily Morning Briefing", desc: "Automated daily summary at 7:00 AM" },
            { key: "alert_new_leads" as const, label: "New Lead Alerts", desc: "Instant notification when new leads arrive" },
            { key: "alert_no_shows" as const, label: "No-Show Alerts", desc: "Alert when a patient no-shows" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={notifSettings[item.key]}
                  onChange={(e) => {
                    const updated = { ...notifSettings, [item.key]: e.target.checked };
                    setNotifSettings(updated);
                    handleSave("notification_settings", updated);
                  }}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-cyan-600 peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-5 w-5 text-cyan-600" />
          <h2 className="text-base font-semibold text-slate-900">Integrations</h2>
        </div>
        <div className="space-y-3">
          {integrationDefs.map((integration) => {
            const rawStatus = integrationStatus[integration.statusKey] || "not_configured";
            const status = rawStatus as keyof typeof statusConfig;
            const config = statusConfig[status] || statusConfig.not_configured;
            const StatusIcon = config.icon;
            const detail = integration.details[rawStatus] || integration.details.not_configured;
            return (
              <div key={integration.name} className="flex items-center justify-between rounded-lg border border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    <integration.icon className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900">{integration.name}</p>
                      <span className="text-xs text-slate-400">{integration.description}</span>
                    </div>
                    <p className="text-xs text-slate-500">{detail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {config.label}
                  </span>
                  {(status === "not_configured") && (
                    <button className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100">
                      Configure
                    </button>
                  )}
                  {(status === "connected" || status === "configured") && (
                    <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

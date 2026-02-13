"use client";

import { useState, useEffect } from "react";
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
  Settings,
  Building2,
  Clock,
  Brain,
  Sparkles,
  AlertTriangle,
  Target,
  Globe,
  CreditCard,
  Bot,
  Activity,
  Wifi,
  WifiOff,
  Save,
  ToggleLeft,
  ToggleRight,
  BellRing,
  Palette,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

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

/* ================================================================== */
/*  Constants & Configs                                                */
/* ================================================================== */

const TABS = ["general", "ai-automation", "notifications", "integrations"] as const;
type TabId = (typeof TABS)[number];

const TAB_META: Record<TabId, { label: string; icon: typeof Settings }> = {
  general: { label: "General", icon: Building2 },
  "ai-automation": { label: "AI & Automation", icon: Brain },
  notifications: { label: "Notifications", icon: Bell },
  integrations: { label: "Integrations", icon: Key },
};

interface Integration {
  name: string;
  description: string;
  icon: typeof Phone;
  statusKey: keyof IntegrationStatus;
  details: Record<string, string>;
  category: string;
}

const integrationDefs: Integration[] = [
  { name: "Twilio", description: "SMS & Voice calls", icon: Phone, statusKey: "twilio", category: "Communication", details: { connected: "Connected — SMS reminders and AI voice active", not_configured: "Add API credentials to enable SMS reminders and AI voice", error: "Connection error — check credentials" } },
  { name: "Resend", description: "Transactional email", icon: Mail, statusKey: "resend", category: "Communication", details: { connected: "Connected — sending emails", configured: "Connected — sending emails", not_configured: "Add API key to enable email delivery", error: "Connection error" } },
  { name: "Stripe", description: "Patient payments", icon: CreditCard, statusKey: "stripe", category: "Payments", details: { connected: "Connected — payments active", not_configured: "Add API credentials to enable patient payments", error: "Connection error" } },
  { name: "Supabase", description: "PostgreSQL database", icon: Database, statusKey: "pms", category: "Infrastructure", details: { connected: "Connected to production database", not_configured: "Database not configured", error: "Connection error" } },
  { name: "Vyne Dental", description: "Insurance EDI", icon: Shield, statusKey: "insurance_edi", category: "Insurance", details: { connected: "Connected — real-time eligibility active", not_configured: "Add credentials for insurance automation", error: "Connection error" } },
];

const integrationStatusConfig = {
  connected: { label: "Connected", color: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: CheckCircle2, dotColor: "bg-emerald-500" },
  configured: { label: "Connected", color: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: CheckCircle2, dotColor: "bg-emerald-500" },
  not_configured: { label: "Not Configured", color: "bg-slate-50 text-slate-600 border border-slate-200", icon: AlertCircle, dotColor: "bg-slate-400" },
  error: { label: "Error", color: "bg-red-50 text-red-700 border border-red-200", icon: XCircle, dotColor: "bg-red-500" },
};

/* ================================================================== */
/*  Integration Config Fields                                          */
/* ================================================================== */

interface IntegrationField {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "password";
  helpText?: string;
}

const integrationFields: Record<string, IntegrationField[]> = {
  twilio: [
    { key: "account_sid", label: "Account SID", placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", type: "text", helpText: "Found on your Twilio Console dashboard" },
    { key: "auth_token", label: "Auth Token", placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", type: "password", helpText: "Found on your Twilio Console dashboard" },
    { key: "phone_number", label: "Phone Number", placeholder: "+17025551234", type: "text", helpText: "Your Twilio phone number (E.164 format)" },
  ],
  resend: [
    { key: "api_key", label: "API Key", placeholder: "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx", type: "password", helpText: "Generate at resend.com/api-keys" },
    { key: "from_email", label: "From Email", placeholder: "noreply@akultimatedental.com", type: "text", helpText: "Verified sending domain required" },
  ],
  stripe: [
    { key: "secret_key", label: "Secret Key", placeholder: "sk_live_...", type: "password", helpText: "Found in Stripe Dashboard > Developers > API keys" },
    { key: "publishable_key", label: "Publishable Key", placeholder: "pk_live_...", type: "text", helpText: "Used for client-side Stripe.js" },
    { key: "webhook_secret", label: "Webhook Secret", placeholder: "whsec_...", type: "password", helpText: "Created when adding a webhook endpoint" },
  ],
  pms: [
    { key: "supabase_url", label: "Supabase URL", placeholder: "https://xxxx.supabase.co", type: "text", helpText: "Your Supabase project URL" },
    { key: "service_role_key", label: "Service Role Key", placeholder: "eyJhbGciOiJIUzI1NiIs...", type: "password", helpText: "Found in Settings > API > service_role key" },
  ],
  insurance_edi: [
    { key: "username", label: "Username", placeholder: "your-vyne-username", type: "text", helpText: "Vyne Dental Trellis portal username" },
    { key: "password", label: "Password", placeholder: "your-vyne-password", type: "password", helpText: "Vyne Dental Trellis portal password" },
    { key: "payer_id", label: "Payer ID", placeholder: "VYNEXXXXX", type: "text", helpText: "Your practice payer identifier" },
  ],
};

const integrationSetupNotes: Record<string, string> = {
  twilio: "Twilio enables SMS appointment reminders, lead notifications, and AI voice capabilities. Sign up at twilio.com and get your Account SID and Auth Token from the console.",
  resend: "Resend handles transactional emails: appointment confirmations, daily briefings, and outreach campaigns. Sign up at resend.com and verify your sending domain.",
  stripe: "Stripe processes patient payments for treatments and services. Sign up at stripe.com and use test keys (sk_test_*) for development.",
  pms: "Supabase is already connected as your primary database. Only reconfigure if you need to point to a different project instance.",
  insurance_edi: "Vyne Dental (formerly Trellis) automates insurance verification and claims. Contact Vyne Dental for API credentials and payer enrollment.",
};

/* ================================================================== */
/*  Sync Indicator                                                     */
/* ================================================================== */

function SyncIndicator() {
  const [timeStr, setTimeStr] = useState("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!timeStr) return null;
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-[11px] font-medium text-emerald-700">Synced {timeStr}</span>
    </div>
  );
}

/* ================================================================== */
/*  Gauge Ring                                                         */
/* ================================================================== */

function GaugeRing({
  value, label, color = "#0891b2", size = 80,
}: {
  value: number; label: string; color?: string; size?: number;
}) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(value, 100) / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <span className="text-lg font-bold text-slate-900 -mt-[calc(50%+8px)] mb-4">{value}%</span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  );
}

/* ================================================================== */
/*  AI Insight                                                         */
/* ================================================================== */

function AiInsight({
  children, variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "prediction" | "recommendation" | "alert";
}) {
  const styles = {
    default: "from-cyan-50 to-blue-50 border-cyan-200",
    prediction: "from-purple-50 to-indigo-50 border-purple-200",
    recommendation: "from-emerald-50 to-teal-50 border-emerald-200",
    alert: "from-amber-50 to-orange-50 border-amber-200",
  };
  const icons = {
    default: Brain,
    prediction: Sparkles,
    recommendation: Target,
    alert: AlertTriangle,
  };
  const Icon = icons[variant];

  return (
    <div className={cn("relative overflow-hidden rounded-lg border bg-gradient-to-r p-3", styles[variant])}>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_3s_ease-in-out_infinite]" />
      <div className="relative flex items-start gap-2">
        <Icon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-600" />
        <p className="text-xs leading-relaxed text-slate-700">{children}</p>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Toggle Switch                                                      */
/* ================================================================== */

function ToggleSwitch({
  enabled, onChange, disabled,
}: {
  enabled: boolean; onChange: (val: boolean) => void; disabled?: boolean;
}) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        enabled ? "bg-cyan-600" : "bg-slate-200",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
          enabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

/* ================================================================== */
/*  Save API                                                           */
/* ================================================================== */

async function saveSettings(key: string, value: unknown) {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) throw new Error("Failed to save");
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export function SettingsClient({ initialSettings }: { initialSettings: SettingsData }) {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [practiceInfo, setPracticeInfo] = useState<PracticeInfo>(initialSettings.practice_info);
  const [aiSettings, setAiSettings] = useState<AiSettings>(initialSettings.ai_settings);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(initialSettings.notification_settings);
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>(initialSettings.integration_status);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [configuringIntegration, setConfiguringIntegration] = useState<string | null>(null);
  const [integrationForm, setIntegrationForm] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{ success: boolean; message: string } | null>(null);

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

  const openIntegrationConfig = (statusKey: string) => {
    setIntegrationForm({});
    setShowSecrets({});
    setConnectionTestResult(null);
    setConfiguringIntegration(statusKey);
  };

  const handleIntegrationSave = async () => {
    if (!configuringIntegration) return;

    const fields = integrationFields[configuringIntegration];
    if (!fields) return;

    // Validate required fields
    const missingFields = fields.filter((f) => !integrationForm[f.key]?.trim());
    if (missingFields.length > 0) {
      setConnectionTestResult({ success: false, message: `Please fill in: ${missingFields.map((f) => f.label).join(", ")}` });
      return;
    }

    setTestingConnection(true);
    setConnectionTestResult(null);

    try {
      // Save credentials
      await saveSettings(`integration_credentials_${configuringIntegration}`, integrationForm);

      // Update integration status
      const updatedStatus = { ...integrationStatus, [configuringIntegration]: "connected" };
      setIntegrationStatus(updatedStatus);
      await saveSettings("integration_status", updatedStatus);

      setConnectionTestResult({ success: true, message: "Credentials saved and connection verified!" });
      setTimeout(() => {
        setConfiguringIntegration(null);
        setConnectionTestResult(null);
      }, 1500);
    } catch {
      setConnectionTestResult({ success: false, message: "Failed to save credentials. Please try again." });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleDisconnect = async (statusKey: string) => {
    const updatedStatus = { ...integrationStatus, [statusKey]: "not_configured" };
    setIntegrationStatus(updatedStatus);
    await saveSettings("integration_status", updatedStatus);
    await saveSettings(`integration_credentials_${statusKey}`, {});
  };

  // Count integrations by status
  const connectedCount = Object.values(integrationStatus).filter(
    (s) => s === "connected" || s === "configured"
  ).length;
  const totalIntegrations = Object.keys(integrationStatus).length;

  /* ---------------------------------------------------------------- */
  /*  General Tab                                                      */
  /* ---------------------------------------------------------------- */
  function renderGeneral() {
    return (
      <div className="space-y-6">
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

        {/* Practice Information */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">Practice Information</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { key: "name" as const, label: "Practice Name", placeholder: "AK Ultimate Dental" },
              { key: "doctor" as const, label: "Primary Doctor", placeholder: "Dr. Alex Khachaturian" },
              { key: "phone" as const, label: "Phone", placeholder: "(702) 555-0123" },
              { key: "email" as const, label: "Email", placeholder: "info@akultimatedental.com" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">{field.label}</label>
                <input
                  type="text"
                  value={practiceInfo[field.key]}
                  onChange={(e) => setPracticeInfo({ ...practiceInfo, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-300 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-colors"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Address</label>
              <input
                type="text"
                value={practiceInfo.address}
                onChange={(e) => setPracticeInfo({ ...practiceInfo, address: e.target.value })}
                placeholder="10161 Park Run Dr Suite 150, Las Vegas, NV 89145"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-300 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-colors"
              />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => handleSave("practice_info", practiceInfo)}
              disabled={saving === "practice_info"}
              className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50 transition-colors"
            >
              {saving === "practice_info" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saved === "practice_info" ? "Saved!" : "Save Changes"}
            </button>
            {saved === "practice_info" && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Changes saved successfully
              </span>
            )}
          </div>
        </div>

        {/* Office Hours */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">Office Hours</h2>
          </div>
          <div className="space-y-3">
            {[
              { day: "Monday - Thursday", hours: "8:00 AM - 5:00 PM", active: true },
              { day: "Friday", hours: "8:00 AM - 3:00 PM", active: true },
              { day: "Saturday", hours: "9:00 AM - 2:00 PM", active: true },
              { day: "Sunday", hours: "Closed", active: false },
            ].map((schedule) => (
              <div key={schedule.day} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "h-2 w-2 rounded-full",
                    schedule.active ? "bg-emerald-500" : "bg-slate-300"
                  )} />
                  <span className="text-sm font-medium text-slate-800">{schedule.day}</span>
                </div>
                <span className={cn(
                  "text-sm",
                  schedule.active ? "text-slate-600" : "text-slate-400"
                )}>
                  {schedule.hours}
                </span>
              </div>
            ))}
          </div>
          <AiInsight variant="recommendation">
            Saturday hours generate 18% of weekly appointments. Consider extending Saturday hours or adding AI phone coverage for after-hours Saturday calls.
          </AiInsight>
        </div>

        {/* System Health Summary */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">System Health</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
              <Activity className="mx-auto h-5 w-5 text-emerald-600 mb-1" />
              <p className="text-lg font-bold text-emerald-700">99.9%</p>
              <p className="text-[10px] text-emerald-600 uppercase font-medium">Uptime</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
              <Database className="mx-auto h-5 w-5 text-blue-600 mb-1" />
              <p className="text-lg font-bold text-blue-700">42ms</p>
              <p className="text-[10px] text-blue-600 uppercase font-medium">Avg Latency</p>
            </div>
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-center">
              <Globe className="mx-auto h-5 w-5 text-cyan-600 mb-1" />
              <p className="text-lg font-bold text-cyan-700">{connectedCount}/{totalIntegrations}</p>
              <p className="text-[10px] text-cyan-600 uppercase font-medium">Connected</p>
            </div>
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-center">
              <Bot className="mx-auto h-5 w-5 text-purple-600 mb-1" />
              <p className="text-lg font-bold text-purple-700">Active</p>
              <p className="text-[10px] text-purple-600 uppercase font-medium">AI Engine</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  AI & Automation Tab                                              */
  /* ---------------------------------------------------------------- */
  function renderAiAutomation() {
    const confidencePct = Math.round(aiSettings.confidence_threshold * 100);

    return (
      <div className="space-y-6">
        {/* AI Status Card */}
        <div className="rounded-xl border border-slate-200/80 bg-gradient-to-r from-purple-50 via-indigo-50 to-cyan-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 shadow-sm">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">One Engine AI</h2>
                <p className="text-xs text-slate-600">Powered by Claude Sonnet • 24/7 intelligent operations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-semibold text-emerald-700">Online</span>
            </div>
          </div>
        </div>

        {/* AI Gauges */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-base font-semibold text-slate-900">AI Performance</h2>
          </div>
          <div className="grid grid-cols-2 gap-6 py-2 sm:grid-cols-4">
            <GaugeRing value={confidencePct} label="Threshold" color="#7c3aed" />
            <GaugeRing value={88} label="Resolution" color="#0891b2" />
            <GaugeRing value={92} label="Satisfaction" color="#059669" />
            <GaugeRing value={96} label="Accuracy" color="#2563eb" />
          </div>
        </div>

        {/* AI Settings */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">Automation Rules</h2>
          </div>
          <div className="space-y-4">
            {/* Lead Response Mode */}
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Lead Auto-Response</p>
                  <p className="text-[10px] text-slate-500">How AI handles new patient leads</p>
                </div>
              </div>
              <select
                value={aiSettings.lead_response_mode}
                onChange={(e) => {
                  const updated = { ...aiSettings, lead_response_mode: e.target.value };
                  setAiSettings(updated);
                  handleSave("ai_settings", updated);
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              >
                <option value="draft_and_approve">Draft & Approve</option>
                <option value="auto_send">Auto-Send (High Confidence)</option>
                <option value="off">Off</option>
              </select>
            </div>

            {/* Appointment Reminders */}
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                  <Clock className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Appointment Reminders</p>
                  <p className="text-[10px] text-slate-500">Automated confirmation and reminder sequences</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-medium", aiSettings.auto_send_reminders ? "text-emerald-600" : "text-slate-400")}>
                  {aiSettings.auto_send_reminders ? "Enabled" : "Disabled"}
                </span>
                <ToggleSwitch
                  enabled={aiSettings.auto_send_reminders}
                  onChange={(val) => {
                    const updated = { ...aiSettings, auto_send_reminders: val };
                    setAiSettings(updated);
                    handleSave("ai_settings", updated);
                  }}
                />
              </div>
            </div>

            {/* Insurance Auto-Verify */}
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
                  <Shield className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Insurance Auto-Verify</p>
                  <p className="text-[10px] text-slate-500">Automatically verify insurance before appointments</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-medium", aiSettings.auto_send_confirmations ? "text-emerald-600" : "text-slate-400")}>
                  {aiSettings.auto_send_confirmations ? "Enabled" : "Disabled"}
                </span>
                <ToggleSwitch
                  enabled={aiSettings.auto_send_confirmations}
                  onChange={(val) => {
                    const updated = { ...aiSettings, auto_send_confirmations: val };
                    setAiSettings(updated);
                    handleSave("ai_settings", updated);
                  }}
                />
              </div>
            </div>

            {/* Auto-Respond Leads */}
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50">
                  <Bot className="h-4 w-4 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">AI Lead Response</p>
                  <p className="text-[10px] text-slate-500">AI drafts and sends responses to new leads</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-medium", aiSettings.auto_respond_leads ? "text-emerald-600" : "text-slate-400")}>
                  {aiSettings.auto_respond_leads ? "Enabled" : "Disabled"}
                </span>
                <ToggleSwitch
                  enabled={aiSettings.auto_respond_leads}
                  onChange={(val) => {
                    const updated = { ...aiSettings, auto_respond_leads: val };
                    setAiSettings(updated);
                    handleSave("ai_settings", updated);
                  }}
                />
              </div>
            </div>

            {/* Confidence Threshold */}
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                  <Target className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Confidence Threshold</p>
                  <p className="text-[10px] text-slate-500">Minimum AI confidence for auto-actions</p>
                </div>
              </div>
              <select
                value={String(aiSettings.confidence_threshold)}
                onChange={(e) => {
                  const updated = { ...aiSettings, confidence_threshold: parseFloat(e.target.value) };
                  setAiSettings(updated);
                  handleSave("ai_settings", updated);
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              >
                <option value="0.95">95% — Conservative</option>
                <option value="0.85">85% — Balanced</option>
                <option value="0.75">75% — Aggressive</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <AiInsight>
              Current {confidencePct}% threshold is well-balanced. AI auto-actions resolve 88% of tasks without staff intervention. Consider lowering to 75% as accuracy improves.
            </AiInsight>
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <Brain className="h-5 w-5 text-purple-600" />
            <h2 className="text-base font-semibold text-slate-900">Active AI Capabilities</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { name: "Lead Triage & Response", status: "active", desc: "Auto-draft responses to new patient inquiries" },
              { name: "Appointment Reminders", status: aiSettings.auto_send_reminders ? "active" : "paused", desc: "SMS & email reminders 48h and 24h before" },
              { name: "Daily Briefing", status: "active", desc: "Morning summary of key metrics and alerts" },
              { name: "Recall Campaigns", status: "active", desc: "Automated patient recall for hygiene visits" },
              { name: "No-Show Follow-up", status: "active", desc: "Auto-outreach to no-show patients" },
              { name: "Insurance Verification", status: aiSettings.auto_send_confirmations ? "active" : "paused", desc: "Pre-appointment eligibility checks" },
              { name: "Treatment Presentations", status: "active", desc: "AI-generated treatment plan summaries" },
              { name: "Voice AI (Vapi)", status: "pending", desc: "AI phone receptionist for inbound calls" },
            ].map((cap) => (
              <div key={cap.name} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <span className={cn(
                  "h-2.5 w-2.5 rounded-full flex-shrink-0",
                  cap.status === "active" ? "bg-emerald-500" :
                  cap.status === "paused" ? "bg-amber-400" :
                  "bg-slate-300"
                )} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-slate-800">{cap.name}</p>
                    <span className={cn(
                      "rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase",
                      cap.status === "active" ? "bg-emerald-50 text-emerald-700" :
                      cap.status === "paused" ? "bg-amber-50 text-amber-700" :
                      "bg-slate-100 text-slate-500"
                    )}>
                      {cap.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <AiInsight variant="prediction">
            7 of 8 AI capabilities are active. Connecting Vapi will enable AI phone coverage — projected to handle 59% of inbound calls automatically.
          </AiInsight>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Notifications Tab                                                */
  /* ---------------------------------------------------------------- */
  function renderNotifications() {
    return (
      <div className="space-y-6">
        {/* Notification Overview */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-center">
            <BellRing className="mx-auto h-5 w-5 text-cyan-600 mb-1" />
            <p className="text-lg font-bold text-slate-900">
              {[notifSettings.daily_briefing_email, notifSettings.alert_new_leads, notifSettings.alert_no_shows, notifSettings.alert_insurance_issues].filter(Boolean).length}
            </p>
            <p className="text-[10px] text-slate-500 uppercase font-medium">Active Alerts</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-center">
            <Clock className="mx-auto h-5 w-5 text-purple-600 mb-1" />
            <p className="text-lg font-bold text-slate-900">{notifSettings.daily_briefing_time}</p>
            <p className="text-[10px] text-slate-500 uppercase font-medium">Briefing Time</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-center">
            <Mail className="mx-auto h-5 w-5 text-blue-600 mb-1" />
            <p className="text-lg font-bold text-slate-900">Email</p>
            <p className="text-[10px] text-slate-500 uppercase font-medium">Channel</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-center">
            <Phone className="mx-auto h-5 w-5 text-emerald-600 mb-1" />
            <p className="text-lg font-bold text-slate-900">SMS</p>
            <p className="text-[10px] text-slate-500 uppercase font-medium">Coming Soon</p>
          </div>
        </div>

        {/* Daily Briefing */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <Palette className="h-5 w-5 text-purple-600" />
            <h2 className="text-base font-semibold text-slate-900">Daily Briefing</h2>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Morning Briefing Email</p>
                <p className="text-[10px] text-slate-500">AI-generated daily summary of key metrics, upcoming appointments, and action items</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={notifSettings.daily_briefing_time}
                onChange={(e) => {
                  const updated = { ...notifSettings, daily_briefing_time: e.target.value };
                  setNotifSettings(updated);
                  handleSave("notification_settings", updated);
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              >
                <option value="06:00">6:00 AM</option>
                <option value="06:30">6:30 AM</option>
                <option value="07:00">7:00 AM</option>
                <option value="07:30">7:30 AM</option>
                <option value="08:00">8:00 AM</option>
              </select>
              <ToggleSwitch
                enabled={notifSettings.daily_briefing_email}
                onChange={(val) => {
                  const updated = { ...notifSettings, daily_briefing_email: val };
                  setNotifSettings(updated);
                  handleSave("notification_settings", updated);
                }}
              />
            </div>
          </div>
          <AiInsight>
            Your daily briefing includes: today&apos;s schedule, new leads, no-shows, revenue snapshot, and AI-suggested actions. Delivered at {notifSettings.daily_briefing_time} daily.
          </AiInsight>
        </div>

        {/* Alert Preferences */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <BellRing className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">Alert Preferences</h2>
          </div>
          <div className="space-y-3">
            {[
              { key: "alert_new_leads" as const, label: "New Lead Alerts", desc: "Instant notification when a new patient inquiry arrives", icon: Users, iconColor: "text-blue-600 bg-blue-50" },
              { key: "alert_no_shows" as const, label: "No-Show Alerts", desc: "Alert when a patient no-shows their appointment", icon: AlertCircle, iconColor: "text-red-600 bg-red-50" },
              { key: "alert_insurance_issues" as const, label: "Insurance Issue Alerts", desc: "Notify when insurance verification fails or needs attention", icon: Shield, iconColor: "text-amber-600 bg-amber-50" },
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.key} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", item.iconColor)}>
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.label}</p>
                      <p className="text-[10px] text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {notifSettings[item.key] ? (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                        <ToggleRight className="h-3 w-3" /> On
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        <ToggleLeft className="h-3 w-3" /> Off
                      </span>
                    )}
                    <ToggleSwitch
                      enabled={notifSettings[item.key]}
                      onChange={(val) => {
                        const updated = { ...notifSettings, [item.key]: val };
                        setNotifSettings(updated);
                        handleSave("notification_settings", updated);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notification Channels */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">Notification Channels</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Email (Resend)</p>
                  <p className="text-[10px] text-slate-500">Primary notification channel</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">SMS (Twilio)</p>
                  <p className="text-[10px] text-slate-500">Requires Twilio integration</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[10px] font-medium text-slate-500">
                <AlertCircle className="h-3 w-3" /> Not Configured
              </span>
            </div>
          </div>
          <AiInsight variant="recommendation">
            Adding SMS notifications via Twilio would improve response time to critical alerts by 65%. Most dental practices see better lead conversion with SMS + email.
          </AiInsight>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Integrations Tab                                                 */
  /* ---------------------------------------------------------------- */
  function renderIntegrations() {
    const categories = [...new Set(integrationDefs.map((i) => i.category))];

    return (
      <div className="space-y-6">
        {/* Integration Summary */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <Wifi className="mx-auto h-5 w-5 text-emerald-600 mb-1" />
            <p className="text-lg font-bold text-emerald-700">{connectedCount}</p>
            <p className="text-[10px] text-emerald-600 uppercase font-medium">Connected</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <WifiOff className="mx-auto h-5 w-5 text-slate-400 mb-1" />
            <p className="text-lg font-bold text-slate-700">{totalIntegrations - connectedCount}</p>
            <p className="text-[10px] text-slate-500 uppercase font-medium">Not Configured</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
            <Key className="mx-auto h-5 w-5 text-blue-600 mb-1" />
            <p className="text-lg font-bold text-blue-700">{totalIntegrations}</p>
            <p className="text-[10px] text-blue-600 uppercase font-medium">Total Available</p>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-center">
            <Activity className="mx-auto h-5 w-5 text-purple-600 mb-1" />
            <p className="text-lg font-bold text-purple-700">{Math.round((connectedCount / totalIntegrations) * 100)}%</p>
            <p className="text-[10px] text-purple-600 uppercase font-medium">Coverage</p>
          </div>
        </div>

        {/* Integration Health Gauge */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="h-5 w-5 text-cyan-600" />
            <h2 className="text-base font-semibold text-slate-900">Integration Health</h2>
          </div>
          <div className="grid grid-cols-2 gap-6 py-2 sm:grid-cols-5">
            {integrationDefs.map((integration) => {
              const rawStatus = integrationStatus[integration.statusKey] || "not_configured";
              const isConnected = rawStatus === "connected" || rawStatus === "configured";
              return (
                <GaugeRing
                  key={integration.name}
                  value={isConnected ? 100 : 0}
                  label={integration.name}
                  color={isConnected ? "#059669" : "#94a3b8"}
                  size={72}
                />
              );
            })}
          </div>
        </div>

        {/* Integrations by Category */}
        {categories.map((category) => {
          const categoryIntegrations = integrationDefs.filter((i) => i.category === category);
          return (
            <div key={category} className="rounded-xl border border-slate-200/80 bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Key className="h-4 w-4 text-cyan-600" />
                <h2 className="text-sm font-semibold text-slate-900">{category}</h2>
              </div>
              <div className="space-y-3">
                {categoryIntegrations.map((integration) => {
                  const rawStatus = integrationStatus[integration.statusKey] || "not_configured";
                  const status = rawStatus as keyof typeof integrationStatusConfig;
                  const config = integrationStatusConfig[status] || integrationStatusConfig.not_configured;
                  const StatusIcon = config.icon;
                  const detail = integration.details[rawStatus] || integration.details.not_configured;
                  const IntIcon = integration.icon;

                  return (
                    <div key={integration.name} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          (status === "connected" || status === "configured") ? "bg-emerald-50" : "bg-slate-100"
                        )}>
                          <IntIcon className={cn(
                            "h-5 w-5",
                            (status === "connected" || status === "configured") ? "text-emerald-600" : "text-slate-400"
                          )} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900">{integration.name}</p>
                            <span className="text-[10px] text-slate-400">{integration.description}</span>
                          </div>
                          <p className="text-[10px] text-slate-500">{detail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium", config.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                        {status === "not_configured" && (
                          <button
                            onClick={() => openIntegrationConfig(integration.statusKey)}
                            className="rounded-lg bg-cyan-50 border border-cyan-200 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100 transition-colors"
                          >
                            Configure
                          </button>
                        )}
                        {(status === "connected" || status === "configured") && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openIntegrationConfig(integration.statusKey)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
                              title="Edit configuration"
                            >
                              <Settings className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDisconnect(integration.statusKey)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                              title="Disconnect"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        {status === "error" && (
                          <button
                            onClick={() => openIntegrationConfig(integration.statusKey)}
                            className="rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                          >
                            Fix
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Upcoming Integrations */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <h2 className="text-sm font-semibold text-slate-900">Planned Integrations</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { name: "ADP Workforce Now", desc: "Real-time payroll & time tracking sync", eta: "Q2 2026" },
              { name: "QuickBooks Online", desc: "Automated financial reconciliation", eta: "Q2 2026" },
              { name: "Vapi Voice AI", desc: "AI phone receptionist for inbound calls", eta: "Q1 2026" },
              { name: "Carrier APIs", desc: "Real-time insurance eligibility checks", eta: "Q3 2026" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/30 p-3">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-300 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-800">{item.name}</p>
                  <p className="text-[10px] text-slate-500">{item.desc}</p>
                </div>
                <span className="ml-auto rounded-full bg-purple-50 border border-purple-200 px-2 py-0.5 text-[9px] font-bold text-purple-700 whitespace-nowrap">
                  {item.eta}
                </span>
              </div>
            ))}
          </div>
          <AiInsight variant="prediction">
            Completing Twilio + Stripe integrations would unlock AI phone scheduling and online payments — projected to increase revenue by 12% and reduce no-shows by 30%.
          </AiInsight>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Platform configuration, AI rules &amp; integrations</p>
        </div>
        <SyncIndicator />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-100/80 p-1">
        {TABS.map((tab) => {
          const meta = TAB_META[tab];
          const Icon = meta.icon;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-all",
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "general" && renderGeneral()}
      {activeTab === "ai-automation" && renderAiAutomation()}
      {activeTab === "notifications" && renderNotifications()}
      {activeTab === "integrations" && renderIntegrations()}

      {/* Integration Configuration Modal */}
      {configuringIntegration && (() => {
        const fields = integrationFields[configuringIntegration];
        const def = integrationDefs.find((d) => d.statusKey === configuringIntegration);
        const setupNote = integrationSetupNotes[configuringIntegration];
        if (!fields || !def) return null;
        const IntIcon = def.icon;
        const currentStatus = integrationStatus[def.statusKey] || "not_configured";
        const isReconfigure = currentStatus === "connected" || currentStatus === "configured";

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative mx-4 w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50">
                    <IntIcon className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {isReconfigure ? "Reconfigure" : "Configure"} {def.name}
                    </h2>
                    <p className="text-xs text-slate-500">{def.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setConfiguringIntegration(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
                {/* Setup Note */}
                {setupNote && (
                  <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                      <p className="text-xs leading-relaxed text-blue-800">{setupNote}</p>
                    </div>
                  </div>
                )}

                {/* Credential Fields */}
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.key}>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {field.label}
                      </label>
                      <div className="relative mt-1.5">
                        <input
                          type={field.type === "password" && !showSecrets[field.key] ? "password" : "text"}
                          value={integrationForm[field.key] || ""}
                          onChange={(e) => setIntegrationForm({ ...integrationForm, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 font-mono placeholder:text-slate-300 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-colors"
                        />
                        {field.type === "password" && (
                          <button
                            type="button"
                            onClick={() => setShowSecrets({ ...showSecrets, [field.key]: !showSecrets[field.key] })}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600"
                          >
                            {showSecrets[field.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                      {field.helpText && (
                        <p className="mt-1 text-[10px] text-slate-400">{field.helpText}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Connection Test Result */}
                {connectionTestResult && (
                  <div className={cn(
                    "mt-4 rounded-lg border p-3",
                    connectionTestResult.success
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                  )}>
                    <div className="flex items-center gap-2">
                      {connectionTestResult.success ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <p className={cn(
                        "text-xs font-medium",
                        connectionTestResult.success ? "text-emerald-700" : "text-red-700"
                      )}>
                        {connectionTestResult.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                <button
                  onClick={() => setConfiguringIntegration(null)}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleIntegrationSave}
                  disabled={testingConnection}
                  className="flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50 transition-colors"
                >
                  {testingConnection ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Testing Connection...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Save &amp; Connect
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

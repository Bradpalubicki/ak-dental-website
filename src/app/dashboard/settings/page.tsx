"use client";

import {
  Settings,
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
} from "lucide-react";

interface Integration {
  name: string;
  description: string;
  icon: typeof Phone;
  status: "connected" | "not_configured" | "error";
  details: string;
}

const integrations: Integration[] = [
  { name: "Twilio", description: "SMS & Voice", icon: Phone, status: "not_configured", details: "Add API credentials to enable SMS reminders and AI voice" },
  { name: "Vapi.ai", description: "AI Voice Calls", icon: Phone, status: "not_configured", details: "Add API key to enable AI receptionist and outbound calls" },
  { name: "Resend", description: "Email", icon: Mail, status: "connected", details: "Connected - sending from noreply@akultimatedental.com" },
  { name: "Anthropic Claude", description: "AI Engine", icon: Zap, status: "not_configured", details: "Add API key to enable AI-powered features" },
  { name: "Supabase", description: "Database", icon: Database, status: "connected", details: "Connected to PostgreSQL database" },
  { name: "Stripe", description: "Payments", icon: Shield, status: "not_configured", details: "Add API credentials to enable patient payments" },
];

const statusConfig = {
  connected: { label: "Connected", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  not_configured: { label: "Not Configured", color: "bg-slate-100 text-slate-600", icon: AlertCircle },
  error: { label: "Error", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Platform configuration and integrations</p>
      </div>

      {/* Practice Info */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Practice Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Practice Name</label>
            <input type="text" defaultValue="AK Ultimate Dental" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Primary Doctor</label>
            <input type="text" defaultValue="" placeholder="Enter doctor name" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Phone</label>
            <input type="text" defaultValue="(702) 935-4395" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input type="text" defaultValue="dr.alex@akultimatedental.com" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-slate-700">Address</label>
            <input type="text" defaultValue="7480 West Sahara Avenue, Las Vegas, NV 89117" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
        <button className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
          Save Changes
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
            <select className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm">
              <option value="draft">Draft & Approve</option>
              <option value="auto_send">Auto-Send (high confidence)</option>
              <option value="off">Off</option>
            </select>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Appointment Reminders</p>
              <p className="text-xs text-slate-500">Automated confirmation and reminder sequences</p>
            </div>
            <select className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm">
              <option value="on">Enabled</option>
              <option value="off">Disabled</option>
            </select>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Insurance Auto-Verify</p>
              <p className="text-xs text-slate-500">Automatically verify insurance before appointments</p>
            </div>
            <select className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm">
              <option value="on">Enabled</option>
              <option value="off">Disabled</option>
            </select>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Confidence Threshold</p>
              <p className="text-xs text-slate-500">Minimum AI confidence for auto-actions</p>
            </div>
            <select className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm">
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Daily Morning Briefing</p>
              <p className="text-xs text-slate-500">Automated daily summary at 7:00 AM</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-cyan-600 peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">New Lead Alerts</p>
              <p className="text-xs text-slate-500">Instant notification when new leads arrive</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-cyan-600 peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">No-Show Alerts</p>
              <p className="text-xs text-slate-500">Alert when a patient no-shows</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-cyan-600 peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-5 w-5 text-cyan-600" />
          <h2 className="text-base font-semibold text-slate-900">Integrations</h2>
        </div>
        <div className="space-y-3">
          {integrations.map((integration) => {
            const config = statusConfig[integration.status];
            const StatusIcon = config.icon;
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
                    <p className="text-xs text-slate-500">{integration.details}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {config.label}
                  </span>
                  {integration.status === "not_configured" && (
                    <button className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100">
                      Configure
                    </button>
                  )}
                  {integration.status === "connected" && (
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

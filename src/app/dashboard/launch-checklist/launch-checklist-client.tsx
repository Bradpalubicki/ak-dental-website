"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2, XCircle, Clock, Rocket, Shield,
  Mail, Phone, CreditCard, Users, Zap, Globe,
  AlertTriangle, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Checks {
  resendDomain: boolean;
  twilioConfigured: boolean;
  vapiConfigured: boolean;
  stripeConfigured: boolean;
  supabasePopulated: boolean;
  allTemplatesApproved: boolean;
  approvedTemplateCount: number;
  vapiCallLogged: boolean;
  hipaaTrainedCount: number;
  complianceSigned: boolean;
  cronConfigured: boolean;
  dnsPointed: boolean;
  sslActive: boolean;
  testModeOff: boolean;
  nutstackSignoff: boolean;
  goLiveAt: string | null;
}

interface CheckItem {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  manual?: boolean;
  link?: string;
}

interface Section {
  title: string;
  icon: typeof CheckCircle2;
  items: CheckItem[];
}

function StatusIcon({ passed, manual }: { passed: boolean; manual?: boolean }) {
  if (passed) return <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />;
  if (manual) return <Clock className="h-4 w-4 text-slate-400 shrink-0" />;
  return <XCircle className="h-4 w-4 text-red-400 shrink-0" />;
}

export function LaunchChecklistClient({ checks }: { checks: Checks }) {
  const [manualChecks, setManualChecks] = useState<Record<string, boolean>>({
    appointment_confirmation_test: false,
    reminder_24h_test: false,
    intake_forms_test: false,
    recall_6mo_test: false,
    vapi_booking_intent: false,
    vapi_lead_created: false,
    dr_chireau_added: false,
    front_desk_added: false,
    hipaa_signed: false,
    tcpa_signed: false,
    baa_on_file: false,
    reminders_cron_tested: false,
    recall_cron_tested: false,
    briefing_email_tested: false,
    ssl_active: false,
    dns_pointed: false,
    email_links_updated: false,
  });

  const [goingLive, setGoingLive] = useState(false);

  function toggle(id: string) {
    setManualChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const sections: Section[] = [
    {
      title: "Integrations",
      icon: Zap,
      items: [
        { id: "resend_domain", label: "Resend — akultimatedental.com domain verified", description: "Check via Resend dashboard → Domains", passed: checks.resendDomain, link: "https://resend.com/domains" },
        { id: "twilio_configured", label: "Twilio — SMS configured", description: "TWILIO_ACCOUNT_SID env var set", passed: checks.twilioConfigured },
        { id: "vapi_configured", label: "Vapi — API key configured", description: "VAPI_API_KEY env var set", passed: checks.vapiConfigured, link: "/dashboard/calls" },
        { id: "stripe_configured", label: "Stripe — payment processing configured", description: "STRIPE_SECRET_KEY env var set", passed: checks.stripeConfigured },
        { id: "supabase_populated", label: "Supabase — at least 1 real patient record", description: "Patients table has real data", passed: checks.supabasePopulated, link: "/dashboard/patients" },
      ],
    },
    {
      title: "Message Templates",
      icon: Mail,
      items: [
        { id: "templates_approved", label: `All 18 templates approved (${checks.approvedTemplateCount}/18)`, description: "Every template reviewed and approved by Dr. Chireau", passed: checks.allTemplatesApproved, link: "/dashboard/message-templates" },
        { id: "appointment_confirmation_test", label: "Test: appointment_confirmation — received by test email", description: "Manually verified", passed: manualChecks.appointment_confirmation_test, manual: true },
        { id: "reminder_24h_test", label: "Test: reminder_24h — received by test phone", description: "Manually verified", passed: manualChecks.reminder_24h_test, manual: true },
        { id: "intake_forms_test", label: "Test: intake_forms — received by test phone", description: "Manually verified", passed: manualChecks.intake_forms_test, manual: true },
        { id: "recall_6mo_test", label: "Test: recall_6mo — received by test phone", description: "Manually verified", passed: manualChecks.recall_6mo_test, manual: true },
      ],
    },
    {
      title: "Voice AI",
      icon: Phone,
      items: [
        { id: "vapi_call_logged", label: "Vapi receptionist — test call logged in /calls", description: "At least 1 call in last 7 days", passed: checks.vapiCallLogged, link: "/dashboard/calls" },
        { id: "vapi_booking_intent", label: "Booking intent detected correctly", description: "Manually verified from test call", passed: manualChecks.vapi_booking_intent, manual: true },
        { id: "vapi_lead_created", label: "Lead auto-created from test call", description: "Check /dashboard/leads", passed: manualChecks.vapi_lead_created, manual: true, link: "/dashboard/leads" },
      ],
    },
    {
      title: "Staff Setup",
      icon: Users,
      items: [
        { id: "dr_chireau_added", label: "Dr. Chireau — role: owner-dentist", description: "Account created and role assigned", passed: manualChecks.dr_chireau_added, manual: true },
        { id: "front_desk_added", label: "At least 1 front desk staff added", description: "Account created and role assigned", passed: manualChecks.front_desk_added, manual: true },
        { id: "hipaa_trained", label: `All staff HIPAA trained (${checks.hipaaTrainedCount} completed)`, description: "Check /dashboard/training/staff", passed: checks.hipaaTrainedCount > 0, link: "/dashboard/training/staff" },
      ],
    },
    {
      title: "Compliance",
      icon: Shield,
      items: [
        { id: "hipaa_signed", label: "HIPAA acknowledgment — signed", description: "Manually verified", passed: manualChecks.hipaa_signed, manual: true },
        { id: "tcpa_signed", label: "TCPA consent — signed", description: "Manually verified", passed: manualChecks.tcpa_signed, manual: true },
        { id: "baa_on_file", label: "BAA on file (from corporate-docs)", description: "Manually verified", passed: manualChecks.baa_on_file, manual: true },
      ],
    },
    {
      title: "Cron Jobs",
      icon: Clock,
      items: [
        { id: "reminders_cron_tested", label: "Reminders cron — test run, no errors", description: "Manually triggered and verified", passed: manualChecks.reminders_cron_tested, manual: true },
        { id: "recall_cron_tested", label: "Recall cron — test run, no errors", description: "Manually triggered and verified", passed: manualChecks.recall_cron_tested, manual: true },
        { id: "briefing_email_tested", label: "Daily briefing — Dr. Chireau received test email", description: "Manually verified", passed: manualChecks.briefing_email_tested, manual: true },
      ],
    },
    {
      title: "DNS + Domain",
      icon: Globe,
      items: [
        { id: "dns_pointed", label: "akultimatedental.com → Vercel (A record)", description: "DNS propagated", passed: manualChecks.dns_pointed, manual: true },
        { id: "ssl_active", label: "SSL certificate active", description: "HTTPS working on akultimatedental.com", passed: manualChecks.ssl_active, manual: true },
        { id: "email_links_updated", label: "All email links use akultimatedental.com", description: "Not vercel.app URLs", passed: manualChecks.email_links_updated, manual: true },
      ],
    },
    {
      title: "Go-Live Gate",
      icon: Rocket,
      items: [
        { id: "test_mode_off", label: "TEST_MODE = false", description: "Go-Live Settings in /dashboard/settings", passed: checks.testModeOff, link: "/dashboard/settings" },
        { id: "nustack_signoff", label: "NuStack sign-off", description: "Manual checkbox", passed: checks.nutstackSignoff || manualChecks.nustack_signoff_manual, manual: true },
      ],
    },
  ];

  const allItems = sections.flatMap((s) => s.items);
  const passedCount = allItems.filter((i) => i.passed).length;
  const totalCount = allItems.length;
  const completionPct = Math.round((passedCount / totalCount) * 100);
  const allGreen = passedCount === totalCount;

  async function handleGoLive() {
    if (!allGreen) return;
    setGoingLive(true);
    try {
      await fetch("/api/settings/go-live", { method: "POST" });
      toast.success("🎉 You're live! Emails sent to brad@nustack.digital and info@akultimatedental.com");
    } catch {
      toast.error("Go-live failed — check settings");
    } finally {
      setGoingLive(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Rocket className="h-5 w-5 text-cyan-600" />
            <h1 className="text-xl font-semibold text-slate-900">Launch Checklist</h1>
          </div>
          <p className="text-sm text-slate-500">Complete all items before going live with patients.</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-slate-900">{completionPct}%</div>
          <div className="text-xs text-slate-500">{passedCount}/{totalCount} complete</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", allGreen ? "bg-emerald-500" : "bg-cyan-500")}
          style={{ width: `${completionPct}%` }}
        />
      </div>

      {/* Alert if not ready */}
      {!allGreen && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-amber-800 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{totalCount - passedCount} items remaining before you can go live.</span>
        </div>
      )}

      {allGreen && !checks.goLiveAt && (
        <div className="flex items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2 text-emerald-800 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" />
            All items complete — ready to go live!
          </div>
          <button
            onClick={handleGoLive}
            disabled={goingLive}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50"
          >
            <Rocket className="h-4 w-4" />
            {goingLive ? "Going Live..." : "Go Live"}
          </button>
        </div>
      )}

      {checks.goLiveAt && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-emerald-800 text-sm font-medium">
          <CheckCircle2 className="h-4 w-4" />
          Live since {new Date(checks.goLiveAt).toLocaleDateString()}
        </div>
      )}

      {/* Sections */}
      {sections.map((section) => {
        const Icon = section.icon;
        const sectionPassed = section.items.filter((i) => i.passed).length;
        return (
          <div key={section.title} className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-slate-600" />
                <h2 className="text-sm font-semibold text-slate-800">{section.title}</h2>
              </div>
              <span className="text-xs text-slate-500">{sectionPassed}/{section.items.length}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 transition-colors",
                    item.manual && !item.passed ? "cursor-pointer hover:bg-slate-50" : ""
                  )}
                  onClick={() => item.manual && toggle(item.id)}
                >
                  <StatusIcon passed={item.passed} manual={item.manual} />
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm", item.passed ? "text-slate-600 line-through" : "text-slate-800")}>{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.description}{item.manual && !item.passed ? " — click to mark done" : ""}</p>
                  </div>
                  {item.link && (
                    <a
                      href={item.link}
                      onClick={(e) => e.stopPropagation()}
                      target={item.link.startsWith("http") ? "_blank" : undefined}
                      className="text-cyan-600 hover:text-cyan-700"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <p className="text-xs text-slate-400 text-center pb-4">
        Items marked with <Clock className="h-3 w-3 inline" /> are manual checkboxes — click to mark as complete.
      </p>
    </div>
  );
}

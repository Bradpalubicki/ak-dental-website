export const dynamic = "force-dynamic";

import { Settings, Users, GraduationCap, Image, Megaphone, Award } from "lucide-react";
import { createServiceSupabase } from "@/lib/supabase/server";
import { SectionHub } from "@/components/dashboard/section-hub";
import { SettingsClient } from "./settings-client";

const defaultPracticeInfo = { name: "", phone: "", email: "", address: "", doctor: "" };
const defaultAiSettings = {
  auto_respond_leads: false,
  auto_send_confirmations: true,
  auto_send_reminders: true,
  lead_response_mode: "draft_and_approve",
  confidence_threshold: 0.85,
};
const defaultNotifSettings = {
  daily_briefing_time: "07:00",
  daily_briefing_email: true,
  alert_new_leads: true,
  alert_no_shows: true,
  alert_insurance_issues: true,
};
const defaultIntegrationStatus = {
  twilio: "connected",
  resend: "connected",
  stripe: "not_configured",
  pms: "connected",
  insurance_edi: "not_configured",
  vapi: "not_configured",
  nylas: "not_configured",
};
const defaultOfficeHours = [
  { day: "Monday", open: "08:00", close: "17:00", active: true },
  { day: "Tuesday", open: "08:00", close: "17:00", active: true },
  { day: "Wednesday", open: "08:00", close: "17:00", active: true },
  { day: "Thursday", open: "08:00", close: "17:00", active: true },
  { day: "Friday", open: "08:00", close: "15:00", active: true },
  { day: "Saturday", open: "09:00", close: "14:00", active: true },
  { day: "Sunday", open: "", close: "", active: false },
];

export default async function SettingsPage() {
  const supabase = createServiceSupabase();

  const { data } = await supabase
    .from("oe_practice_settings")
    .select("key, value");

  // Build a lookup from DB rows
  const dbSettings: Record<string, unknown> = {};
  for (const row of data || []) {
    if (row.value != null) {
      dbSettings[row.key] = row.value;
    }
  }

  // Office hours: use DB value if it's an array, otherwise default
  const officeHours = Array.isArray(dbSettings.office_hours)
    ? (dbSettings.office_hours as typeof defaultOfficeHours)
    : defaultOfficeHours;

  // Compute system health from integration status
  const intStatus = { ...defaultIntegrationStatus, ...(typeof dbSettings.integration_status === "object" && !Array.isArray(dbSettings.integration_status) ? dbSettings.integration_status : {}) } as typeof defaultIntegrationStatus;
  const connectedServices = Object.values(intStatus).filter((s) => s === "connected" || s === "configured").length;
  const totalServices = Object.keys(intStatus).length;

  // Check DB health by measuring query latency
  // eslint-disable-next-line react-hooks/purity -- server component: measuring latency requires Date.now()
  const dbStart = Date.now();
  await supabase.from("oe_practice_settings").select("key").limit(1);
  // eslint-disable-next-line react-hooks/purity -- server component: measuring latency requires Date.now()
  const dbLatency = Date.now() - dbStart;

  return (
    <div>
      <SectionHub
        title="Settings & Operations"
        description="Practice settings, staff, training, media, and compliance tools"
        icon={Settings}
        iconBg="bg-slate-100"
        iconColor="text-slate-600"
        links={[
          {
            label: "HR & Staff",
            href: "/dashboard/hr",
            icon: Users,
            description: "Employees, payroll, write-ups, certifications",
          },
          {
            label: "Training",
            href: "/dashboard/training",
            icon: GraduationCap,
            description: "HIPAA, OSHA, and platform training by role",
          },
          {
            label: "Media",
            href: "/dashboard/media",
            icon: Image,
            description: "Practice photos, before/after, and assets",
          },
          {
            label: "Postings",
            href: "/dashboard/postings",
            icon: Megaphone,
            description: "Website specials, announcements, and hours",
          },
          {
            label: "Licensing",
            href: "/dashboard/licensing",
            icon: Award,
            description: "Provider licenses and renewal tracking",
          },
          {
            label: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
            description: "AI, notifications, integrations, office hours",
          },
        ]}
      />
    <SettingsClient
      initialSettings={{
        practice_info: { ...defaultPracticeInfo, ...(typeof dbSettings.practice_info === "object" && !Array.isArray(dbSettings.practice_info) ? dbSettings.practice_info : {}) } as typeof defaultPracticeInfo,
        ai_settings: { ...defaultAiSettings, ...(typeof dbSettings.ai_settings === "object" && !Array.isArray(dbSettings.ai_settings) ? dbSettings.ai_settings : {}) } as typeof defaultAiSettings,
        notification_settings: { ...defaultNotifSettings, ...(typeof dbSettings.notification_settings === "object" && !Array.isArray(dbSettings.notification_settings) ? dbSettings.notification_settings : {}) } as typeof defaultNotifSettings,
        integration_status: intStatus,
        office_hours: officeHours,
      }}
      systemHealth={{
        dbLatencyMs: dbLatency,
        connectedServices,
        totalServices,
        aiStatus: "active" as const,
      }}
    />
    </div>
  );
}

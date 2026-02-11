export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
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
  twilio: "not_configured",
  resend: "configured",
  stripe: "not_configured",
  pms: "not_configured",
  insurance_edi: "not_configured",
};

export default async function SettingsPage() {
  const supabase = createServiceSupabase();

  const { data } = await supabase
    .from("oe_practice_settings")
    .select("key, value");

  // Build a lookup from DB rows
  const dbSettings: Record<string, Record<string, unknown>> = {};
  for (const row of data || []) {
    if (row.value && typeof row.value === "object") {
      dbSettings[row.key] = row.value as Record<string, unknown>;
    }
  }

  return (
    <SettingsClient
      initialSettings={{
        practice_info: { ...defaultPracticeInfo, ...dbSettings.practice_info } as typeof defaultPracticeInfo,
        ai_settings: { ...defaultAiSettings, ...dbSettings.ai_settings } as typeof defaultAiSettings,
        notification_settings: { ...defaultNotifSettings, ...dbSettings.notification_settings } as typeof defaultNotifSettings,
        integration_status: { ...defaultIntegrationStatus, ...dbSettings.integration_status } as typeof defaultIntegrationStatus,
      }}
    />
  );
}

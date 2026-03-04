// Test Mode service — read/write test_mode flag from oe_settings
// When test_mode is true, all SMS/email sends go to TEST_PHONE/TEST_EMAIL instead of patients

import { createServiceSupabase } from "@/lib/supabase/server";

export async function getTestMode(): Promise<{
  enabled: boolean;
  testPhone: string;
  testEmail: string;
}> {
  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("oe_settings")
    .select("key, value")
    .in("key", ["test_mode", "test_phone", "test_email"]);

  const map: Record<string, string> = {};
  for (const row of data || []) map[row.key] = row.value || "";

  return {
    enabled: map.test_mode === "true",
    testPhone: map.test_phone || process.env.TEST_PHONE || "",
    testEmail: map.test_email || process.env.TEST_EMAIL || "",
  };
}

export async function logTestSend(params: {
  type: "sms" | "email";
  channel: string;
  recipient: string;
  templateType?: string;
  messagePreview?: string;
}) {
  const supabase = createServiceSupabase();
  await supabase.from("oe_test_log").insert({
    type: params.type,
    channel: params.channel,
    recipient: params.recipient,
    template_type: params.templateType,
    message_preview: params.messagePreview?.slice(0, 200),
  });
}

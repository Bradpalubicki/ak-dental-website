export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { MessageTemplatesClient } from "./message-templates-client";
import { MESSAGE_TEMPLATES } from "@/config/message-templates";

export default async function MessageTemplatesPage() {
  const supabase = createServiceSupabase();

  // Try to load from DB; fall back to config defaults
  const { data: dbTemplates } = await supabase
    .from("oe_message_templates")
    .select("*")
    .order("group");

  // Merge DB state with config defaults
  const templates = MESSAGE_TEMPLATES.map((t) => {
    const db = dbTemplates?.find((d) => d.type === t.type);
    return {
      ...t,
      id: db?.id || null,
      body: db?.body || t.body,
      subject: db?.subject || t.subject,
      approved: db?.approved ?? false,
      approved_at: db?.approved_at || null,
      approved_by: db?.approved_by || null,
    };
  });

  const approvedCount = templates.filter((t) => t.approved).length;
  const totalCount = templates.length;

  return (
    <MessageTemplatesClient
      templates={templates}
      approvedCount={approvedCount}
      totalCount={totalCount}
    />
  );
}

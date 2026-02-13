export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getPortalPatient } from "@/lib/portal-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { MessagesClient } from "./messages-client";

export default async function PortalMessagesPage() {
  const patient = await getPortalPatient();
  if (!patient) redirect("/portal/login");

  const supabase = createServiceSupabase();

  const { data: messages } = await supabase
    .from("oe_outreach_messages")
    .select("id, subject, channel, campaign_type, status, sent_at, opened, opened_at")
    .eq("patient_id", patient.id)
    .order("sent_at", { ascending: false })
    .limit(50);

  return <MessagesClient messages={messages || []} patientId={patient.id} />;
}

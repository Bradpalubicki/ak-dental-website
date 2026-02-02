import { createServiceSupabase } from "@/lib/supabase/server";
import { InboxClient } from "./inbox-client";

export default async function InboxPage() {
  const supabase = createServiceSupabase();

  // Get all messages with patient info, ordered by most recent
  const { data: messages } = await supabase
    .from("oe_outreach_messages")
    .select(
      "id, created_at, channel, direction, status, subject, content, metadata, patient:oe_patients(id, first_name, last_name, phone, email)"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const formattedMessages = (messages || []).map((m: any) => ({
    id: m.id as string,
    createdAt: m.created_at as string,
    channel: m.channel as string,
    direction: m.direction as string,
    status: m.status as string,
    subject: m.subject as string | null,
    content: m.content as string,
    metadata: m.metadata as Record<string, unknown> | null,
    patientId: m.patient?.id || null,
    patientName: m.patient
      ? `${m.patient.first_name} ${m.patient.last_name}`
      : "Unknown",
    patientPhone: m.patient?.phone || null,
    patientEmail: m.patient?.email || null,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // Group by patient
  const conversationMap = new Map<
    string,
    {
      patientId: string | null;
      patientName: string;
      patientPhone: string | null;
      patientEmail: string | null;
      messages: typeof formattedMessages;
      lastMessage: (typeof formattedMessages)[0];
      unreadCount: number;
    }
  >();

  for (const msg of formattedMessages) {
    const key = msg.patientId || msg.patientName;
    if (!conversationMap.has(key)) {
      conversationMap.set(key, {
        patientId: msg.patientId,
        patientName: msg.patientName,
        patientPhone: msg.patientPhone,
        patientEmail: msg.patientEmail,
        messages: [],
        lastMessage: msg,
        unreadCount: 0,
      });
    }
    const conv = conversationMap.get(key)!;
    conv.messages.push(msg);
    if (msg.direction === "inbound" && msg.status !== "replied") {
      conv.unreadCount++;
    }
  }

  const conversations = Array.from(conversationMap.values()).sort(
    (a, b) =>
      new Date(b.lastMessage.createdAt).getTime() -
      new Date(a.lastMessage.createdAt).getTime()
  );

  return <InboxClient conversations={conversations} />;
}

export const dynamic = "force-dynamic";

import { MessageSquare, Send, Mail, BookTemplate, FolderOpen } from "lucide-react";
import { createServiceSupabase } from "@/lib/supabase/server";
import { SectionHub } from "@/components/dashboard/section-hub";
import { InboxClient } from "./inbox-client";

export default async function InboxPage() {
  const supabase = createServiceSupabase();

  const today = new Date();
  const todayStart = `${today.toISOString().split("T")[0]}T00:00:00.000Z`;

  const [messagesRes, inboundTodayRes] = await Promise.all([
    supabase
      .from("oe_outreach_messages")
      .select(
        "id, created_at, channel, direction, status, subject, content, metadata, patient:oe_patients(id, first_name, last_name, phone, email)"
      )
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("oe_outreach_messages")
      .select("id", { count: "exact", head: true })
      .eq("direction", "inbound")
      .gte("created_at", todayStart),
  ]);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const formattedMessages = (messagesRes.data || []).map((m: any) => ({
    id: m.id as string,
    createdAt: m.created_at as string,
    channel: m.channel as string,
    direction: m.direction as string,
    status: m.status as string,
    subject: m.subject as string | null,
    content: m.content as string,
    metadata: m.metadata as Record<string, unknown> | null,
    patientId: m.patient?.id || null,
    patientName: m.patient ? `${m.patient.first_name} ${m.patient.last_name}` : "Unknown",
    patientPhone: m.patient?.phone || null,
    patientEmail: m.patient?.email || null,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

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

  return (
    <div>
      <SectionHub
        title="Inbox"
        description="Messages, outreach campaigns, email, and templates"
        icon={MessageSquare}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
        links={[
          {
            label: "Messages",
            href: "/dashboard/inbox",
            icon: MessageSquare,
            description: "SMS and email conversations",
            badge: inboundTodayRes.count ?? 0,
            badgeColor: "bg-blue-100 text-blue-700",
          },
          {
            label: "Outreach",
            href: "/dashboard/outreach",
            icon: Send,
            description: "Recall, reactivation, and campaign workflows",
          },
          {
            label: "Email",
            href: "/dashboard/email",
            icon: Mail,
            description: "Email history and delivery logs",
          },
          {
            label: "Templates",
            href: "/dashboard/message-templates",
            icon: BookTemplate,
            description: "Approve and manage message templates",
          },
          {
            label: "Dropbox",
            href: "/dashboard/dropbox",
            icon: FolderOpen,
            description: "AI file drop — categorize uploaded documents",
          },
        ]}
      />
      <InboxClient conversations={conversations} />
    </div>
  );
}

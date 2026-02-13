export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { OutreachClient } from "./outreach-client";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function OutreachPage() {
  const supabase = createServiceSupabase();
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);

  const [workflowsResult, messagesResult] = await Promise.all([
    supabase
      .from("oe_outreach_workflows")
      .select("*")
      .order("created_at", { ascending: true }),
    supabase
      .from("oe_outreach_messages")
      .select("channel, campaign_type, status, opened, clicked, converted, responded, unsubscribed, ai_generated, automated, sent_at")
      .gte("sent_at", sixMonthsAgo)
      .order("sent_at", { ascending: true }),
  ]);

  const workflows = workflowsResult.data || [];
  const allMessages = messagesResult.data || [];

  // --- This month's messages ---
  const thisMonthMsgs = allMessages.filter((m) => m.sent_at >= thisMonthStart);
  const totalSent = thisMonthMsgs.length;
  const delivered = thisMonthMsgs.filter((m) => m.status === "delivered").length;
  const opened = thisMonthMsgs.filter((m) => m.opened).length;
  const clicked = thisMonthMsgs.filter((m) => m.clicked).length;
  const converted = thisMonthMsgs.filter((m) => m.converted).length;
  const deliveryRate = totalSent > 0 ? Math.round((delivered / totalSent) * 1000) / 10 : 0;
  const openRate = delivered > 0 ? Math.round((opened / delivered) * 1000) / 10 : 0;
  const clickRate = delivered > 0 ? Math.round((clicked / delivered) * 1000) / 10 : 0;
  const conversionCount = converted;

  // --- Monthly Outreach Trend ---
  const monthMap = new Map<string, { sent: number; delivered: number; opened: number; clicked: number; converted: number }>();
  for (const m of allMessages) {
    const d = new Date(m.sent_at);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    const entry = monthMap.get(key) || { sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0 };
    entry.sent++;
    if (m.status === "delivered") entry.delivered++;
    if (m.opened) entry.opened++;
    if (m.clicked) entry.clicked++;
    if (m.converted) entry.converted++;
    monthMap.set(key, entry);
  }
  const monthlyOutreach = Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, val]) => ({
      month: MONTH_NAMES[parseInt(key.split("-")[1])],
      ...val,
    }));

  // --- Channel Performance ---
  const channelCounts = new Map<string, number>();
  for (const m of thisMonthMsgs) {
    channelCounts.set(m.channel, (channelCounts.get(m.channel) || 0) + 1);
  }
  const channelColors: Record<string, string> = { email: "#2563eb", sms: "#059669", phone: "#7c3aed" };
  const channelPerformance = Array.from(channelCounts.entries()).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: totalSent > 0 ? Math.round((count / totalSent) * 100) : 0,
    color: channelColors[name] || "#94a3b8",
  }));

  // --- Weekly Engagement ---
  const weekMsgs = allMessages.filter((m) => m.sent_at >= thisWeekStart.toISOString());
  const weeklyEngagement = DAY_NAMES.map((day, i) => {
    const dayMsgs = weekMsgs.filter((m) => new Date(m.sent_at).getDay() === i);
    const dayDelivered = dayMsgs.filter((m) => m.status === "delivered").length;
    return {
      day,
      openRate: dayDelivered > 0 ? Math.round((dayMsgs.filter((m) => m.opened).length / dayDelivered) * 100) : 0,
      clickRate: dayDelivered > 0 ? Math.round((dayMsgs.filter((m) => m.clicked).length / dayDelivered) * 100) : 0,
      responseRate: dayDelivered > 0 ? Math.round((dayMsgs.filter((m) => m.responded).length / dayDelivered) * 100) : 0,
    };
  });

  // --- Campaign Type Performance ---
  const typeMap = new Map<string, { volume: number; delivered: number; opened: number; clicked: number; converted: number }>();
  for (const m of thisMonthMsgs) {
    const type = m.campaign_type || "custom";
    const entry = typeMap.get(type) || { volume: 0, delivered: 0, opened: 0, clicked: 0, converted: 0 };
    entry.volume++;
    if (m.status === "delivered") entry.delivered++;
    if (m.opened) entry.opened++;
    if (m.clicked) entry.clicked++;
    if (m.converted) entry.converted++;
    typeMap.set(type, entry);
  }
  const typeLabels: Record<string, string> = {
    welcome: "Welcome", recall: "Recall", treatment_followup: "Treatment",
    reactivation: "Reactivation", no_show: "No-Show", review_request: "Reviews", birthday: "Birthday", custom: "Custom",
  };
  const campaignTypePerformance = Array.from(typeMap.entries())
    .sort((a, b) => b[1].volume - a[1].volume)
    .map(([type, val]) => ({
      type: typeLabels[type] || type,
      volume: val.volume,
      openRate: val.delivered > 0 ? Math.round((val.opened / val.delivered) * 100) : 0,
      clickRate: val.delivered > 0 ? Math.round((val.clicked / val.delivered) * 100) : 0,
      convRate: val.delivered > 0 ? Math.round((val.converted / val.delivered) * 100) : 0,
    }));

  // --- Hourly Heatmap ---
  const hourDayMap = new Map<string, { total: number; opened: number }>();
  const dayKeys = ["mon", "tue", "wed", "thu", "fri"] as const;
  for (const m of thisMonthMsgs) {
    const d = new Date(m.sent_at);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;
    const hour = d.getHours();
    if (hour < 8 || hour > 17) continue;
    const key = `${hour}-${dow}`;
    const entry = hourDayMap.get(key) || { total: 0, opened: 0 };
    entry.total++;
    if (m.opened) entry.opened++;
    hourDayMap.set(key, entry);
  }
  const hourlyHeatmap = Array.from({ length: 10 }, (_, i) => {
    const h = i + 8;
    const hourLabel = `${h > 12 ? h - 12 : h}${h >= 12 ? "PM" : "AM"}`;
    const row: Record<string, string | number> = { hour: hourLabel };
    for (let dow = 1; dow <= 5; dow++) {
      const entry = hourDayMap.get(`${h}-${dow}`);
      row[dayKeys[dow - 1]] = entry && entry.total > 0 ? Math.round((entry.opened / entry.total) * 100) : 0;
    }
    return row;
  });

  // --- Conversion Funnel ---
  const conversionFunnel = [
    { stage: "Messages Sent", value: totalSent, pct: 100 },
    { stage: "Delivered", value: delivered, pct: totalSent > 0 ? Math.round((delivered / totalSent) * 100) : 0 },
    { stage: "Opened", value: opened, pct: totalSent > 0 ? Math.round((opened / totalSent) * 100) : 0 },
    { stage: "Clicked / Replied", value: clicked, pct: totalSent > 0 ? Math.round((clicked / totalSent) * 100) : 0 },
    { stage: "Converted", value: converted, pct: totalSent > 0 ? Math.round((converted / totalSent) * 100) : 0 },
  ];

  // --- Automation Metrics ---
  const autoMonthMap = new Map<string, { manual: number; automated: number; aiGenerated: number }>();
  for (const m of allMessages) {
    const d = new Date(m.sent_at);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    const entry = autoMonthMap.get(key) || { manual: 0, automated: 0, aiGenerated: 0 };
    if (m.automated) {
      entry.automated++;
      if (m.ai_generated) entry.aiGenerated++;
    } else {
      entry.manual++;
    }
    autoMonthMap.set(key, entry);
  }
  const automationMetrics = Array.from(autoMonthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, val]) => ({
      month: MONTH_NAMES[parseInt(key.split("-")[1])],
      ...val,
    }));

  // --- AI Stats ---
  const aiGeneratedCount = thisMonthMsgs.filter((m) => m.ai_generated).length;
  const automatedCount = thisMonthMsgs.filter((m) => m.automated).length;
  const unsubscribeRate = delivered > 0 ? Math.round((thisMonthMsgs.filter((m) => m.unsubscribed).length / delivered) * 1000) / 10 : 0;
  const bounceRate = totalSent > 0 ? Math.round(((totalSent - delivered) / totalSent) * 1000) / 10 : 0;

  return (
    <OutreachClient
      initialWorkflows={workflows}
      analytics={{
        totalSent,
        deliveryRate,
        openRate,
        clickRate,
        conversionCount,
        monthlyOutreach,
        channelPerformance,
        weeklyEngagement,
        campaignTypePerformance,
        hourlyHeatmap,
        conversionFunnel,
        automationMetrics,
        aiGeneratedCount,
        automatedCount,
        unsubscribeRate,
        bounceRate,
      }}
    />
  );
}

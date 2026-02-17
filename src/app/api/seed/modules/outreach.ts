import type { SupabaseClient } from "@supabase/supabase-js";

const campaignTypes = ["welcome", "recall", "treatment_followup", "reactivation", "no_show", "review_request", "birthday"];
const typeWeights = [15, 25, 12, 18, 8, 15, 7];
const channels = ["email", "sms", "phone"];
const channelWeights = [58, 32, 10];

const emailSubjects: Record<string, string[]> = {
  welcome: ["Welcome to AK Ultimate Dental!", "Your New Patient Guide", "Getting Started With Your Dental Care"],
  recall: ["Time for Your Cleaning!", "Your 6-Month Checkup is Due", "Don't Forget Your Dental Visit"],
  treatment_followup: ["How Are You Feeling?", "Post-Treatment Care Reminder", "Follow-Up: Your Recent Visit"],
  reactivation: ["We Miss You!", "It's Been a While - Schedule Today", "Your Smile Needs Attention"],
  no_show: ["We Missed You Today", "Reschedule Your Appointment", "Let's Find a Better Time"],
  review_request: ["How Was Your Visit?", "Share Your Experience", "We'd Love Your Feedback"],
  birthday: ["Happy Birthday from AK Dental!", "A Special Birthday Gift for You", "Celebrating Your Special Day"],
};

const engagementByType: Record<string, { deliveryRate: number; openRate: number; clickRate: number; convRate: number; responseRate: number }> = {
  welcome:            { deliveryRate: 0.97, openRate: 0.68, clickRate: 0.32, convRate: 0.18, responseRate: 0.12 },
  recall:             { deliveryRate: 0.96, openRate: 0.52, clickRate: 0.24, convRate: 0.14, responseRate: 0.08 },
  treatment_followup: { deliveryRate: 0.97, openRate: 0.45, clickRate: 0.19, convRate: 0.11, responseRate: 0.06 },
  reactivation:       { deliveryRate: 0.94, openRate: 0.38, clickRate: 0.15, convRate: 0.08, responseRate: 0.05 },
  no_show:            { deliveryRate: 0.96, openRate: 0.56, clickRate: 0.28, convRate: 0.16, responseRate: 0.10 },
  review_request:     { deliveryRate: 0.97, openRate: 0.42, clickRate: 0.35, convRate: 0.22, responseRate: 0.15 },
  birthday:           { deliveryRate: 0.98, openRate: 0.72, clickRate: 0.28, convRate: 0.10, responseRate: 0.08 },
};

const channelAdjust: Record<string, { openMult: number; clickMult: number; responseMult: number }> = {
  email: { openMult: 1.0, clickMult: 1.0, responseMult: 1.0 },
  sms:   { openMult: 1.6, clickMult: 1.5, responseMult: 2.2 },
  phone: { openMult: 0, clickMult: 0, responseMult: 5.5 },
};

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export async function seedOutreach(supabase: SupabaseClient) {
  const inserted: Record<string, number> = {};
  const errors: string[] = [];

  // Get workflow IDs
  const { data: workflows } = await supabase.from("oe_outreach_workflows").select("id, type");
  const workflowMap: Record<string, string> = {};
  for (const w of workflows || []) {
    workflowMap[w.type] = w.id;
  }

  // Get patient IDs
  const { data: patients } = await supabase.from("oe_patients").select("id").limit(50);
  const patientIds = (patients || []).map((p: { id: string }) => p.id);

  const messages: Record<string, unknown>[] = [];
  const now = new Date();

  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    const monthIndex = 5 - monthOffset;

    const baseVolume = 1200 + monthIndex * 120 + Math.floor(Math.random() * 60);
    const autoRate = 0.34 + (monthIndex / 5) * 0.39;
    const aiGenRate = 0.15 + (monthIndex / 5) * 0.14;

    for (let i = 0; i < baseVolume; i++) {
      const campaignType = weightedRandom(campaignTypes, typeWeights);
      const channel = weightedRandom(channels, channelWeights);
      const engagement = engagementByType[campaignType];
      const chAdj = channelAdjust[channel];

      const dayOfMonth = Math.min(Math.floor(Math.random() * daysInMonth) + 1, daysInMonth);
      const msgDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), dayOfMonth);
      const dow = msgDate.getDay();
      if (dow === 0 && Math.random() < 0.85) continue;

      const hour = 8 + Math.floor(Math.random() * 10);
      const minute = Math.floor(Math.random() * 60);
      msgDate.setHours(hour, minute, Math.floor(Math.random() * 60));

      const isAutomated = Math.random() < autoRate;
      const isAiGenerated = isAutomated && Math.random() < (aiGenRate / autoRate);

      const delivered = Math.random() < engagement.deliveryRate;
      const status = delivered ? "delivered" : (Math.random() < 0.6 ? "bounced" : "failed");

      let opened = false, clicked = false, converted = false, responded = false;
      if (delivered && channel !== "phone") {
        opened = Math.random() < engagement.openRate * chAdj.openMult;
        if (opened) clicked = Math.random() < (engagement.clickRate / engagement.openRate) * chAdj.clickMult;
        if (clicked) converted = Math.random() < (engagement.convRate / engagement.clickRate);
        responded = Math.random() < engagement.responseRate * chAdj.responseMult;
      } else if (delivered && channel === "phone") {
        responded = Math.random() < engagement.responseRate * chAdj.responseMult;
        if (responded) converted = Math.random() < engagement.convRate * 2;
      }

      const subjects = emailSubjects[campaignType] || ["Outreach Message"];
      const subject = channel === "phone" ? null : subjects[Math.floor(Math.random() * subjects.length)];

      const sentAt = msgDate.toISOString();
      const openedAt = opened ? new Date(msgDate.getTime() + Math.random() * 86400000).toISOString() : null;
      const clickedAt = clicked ? new Date(new Date(openedAt!).getTime() + Math.random() * 3600000).toISOString() : null;
      const convertedAt = converted ? new Date(new Date((clickedAt || openedAt || sentAt)).getTime() + Math.random() * 172800000).toISOString() : null;

      messages.push({
        workflow_id: workflowMap[campaignType] || null,
        patient_id: patientIds.length > 0 ? patientIds[Math.floor(Math.random() * patientIds.length)] : null,
        channel,
        campaign_type: campaignType,
        status: delivered ? "delivered" : status,
        opened, clicked, converted, responded,
        unsubscribed: delivered && Math.random() < 0.004,
        ai_generated: isAiGenerated,
        automated: isAutomated,
        subject,
        sent_at: sentAt,
        opened_at: openedAt,
        clicked_at: clickedAt,
        converted_at: convertedAt,
        created_at: sentAt,
      });
    }
  }

  // Insert in batches of 500
  let totalInserted = 0;
  for (let i = 0; i < messages.length; i += 500) {
    const batch = messages.slice(i, i + 500);
    const { error } = await supabase.from("oe_outreach_messages").insert(batch);
    if (error) errors.push(`Outreach batch ${i}: ${error.message}`);
    else totalInserted += batch.length;
  }

  inserted.oe_outreach_messages = totalInserted;
  return { inserted, errors };
}

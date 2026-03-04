import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { sendSms } from "@/lib/services/twilio";
import { verifyCronSecret } from "@/lib/cron-auth";
import { getTestMode, logTestSend } from "@/lib/services/test-mode";
import { getTemplateBody } from "@/lib/services/message-template";

// GET /api/cron/no-show
// Runs every 30 min to catch patients who missed appointments
// - 30 min after missed: auto-send recovery SMS (no approval needed)
// - 24h after missed: queue for approval before sending
export async function GET(req: NextRequest) {
  const auth = verifyCronSecret(req);
  if (!auth.valid) return auth.response!;

  try {
    const supabase = createServiceSupabase();
    const testMode = await getTestMode();
    const now = new Date();

    // --- 30-MINUTE NO-SHOW RECOVERY ---
    // Appointments that ended 25-40 min ago, still "scheduled" (patient never arrived)
    const thirtyMinAgo = new Date(now.getTime() - 25 * 60 * 1000);
    const fortyMinAgo = new Date(now.getTime() - 40 * 60 * 1000);
    const todayStr = now.toISOString().split("T")[0];

    const { data: noShows30 } = await supabase
      .from("oe_appointments")
      .select("*, oe_patients(first_name, last_name, phone)")
      .eq("appointment_date", todayStr)
      .eq("status", "scheduled")
      .eq("no_show_30m_sent", false)
      .lte("appointment_time", thirtyMinAgo.toTimeString().slice(0, 5))
      .gte("appointment_time", fortyMinAgo.toTimeString().slice(0, 5));

    let sent30 = 0;
    for (const apt of noShows30 || []) {
      const patient = apt.oe_patients as { first_name: string; last_name: string; phone: string };
      if (!patient.phone) continue;

      const template = await getTemplateBody("no_show_recovery_30m", {
        patient_name: patient.first_name,
        appointment_time: apt.appointment_time,
      });
      const smsBody = template?.body
        || `Hi ${patient.first_name}, we missed you at your ${apt.appointment_time} appointment today. We'd love to get you rescheduled — reply here or call us.`;

      const smsTo = testMode.enabled ? testMode.testPhone : patient.phone;
      if (smsTo) {
        await sendSms({ to: smsTo, body: testMode.enabled ? `[TEST] ${smsBody}` : smsBody });
        if (testMode.enabled) {
          await logTestSend({ type: "sms", channel: "no_show_recovery_30m", recipient: smsTo, templateType: "no_show_recovery_30m", messagePreview: smsBody.slice(0, 100) });
        }
        sent30++;
      }

      await supabase
        .from("oe_appointments")
        .update({ no_show_30m_sent: true, status: "no_show" })
        .eq("id", apt.id);
    }

    // --- 24-HOUR NO-SHOW RECOVERY (queue for approval) ---
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const { data: noShows24 } = await supabase
      .from("oe_appointments")
      .select("*, oe_patients(id, first_name, last_name, phone)")
      .eq("appointment_date", yesterdayStr)
      .eq("status", "no_show")
      .eq("no_show_24h_queued", false);

    let queued24 = 0;
    for (const apt of noShows24 || []) {
      const patient = apt.oe_patients as { id: string; first_name: string; last_name: string; phone: string };
      if (!patient.phone) continue;

      const template = await getTemplateBody("no_show_recovery_24h", {
        patient_name: patient.first_name,
        appointment_time: apt.appointment_time,
      });
      const smsBody = template?.body
        || `Hi ${patient.first_name}, we noticed you missed your appointment yesterday. We'd love to help you reschedule — we have openings this week.`;

      // Queue for approval (do not auto-send)
      await supabase.from("oe_ai_actions").insert({
        action_type: "no_show_recovery",
        module: "scheduling",
        description: `No-show recovery SMS for ${patient.first_name} ${patient.last_name} (missed ${yesterdayStr})`,
        input_data: {
          patient_id: patient.id,
          appointment_id: apt.id,
          phone: patient.phone,
        },
        output_data: { message: smsBody, channel: "sms" },
        status: "pending_approval",
        patient_id: patient.id,
      });

      await supabase
        .from("oe_appointments")
        .update({ no_show_24h_queued: true })
        .eq("id", apt.id);

      queued24++;
    }

    await supabase.from("oe_ai_actions").insert({
      action_type: "no_show_cron",
      module: "scheduling",
      description: `No-show cron: ${sent30} 30min SMS sent, ${queued24} 24h messages queued for approval${testMode.enabled ? " [TEST MODE]" : ""}`,
      output_data: { sent_30m: sent30, queued_24h: queued24, test_mode: testMode.enabled },
      status: "executed",
    });

    return NextResponse.json({ success: true, sent_30m: sent30, queued_24h: queued24, test_mode: testMode.enabled });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { sendSms } from "@/lib/services/twilio";
import { sendEmail } from "@/lib/services/resend";
import { verifyCronSecret } from "@/lib/cron-auth";
import { getTestMode, logTestSend } from "@/lib/services/test-mode";
import { getTemplateBody } from "@/lib/services/message-template";

// GET /api/cron/recall
// Weekly on Mondays — find patients 6+ months since last visit, queue recall messages
// Uses oe_message_templates for copy instead of AI-generated content
export async function GET(req: NextRequest) {
  const auth = verifyCronSecret(req);
  if (!auth.valid) return auth.response!;

  try {
    const supabase = createServiceSupabase();
    const testMode = await getTestMode();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const cutoffDate = sixMonthsAgo.toISOString().split("T")[0];

    const nineMonthsAgo = new Date();
    nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 9);
    const overdueDate = nineMonthsAgo.toISOString().split("T")[0];

    const { data: patients } = await supabase
      .from("oe_patients")
      .select("id, first_name, last_name, email, phone, last_visit, sms_opt_out")
      .eq("status", "active")
      .eq("sms_opt_out", false)
      .lt("last_visit", cutoffDate)
      .order("last_visit", { ascending: true })
      .limit(30);

    if (!patients || patients.length === 0) {
      return NextResponse.json({ success: true, message: "No patients need recall", processed: 0 });
    }

    let processed = 0;
    let skipped = 0;

    for (const patient of patients) {
      // Skip if we sent recall in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentOutreach } = await supabase
        .from("oe_outreach_messages")
        .select("id")
        .eq("patient_id", patient.id)
        .ilike("type", "%recall%")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .limit(1);

      if (recentOutreach && recentOutreach.length > 0) {
        skipped++;
        continue;
      }

      // Patients 9+ months overdue get the stronger "overdue" template
      const isOverdue = patient.last_visit && patient.last_visit < overdueDate;
      const templateType = isOverdue ? "recall_overdue" : "recall_6mo";
      const mergeFields = { patient_name: patient.first_name };

      const template = await getTemplateBody(templateType, mergeFields);

      if (!template) {
        skipped++;
        continue;
      }

      // SMS (primary channel for recall)
      if (patient.phone) {
        const smsTo = testMode.enabled ? testMode.testPhone : patient.phone;
        if (smsTo) {
          await sendSms({ to: smsTo, body: testMode.enabled ? `[TEST] ${template.body}` : template.body });
          if (testMode.enabled) {
            await logTestSend({ type: "sms", channel: templateType, recipient: smsTo, templateType, messagePreview: template.body.slice(0, 100) });
          }
        }
      }

      // Email (secondary channel — recall_6mo has email variant)
      if (patient.email && !isOverdue) {
        const emailTo = testMode.enabled ? testMode.testEmail : patient.email;
        const subject = template.subject || "It's time for your next dental visit — AK Ultimate Dental";
        const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#0891b2">AK Ultimate Dental</h2>
          ${testMode.enabled ? '<p style="background:#fef08a;padding:8px;border-radius:4px"><strong>[TEST MODE]</strong> Real recipient: ' + patient.email + '</p>' : ""}
          <p>${template.body.replace(/\n/g, "<br>")}</p>
          <p style="margin-top:24px"><a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://akultimatedental.com"}/book" style="background:#0891b2;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Book Appointment</a></p>
          <p style="color:#64748b;font-size:12px;margin-top:24px">AK Ultimate Dental — 7480 West Sahara Ave, Las Vegas, NV 89117</p>
        </div>`;
        await sendEmail({ to: emailTo, subject: testMode.enabled ? `[TEST] ${subject}` : subject, html });
        if (testMode.enabled) {
          await logTestSend({ type: "email", channel: templateType, recipient: emailTo, templateType, messagePreview: subject });
        }
      }

      // Log outreach record
      await supabase.from("oe_outreach_messages").insert({
        patient_id: patient.id,
        type: templateType,
        channel: "sms",
        message: template.body,
        status: "sent",
      });

      processed++;
    }

    await supabase.from("oe_ai_actions").insert({
      action_type: "recall_cron",
      module: "recall",
      description: `Weekly recall: ${processed} messages sent, ${skipped} skipped${testMode.enabled ? " [TEST MODE]" : ""}`,
      output_data: { patients_found: patients.length, processed, skipped, test_mode: testMode.enabled },
      status: "executed",
    });

    return NextResponse.json({ success: true, patients_found: patients.length, processed, skipped, test_mode: testMode.enabled });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

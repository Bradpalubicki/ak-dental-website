import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/services/resend";
import { sendSms } from "@/lib/services/twilio";
import { verifyCronSecret } from "@/lib/cron-auth";
import { getTestMode, logTestSend } from "@/lib/services/test-mode";
import { getTemplateBody } from "@/lib/services/message-template";

// GET /api/cron/reminders - Send appointment reminders (Vercel Cron)
export async function GET(req: NextRequest) {
  const auth = verifyCronSecret(req);
  if (!auth.valid) return auth.response!;

  try {
    const supabase = createServiceSupabase();
    const testMode = await getTestMode();

    // Get tomorrow's appointments that haven't been reminded
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const { data: appointments } = await supabase
      .from("oe_appointments")
      .select("*, oe_patients(first_name, last_name, phone, email)")
      .eq("appointment_date", tomorrowStr)
      .eq("reminder_24h_sent", false)
      .in("status", ["scheduled", "confirmed"]);

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ message: "No reminders to send", count: 0 });
    }

    let sentCount = 0;

    for (const apt of appointments) {
      const patient = apt.oe_patients as { first_name: string; last_name: string; phone: string; email: string };
      const dateFormatted = new Date(apt.appointment_date).toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric",
      });
      const mergeFields = {
        patient_name: patient.first_name,
        appointment_date: dateFormatted,
        appointment_time: apt.appointment_time,
      };

      // Send email reminder
      if (patient.email) {
        const emailTo = testMode.enabled ? testMode.testEmail : patient.email;
        const template = await getTemplateBody("reminder_24h", mergeFields);
        const subject = template?.subject || `Reminder: Your appointment is tomorrow at ${apt.appointment_time}`;
        const body = template?.body || `Hi ${patient.first_name}, your ${apt.type} appointment at AK Ultimate Dental is tomorrow at ${apt.appointment_time}.`;

        const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#0891b2">AK Ultimate Dental</h2>
          ${testMode.enabled ? '<p style="background:#fef08a;padding:8px;border-radius:4px"><strong>[TEST MODE]</strong> Real recipient: ' + patient.email + '</p>' : ""}
          <p>${body.replace(/\n/g, "<br>")}</p>
          <p style="color:#64748b;font-size:12px;margin-top:24px">AK Ultimate Dental — 123 Main St, Naperville, IL</p>
        </div>`;

        await sendEmail({ to: emailTo, subject: testMode.enabled ? `[TEST] ${subject}` : subject, html });

        if (testMode.enabled) {
          await logTestSend({ type: "email", channel: "reminder_24h", recipient: emailTo, templateType: "reminder_24h", messagePreview: subject });
        }
      }

      // Send SMS reminder
      if (patient.phone) {
        const smsTo = testMode.enabled ? testMode.testPhone : patient.phone;
        const template = await getTemplateBody("reminder_24h", mergeFields);
        const smsBody = template?.body || `Hi ${patient.first_name} — reminder: appointment at AK Ultimate Dental tomorrow at ${apt.appointment_time}. Reply C to confirm or R to reschedule.`;

        if (smsTo) {
          await sendSms({ to: smsTo, body: testMode.enabled ? `[TEST] ${smsBody}` : smsBody });

          if (testMode.enabled) {
            await logTestSend({ type: "sms", channel: "reminder_24h", recipient: smsTo, templateType: "reminder_24h", messagePreview: smsBody.slice(0, 100) });
          }
        }
      }

      await supabase
        .from("oe_appointments")
        .update({ reminder_24h_sent: true })
        .eq("id", apt.id);

      sentCount++;
    }

    await supabase.from("oe_ai_actions").insert({
      action_type: "send_reminders",
      module: "scheduling",
      description: `Sent ${sentCount} appointment reminders for ${tomorrowStr}${testMode.enabled ? " [TEST MODE]" : ""}`,
      output_data: { count: sentCount, test_mode: testMode.enabled },
      status: "executed",
    });

    return NextResponse.json({ success: true, count: sentCount, test_mode: testMode.enabled });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

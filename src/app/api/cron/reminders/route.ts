import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { sendEmail, appointmentReminderEmail } from "@/lib/services/resend";
import { sendSms } from "@/lib/services/twilio";
import { verifyCronSecret } from "@/lib/cron-auth";

// GET /api/cron/reminders - Send appointment reminders (Vercel Cron)
export async function GET(req: NextRequest) {
  const auth = verifyCronSecret(req);
  if (!auth.valid) return auth.response!;

  try {
    const supabase = createServiceSupabase();

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

      // Send email reminder
      if (patient.email) {
        const template = appointmentReminderEmail({
          patientName: patient.first_name,
          date: new Date(apt.appointment_date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
          time: apt.appointment_time,
          type: apt.type,
          hoursUntil: 24,
        });
        await sendEmail({
          to: patient.email,
          subject: template.subject,
          html: template.html,
        });
      }

      // Send SMS reminder
      if (patient.phone) {
        await sendSms({
          to: patient.phone,
          body: `Reminder: ${patient.first_name}, your ${apt.type} appointment at AK Ultimate Dental is tomorrow at ${apt.appointment_time}. Reply C to confirm or R to reschedule. (702) 935-4395`,
        });
      }

      // Update appointment
      await supabase
        .from("oe_appointments")
        .update({ reminder_24h_sent: true })
        .eq("id", apt.id);

      sentCount++;
    }

    // Log AI action
    await supabase.from("oe_ai_actions").insert({
      action_type: "send_reminders",
      module: "scheduling",
      description: `Sent ${sentCount} appointment reminders for ${tomorrowStr}`,
      output_data: { count: sentCount },
      status: "executed",
    });

    return NextResponse.json({ success: true, count: sentCount });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

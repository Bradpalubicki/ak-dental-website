import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { sendEmail, appointmentConfirmationEmail } from "@/lib/services/resend";
import { sendSms } from "@/lib/services/twilio";

// POST /api/appointments/[id]/confirm - Send confirmation
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceSupabase();

    // Get appointment with patient info
    const { data: apt, error } = await supabase
      .from("oe_appointments")
      .select("*, oe_patients(first_name, last_name, phone, email)")
      .eq("id", id)
      .single();

    if (error || !apt) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const patient = apt.oe_patients as { first_name: string; last_name: string; phone: string; email: string };
    const patientName = `${patient.first_name} ${patient.last_name}`;

    // Send email confirmation
    if (patient.email) {
      const template = appointmentConfirmationEmail({
        patientName,
        date: new Date(apt.appointment_date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
        time: apt.appointment_time,
        type: apt.type,
        provider: apt.provider_name,
      });
      await sendEmail({
        to: patient.email,
        subject: template.subject,
        html: template.html,
      });
    }

    // Send SMS confirmation
    if (patient.phone) {
      await sendSms({
        to: patient.phone,
        body: `Hi ${patient.first_name}, your appointment at AK Ultimate Dental is confirmed for ${apt.appointment_date} at ${apt.appointment_time}. Reply C to confirm or R to reschedule. (702) 935-4395`,
      });
    }

    // Update appointment
    await supabase
      .from("oe_appointments")
      .update({ status: "confirmed", confirmation_sent: true })
      .eq("id", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

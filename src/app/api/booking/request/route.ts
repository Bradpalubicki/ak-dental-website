import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/services/resend";

const bookingSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  patientEmail: z.string().email("Valid email is required"),
  patientPhone: z.string().min(10, "Valid phone number is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
  providerId: z.string().uuid("Valid provider ID is required"),
  serviceType: z.string().min(1, "Service type is required"),
  isNewPatient: z.boolean(),
  notes: z.string().optional(),
});

type BookingRequest = z.infer<typeof bookingSchema>;

// POST /api/booking/request
// Public endpoint — no auth required for new patients
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data: BookingRequest = parsed.data;
    const supabase = createServiceSupabase();

    // Get provider info for the confirmation email
    const { data: provider } = await supabase
      .from("oe_providers")
      .select("first_name, last_name, title")
      .eq("id", data.providerId)
      .single();

    const providerName = provider
      ? [provider.title, provider.first_name, provider.last_name].filter(Boolean).join(" ")
      : "Our Provider";

    // Insert appointment
    const { data: apt, error: aptError } = await supabase
      .from("oe_appointments")
      .insert({
        appointment_date: data.date,
        appointment_time: data.time,
        duration_minutes: 30,
        type: data.serviceType,
        status: "scheduled",
        provider_id: data.providerId,
        provider_name: providerName,
        notes: data.notes || null,
        booking_source: "online",
      })
      .select("id")
      .single();

    if (aptError || !apt) {
      return NextResponse.json({ error: aptError?.message || "Failed to create appointment" }, { status: 500 });
    }

    // If new patient, also create a lead
    if (data.isNewPatient) {
      const nameParts = data.patientName.trim().split(" ");
      const firstName = nameParts[0] || data.patientName;
      const lastName = nameParts.slice(1).join(" ") || "";

      await supabase.from("oe_leads").insert({
        first_name: firstName,
        last_name: lastName,
        email: data.patientEmail,
        phone: data.patientPhone,
        source: "online_booking",
        inquiry_type: data.serviceType,
        message: `Online booking request for ${data.date} at ${data.time}. Notes: ${data.notes || "None"}`,
        urgency: data.serviceType === "emergency" ? "high" : "medium",
        status: "new",
      });
    }

    // Format date for display
    const dateObj = new Date(`${data.date}T12:00:00`);
    const displayDate = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Format time for display
    const [h, m] = data.time.split(":").map(Number);
    const hour12 = h % 12 || 12;
    const ampm = h < 12 ? "AM" : "PM";
    const displayTime = `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;

    // Send confirmation email
    await sendEmail({
      to: data.patientEmail,
      subject: `Appointment Request Received — ${displayDate} at ${displayTime}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0891b2; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">AK Ultimate Dental</h1>
            <p style="margin: 4px 0 0; opacity: 0.9;">Appointment Request Received</p>
          </div>
          <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Hi ${data.patientName},</p>
            <p>We've received your appointment request. Our team will confirm within 2 business hours.</p>
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 4px 0;"><strong>Date:</strong> ${displayDate}</p>
              <p style="margin: 4px 0;"><strong>Time:</strong> ${displayTime}</p>
              <p style="margin: 4px 0;"><strong>Service:</strong> ${data.serviceType}</p>
              <p style="margin: 4px 0;"><strong>Provider:</strong> ${providerName}</p>
              <p style="margin: 4px 0;"><strong>Location:</strong> 7480 W Sahara Ave, Las Vegas, NV 89117</p>
            </div>
            <p>Need immediate assistance? Call us at <strong>(702) 935-4395</strong>.</p>
            <p>We look forward to seeing you!</p>
            <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
              AK Ultimate Dental | (702) 935-4395 | 7480 W Sahara Ave, Las Vegas, NV 89117
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, appointmentId: apt.id });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

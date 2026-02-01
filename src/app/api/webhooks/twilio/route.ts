import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

// POST /api/webhooks/twilio - Handle Twilio webhooks (SMS status, incoming messages)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());

    const messageStatus = body.MessageStatus as string;
    const from = body.From as string;
    const to = body.To as string;
    const messageBody = body.Body as string;
    const messageSid = body.MessageSid as string;

    const supabase = createServiceSupabase();

    // Handle incoming SMS
    if (messageBody && from) {
      // Log incoming message
      await supabase.from("oe_outreach_messages").insert({
        patient_id: "00000000-0000-0000-0000-000000000000", // Will be matched by phone lookup
        channel: "sms",
        direction: "inbound",
        status: "delivered",
        content: messageBody,
        metadata: { from, to, sid: messageSid },
      });

      // Check if this is a confirmation reply
      const normalizedBody = messageBody.trim().toLowerCase();
      if (normalizedBody === "c" || normalizedBody === "confirm" || normalizedBody === "yes") {
        // Find the patient's upcoming appointment by phone
        const { data: patients } = await supabase
          .from("oe_patients")
          .select("id")
          .eq("phone", from)
          .limit(1);

        if (patients && patients.length > 0) {
          // Confirm their next appointment
          const { data: appointments } = await supabase
            .from("oe_appointments")
            .select("id")
            .eq("patient_id", patients[0].id)
            .eq("status", "scheduled")
            .gte("appointment_date", new Date().toISOString().split("T")[0])
            .order("appointment_date", { ascending: true })
            .limit(1);

          if (appointments && appointments.length > 0) {
            await supabase
              .from("oe_appointments")
              .update({ status: "confirmed" })
              .eq("id", appointments[0].id);
          }
        }
      }
    }

    // Return TwiML response
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      }
    );
  } catch (error) {
    console.error("[Twilio Webhook]", error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      { status: 200, headers: { "Content-Type": "text/xml" } }
    );
  }
}

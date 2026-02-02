import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { generateLeadResponse } from "@/lib/services/ai";

// POST /api/webhooks/twilio - Handle Twilio webhooks (inbound SMS, status updates)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());

    const from = body.From as string;
    const to = body.To as string;
    const messageBody = body.Body as string;
    const messageSid = body.MessageSid as string;
    const messageStatus = body.MessageStatus as string;

    const supabase = createServiceSupabase();

    // Handle incoming SMS
    if (messageBody && from) {
      // Find patient by phone number
      const { data: patients } = await supabase
        .from("oe_patients")
        .select("id, first_name, last_name, phone, email")
        .eq("phone", from)
        .limit(1);

      const patient = patients?.[0] || null;

      // Log incoming message
      await supabase.from("oe_outreach_messages").insert({
        patient_id: patient?.id || null,
        channel: "sms",
        direction: "inbound",
        status: "delivered",
        content: messageBody,
        metadata: { from, to, sid: messageSid },
      });

      // Classify the inbound message intent
      const normalizedBody = messageBody.trim().toLowerCase();

      // Check for opt-out keywords FIRST
      const optOutKeywords = ["stop", "unsubscribe", "optout", "opt out", "cancel messages", "quit"];
      if (optOutKeywords.some((kw) => normalizedBody === kw || normalizedBody === kw.replace(" ", ""))) {
        // Set opt-out flag on patient and/or lead
        if (patient) {
          await supabase
            .from("oe_patients")
            .update({ sms_opt_out: true })
            .eq("id", patient.id);
        }

        // Also check leads by phone
        await supabase
          .from("oe_leads")
          .update({ sms_opt_out: true })
          .eq("phone", from);

        // Pause any active nurture/reactivation sequences
        if (patient) {
          await supabase
            .from("oe_patient_reactivation_sequences")
            .update({ status: "opted_out", completed_at: new Date().toISOString() })
            .eq("patient_id", patient.id)
            .eq("status", "active");
        }

        // Pause lead nurture sequences for this phone
        const { data: leads } = await supabase
          .from("oe_leads")
          .select("id")
          .eq("phone", from);

        if (leads) {
          for (const lead of leads) {
            await supabase
              .from("oe_lead_nurture_sequences")
              .update({ status: "opted_out", completed_at: new Date().toISOString() })
              .eq("lead_id", lead.id)
              .eq("status", "active");
          }
        }

        // Log the opt-out
        await supabase.from("oe_ai_actions").insert({
          action_type: "sms_opt_out",
          module: "compliance",
          description: `${patient ? `${patient.first_name} ${patient.last_name}` : from} opted out of SMS messages`,
          input_data: { phone: from, message: messageBody },
          status: "executed",
          patient_id: patient?.id || null,
        });

        // Return TwiML - Twilio handles STOP automatically, but we track it too
        return new NextResponse(
          '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
          { status: 200, headers: { "Content-Type": "text/xml" } }
        );
      }

      // Check for confirmation replies
      const confirmationReplies = ["c", "confirm", "yes", "y", "confirmed", "ok"];
      const cancelReplies = ["cancel", "no", "n", "reschedule"];

      if (confirmationReplies.includes(normalizedBody)) {
        // Confirmation reply - update next appointment
        if (patient) {
          const { data: appointments } = await supabase
            .from("oe_appointments")
            .select("id")
            .eq("patient_id", patient.id)
            .eq("status", "scheduled")
            .gte("appointment_date", new Date().toISOString().split("T")[0])
            .order("appointment_date", { ascending: true })
            .limit(1);

          if (appointments && appointments.length > 0) {
            await supabase
              .from("oe_appointments")
              .update({ status: "confirmed" })
              .eq("id", appointments[0].id);

            // Log the confirmation
            await supabase.from("oe_ai_actions").insert({
              action_type: "appointment_confirmed_sms",
              module: "scheduling",
              description: `${patient.first_name} ${patient.last_name} confirmed appointment via SMS`,
              input_data: { phone: from, message: messageBody },
              status: "executed",
              patient_id: patient.id,
            });
          }
        }
      } else if (cancelReplies.some((r) => normalizedBody.includes(r))) {
        // Cancellation or reschedule request - queue for human review
        await supabase.from("oe_ai_actions").insert({
          action_type: "cancellation_request",
          module: "scheduling",
          description: `${patient ? `${patient.first_name} ${patient.last_name}` : from} requested cancellation/reschedule via SMS`,
          input_data: {
            phone: from,
            message: messageBody,
            patient_id: patient?.id || null,
          },
          status: "pending_approval",
          patient_id: patient?.id || null,
        });
      } else {
        // General message - classify with AI and queue draft response
        const patientName = patient
          ? `${patient.first_name} ${patient.last_name}`
          : `Patient (${from})`;

        const aiResponse = await generateLeadResponse({
          patientName,
          inquiry: "Inbound SMS",
          message: messageBody,
          source: "sms",
          urgency: "medium",
        });

        if (aiResponse) {
          await supabase.from("oe_ai_actions").insert({
            action_type: "sms_response_draft",
            module: "outreach",
            description: `Draft SMS reply to ${patientName}: "${messageBody.substring(0, 50)}${messageBody.length > 50 ? "..." : ""}"`,
            input_data: {
              phone: from,
              message: messageBody,
              patient_id: patient?.id || null,
              patient_name: patientName,
            },
            output_data: {
              response: aiResponse.content,
              model: aiResponse.model,
            },
            status: "pending_approval",
            patient_id: patient?.id || null,
            confidence_score: 0.75,
          });
        }

        // If sender is not a known patient, create a lead
        if (!patient) {
          await supabase.from("oe_leads").insert({
            first_name: "Unknown",
            last_name: from,
            phone: from,
            source: "phone",
            status: "new",
            inquiry_type: "SMS Inquiry",
            message: messageBody,
            urgency: "medium",
            ai_response_draft: aiResponse?.content || null,
          });
        }
      }
    }

    // Handle status callbacks (delivery receipts)
    if (messageStatus && messageSid) {
      const statusMap: Record<string, string> = {
        delivered: "delivered",
        sent: "sent",
        failed: "failed",
        undelivered: "failed",
      };
      const mappedStatus = statusMap[messageStatus];
      if (mappedStatus) {
        await supabase
          .from("oe_outreach_messages")
          .update({ status: mappedStatus })
          .eq("metadata->>sid", messageSid);
      }
    }

    // Return TwiML response (empty - no auto-reply)
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

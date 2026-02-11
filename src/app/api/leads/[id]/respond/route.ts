import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { sendEmail, leadResponseEmail } from "@/lib/services/resend";
import { sendSms } from "@/lib/services/twilio";
import { tryAuth } from "@/lib/auth";

// POST /api/leads/[id]/respond - Approve and send AI response
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;
  try {
    const { id } = await params;
    const body = await req.json();
    const { response_text, channel } = body;
    const supabase = createServiceSupabase();

    // Get the lead
    const { data: lead, error: leadError } = await supabase
      .from("oe_leads")
      .select("*")
      .eq("id", id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const responseText = response_text || lead.ai_response_draft;
    if (!responseText) {
      return NextResponse.json({ error: "No response text provided" }, { status: 400 });
    }

    const results: Record<string, unknown> = {};

    // Send via email
    if ((channel === "email" || channel === "both") && lead.email) {
      const template = leadResponseEmail({
        patientName: lead.first_name,
        responseBody: responseText,
      });
      const emailResult = await sendEmail({
        to: lead.email,
        subject: template.subject,
        html: template.html,
      });
      results.email = emailResult;
    }

    // Send via SMS
    if ((channel === "sms" || channel === "both") && lead.phone) {
      const smsResult = await sendSms({
        to: lead.phone,
        body: `Hi ${lead.first_name}, thank you for contacting AK Ultimate Dental! ${responseText.substring(0, 300)}`,
      });
      results.sms = smsResult;
    }

    // Calculate response time
    const createdAt = new Date(lead.created_at).getTime();
    const responseTimeSeconds = Math.round((Date.now() - createdAt) / 1000);

    // Update lead
    await supabase
      .from("oe_leads")
      .update({
        status: "contacted",
        ai_response_sent: true,
        ai_response_approved: true,
        response_time_seconds: responseTimeSeconds,
      })
      .eq("id", id);

    // Log AI action
    await supabase.from("oe_ai_actions").insert({
      action_type: "lead_response_sent",
      module: "lead_response",
      description: `Sent response to ${lead.first_name} ${lead.last_name} via ${channel}`,
      output_data: results,
      status: "executed",
      lead_id: id,
    });

    return NextResponse.json({
      success: true,
      response_time_seconds: responseTimeSeconds,
      results,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

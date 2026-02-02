import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { sendEmail, leadResponseEmail } from "@/lib/services/resend";
import { sendSms } from "@/lib/services/twilio";

// POST /api/approvals/execute - Approve or reject an AI action
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action_id, decision, edited_content, reason } = body;

    if (!action_id || !decision) {
      return NextResponse.json(
        { error: "action_id and decision required" },
        { status: 400 }
      );
    }

    const supabase = createServiceSupabase();

    // Get the action
    const { data: action, error: actionError } = await supabase
      .from("oe_ai_actions")
      .select("*")
      .eq("id", action_id)
      .single();

    if (actionError || !action) {
      return NextResponse.json({ error: "Action not found" }, { status: 404 });
    }

    if (action.status !== "pending_approval") {
      return NextResponse.json(
        { error: "Action already processed" },
        { status: 400 }
      );
    }

    // Handle rejection
    if (decision === "reject") {
      await supabase
        .from("oe_ai_actions")
        .update({
          status: "rejected",
          approved_by: "staff",
          approved_at: new Date().toISOString(),
          output_data: {
            ...((action.output_data as Record<string, unknown>) || {}),
            rejection_reason: reason || "No reason provided",
          },
        })
        .eq("id", action_id);

      return NextResponse.json({ success: true, status: "rejected" });
    }

    // Handle approval - execute the action
    const results: Record<string, unknown> = {};
    const finalContent = edited_content || getActionContent(action);

    // Execute based on action type
    if (
      action.action_type === "lead_response_draft" &&
      action.lead_id
    ) {
      // Get the lead to send the response
      const { data: lead } = await supabase
        .from("oe_leads")
        .select("*")
        .eq("id", action.lead_id)
        .single();

      if (lead) {
        // Send via email if available
        if (lead.email) {
          const template = leadResponseEmail({
            patientName: lead.first_name,
            responseBody: finalContent,
          });
          const emailResult = await sendEmail({
            to: lead.email,
            subject: template.subject,
            html: template.html,
          });
          results.email = emailResult;
        }

        // Send via SMS if available
        if (lead.phone) {
          const smsResult = await sendSms({
            to: lead.phone,
            body: `Hi ${lead.first_name}, thank you for contacting AK Ultimate Dental! ${finalContent.substring(0, 300)}`,
          });
          results.sms = smsResult;
        }

        // Update lead status
        const createdAt = new Date(lead.created_at).getTime();
        const responseTimeSeconds = Math.round((Date.now() - createdAt) / 1000);

        await supabase
          .from("oe_leads")
          .update({
            status: "contacted",
            ai_response_sent: true,
            ai_response_approved: true,
            response_time_seconds: responseTimeSeconds,
          })
          .eq("id", lead.id);
      }
    }

    // For outreach/recall messages
    if (
      action.action_type === "recall_message" ||
      action.action_type === "outreach_message"
    ) {
      if (action.patient_id) {
        const { data: patient } = await supabase
          .from("oe_patients")
          .select("*")
          .eq("id", action.patient_id)
          .single();

        if (patient) {
          if (patient.email) {
            const emailResult = await sendEmail({
              to: patient.email,
              subject: "We miss you at AK Ultimate Dental!",
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: #0891b2; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">AK Ultimate Dental</h1>
                  </div>
                  <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
                    <p>Hi ${patient.first_name},</p>
                    ${finalContent
                      .split("\n")
                      .map((line: string) => `<p>${line}</p>`)
                      .join("")}
                    <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
                      AK Ultimate Dental | (702) 935-4395 | akultimatedental.com
                    </p>
                  </div>
                </div>
              `,
            });
            results.email = emailResult;
          }
          if (patient.phone) {
            const smsResult = await sendSms({
              to: patient.phone,
              body: `Hi ${patient.first_name}! ${finalContent.substring(0, 300)}`,
            });
            results.sms = smsResult;
          }

          // Log outreach message
          await supabase.from("oe_outreach_messages").insert({
            patient_id: patient.id,
            channel: patient.email ? "email" : "sms",
            direction: "outbound",
            status: "sent",
            content: finalContent,
            metadata: results,
          });
        }
      }
    }

    // Update action status to approved/executed
    await supabase
      .from("oe_ai_actions")
      .update({
        status: "executed",
        approved_by: "staff",
        approved_at: new Date().toISOString(),
        output_data: {
          ...((action.output_data as Record<string, unknown>) || {}),
          execution_results: results,
          ...(edited_content ? { edited_content } : {}),
        },
      })
      .eq("id", action_id);

    return NextResponse.json({ success: true, status: "executed", results });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function getActionContent(action: Record<string, unknown>): string {
  const output = action.output_data as Record<string, unknown> | null;
  if (!output) return "";
  if (typeof output === "string") return output;
  if (output.response) return String(output.response);
  if (output.content) return String(output.content);
  if (output.message) return String(output.message);
  return "";
}

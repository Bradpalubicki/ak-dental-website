import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";
import { sendEmail } from "@/lib/services/resend";
import { sendSms } from "@/lib/services/twilio";

export const dynamic = "force-dynamic";

const SendSchema = z.object({
  workflow_id: z.string().uuid(),
  channel: z.enum(["email", "sms", "both"]).default("email"),
  // Optional: specific patient IDs. If empty, uses workflow trigger_conditions
  patient_ids: z.array(z.string().uuid()).optional(),
  test_mode: z.boolean().default(false), // if true, sends only to admin
});

function fillMergeFields(text: string, patient: Record<string, string>): string {
  return text
    .replace(/{{patient_name}}/g, patient.name || "Valued Patient")
    .replace(/{{practice_name}}/g, "AK Ultimate Dental")
    .replace(/{{booking_link}}/g, "https://akultimatedental.com/book")
    .replace(/{{cancel_link}}/g, "https://akultimatedental.com/cancel")
    .replace(/{{intake_link}}/g, "https://akultimatedental.com/intake")
    .replace(/{{review_link}}/g, "https://g.page/r/ak-ultimate-dental/review")
    .replace(/{{payment_link}}/g, "https://akultimatedental.com/portal/billing")
    .replace(/{{appointment_date}}/g, patient.appointment_date || "")
    .replace(/{{appointment_time}}/g, patient.appointment_time || "")
    .replace(/{{provider_name}}/g, patient.provider_name || "Dr. Chireau")
    .replace(/{{treatment_name}}/g, patient.treatment_name || "");
}

export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const parsed = SendSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { workflow_id, channel, patient_ids, test_mode } = parsed.data;
  const supabase = createServiceSupabase();

  // Load workflow
  const { data: workflow, error: wfErr } = await supabase
    .from("oe_outreach_workflows")
    .select("*")
    .eq("id", workflow_id)
    .single();

  if (wfErr || !workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  // Get the first step message
  const steps = (workflow.steps as Array<{ message?: string; subject?: string }>) || [];
  const firstStep = steps[0];
  const messageBody = firstStep?.message || workflow.name;
  const subject = firstStep?.subject || workflow.name;

  // Load patients to send to
  let patients: Array<{ id: string; first_name: string; last_name: string; email: string | null; phone: string | null }> = [];

  if (test_mode) {
    // Test mode — use practice settings email/phone
    const { data: settings } = await supabase
      .from("oe_practice_settings")
      .select("value")
      .eq("key", "practice_info")
      .single();
    const info = (settings?.value as Record<string, string>) || {};
    patients = [{
      id: "test",
      first_name: "Test",
      last_name: "Patient",
      email: info.email || null,
      phone: info.phone || null,
    }];
  } else if (patient_ids && patient_ids.length > 0) {
    const { data } = await supabase
      .from("oe_patients")
      .select("id, first_name, last_name, email, phone")
      .in("id", patient_ids)
      .is("deleted_at", null);
    patients = data || [];
  } else {
    // Default: send to all active patients (capped at 50 for safety)
    const { data } = await supabase
      .from("oe_patients")
      .select("id, first_name, last_name, email, phone")
      .eq("status", "active")
      .is("deleted_at", null)
      .limit(50);
    patients = data || [];
  }

  if (patients.length === 0) {
    return NextResponse.json({ error: "No eligible patients found" }, { status: 400 });
  }

  const results = { sent: 0, failed: 0, skipped: 0 };

  for (const patient of patients) {
    const mergeData = {
      name: `${patient.first_name} ${patient.last_name}`,
      appointment_date: "",
      appointment_time: "",
      provider_name: "Dr. Chireau",
      treatment_name: "",
    };
    const filledBody = fillMergeFields(messageBody, mergeData);
    const filledSubject = fillMergeFields(subject, mergeData);

    try {
      if ((channel === "email" || channel === "both") && patient.email) {
        await sendEmail({
          to: patient.email,
          subject: filledSubject,
          html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.6;">${filledBody}<hr style="border:none;border-top:1px solid #f1f5f9;margin-top:32px;"/><p style="font-size:12px;color:#94a3b8;">AK Ultimate Dental · 7480 W Sahara Ave Las Vegas NV 89117</p></div>`,
        });
      }

      if ((channel === "sms" || channel === "both") && patient.phone) {
        await sendSms({ to: patient.phone, body: filledBody.substring(0, 1600) });
      }

      // Log the message
      await supabase.from("oe_outreach_messages").insert({
        patient_id: patient.id === "test" ? null : patient.id,
        workflow_id,
        campaign_type: workflow.type,
        channel: channel === "both" ? "email" : channel,
        direction: "outbound",
        status: "delivered",
        body: filledBody,
        subject: filledSubject,
        automated: true,
        ai_generated: false,
        sent_at: new Date().toISOString(),
      });

      results.sent++;
    } catch {
      results.failed++;
    }
  }

  // Update workflow enrolled count
  await supabase
    .from("oe_outreach_workflows")
    .update({
      enrolled_count: (workflow.enrolled_count || 0) + results.sent,
      updated_at: new Date().toISOString(),
    })
    .eq("id", workflow_id);

  return NextResponse.json({
    success: true,
    workflow: workflow.name,
    channel,
    results,
    test_mode,
  });
}

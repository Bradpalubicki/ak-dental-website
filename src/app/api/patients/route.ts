import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";
import { logPhiAccess } from "@/lib/audit";
import { sendEmail } from "@/lib/services/resend";
import { sendSms } from "@/lib/services/twilio";
import { getTestMode, logTestSend } from "@/lib/services/test-mode";
import { getTemplateBody } from "@/lib/services/message-template";

const CreatePatientSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email().max(254).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(50).optional().nullable(),
  zip: z.string().max(10).optional().nullable(),
  insurance_provider: z.string().max(200).optional().nullable(),
  insurance_member_id: z.string().max(100).optional().nullable(),
  insurance_group_number: z.string().max(100).optional().nullable(),
  status: z.enum(["active", "inactive", "prospect"]).default("active"),
  notes: z.string().max(5000).optional().nullable(),
  tags: z.array(z.string()).default([]),
});

export async function GET(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const status = req.nextUrl.searchParams.get("status");
  const showDeleted = req.nextUrl.searchParams.get("deleted") === "true";

  let query = supabase
    .from("oe_patients")
    .select("*")
    .order("last_name", { ascending: true })
    .limit(200);

  if (showDeleted) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    query = query.not("deleted_at", "is", null).gte("deleted_at", thirtyDaysAgo);
  } else {
    query = query.is("deleted_at", null);
  }

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logPhiAccess("patients.list", "patient", undefined, { count: data?.length, status });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const parsed = CreatePatientSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("oe_patients")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logPhiAccess("patients.create", "patient", data?.id);

  // Fire welcome email + intake SMS (non-blocking)
  if (data) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://akultimatedental.com";
    const intakeLink = `${baseUrl}/portal/intake`;
    const mergeFields = { patient_name: parsed.data.first_name, intake_link: intakeLink };

    void (async () => {
      try {
        const testMode = await getTestMode();

        // Welcome email
        if (parsed.data.email) {
          const emailTemplate = await getTemplateBody("new_patient_welcome", mergeFields);
          const subject = emailTemplate?.subject || "Welcome to AK Ultimate Dental!";
          const body = emailTemplate?.body || `Hi ${parsed.data.first_name}, welcome to AK Ultimate Dental! We're excited to have you as a patient. Complete your intake forms here: ${intakeLink}`;
          const emailTo = testMode.enabled ? testMode.testEmail : parsed.data.email;
          if (emailTo) {
            const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
              <h2 style="color:#0891b2">Welcome to AK Ultimate Dental!</h2>
              ${testMode.enabled ? '<p style="background:#fef08a;padding:8px;border-radius:4px"><strong>[TEST MODE]</strong></p>' : ""}
              <p>${body.replace(/\n/g, "<br>")}</p>
              <p style="margin-top:20px"><a href="${intakeLink}" style="background:#0891b2;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Complete Intake Forms</a></p>
              <p style="color:#64748b;font-size:12px;margin-top:24px">AK Ultimate Dental — 7480 West Sahara Ave, Las Vegas, NV 89117</p>
            </div>`;
            await sendEmail({ to: emailTo, subject: testMode.enabled ? `[TEST] ${subject}` : subject, html });
            if (testMode.enabled) await logTestSend({ type: "email", channel: "new_patient_welcome", recipient: emailTo, templateType: "new_patient_welcome", messagePreview: subject });
          }
        }

        // Intake forms SMS
        if (parsed.data.phone) {
          const smsTemplate = await getTemplateBody("intake_forms", mergeFields);
          const smsBody = smsTemplate?.body || `Hi ${parsed.data.first_name}! Please complete your new patient forms before your visit: ${intakeLink} — AK Ultimate Dental`;
          const smsTo = testMode.enabled ? testMode.testPhone : parsed.data.phone;
          if (smsTo) {
            await sendSms({ to: smsTo, body: testMode.enabled ? `[TEST] ${smsBody}` : smsBody });
            if (testMode.enabled) await logTestSend({ type: "sms", channel: "intake_forms", recipient: smsTo, templateType: "intake_forms", messagePreview: smsBody.slice(0, 100) });
          }
        }
      } catch {
        // Non-blocking — don't fail patient creation if messaging fails
      }
    })();
  }

  return NextResponse.json(data, { status: 201 });
}

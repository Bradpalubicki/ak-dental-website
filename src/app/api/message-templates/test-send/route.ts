import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/services/resend";
import { z } from "zod";

const schema = z.object({ type: z.string() });

// Replace merge fields with test values
function fillMergeFields(text: string): string {
  return text
    .replace(/{{patient_name}}/g, "Test Patient")
    .replace(/{{practice_name}}/g, "AK Ultimate Dental")
    .replace(/{{appointment_date}}/g, "March 10, 2026")
    .replace(/{{appointment_time}}/g, "10:00 AM")
    .replace(/{{provider_name}}/g, "Dr. Chireau")
    .replace(/{{booking_link}}/g, "https://akultimatedental.com/book")
    .replace(/{{cancel_link}}/g, "https://akultimatedental.com/cancel")
    .replace(/{{intake_link}}/g, "https://akultimatedental.com/intake")
    .replace(/{{review_link}}/g, "https://g.page/ak-ultimate-dental")
    .replace(/{{payment_link}}/g, "https://akultimatedental.com/pay")
    .replace(/{{treatment_name}}/g, "Composite Filling");
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  // Get template from DB
  const supabase = createServiceSupabase();
  const { data: template } = await supabase
    .from("oe_message_templates")
    .select("*")
    .eq("type", body.data.type)
    .single();

  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  // Get the logged-in user's email
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const toEmail = user.emailAddresses[0]?.emailAddress;

  if (!toEmail) return NextResponse.json({ error: "No email on your account" }, { status: 400 });

  const filledBody = fillMergeFields(template.body);
  const filledSubject = template.subject ? fillMergeFields(template.subject) : `[TEST] ${template.label}`;

  if (template.channel === "sms") {
    // For SMS-only, send as email with SMS content for preview
    await sendEmail({
      to: toEmail,
      subject: `[TEST SMS PREVIEW] ${template.label}`,
      html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
        <div style="background:#f1f5f9;border-radius:8px;padding:16px;margin-bottom:16px;">
          <p style="margin:0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">SMS Preview — would send to patient's phone</p>
        </div>
        <div style="background:#0891b2;color:white;border-radius:12px 12px 12px 4px;padding:16px;font-size:15px;">
          ${filledBody}
        </div>
        <p style="color:#94a3b8;font-size:12px;margin-top:24px;">Test send from AK Dental Message Templates</p>
      </div>`,
    });
  } else {
    await sendEmail({
      to: toEmail,
      subject: `[TEST] ${filledSubject}`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#92400e;">
          ⚠️ This is a test email from AK Dental Message Templates
        </div>
        <div style="white-space:pre-wrap;font-size:15px;color:#1e293b;line-height:1.6;">${filledBody}</div>
        <p style="color:#94a3b8;font-size:12px;margin-top:24px;border-top:1px solid #f1f5f9;padding-top:16px;">Test send · AK Ultimate Dental</p>
      </div>`,
    });
  }

  return NextResponse.json({ success: true, sentTo: toEmail });
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sendEmail } from "@/lib/services/resend";

/**
 * POST /api/test/send-email
 * Sends a test email to the requesting admin. Admin-only.
 * Body: { to: string }
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Test endpoint disabled in production" }, { status: 403 });
  }

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { to } = await req.json();
  if (!to) return NextResponse.json({ error: "to address required" }, { status: 400 });

  const now = new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "full",
    timeStyle: "short",
  });

  const result = await sendEmail({
    to,
    subject: "✅ AK Ultimate Dental — Email Test",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0891b2; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 22px;">AK Ultimate Dental</h1>
          <p style="margin: 6px 0 0; opacity: 0.85; font-size: 14px;">Dashboard Email Test</p>
        </div>
        <div style="padding: 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background: #fff;">
          <p style="font-size: 16px; color: #0f172a; margin-top: 0;">
            ✅ Email is working correctly.
          </p>
          <p style="color: #475569;">
            This test was triggered from the AK Ultimate Dental dashboard at:
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin: 16px 0;">
            <p style="margin: 0; font-size: 15px; color: #0f172a; font-weight: 600;">${now}</p>
          </div>
          <p style="color: #475569;">
            The following email features are active and ready:
          </p>
          <ul style="color: #475569; line-height: 1.8;">
            <li>Appointment confirmations</li>
            <li>Appointment reminders (24hr + 2hr)</li>
            <li>New patient lead responses</li>
            <li>Team member invitations</li>
            <li>Daily briefing reports</li>
            <li>SEO monthly reports</li>
            <li>AI action alerts</li>
          </ul>
          <p style="color: #64748b; font-size: 12px; margin-top: 28px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
            AK Ultimate Dental · (702) 935-4395 · 7480 W Sahara Ave, Las Vegas, NV 89117<br>
            <em>Sent via NuStack Digital Ventures platform</em>
          </p>
        </div>
      </div>
    `,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: result.id, sentTo: to });
}

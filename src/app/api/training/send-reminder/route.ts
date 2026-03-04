import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sendEmail } from "@/lib/services/resend";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string(),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { email, name } = body.data;
  const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ak-ultimate-dental.vercel.app";

  await sendEmail({
    to: email,
    subject: "Action required: Complete your required training — AK Ultimate Dental",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0891b2;color:white;padding:20px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:22px;">AK Ultimate Dental</h1>
          <p style="margin:4px 0 0;opacity:0.9;font-size:14px;">Training Reminder</p>
        </div>
        <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
          <p>Hi ${name},</p>
          <p>This is a reminder that you have required compliance training to complete before your next shift at AK Ultimate Dental.</p>
          <p><strong>Required modules:</strong></p>
          <ul>
            <li>HIPAA Privacy Training (all staff)</li>
            <li>OSHA Safety Training (clinical staff only)</li>
          </ul>
          <p>Please complete your training as soon as possible:</p>
          <p style="text-align:center;margin:24px 0;">
            <a href="${dashboardUrl}/dashboard/training" style="background:#0891b2;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
              Complete Training
            </a>
          </p>
          <p style="color:#64748b;font-size:12px;margin-top:24px;">
            AK Ultimate Dental | (702) 935-4395 | akultimatedental.com
          </p>
        </div>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}

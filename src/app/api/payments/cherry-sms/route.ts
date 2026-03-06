import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import twilio from "twilio";

const BodySchema = z.object({
  phone: z.string().min(10),
  firstName: z.string(),
  lastName: z.string(),
  amountDollars: z.number().min(1),
  treatmentPlanId: z.string().uuid(),
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: NextRequest) {
  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { phone, firstName, amountDollars, treatmentPlanId } = parsed.data;

  // Normalize phone to E.164
  const normalized = phone.replace(/\D/g, "");
  const e164 = normalized.startsWith("1") ? `+${normalized}` : `+1${normalized}`;

  const cherryUrl = `https://www.withcherry.com/apply?amount=${amountDollars}&practice_name=AK+Ultimate+Dental&first_name=${encodeURIComponent(firstName)}`;

  const body = `Hi ${firstName}! AK Ultimate Dental has sent your financing application link. Apply now with Cherry — 80%+ approval, no impact to your credit score to check:\n\n${cherryUrl}\n\nQuestions? Call us: (702) 660-5555`;

  await twilioClient.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to: e164,
  });

  return NextResponse.json({ success: true, sentTo: e164, treatmentPlanId });
}

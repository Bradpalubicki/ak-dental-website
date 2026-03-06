import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SquareClient, SquareEnvironment } from "square";
import { createServiceSupabase } from "@/lib/supabase/server";

const BodySchema = z.object({
  sourceId: z.string().min(1),
  treatmentPlanId: z.string().uuid(),
  amountCents: z.number().int().min(1),
  patientEmail: z.string().email().optional().nullable(),
});

const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

export async function POST(req: NextRequest) {
  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { sourceId, treatmentPlanId, amountCents, patientEmail } = parsed.data;
  const idempotencyKey = `${treatmentPlanId}-${Date.now()}`;

  const response = await squareClient.payments.create({
    sourceId,
    idempotencyKey,
    amountMoney: {
      amount: BigInt(amountCents),
      currency: "USD",
    },
    locationId: process.env.SQUARE_LOCATION_ID!,
    buyerEmailAddress: patientEmail ?? undefined,
    note: `AK Ultimate Dental — Treatment Plan ${treatmentPlanId}`,
  });

  const payment = response.payment;

  if (!payment || payment.status !== "COMPLETED") {
    return NextResponse.json({ error: "Payment failed or not completed" }, { status: 500 });
  }

  const supabase = createServiceSupabase();
  await supabase
    .from("oe_treatment_plans")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
      notes: `Square payment ID: ${payment.id}`,
    })
    .eq("id", treatmentPlanId);

  return NextResponse.json({
    success: true,
    paymentId: payment.id,
    receiptUrl: payment.receiptUrl,
  });
}

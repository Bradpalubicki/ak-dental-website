import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";

const ClaimSchema = z.object({
  claim: z.object({
    claim_number: z.string().nullable().optional(),
    insurance_provider: z.string(),
    procedure_codes: z.unknown().optional(),
    billed_amount: z.union([z.string(), z.number()]).optional(),
    denial_reason: z.string().nullable().optional(),
    aging_days: z.number().nullable().optional(),
    status: z.string().optional(),
  }),
});

function procedureSummary(codes: unknown): string {
  if (!Array.isArray(codes) || codes.length === 0) return "see claim";
  return codes
    .map((c: { code?: string; description?: string }) => c.code || c.description || "")
    .filter(Boolean)
    .join(", ");
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: unknown = await request.json();
  const parsed = ClaimSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { claim } = parsed.data;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are a dental billing specialist. Write a professional insurance appeal letter for a denied dental claim.

Claim details (no patient PHI):
- Claim #: ${claim.claim_number || "N/A"}
- Insurance Payer: ${claim.insurance_provider}
- Procedure Codes: ${procedureSummary(claim.procedure_codes)}
- Billed Amount: $${Number(claim.billed_amount || 0).toLocaleString()}
- Denial Reason: ${claim.denial_reason || "Not specified"}
- Days Outstanding: ${claim.aging_days || 0}

Write a formal appeal letter that:
1. States the claim number and date of service reference
2. Directly addresses the denial reason with a professional rebuttal
3. Cites relevant ADA guidelines or payer contract obligations where applicable
4. Requests prompt reconsideration and payment
5. Is firm but professional in tone

Format as a complete letter with "To Whom It May Concern:" salutation and signature block for "Dr. Alex Chireau, DDS / AK Ultimate Dental / 7480 W Sahara Ave, Las Vegas, NV 89117 / (702) 935-4395".

Keep it under 300 words. Return only the letter text, no commentary.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  const letter = message.content[0].type === "text" ? message.content[0].text : "";

  return NextResponse.json({ letter });
}

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CONSENT_ENGINE_URL = "https://consent-engine-nustack-digital-ventures-llc.vercel.app";

const generateSchema = z.object({
  treatment: z.string().min(2),
  state: z.string().min(2),
  clinic: z.object({ name: z.string(), phone: z.string().optional(), address: z.string().optional() }),
  options: z.object({ language: z.string().optional(), includeFdaWarnings: z.boolean().optional() }).optional(),
});

const sendSchema = z.object({
  title: z.string(),
  senderName: z.string().default("AK Ultimate Dental"),
  recipients: z.array(z.object({ name: z.string(), email: z.string().email() })),
  fields: z.array(z.object({ type: z.string(), label: z.string(), required: z.boolean() })).optional(),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const action = req.nextUrl.searchParams.get("action") ?? "generate";

  if (action === "generate") {
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const res = await fetch(`${CONSENT_ENGINE_URL}/api/consent/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  if (action === "send") {
    const parsed = sendSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    // Default consent fields for dental consent forms
    const fields = parsed.data.fields ?? [
      { type: "text", label: "Patient Full Legal Name", required: true },
      { type: "date", label: "Date of Consent", required: true },
      { type: "checkbox", label: "I have read and understand this consent form", required: true },
      { type: "checkbox", label: "I consent to the dental treatment described above", required: true },
      { type: "checkbox", label: "I have had the opportunity to ask questions", required: true },
      { type: "signature", label: "Patient Signature (type full legal name)", required: true },
    ];

    const res = await fetch(`${CONSENT_ENGINE_URL}/api/consent/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsed.data, fields }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  if (action === "audit") {
    const res = await fetch(`${CONSENT_ENGINE_URL}/api/consent/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${CONSENT_ENGINE_URL}/api/consent/documents`, {
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

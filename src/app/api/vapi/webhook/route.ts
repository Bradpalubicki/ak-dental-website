import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Vapi sends call-end events — store in oe_calls for analytics
const VapiCallEndSchema = z.object({
  message: z.object({
    type: z.string(),
    call: z.object({
      id: z.string().optional(),
      type: z.string().optional(),
      status: z.string().optional(),
      startedAt: z.string().optional(),
      endedAt: z.string().optional(),
      endedReason: z.string().optional(),
      cost: z.number().optional(),
      costBreakdown: z.unknown().optional(),
    }).optional(),
    customer: z.object({
      number: z.string().optional(),
      name: z.string().optional(),
    }).optional(),
    transcript: z.string().optional(),
    summary: z.string().optional(),
    analysis: z.object({
      summary: z.string().optional(),
      successEvaluation: z.string().optional(),
    }).optional(),
    durationSeconds: z.number().optional(),
    recordingUrl: z.string().optional(),
  }),
}).passthrough();

function parseIntent(transcript: string | undefined, summary: string | undefined): string {
  const text = ((transcript || "") + " " + (summary || "")).toLowerCase();
  if (text.includes("appointment") || text.includes("book") || text.includes("schedule")) return "appointment";
  if (text.includes("billing") || text.includes("invoice") || text.includes("payment")) return "billing";
  if (text.includes("insurance") || text.includes("coverage") || text.includes("claim")) return "insurance";
  if (text.includes("emergency") || text.includes("pain") || text.includes("urgent")) return "emergency";
  if (text.includes("cancel") || text.includes("reschedule")) return "appointment";
  if (text.includes("prescription") || text.includes("medication")) return "prescription";
  if (text.includes("follow") || text.includes("check in") || text.includes("result")) return "follow_up";
  return "other";
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = VapiCallEndSchema.safeParse(raw);

    if (!parsed.success) {
      // Accept but don't process unknown event shapes
      return NextResponse.json({ received: true });
    }

    const { message } = parsed.data;

    // Only process call-end events
    if (message.type !== "end-of-call-report") {
      return NextResponse.json({ received: true, skipped: true });
    }

    const call = message.call;
    const customer = message.customer;
    const transcript = message.transcript;
    const summary = message.analysis?.summary || message.summary;

    const startedAt = call?.startedAt ? new Date(call.startedAt) : new Date();
    const endedAt = call?.endedAt ? new Date(call.endedAt) : new Date();
    const durationSeconds = message.durationSeconds ||
      Math.round((endedAt.getTime() - startedAt.getTime()) / 1000);

    const status = (() => {
      const reason = call?.endedReason?.toLowerCase() || "";
      if (reason.includes("voicemail")) return "voicemail";
      if (reason.includes("abandon") || reason.includes("hang")) return "abandoned";
      if (durationSeconds < 5) return "missed";
      return "answered";
    })();

    const intent = parseIntent(transcript, summary);

    const supabase = createServiceSupabase();
    await supabase.from("oe_calls").insert({
      call_type: call?.type || "inbound",
      direction: "inbound",
      status,
      caller_phone: customer?.number || null,
      caller_name: customer?.name || null,
      duration_seconds: durationSeconds,
      ai_handled: true,
      ai_summary: summary || null,
      transcript: transcript || null,
      intent,
      urgency: intent === "emergency" ? "urgent" : "medium",
      action_taken: call?.endedReason || null,
      recording_url: message.recordingUrl || null,
      created_at: startedAt.toISOString(),
    });

    return NextResponse.json({ received: true, stored: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[Vapi Webhook]", msg);
    // Always return 200 to Vapi — don't retry on our errors
    return NextResponse.json({ received: true, error: msg });
  }
}

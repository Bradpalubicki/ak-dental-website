import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { verifyWebhookSignature, isConfigured } from "@/lib/services/nylas";

const WEBHOOK_SECRET = process.env.NYLAS_WEBHOOK_SECRET || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ak-dental-website.vercel.app";

// GET — Nylas webhook challenge verification
export async function GET(req: NextRequest) {
  const challenge = req.nextUrl.searchParams.get("challenge");
  if (challenge) {
    return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
  }
  return NextResponse.json({ error: "No challenge" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ error: "Nylas not configured" }, { status: 503 });
  }

  const rawBody = await req.text();

  // Verify webhook signature if secret is configured
  if (WEBHOOK_SECRET) {
    const signature = req.headers.get("x-nylas-signature") || "";
    if (!verifyWebhookSignature(rawBody, signature, WEBHOOK_SECRET)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = payload.type as string;

  // Only process new inbound messages
  if (type !== "message.created" && type !== "message.updated") {
    return NextResponse.json({ received: true });
  }

  const data = payload.data as Record<string, unknown> | undefined;
  const obj = (data?.object ?? {}) as Record<string, unknown>;

  const nylasMessageId = obj.id as string | undefined;
  const grantId = obj.grant_id as string | undefined;

  if (!nylasMessageId || !grantId) {
    return NextResponse.json({ received: true });
  }

  // Inbound check: skip outbound messages
  const folders = (obj.folders as string[]) || [];
  if (folders.some((f) => f.toLowerCase().includes("sent"))) {
    return NextResponse.json({ received: true });
  }

  const fromList = (obj.from as Array<{ name?: string; email?: string }>) || [];
  const fromEmail = fromList[0]?.email || "";
  const fromName = fromList[0]?.name || "";
  const subject = (obj.subject as string) || null;
  const bodyHtml = (obj.body as string) || null;
  const snippet = (obj.snippet as string) || null;
  const threadId = (obj.thread_id as string) || null;
  const attachments = (obj.attachments as Array<{ filename: string }>) || [];

  const supabase = createServiceSupabase();

  // Upsert — idempotent on nylas_message_id
  const { data: inserted, error } = await supabase
    .from("oe_email_messages")
    .upsert(
      {
        nylas_message_id: nylasMessageId,
        nylas_thread_id: threadId,
        nylas_grant_id: grantId,
        from_email: fromEmail,
        from_name: fromName,
        subject,
        body_text: snippet,
        body_html: bodyHtml,
        has_attachment: attachments.length > 0,
        attachment_names: attachments.length > 0
          ? attachments.map((a) => a.filename)
          : null,
        direction: "inbound",
        processed: false,
      },
      { onConflict: "nylas_message_id", ignoreDuplicates: false }
    )
    .select("id")
    .single();

  if (error || !inserted) {
    // Already processed (duplicate) — still return 200
    return NextResponse.json({ received: true });
  }

  // Fire-and-forget: trigger async processing without blocking response
  // Using void fetch so Nylas gets 200 within its 10s timeout
  void fetch(`${APP_URL}/api/email/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CRON_SECRET || ""}`,
    },
    body: JSON.stringify({ messageId: inserted.id }),
  }).catch(() => {
    // Intentionally ignore — Nylas already got its 200
  });

  return NextResponse.json({ received: true });
}

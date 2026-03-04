import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { verifyCronSecret } from "@/lib/cron-auth";
import { downloadAttachment as _downloadAttachment } from "@/lib/services/nylas";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const InvoiceSchema = z.object({
  vendor_name: z.string(),
  amount: z.number(),
  currency: z.string().default("USD"),
  due_date: z.string().nullable(),
  invoice_number: z.string().nullable(),
  confidence: z.number().min(0).max(1),
});

const ClassificationSchema = z.object({
  classification: z.enum(["invoice", "inquiry", "appointment", "noise", "other"]),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
});

export async function POST(req: NextRequest) {
  const authCheck = verifyCronSecret(req);
  if (!authCheck.valid) return authCheck.response!;

  if (!anthropic) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  const { messageId } = await req.json();
  if (!messageId) {
    return NextResponse.json({ error: "messageId required" }, { status: 400 });
  }

  const supabase = createServiceSupabase();

  const { data: message } = await supabase
    .from("oe_email_messages")
    .select("*")
    .eq("id", messageId)
    .single();

  if (!message || message.processed) {
    return NextResponse.json({ skipped: true });
  }

  // Step 1: Classify the email
  const classifyContent = `Subject: ${message.subject || "(no subject)"}
From: ${message.from_name || ""} <${message.from_email}>
Body preview: ${(message.body_text || message.body_html || "").substring(0, 500)}
Has attachment: ${message.has_attachment}
Attachment names: ${JSON.stringify(message.attachment_names || [])}`;

  let classification = "other";
  let classConfidence = 0.5;

  try {
    const classifyRes = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      system: `You are an email classifier for a dental practice. Classify emails into exactly one of:
- invoice: vendor bills, invoices, receipts, payment requests
- inquiry: patient questions, appointment requests, general questions needing a reply
- appointment: appointment confirmations, scheduling only (no reply needed)
- noise: newsletters, marketing, spam, automated notifications, no-reply senders
- other: anything that doesn't fit the above

Respond with valid JSON matching: { "classification": "...", "confidence": 0.0-1.0, "reasoning": "..." }`,
      messages: [{ role: "user", content: classifyContent }],
    });

    const text = classifyRes.content.find((b) => b.type === "text")?.text || "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = ClassificationSchema.safeParse(JSON.parse(jsonMatch[0]));
      if (parsed.success) {
        classification = parsed.data.classification;
        classConfidence = parsed.data.confidence;
      }
    }
  } catch {
    // Classification failed — mark as other and continue
  }

  // Step 2: Invoice processing
  if (classification === "invoice") {
    const extractionInput = message.body_html || message.body_text || "";

    // Try to download PDF attachment if present
    if (
      message.has_attachment &&
      message.nylas_grant_id &&
      Array.isArray(message.attachment_names) &&
      message.attachment_names.length > 0
    ) {
      // Note: We only have attachment names from the webhook payload.
      // To download, we'd need attachment IDs from a full message fetch.
      // For now, extract from email body. Full attachment download
      // requires storing attachment_ids — handled in a future enhancement.
      // The body HTML is sufficient for most HTML/forwarded invoices.
    }

    // Use Anthropic Files API if we have PDF content, otherwise parse HTML body
    let invoiceData: z.infer<typeof InvoiceSchema> | null = null;

    try {
      const invoiceRes = await anthropic.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 512,
        system: `Extract invoice/bill data from this email. Return JSON matching exactly:
{ "vendor_name": "string", "amount": number, "currency": "USD", "due_date": "YYYY-MM-DD or null", "invoice_number": "string or null", "confidence": 0.0-1.0 }
If you cannot determine a field, use null. Amount must be a number (no $ sign).`,
        messages: [
          {
            role: "user",
            content: `Email subject: ${message.subject || ""}
From: ${message.from_name || ""} <${message.from_email}>

Email body:
${extractionInput.substring(0, 3000)}`,
          },
        ],
      });

      const text = invoiceRes.content.find((b) => b.type === "text")?.text || "{}";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = InvoiceSchema.safeParse(JSON.parse(jsonMatch[0]));
        if (parsed.success) {
          invoiceData = parsed.data;
        }
      }
    } catch {
      // Extraction failed — still create AP record with partial data
    }

    if (invoiceData) {
      // Calculate status based on due date
      let status = "upcoming";
      if (invoiceData.due_date) {
        const daysUntilDue = Math.ceil(
          (new Date(invoiceData.due_date).getTime() - Date.now()) / 86400000
        );
        if (daysUntilDue < 0) status = "overdue";
        else if (daysUntilDue <= 7) status = "due_soon";
      }

      await supabase.from("oe_accounts_payable").insert({
        vendor: invoiceData.vendor_name || message.from_name || message.from_email,
        description: message.subject || "Invoice from email",
        amount: invoiceData.amount || 0,
        due_date: invoiceData.due_date || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        status,
        notes: `Auto-imported from email. From: ${message.from_email}`,
        source_email_id: message.id,
        invoice_number: invoiceData.invoice_number,
        extraction_confidence: invoiceData.confidence,
        raw_extraction: invoiceData as unknown as Record<string, unknown>,
      });
    }
  }

  // Step 3: Draft a reply for inquiry emails
  if (classification === "inquiry") {
    try {
      // Pull style profile if available
      const { data: styleProfile } = await supabase
        .from("oe_email_style")
        .select("style_summary, tone_keywords, example_openers, example_closings")
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .single();

      const styleContext = styleProfile?.style_summary && styleProfile.style_summary !== "No style profile yet — send some emails to generate one."
        ? `\n\nVoice profile (based on past sent emails): ${styleProfile.style_summary}
Tone keywords: ${(styleProfile.tone_keywords as string[] || []).join(", ")}
Common openers: ${(styleProfile.example_openers as string[] || []).join(" | ")}
Common closings: ${(styleProfile.example_closings as string[] || []).join(" | ")}`
        : "";

      const draftRes = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: `You draft email replies for AK Ultimate Dental in Las Vegas, NV.
Write in this voice: professional, direct, warm. Short sentences. No fluff.
Start with "Hi [name]," — use the sender's first name if available.
Sign off with "Dr. Alex & Team, AK Ultimate Dental".
Reply in plain text only. Do not use markdown.${styleContext}`,
        messages: [
          {
            role: "user",
            content: `Draft a reply to this email:

From: ${message.from_name || message.from_email}
Subject: ${message.subject || "(no subject)"}

${(message.body_text || "").substring(0, 1000)}`,
          },
        ],
      });

      const draftText = draftRes.content.find((b) => b.type === "text")?.text || "";

      if (draftText) {
        await supabase.from("oe_email_drafts").insert({
          source_message_id: message.id,
          to_email: message.from_email,
          subject: `Re: ${message.subject || "(no subject)"}`,
          body: draftText,
          status: "pending",
        });
      }
    } catch {
      // Draft generation failed — not critical
    }
  }

  // Mark message as processed
  await supabase
    .from("oe_email_messages")
    .update({
      processed: true,
      classification,
      classification_confidence: classConfidence,
    })
    .eq("id", messageId);

  return NextResponse.json({ success: true, classification });
}

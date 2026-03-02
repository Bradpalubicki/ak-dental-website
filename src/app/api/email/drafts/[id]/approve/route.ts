import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";
import { sendEmail } from "@/lib/services/resend";

// POST — approve a draft and send via Resend
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data: draft } = await supabase
    .from("oe_email_drafts")
    .select("*")
    .eq("id", id)
    .eq("status", "pending")
    .single();

  if (!draft) {
    return NextResponse.json({ error: "Draft not found or already processed" }, { status: 404 });
  }

  // Allow optional body override at approval time
  let finalBody = draft.body;
  let finalSubject = draft.subject;
  try {
    const reqBody = await req.json();
    if (reqBody.body) finalBody = reqBody.body;
    if (reqBody.subject) finalSubject = reqBody.subject;
  } catch {
    // No body override — use saved draft
  }

  // Convert plain text to HTML paragraphs
  const html = `<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #1e293b;">
${finalBody.split("\n").map((line: string) => `<p style="margin: 0 0 8px;">${line || "&nbsp;"}</p>`).join("")}
</div>`;

  const result = await sendEmail({
    to: draft.to_email,
    subject: finalSubject,
    html,
    replyTo: "dr.alex@akultimatedental.com",
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 500 });
  }

  // Mark as sent
  await supabase
    .from("oe_email_drafts")
    .update({
      status: "sent",
      approved_by: authResult.userId,
      approved_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
      resend_id: result.id,
      body: finalBody,
      subject: finalSubject,
    })
    .eq("id", id);

  return NextResponse.json({ success: true, resend_id: result.id });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { verifyPortalApiAuth } from "@/lib/portal-auth";

const SendMessageSchema = z.object({
  subject: z.string().min(1).max(200).transform((s) => s.trim()),
  body: z.string().min(1).max(5000).transform((s) => s.trim()),
});

export async function POST(request: NextRequest) {
  try {
    const { patient, error: authError } = await verifyPortalApiAuth();
    if (authError || !patient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = SendMessageSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { subject, body: messageBody } = parsed.data;
    const supabase = createServiceSupabase();

    const { error } = await supabase
      .from("oe_outreach_messages")
      .insert({
        patient_id: patient.id,
        channel: "email",
        campaign_type: "custom",
        status: "delivered",
        subject: `[Portal] ${subject}`,
        body_preview: messageBody.substring(0, 200),
        sent_at: new Date().toISOString(),
        automated: false,
        ai_generated: false,
      });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

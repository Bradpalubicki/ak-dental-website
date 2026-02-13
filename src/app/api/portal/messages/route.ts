import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { verifyPortalApiAuth } from "@/lib/portal-auth";

export async function POST(request: NextRequest) {
  try {
    const { patient, error: authError } = await verifyPortalApiAuth();
    if (authError || !patient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, body: messageBody } = body;

    if (!subject?.trim() || !messageBody?.trim()) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    const supabase = createServiceSupabase();

    // Store as an outreach message (inbound from patient)
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

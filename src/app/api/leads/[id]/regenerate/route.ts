import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { generateLeadResponse } from "@/lib/services/ai";
import { tryAuth } from "@/lib/auth";

// POST /api/leads/[id]/regenerate - Re-run AI draft generation for a lead
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const supabase = createServiceSupabase();

    const { data: lead, error: leadError } = await supabase
      .from("oe_leads")
      .select("*")
      .eq("id", id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const aiResponse = await generateLeadResponse({
      patientName: `${lead.first_name} ${lead.last_name}`,
      inquiry: lead.inquiry_type || "General Inquiry",
      message: lead.message || "",
      source: lead.source,
      urgency: lead.urgency,
    });

    if (!aiResponse) {
      return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
    }

    await supabase
      .from("oe_leads")
      .update({ ai_response_draft: aiResponse.content, updated_at: new Date().toISOString() })
      .eq("id", id);

    await supabase.from("oe_ai_actions").insert({
      action_type: "lead_response_draft",
      module: "lead_response",
      description: `Regenerated response draft for ${lead.first_name} ${lead.last_name}`,
      input_data: { lead_id: id, inquiry_type: lead.inquiry_type, message: lead.message },
      output_data: { response: aiResponse.content, model: aiResponse.model },
      status: "pending_approval",
      lead_id: id,
      confidence_score: 0.85,
    });

    return NextResponse.json({ draft: aiResponse.content });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

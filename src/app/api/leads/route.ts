import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { generateLeadResponse } from "@/lib/services/ai";
import { sendEmail, leadResponseEmail } from "@/lib/services/resend";
import { sendSms } from "@/lib/services/twilio";

// GET /api/leads - List all leads
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceSupabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = supabase
      .from("oe_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ leads: data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/leads - Create a new lead (from website form, etc.)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServiceSupabase();

    const { first_name, last_name, email, phone, source, inquiry_type, message, urgency } = body;

    if (!first_name || !last_name) {
      return NextResponse.json({ error: "First and last name required" }, { status: 400 });
    }

    // Insert lead
    const { data: lead, error } = await supabase
      .from("oe_leads")
      .insert({
        first_name,
        last_name,
        email: email || null,
        phone: phone || null,
        source: source || "website",
        inquiry_type: inquiry_type || null,
        message: message || null,
        urgency: urgency || "medium",
        status: "new",
      })
      .select()
      .single();

    if (error) throw error;

    // Generate AI response draft
    const aiResponse = await generateLeadResponse({
      patientName: `${first_name} ${last_name}`,
      inquiry: inquiry_type || "General Inquiry",
      message: message || "",
      source: source || "website",
      urgency: urgency || "medium",
    });

    if (aiResponse) {
      await supabase
        .from("oe_leads")
        .update({ ai_response_draft: aiResponse.content })
        .eq("id", lead.id);

      // Log AI action
      await supabase.from("oe_ai_actions").insert({
        action_type: "lead_response_draft",
        module: "lead_response",
        description: `Drafted response for lead: ${first_name} ${last_name}`,
        input_data: { lead_id: lead.id, inquiry_type, message },
        output_data: { response: aiResponse.content, model: aiResponse.model },
        status: "pending_approval",
        lead_id: lead.id,
        confidence_score: 0.85,
      });
    }

    return NextResponse.json({ lead, ai_draft: aiResponse?.content || null }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { generateLeadResponse } from "@/lib/services/ai";
import { tryAuth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const CreateLeadSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email().max(254).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  source: z.string().max(100).default("website"),
  inquiry_type: z.string().max(100).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
  urgency: z.enum(["low", "medium", "high"]).default("medium"),
});

// GET /api/leads - List all leads (requires auth)
export async function GET(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const supabase = createServiceSupabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);

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

// POST /api/leads - Create a new lead (from website form — public, rate-limited)
export async function POST(req: NextRequest) {
  // Rate limit: 5 submissions per minute per IP
  const rl = rateLimit(req, { limit: 5, windowMs: 60_000, prefix: "leads" });
  if (!rl.allowed) return rl.response!;

  try {
    const parsed = CreateLeadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { first_name, last_name, email, phone, source, inquiry_type, message, urgency } = parsed.data;
    const supabase = createServiceSupabase();

    const { data: lead, error } = await supabase
      .from("oe_leads")
      .insert({ first_name, last_name, email: email ?? null, phone: phone ?? null, source, inquiry_type: inquiry_type ?? null, message: message ?? null, urgency, status: "new" })
      .select()
      .single();

    if (error) throw error;

    // Generate AI response draft
    const aiResponse = await generateLeadResponse({
      patientName: `${first_name} ${last_name}`,
      inquiry: inquiry_type || "General Inquiry",
      message: message || "",
      source,
      urgency,
    });

    if (aiResponse) {
      await supabase
        .from("oe_leads")
        .update({ ai_response_draft: aiResponse.content })
        .eq("id", lead.id);

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

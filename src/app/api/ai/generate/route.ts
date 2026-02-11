import { NextRequest, NextResponse } from "next/server";
import { generateLeadResponse, generateTreatmentSummary, generateDailyBriefing, classifyCallIntent } from "@/lib/services/ai";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

// POST /api/ai/generate - Generate AI content
export async function POST(req: NextRequest) {
  try {
    const authResult = await tryAuth();
    if (authResult instanceof NextResponse) return authResult;

    const body = await req.json();
    const { type, params } = body;

    let result;

    switch (type) {
      case "lead_response":
        result = await generateLeadResponse(params);
        break;
      case "treatment_summary":
        result = await generateTreatmentSummary(params);
        break;
      case "daily_briefing":
        result = await generateDailyBriefing(params);
        break;
      case "classify_call":
        result = await classifyCallIntent(params.transcription);
        break;
      default:
        return NextResponse.json({ error: "Unknown generation type" }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json(
        { error: "AI service not configured. Add ANTHROPIC_API_KEY to environment." },
        { status: 503 }
      );
    }

    // Log the AI action
    const supabase = createServiceSupabase();
    await supabase.from("oe_ai_actions").insert({
      action_type: `generate_${type}`,
      module: type === "lead_response" ? "lead_response" : type === "treatment_summary" ? "treatment_plans" : type === "daily_briefing" ? "analytics" : "calls",
      description: `Generated ${type.replace("_", " ")}`,
      input_data: params,
      output_data: { content: result.content, model: result.model, tokens: { input: result.inputTokens, output: result.outputTokens } },
      status: "executed",
      patient_id: params.patient_id || null,
      lead_id: params.lead_id || null,
    });

    return NextResponse.json({
      content: result.content,
      model: result.model,
      usage: {
        input_tokens: result.inputTokens,
        output_tokens: result.outputTokens,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

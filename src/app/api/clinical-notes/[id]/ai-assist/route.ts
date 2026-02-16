import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { logPhiAccess } from "@/lib/audit";
import Anthropic from "@anthropic-ai/sdk";

const anthropic =
  process.env.ANTHROPIC_API_KEY &&
  process.env.ANTHROPIC_API_KEY !== "PLACEHOLDER_ADD_ANTHROPIC_KEY"
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

// POST /api/clinical-notes/[id]/ai-assist - AI assistance for clinical notes
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceSupabase();

    if (!anthropic) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      );
    }

    // Get the note
    const { data: note } = await supabase
      .from("oe_clinical_notes")
      .select("*, patient:oe_patients(id, first_name, last_name, date_of_birth)")
      .eq("id", id)
      .single();

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const patient = note.patient as any;
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const patientName = patient
      ? `${patient.first_name} ${patient.last_name}`
      : "Unknown Patient";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are a clinical documentation assistant for AK Ultimate Dental, a dental practice in Las Vegas, NV.
You help providers with clinical note documentation by providing:
1. A concise clinical summary
2. Suggested CDT procedure codes based on the documentation
3. Treatment plan recommendations
4. Risk flags or clinical alerts

Respond in JSON format with the following structure:
{
  "summary": "Brief clinical summary of the visit",
  "coding_suggestions": [{"code": "D0120", "description": "Periodic oral evaluation", "rationale": "Why this code applies"}],
  "treatment_recommendations": ["Recommendation 1", "Recommendation 2"],
  "risk_flags": ["Any clinical concerns or follow-up needs"],
  "documentation_tips": ["Suggestions to improve the note documentation"]
}

Be accurate and clinically appropriate. Do not fabricate clinical findings.`,
      messages: [
        {
          role: "user",
          content: `Review and assist with this clinical note:

Patient: ${patientName}
Note Type: ${note.note_type}
Chief Complaint: ${note.chief_complaint || "Not specified"}

SOAP Note:
Subjective: ${note.subjective || "Not documented"}
Objective: ${note.objective || "Not documented"}
Assessment: ${note.assessment || "Not documented"}
Plan: ${note.plan || "Not documented"}

Teeth Involved: ${(note.tooth_numbers || []).join(", ") || "None specified"}
Procedure Codes Listed: ${(note.procedure_codes || []).join(", ") || "None listed"}
Medications: ${(note.medications || []).join(", ") || "None"}
Vitals: ${JSON.stringify(note.vitals || {})}

Please provide a clinical summary, coding suggestions, treatment recommendations, risk flags, and documentation tips.`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const aiText = textBlock?.text || "";

    // Parse AI response
    let aiSuggestions;
    let aiSummary = "";
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = aiText.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, aiText];
      const parsed = JSON.parse(jsonMatch[1] || aiText);
      aiSummary = parsed.summary || "";
      aiSuggestions = {
        coding_suggestions: parsed.coding_suggestions || [],
        treatment_recommendations: parsed.treatment_recommendations || [],
        risk_flags: parsed.risk_flags || [],
        documentation_tips: parsed.documentation_tips || [],
      };
    } catch {
      aiSummary = aiText;
      aiSuggestions = { raw_response: aiText };
    }

    // Update the note with AI suggestions
    const { data: updated, error } = await supabase
      .from("oe_clinical_notes")
      .update({
        ai_summary: aiSummary,
        ai_suggestions: aiSuggestions,
      })
      .eq("id", id)
      .select("*, patient:oe_patients(id, first_name, last_name)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logPhiAccess("clinical_notes.ai_assist", "clinical_note", id, {
      patientId: note.patient_id,
      model: response.model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    });

    return NextResponse.json({
      note: updated,
      ai_summary: aiSummary,
      ai_suggestions: aiSuggestions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI assist failed" },
      { status: 500 }
    );
  }
}

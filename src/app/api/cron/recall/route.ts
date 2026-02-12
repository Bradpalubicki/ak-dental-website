import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { generateLeadResponse } from "@/lib/services/ai";
import { verifyCronSecret } from "@/lib/cron-auth";

// GET /api/cron/recall - Find patients needing recall and generate outreach messages
// Runs weekly on Mondays at 10:00 AM UTC via Vercel Cron
export async function GET(req: NextRequest) {
  const auth = verifyCronSecret(req);
  if (!auth.valid) return auth.response!;

  try {
    const supabase = createServiceSupabase();

    // Find patients with last_visit > 6 months ago who are still active
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const cutoffDate = sixMonthsAgo.toISOString().split("T")[0];

    const { data: patients } = await supabase
      .from("oe_patients")
      .select("id, first_name, last_name, email, phone, last_visit")
      .eq("status", "active")
      .lt("last_visit", cutoffDate)
      .order("last_visit", { ascending: true })
      .limit(20);

    if (!patients || patients.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No patients need recall at this time",
        processed: 0,
      });
    }

    let processed = 0;
    let skipped = 0;

    for (const patient of patients) {
      // Check if we already sent a recall recently (within 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentOutreach } = await supabase
        .from("oe_outreach_messages")
        .select("id")
        .eq("patient_id", patient.id)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .limit(1);

      if (recentOutreach && recentOutreach.length > 0) {
        skipped++;
        continue;
      }

      // Generate recall message using AI
      const lastVisitDate = patient.last_visit
        ? new Date(patient.last_visit).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "a while";

      const aiResponse = await generateLeadResponse({
        patientName: `${patient.first_name} ${patient.last_name}`,
        inquiry: "Recall - Due for checkup",
        message: `Patient last visited in ${lastVisitDate}. They are overdue for their regular dental checkup and cleaning. Generate a warm, encouraging recall message.`,
        source: "recall_automation",
        urgency: "medium",
      });

      if (aiResponse) {
        // Create AI action for approval
        await supabase.from("oe_ai_actions").insert({
          action_type: "recall_message",
          module: "recall",
          description: `Recall message for ${patient.first_name} ${patient.last_name} (last visit: ${lastVisitDate})`,
          input_data: {
            patient_id: patient.id,
            patient_name: `${patient.first_name} ${patient.last_name}`,
            last_visit: patient.last_visit,
            email: patient.email,
            phone: patient.phone,
          },
          output_data: {
            response: aiResponse.content,
            model: aiResponse.model,
          },
          status: "pending_approval",
          patient_id: patient.id,
          confidence_score: 0.8,
        });

        processed++;
      }
    }

    // Log the cron execution
    await supabase.from("oe_ai_actions").insert({
      action_type: "recall_cron",
      module: "recall",
      description: `Weekly recall scan: ${processed} messages queued, ${skipped} skipped (recent outreach)`,
      output_data: {
        patients_found: patients.length,
        messages_queued: processed,
        skipped,
      },
      status: "executed",
    });

    return NextResponse.json({
      success: true,
      patients_found: patients.length,
      messages_queued: processed,
      skipped,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

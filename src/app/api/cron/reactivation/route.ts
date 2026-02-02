import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { enrollReactivationPatients, processReactivationSequences } from "@/lib/workflows/reactivation-engine";

// GET /api/cron/reactivation - Enroll patients + process reactivation sequences
// Runs daily at 15:00 UTC Mon-Fri via Vercel Cron
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Phase 1: Scan for patients needing reactivation and enroll them
    const enrollment = await enrollReactivationPatients();

    // Phase 2: Process due sequences (generate messages, queue for approval)
    const processing = await processReactivationSequences();

    // Log the cron execution
    const supabase = createServiceSupabase();
    await supabase.from("oe_ai_actions").insert({
      action_type: "reactivation_cron",
      module: "remarketing",
      description: `Reactivation cron: ${enrollment.recall} recall, ${enrollment.incomplete_treatment} treatment, ${enrollment.missed_appointment} missed, ${enrollment.lapsed} lapsed enrolled. ${processing.processed} messages queued.`,
      output_data: {
        enrollment,
        processing,
      },
      status: "executed",
    });

    return NextResponse.json({
      success: true,
      enrollment,
      processing,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

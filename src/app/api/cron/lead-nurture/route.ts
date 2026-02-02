import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { enrollNewLeads, processNurtureSequences } from "@/lib/workflows/lead-nurture-engine";

// GET /api/cron/lead-nurture - Enroll leads + process nurture sequences
// Runs every 2 hours Mon-Thu via Vercel Cron
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Phase 1: Enroll new leads into nurture sequences
    const enrollment = await enrollNewLeads();

    // Phase 2: Process due sequences (generate messages, queue for approval)
    const processing = await processNurtureSequences();

    // Log the cron execution
    const supabase = createServiceSupabase();
    await supabase.from("oe_ai_actions").insert({
      action_type: "lead_nurture_cron",
      module: "remarketing",
      description: `Lead nurture cron: ${enrollment.enrolled} enrolled, ${processing.processed} messages queued, ${processing.completed} completed`,
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

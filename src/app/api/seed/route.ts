import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { seedDemo } from "./modules/demo";
import { seedCalls } from "./modules/calls";
import { seedOutreach } from "./modules/outreach";
import { seedHr } from "./modules/hr";
import { seedTreatments } from "./modules/treatments";
import { seedProviders } from "./modules/providers";
import { seedDashboard } from "./modules/dashboard";
import { seedLicensing } from "./modules/licensing";

type SeedModule = "demo" | "calls" | "outreach" | "hr" | "treatments" | "providers" | "dashboard" | "licensing" | "all";

const SEED_MODULES: Record<string, (supabase: ReturnType<typeof createServiceSupabase>) => Promise<{ inserted: Record<string, number>; errors: string[] }>> = {
  demo: seedDemo,
  calls: seedCalls,
  outreach: seedOutreach,
  hr: seedHr,
  treatments: seedTreatments,
  providers: seedProviders,
  dashboard: seedDashboard,
  licensing: seedLicensing,
};

export async function POST(req: Request) {
  try {
    // Auth: require CRON_SECRET or valid Clerk admin session
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Try Clerk auth as fallback
      const { auth } = await import("@clerk/nextjs/server");
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json().catch(() => ({}));
    const module = (body.module || "all") as SeedModule;

    const supabase = createServiceSupabase();
    const results: Record<string, { inserted: Record<string, number>; errors: string[] }> = {};

    if (module === "all") {
      // Run in order: demo first (creates patients), then everything else
      const order: (keyof typeof SEED_MODULES)[] = [
        "demo", "treatments", "providers", "hr", "licensing", "dashboard", "calls", "outreach",
      ];
      for (const mod of order) {
        results[mod] = await SEED_MODULES[mod](supabase);
      }
    } else if (SEED_MODULES[module]) {
      results[module] = await SEED_MODULES[module](supabase);
    } else {
      return NextResponse.json(
        { error: `Invalid module: ${module}. Valid: ${Object.keys(SEED_MODULES).join(", ")}, all` },
        { status: 400 }
      );
    }

    // Summarize
    const totalInserted: Record<string, number> = {};
    const allErrors: string[] = [];
    for (const [mod, result] of Object.entries(results)) {
      for (const [table, count] of Object.entries(result.inserted)) {
        totalInserted[table] = (totalInserted[table] || 0) + count;
      }
      allErrors.push(...result.errors.map((e) => `[${mod}] ${e}`));
    }

    return NextResponse.json({
      success: allErrors.length === 0,
      module,
      inserted: totalInserted,
      errors: allErrors,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Seed failed" },
      { status: 500 }
    );
  }
}

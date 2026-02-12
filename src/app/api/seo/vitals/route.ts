import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Web Vitals Collection Endpoint
 *
 * POST /api/seo/vitals — Receives CWV metrics from client-side beacon.
 * No auth required (client-side beacon). Rate limiting handled by Vercel.
 * Stores in seo_web_vitals Supabase table.
 */

interface VitalMetric {
  name: string;
  value: number;
  id: string;
  page: string;
  timestamp: number;
}

export async function POST(request: Request) {
  try {
    const metric: VitalMetric = await request.json();

    if (!metric.name || typeof metric.value !== "number") {
      return NextResponse.json({ error: "Invalid metric" }, { status: 400 });
    }

    // Store in Supabase
    try {
      const supabase = await createServerSupabase();
      await supabase.from("seo_web_vitals").insert({
        metric_name: metric.name,
        metric_value: metric.value,
        metric_id: metric.id,
        page: metric.page,
      });
    } catch {
      // Table may not exist yet — log as fallback
      console.log(
        `[WebVital] ${metric.name}: ${metric.value.toFixed(2)} (${metric.page})`
      );
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

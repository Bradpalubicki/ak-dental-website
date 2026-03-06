import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/media/[id]
export async function GET(_req: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const { id } = await context.params;
  const supabase = createServiceSupabase();
  const { data, error } = await supabase.from("media_assets").select("*").eq("id", id).single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

const PatchSchema = z.object({
  placement: z.string().optional(),
  caption: z.string().optional(),
  sort_order: z.number().optional(),
  is_featured: z.boolean().optional(),
  photo_type: z.string().optional(),
  service_category: z.string().optional(),
  before_or_after: z.string().optional(),
  case_notes: z.string().optional(),
  consent_confirmed: z.boolean().optional(),
  consent_type: z.string().optional(),
  // Writable story fields — client-edited or AI-approved drafts
  story_headline: z.string().max(200).optional(),
  story_body: z.string().max(2000).optional(),
  story_caption: z.string().max(500).optional(),
  story_treatment_summary: z.string().max(500).optional(),
});

// PATCH /api/media/[id]
export async function PATCH(req: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const { id } = await context.params;
  const body = PatchSchema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  }

  const updates: Record<string, unknown> = { ...body.data };

  if (body.data.consent_confirmed) {
    updates.consent_confirmed_by = auth.userId;
    updates.consent_confirmed_at = new Date().toISOString();
  }

  const supabase = createServiceSupabase();
  const { error } = await supabase.from("media_assets").update(updates).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

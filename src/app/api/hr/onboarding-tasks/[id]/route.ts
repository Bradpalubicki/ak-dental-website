import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

const UpdateSchema = z.object({
  status: z.enum(["pending", "completed", "skipped", "na"]),
  notes:  z.string().max(2000).optional().nullable(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });

  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "completed") {
    updates.completed_at = new Date().toISOString();
    updates.completed_by = authResult.userId;
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("oe_onboarding_tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

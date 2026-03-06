import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

const PatchLeadSchema = z.object({
  status: z
    .enum(["new", "contacted", "qualified", "appointment_booked", "converted", "lost"])
    .optional(),
  notes: z.string().max(5000).optional().nullable(),
  assigned_to: z.string().max(255).optional().nullable(),
  urgency: z.enum(["low", "medium", "high", "emergency"]).optional(),
});

// PATCH /api/leads/[id] - Update lead status, notes, urgency, assigned_to
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const parsed = PatchLeadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const supabase = createServiceSupabase();

    const { data, error } = await supabase
      .from("oe_leads")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead: data });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

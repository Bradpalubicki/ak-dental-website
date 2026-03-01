import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

const patchSchema = z.object({
  title: z.string().min(2).optional(),
  employment_type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACTOR", "TEMPORARY", "INTERN"]).optional(),
  department: z.enum(["Clinical", "Administrative", "Management"]).optional(),
  description: z.string().min(10).optional(),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  nice_to_have: z.string().optional(),
  tags: z.array(z.string()).optional(),
  salary_min: z.number().int().optional(),
  salary_max: z.number().int().optional(),
  remote_possible: z.boolean().optional(),
  status: z.enum(["draft", "active", "paused", "filled", "archived"]).optional(),
  apply_email: z.string().email().optional(),
  apply_url: z.string().url().optional(),
  expires_at: z.string().optional(),
}).strict();

/** PATCH /api/hr/jobs/[id] — update a job posting */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createServiceSupabase();
  const updates: Record<string, unknown> = { ...parsed.data };

  // Auto-set posted_at when activating
  if (parsed.data.status === "active") {
    const { data: existing } = await supabase
      .from("oe_job_postings")
      .select("posted_at")
      .eq("id", id)
      .single();
    if (!existing?.posted_at) updates.posted_at = new Date().toISOString();
  }
  if (parsed.data.status === "filled") {
    updates.filled_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("oe_job_postings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** DELETE /api/hr/jobs/[id] — archive a job posting */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { error } = await supabase
    .from("oe_job_postings")
    .update({ status: "archived" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

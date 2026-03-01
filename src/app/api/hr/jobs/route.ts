import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  employment_type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACTOR", "TEMPORARY", "INTERN"]).default("FULL_TIME"),
  department: z.enum(["Clinical", "Administrative", "Management"]).default("Clinical"),
  description: z.string().min(10),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  nice_to_have: z.string().optional(),
  tags: z.array(z.string()).default([]),
  salary_min: z.number().int().optional(),
  salary_max: z.number().int().optional(),
  salary_unit: z.enum(["HOUR", "DAY", "WEEK", "MONTH", "YEAR"]).default("YEAR"),
  remote_possible: z.boolean().default(false),
  status: z.enum(["draft", "active", "paused"]).default("draft"),
  apply_email: z.string().email().optional(),
  apply_url: z.string().url().optional(),
  expires_at: z.string().optional(),
});

/** GET /api/hr/jobs — returns all postings (admin) or active only (public via ?public=1) */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isPublic = searchParams.get("public") === "1";

  const supabase = createServiceSupabase();

  let query = supabase
    .from("oe_job_postings")
    .select("*")
    .order("posted_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (isPublic) {
    query = query.eq("status", "active");
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

/** POST /api/hr/jobs — create a new job posting */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const supabase = createServiceSupabase();

  const { data: job, error } = await supabase
    .from("oe_job_postings")
    .insert({
      ...data,
      created_by: userId,
      posted_at: data.status === "active" ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "A job with that slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(job, { status: 201 });
}

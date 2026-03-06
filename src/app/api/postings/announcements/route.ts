import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

const PRACTICE_ID = "ak-ultimate-dental";

const AnnouncementSchema = z.object({
  message: z.string().min(1).max(280),
  link_label: z.string().max(60).optional(),
  link_href: z.string().max(200).optional(),
  style: z.enum(["info", "warning", "success", "urgent"]).default("info"),
  starts_at: z.string().datetime().optional(),
  expires_at: z.string().datetime().nullable().optional(),
});

export async function GET() {
  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("practice_announcements")
    .select("*")
    .eq("practice_id", PRACTICE_ID)
    .neq("status", "archived")
    .order("created_at", { ascending: false });
  return NextResponse.json({ announcements: data ?? [] });
}

export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const body = AnnouncementSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("practice_announcements")
    .insert({ ...body.data, practice_id: PRACTICE_ID, created_by: auth.userId! })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ announcement: data });
}

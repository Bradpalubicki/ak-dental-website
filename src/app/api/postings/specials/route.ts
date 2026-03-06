import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

const PRACTICE_ID = "ak-ultimate-dental";

const SpecialSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  fine_print: z.string().max(300).optional(),
  cta_label: z.string().max(60).default("Claim This Offer"),
  cta_href: z.string().max(200).default("/appointment"),
  badge_text: z.string().max(40).optional(),
  discount_type: z.enum(["percent", "fixed", "free", "custom"]).optional(),
  discount_value: z.number().min(0).max(100000).optional(),
  discount_display: z.string().max(60).optional(),
  starts_at: z.string().datetime().optional(),
  expires_at: z.string().datetime().nullable().optional(),
  is_featured: z.boolean().default(false),
});

export async function GET() {
  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("practice_specials")
    .select("*")
    .eq("practice_id", PRACTICE_ID)
    .neq("status", "archived")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return NextResponse.json({ specials: data ?? [] });
}

export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const body = SpecialSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("practice_specials")
    .insert({ ...body.data, practice_id: PRACTICE_ID, created_by: auth.userId! })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ special: data });
}

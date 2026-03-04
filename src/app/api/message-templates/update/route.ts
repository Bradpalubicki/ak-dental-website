import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  type: z.string(),
  body: z.string().min(1),
  subject: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const supabase = createServiceSupabase();

  // Get the current body to store as edited_from
  const { data: current } = await supabase
    .from("oe_message_templates")
    .select("body")
    .eq("type", body.data.type)
    .single();

  const { error } = await supabase
    .from("oe_message_templates")
    .update({
      body: body.data.body,
      subject: body.data.subject,
      approved: false,
      approved_at: null,
      approved_by: null,
      edited_from: current?.body || null,
      updated_at: new Date().toISOString(),
    })
    .eq("type", body.data.type);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

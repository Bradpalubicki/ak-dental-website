import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({ type: z.string() });

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const supabase = createServiceSupabase();
  const { error } = await supabase
    .from("oe_message_templates")
    .update({
      approved: true,
      approved_at: new Date().toISOString(),
      approved_by: userId,
    })
    .eq("type", body.data.type);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

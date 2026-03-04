import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceSupabase();
  const { error } = await supabase
    .from("oe_message_templates")
    .update({
      approved: true,
      approved_at: new Date().toISOString(),
      approved_by: userId,
    })
    .eq("approved", false);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

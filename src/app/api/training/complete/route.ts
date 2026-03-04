import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  module: z.string(),
  score: z.number().int().min(0),
  passed: z.boolean(),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress || "";
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const role = (user.publicMetadata as Record<string, string>)?.role || "";

  const supabase = createServiceSupabase();

  // Upsert — one record per user per module (latest wins)
  const { error } = await supabase
    .from("oe_training_completions")
    .upsert(
      {
        user_id: userId,
        user_email: email,
        user_name: name,
        role,
        module: body.data.module,
        score: body.data.score,
        passed: body.data.passed,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,module" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update Clerk metadata for quick reference
  if (body.data.passed) {
    const metaKey = `${body.data.module}_trained_at`;
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...((user.publicMetadata as Record<string, unknown>) || {}),
        [metaKey]: new Date().toISOString(),
      },
    });
  }

  return NextResponse.json({ success: true });
}

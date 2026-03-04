import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  enabled: z.boolean(),
  testPhone: z.string().optional(),
  testEmail: z.string().email().optional().or(z.literal("")),
});

export async function GET() {
  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("oe_settings")
    .select("key, value")
    .in("key", ["test_mode", "test_phone", "test_email"]);

  const map: Record<string, string> = {};
  for (const row of data || []) map[row.key] = row.value || "";

  return NextResponse.json({
    enabled: map.test_mode === "true",
    testPhone: map.test_phone || "",
    testEmail: map.test_email || "",
  });
}

export async function POST(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const level = (sessionClaims?.publicMetadata as Record<string, string>)?.authorityLevel;
  if (!["admin", "global_admin"].includes(level)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const supabase = createServiceSupabase();
  const now = new Date().toISOString();

  await Promise.all([
    supabase.from("oe_settings").upsert({ key: "test_mode", value: String(body.data.enabled), updated_at: now, updated_by: userId }, { onConflict: "key" }),
    body.data.testPhone !== undefined
      ? supabase.from("oe_settings").upsert({ key: "test_phone", value: body.data.testPhone, updated_at: now, updated_by: userId }, { onConflict: "key" })
      : Promise.resolve(),
    body.data.testEmail !== undefined
      ? supabase.from("oe_settings").upsert({ key: "test_email", value: body.data.testEmail, updated_at: now, updated_by: userId }, { onConflict: "key" })
      : Promise.resolve(),
  ]);

  return NextResponse.json({ success: true });
}

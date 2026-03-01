import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

// GET /api/notifications — fetch recent notifications + unread count
export async function GET() {
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("oe_notifications")
    .select("id, created_at, type, title, body, link, read, actor")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const unread = (data || []).filter((n) => !n.read).length;
  return NextResponse.json({ notifications: data || [], unread });
}

// PATCH /api/notifications — mark one or all as read
export async function PATCH(req: NextRequest) {
  const supabase = createServiceSupabase();
  const { id, markAll } = await req.json() as { id?: string; markAll?: boolean };

  if (markAll) {
    const { error } = await supabase
      .from("oe_notifications")
      .update({ read: true, read_at: new Date().toISOString() })
      .eq("read", false);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase
    .from("oe_notifications")
    .update({ read: true, read_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

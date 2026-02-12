import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/api-auth";

export async function GET() {
  const check = await requirePermission("settings.view");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("oe_user_roles")
    .select("*, oe_roles(name, display_name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[RBAC] Failed to fetch users:", error.message);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const check = await requirePermission("settings.admin");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();
  const body = await req.json();

  const { clerk_user_id, role_id } = body;

  if (!clerk_user_id || !role_id) {
    return NextResponse.json(
      { error: "clerk_user_id and role_id are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("oe_user_roles")
    .upsert(
      {
        clerk_user_id,
        role_id,
        assigned_by: check.userId,
      },
      { onConflict: "clerk_user_id" }
    )
    .select("*, oe_roles(name, display_name)")
    .single();

  if (error) {
    console.error("[RBAC] Failed to assign role:", error.message);
    return NextResponse.json({ error: "Failed to assign role" }, { status: 500 });
  }

  return NextResponse.json(data);
}

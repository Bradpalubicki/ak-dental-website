import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/api-auth";

export async function GET() {
  const check = await requirePermission("settings.view");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("oe_roles")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[RBAC] Failed to fetch roles:", error.message);
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }

  return NextResponse.json(data);
}

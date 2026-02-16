import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const params = req.nextUrl.searchParams;

  const page = parseInt(params.get("page") || "1");
  const limit = Math.min(parseInt(params.get("limit") || "50"), 100);
  const offset = (page - 1) * limit;

  let query = supabase
    .from("audit_log")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // Filters
  const userId = params.get("user_id");
  if (userId) query = query.eq("user_id", userId);

  const action = params.get("action");
  if (action) query = query.eq("action", action);

  const resourceType = params.get("resource_type");
  if (resourceType) query = query.eq("resource_type", resourceType);

  const phiOnly = params.get("phi_only");
  if (phiOnly === "true") query = query.eq("phi_accessed", true);

  const startDate = params.get("start_date");
  if (startDate) query = query.gte("created_at", startDate);

  const endDate = params.get("end_date");
  if (endDate) query = query.lte("created_at", endDate);

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

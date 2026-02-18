import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const employeeId = req.nextUrl.searchParams.get("employee_id");
  const type = req.nextUrl.searchParams.get("type");
  const showDeleted = req.nextUrl.searchParams.get("deleted") === "true";

  let query = supabase
    .from("oe_hr_documents")
    .select("*, employee:oe_employees(first_name, last_name)")
    .order("created_at", { ascending: false });

  if (showDeleted) {
    // Show only soft-deleted documents from the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    query = query.not("deleted_at", "is", null).gte("deleted_at", thirtyDaysAgo);
  } else {
    // Default: filter out soft-deleted documents
    query = query.is("deleted_at", null);
  }

  if (employeeId) query = query.eq("employee_id", employeeId);
  if (type) query = query.eq("type", type);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();
  const body = await req.json();

  const { data, error } = await supabase
    .from("oe_hr_documents")
    .insert({
      employee_id: body.employee_id,
      type: body.type,
      title: body.title,
      content: body.content,
      severity: body.severity || null,
      status: body.status || "draft",
      created_by: body.created_by || "Dr. Alex Khachaturian",
      metadata: body.metadata || {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("oe_hr_documents")
    .select(
      "*, employee:oe_employees(*), acknowledgments:oe_document_acknowledgments(*)"
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  if (body.status !== undefined) updates.status = body.status;
  if (body.title !== undefined) updates.title = body.title;
  if (body.content !== undefined) updates.content = body.content;
  if (body.severity !== undefined) updates.severity = body.severity;

  const { data, error } = await supabase
    .from("oe_hr_documents")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Soft delete — sets deleted_at timestamp, data retained for 30 days
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("oe_hr_documents")
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: authResult.userName || authResult.userId,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Document moved to trash", data });
}

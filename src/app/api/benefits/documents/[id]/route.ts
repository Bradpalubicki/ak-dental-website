import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/api-auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await requirePermission("benefits.view");
  if (!check.allowed) return check.response!;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data: doc, error } = await supabase
    .from("oe_policy_documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(doc.storage_bucket)
    .createSignedUrl(doc.storage_path, 3600);

  if (signedUrlError) {
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });
  }

  return NextResponse.json({ ...doc, signedUrl: signedUrlData.signedUrl });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await requirePermission("benefits.delete");
  if (!check.allowed) return check.response!;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data: doc, error: fetchError } = await supabase
    .from("oe_policy_documents")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const { error: storageError } = await supabase.storage
    .from(doc.storage_bucket)
    .remove([doc.storage_path]);

  if (storageError) {
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }

  const { error: deleteError } = await supabase
    .from("oe_policy_documents")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

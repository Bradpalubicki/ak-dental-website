import { NextResponse } from "next/server";
import { tryAuth } from "@/lib/auth";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data: doc, error } = await supabase
    .from("oe_documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Generate a signed URL for download
  const { data: urlData, error: urlError } = await supabase.storage
    .from("documents")
    .createSignedUrl(doc.storage_path, 3600); // 1 hour expiry

  if (urlError) {
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });
  }

  return NextResponse.json({ ...doc, download_url: urlData.signedUrl });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const supabase = createServiceSupabase();

  // Soft delete — mark as deleted
  const { error } = await supabase
    .from("oe_documents")
    .update({ status: "deleted", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

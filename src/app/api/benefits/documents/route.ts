import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/api-auth";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]);

export async function GET(req: NextRequest) {
  const check = await requirePermission("benefits.view");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();
  const policyId = req.nextUrl.searchParams.get("policy_id");
  const enrollmentId = req.nextUrl.searchParams.get("enrollment_id");

  let query = supabase
    .from("oe_policy_documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (policyId) {
    query = query.eq("policy_id", policyId);
  }
  if (enrollmentId) {
    query = query.eq("enrollment_id", enrollmentId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const check = await requirePermission("benefits.edit");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();
  const formData = await req.formData();

  const file = formData.get("file") as File | null;
  const policyId = formData.get("policy_id") as string | null;
  const enrollmentId = formData.get("enrollment_id") as string | null;
  const documentType = formData.get("document_type") as string | null;
  const notes = formData.get("notes") as string | null;

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 });
  }

  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: `File extension ${ext} not allowed. Accepted: PDF, DOC, DOCX, JPG, PNG` },
      { status: 400 }
    );
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: `File type ${file.type} not allowed. Accepted: PDF, DOC, DOCX, JPG, PNG` },
      { status: 400 }
    );
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `policies/${policyId || "general"}/${Date.now()}_${sanitizedName}`;

  const { error: uploadError } = await supabase.storage
    .from("policy-documents")
    .upload(storagePath, file);

  if (uploadError) {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("oe_policy_documents")
    .insert({
      policy_id: policyId || null,
      enrollment_id: enrollmentId || null,
      document_type: documentType || null,
      file_name: sanitizedName,
      storage_bucket: "policy-documents",
      storage_path: storagePath,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to save document record" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

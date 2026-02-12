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
const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function GET(req: NextRequest) {
  const check = await requirePermission("hr.view");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();
  const employeeId = req.nextUrl.searchParams.get("employee_id");
  const hrDocumentId = req.nextUrl.searchParams.get("hr_document_id");
  const certificationId = req.nextUrl.searchParams.get("certification_id");

  let query = supabase
    .from("oe_hr_document_attachments")
    .select("*")
    .order("created_at", { ascending: false });

  if (employeeId) query = query.eq("employee_id", employeeId);
  if (hrDocumentId) query = query.eq("hr_document_id", hrDocumentId);
  if (certificationId) query = query.eq("certification_id", certificationId);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch attachments" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const check = await requirePermission("hr.edit");
  if (!check.allowed) return check.response!;

  const supabase = createServiceSupabase();
  const formData = await req.formData();

  const file = formData.get("file") as File | null;
  const employeeId = formData.get("employee_id") as string | null;
  const hrDocumentId = formData.get("hr_document_id") as string | null;
  const certificationId = formData.get("certification_id") as string | null;
  const documentCategory = formData.get("document_category") as string | null;
  const notes = formData.get("notes") as string | null;

  if (!file || !employeeId) {
    return NextResponse.json(
      { error: "File and employee_id are required" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: `File type ${file.type} not allowed. Accepted: PDF, DOC, DOCX, JPG, PNG` },
      { status: 400 }
    );
  }

  const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json({ error: "Invalid file extension" }, { status: 400 });
  }

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `employees/${employeeId}/${Date.now()}_${sanitizedName}`;

  const { error: uploadError } = await supabase.storage
    .from("hr-documents")
    .upload(storagePath, file);

  if (uploadError) {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("oe_hr_document_attachments")
    .insert({
      employee_id: employeeId,
      hr_document_id: hrDocumentId || null,
      certification_id: certificationId || null,
      document_category: documentCategory || "general",
      file_name: sanitizedName,
      file_size: file.size,
      mime_type: file.type,
      storage_path: storagePath,
      storage_bucket: "hr-documents",
      uploaded_by: check.userId || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to save attachment record" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

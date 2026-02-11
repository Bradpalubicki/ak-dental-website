import { NextResponse } from "next/server";
import { tryAuth } from "@/lib/auth";
import { createServiceSupabase } from "@/lib/supabase/server";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const entityType = formData.get("entityType") as string;
    const entityId = formData.get("entityId") as string | null;
    const description = formData.get("description") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!entityType) {
      return NextResponse.json({ error: "entityType required" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed: ${file.type}. Allowed: PDF, JPEG, PNG, WebP, Word` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    const supabase = createServiceSupabase();

    // Generate storage path
    const fileExt = file.name.split(".").pop() || "bin";
    const storagePath = `${entityType}/${crypto.randomUUID()}.${fileExt}`;

    // Upload to Supabase Storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Create metadata record
    const { data: doc, error: dbError } = await supabase
      .from("oe_documents")
      .insert({
        entity_type: entityType,
        entity_id: entityId || null,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: storagePath,
        uploaded_by: authResult.userId,
        uploaded_by_name: authResult.userName,
        description: description || null,
      })
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file if DB insert fails
      await supabase.storage.from("documents").remove([storagePath]);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // If this is a license document, update the license record
    if (entityType === "license" && entityId) {
      await supabase
        .from("oe_licenses")
        .update({ document_url: storagePath, document_name: file.name })
        .eq("id", entityId);
    }

    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

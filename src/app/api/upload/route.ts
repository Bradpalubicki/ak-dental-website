import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { tryAuth } from "@/lib/auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

const ALLOWED_FOLDERS = [
  "licenses",
  "insurance-policies",
  "hr-documents",
  "patient-docs",
  "general",
] as const;

export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "general";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES[file.type]) {
    return NextResponse.json(
      { error: `File type not allowed: ${file.type}. Allowed: PDF, JPEG, PNG, WebP, DOCX` },
      { status: 400 }
    );
  }

  if (!ALLOWED_FOLDERS.includes(folder as typeof ALLOWED_FOLDERS[number])) {
    return NextResponse.json(
      { error: `Invalid folder: ${folder}` },
      { status: 400 }
    );
  }

  const supabase = createServiceSupabase();

  // Generate unique filename
  const ext = file.name.split(".").pop() || "bin";
  const timestamp = Date.now();
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 50);
  const path = `${folder}/${timestamp}_${safeName}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { data, error } = await supabase.storage
    .from("documents")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    // If bucket doesn't exist, return helpful error
    if (error.message?.includes("not found") || error.message?.includes("Bucket")) {
      return NextResponse.json(
        { error: "Storage bucket 'documents' not configured. Create it in Supabase dashboard." },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("documents")
    .getPublicUrl(data.path);

  return NextResponse.json({
    path: data.path,
    url: urlData.publicUrl,
    name: file.name,
    size: file.size,
    type: file.type,
  });
}

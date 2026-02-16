import { NextRequest, NextResponse } from "next/server";
import { tryAuth } from "@/lib/auth";
import {
  getDocuments,
  uploadDocument,
} from "@/lib/services/documents";

export async function GET(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category") || undefined;
  const patient_id = searchParams.get("patient_id") || undefined;
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;
  const entityType = searchParams.get("entityType");
  const entityId = searchParams.get("entityId");

  // Support legacy entity-based queries
  if (entityType) {
    const { createServiceSupabase } = await import("@/lib/supabase/server");
    const supabase = createServiceSupabase();

    let query = supabase
      .from("oe_documents")
      .select("*")
      .eq("entity_type", entityType)
      .not("status", "in", '("deleted")')
      .order("created_at", { ascending: false });

    if (entityId) {
      query = query.eq("entity_id", entityId);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  const { data, error } = await getDocuments({
    category,
    patient_id,
    status,
    search,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];
    const patientId = formData.get("patientId") as string | null;
    const category = formData.get("category") as string | null;
    const description = formData.get("description") as string | null;
    const tags = formData.get("tags") as string | null;
    const notes = formData.get("notes") as string | null;
    const entityType = formData.get("entityType") as string | null;
    const entityId = formData.get("entityId") as string | null;

    if (files.length === 0) {
      // Try single file param
      const singleFile = formData.get("file") as File | null;
      if (!singleFile) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }
      files.push(singleFile);
    }

    const results = [];
    const errors = [];

    for (const file of files) {
      const { data, error } = await uploadDocument(
        file,
        authResult.userId,
        authResult.userName,
        {
          entityType: entityType || "dropbox",
          entityId: entityId || undefined,
          patientId: patientId || undefined,
          category: (category as import("@/types/database").DocumentCategory) || undefined,
          description: description || undefined,
          tags: tags ? tags.split(",").map((t) => t.trim()) : undefined,
          notes: notes || undefined,
        }
      );

      if (error) {
        errors.push({ fileName: file.name, error });
      } else if (data) {
        results.push(data);
      }
    }

    if (results.length === 0 && errors.length > 0) {
      return NextResponse.json({ error: errors[0].error, errors }, { status: 400 });
    }

    return NextResponse.json(
      { documents: results, errors: errors.length > 0 ? errors : undefined },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: `Upload failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 500 }
    );
  }
}

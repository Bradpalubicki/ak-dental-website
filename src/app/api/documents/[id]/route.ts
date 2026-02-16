import { NextRequest, NextResponse } from "next/server";
import { tryAuth } from "@/lib/auth";
import {
  getDocument,
  updateDocument,
  archiveDocument,
} from "@/lib/services/documents";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const { data, error } = await getDocument(id);

  if (error || !data) {
    return NextResponse.json(
      { error: error || "Document not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.category !== undefined) updates.category = body.category;
  if (body.subcategory !== undefined) updates.subcategory = body.subcategory;
  if (body.patient_id !== undefined) updates.patient_id = body.patient_id;
  if (body.tags !== undefined) updates.tags = body.tags;
  if (body.notes !== undefined) updates.notes = body.notes;
  if (body.status !== undefined) updates.status = body.status;
  if (body.description !== undefined) updates.description = body.description;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid update fields provided" },
      { status: 400 }
    );
  }

  const { data, error } = await updateDocument(id, updates);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const { success, error } = await archiveDocument(id);

  if (!success) {
    return NextResponse.json(
      { error: error || "Failed to archive document" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

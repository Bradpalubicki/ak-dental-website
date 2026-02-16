import { NextRequest, NextResponse } from "next/server";
import { tryAuth } from "@/lib/auth";
import { processDocument } from "@/lib/services/documents";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const { data, error } = await processDocument(id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}

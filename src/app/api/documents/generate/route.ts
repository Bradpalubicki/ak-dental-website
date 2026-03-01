import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { generateMPA, generateTSA, generateNevadaAddendum, generateSubBA } from "@/lib/documents/generators";

const GENERATORS: Record<string, () => Promise<Buffer>> = {
  "DEP-2026-001": generateMPA,
  "DEP-2026-001-TSA": generateTSA,
  "DEP-2026-001-NV": generateNevadaAddendum,
  "NUSTACK-INTERNAL-SUB-BA-001": generateSubBA,
};

const FILE_NAMES: Record<string, string> = {
  "DEP-2026-001": "DEP-2026-001_Master-Platform-Agreement-BAA.pdf",
  "DEP-2026-001-TSA": "DEP-2026-001-TSA_Technology-Services-Authorization.pdf",
  "DEP-2026-001-NV": "DEP-2026-001-NV_Nevada-SB370-Processing-Addendum.pdf",
  "NUSTACK-INTERNAL-SUB-BA-001": "NUSTACK-INTERNAL-SUB-BA-001_Sub-BA-Agreement.pdf",
};

export async function GET(req: NextRequest) {
  const agreementNumber = req.nextUrl.searchParams.get("agreement");

  if (!agreementNumber) {
    return NextResponse.json({ error: "Missing agreement parameter" }, { status: 400 });
  }

  const generator = GENERATORS[agreementNumber];
  if (!generator) {
    return NextResponse.json({ error: "Unknown agreement number" }, { status: 404 });
  }

  // Verify the document exists in DB
  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("de_legal_documents")
    .select("id, status")
    .eq("agreement_number", agreementNumber)
    .is("deleted_at", null)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  try {
    const pdfBuffer = await generator();
    const fileName = FILE_NAMES[agreementNumber];

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 });
  }
}

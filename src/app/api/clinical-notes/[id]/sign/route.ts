import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { logPhiAccess } from "@/lib/audit";
import { auth } from "@clerk/nextjs/server";

// POST /api/clinical-notes/[id]/sign - Sign a clinical note
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceSupabase();
    const { userId } = await auth();
    const body = await req.json().catch(() => ({}));
    const signerName = body.signer_name || "Unknown Provider";

    // Check if note exists and is not already signed
    const { data: existing } = await supabase
      .from("oe_clinical_notes")
      .select("id, is_signed, status")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (existing.is_signed) {
      return NextResponse.json(
        { error: "Note is already signed" },
        { status: 400 }
      );
    }

    // Sign the note
    const { data, error } = await supabase
      .from("oe_clinical_notes")
      .update({
        is_signed: true,
        signed_at: new Date().toISOString(),
        signed_by: userId || signerName,
        status: "signed",
      })
      .eq("id", id)
      .select("*, patient:oe_patients(id, first_name, last_name)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logPhiAccess("clinical_notes.sign", "clinical_note", id, {
      signedBy: userId || signerName,
      patientId: data.patient_id,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sign note" },
      { status: 500 }
    );
  }
}

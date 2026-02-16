import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { logPhiAccess } from "@/lib/audit";

// GET /api/clinical-notes/[id] - Get single note
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceSupabase();

    const { data, error } = await supabase
      .from("oe_clinical_notes")
      .select("*, patient:oe_patients(id, first_name, last_name, email, phone, date_of_birth, insurance_provider)")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await logPhiAccess("clinical_notes.read", "clinical_note", id, {
      patientId: data.patient_id,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch note" },
      { status: 500 }
    );
  }
}

// PATCH /api/clinical-notes/[id] - Update note
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceSupabase();
    const body = await req.json();

    // Check if note is signed (read-only)
    const { data: existing } = await supabase
      .from("oe_clinical_notes")
      .select("is_signed, status")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (existing.is_signed) {
      return NextResponse.json(
        { error: "Signed notes cannot be modified. Create an amendment instead." },
        { status: 403 }
      );
    }

    // Only allow specific fields to be updated
    const allowedFields = [
      "chief_complaint",
      "subjective",
      "objective",
      "assessment",
      "plan",
      "tooth_numbers",
      "procedure_codes",
      "medications",
      "vitals",
      "note_type",
      "provider_name",
      "status",
      "appointment_id",
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("oe_clinical_notes")
      .update(updates)
      .eq("id", id)
      .select("*, patient:oe_patients(id, first_name, last_name)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logPhiAccess("clinical_notes.update", "clinical_note", id, {
      fieldsUpdated: Object.keys(updates),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update note" },
      { status: 500 }
    );
  }
}

// DELETE /api/clinical-notes/[id] - Delete note (draft only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceSupabase();

    // Only allow deletion of draft notes
    const { data: existing } = await supabase
      .from("oe_clinical_notes")
      .select("status, is_signed")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (existing.status !== "draft") {
      return NextResponse.json(
        { error: "Only draft notes can be deleted" },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("oe_clinical_notes")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logPhiAccess("clinical_notes.delete", "clinical_note", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete note" },
      { status: 500 }
    );
  }
}

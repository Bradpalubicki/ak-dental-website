import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { logPhiAccess } from "@/lib/audit";
import { auth } from "@clerk/nextjs/server";

// GET /api/clinical-notes - List notes with filters
export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceSupabase();
    const { searchParams } = new URL(req.url);

    const patientId = searchParams.get("patient_id");
    const providerId = searchParams.get("provider_id");
    const noteType = searchParams.get("note_type");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("oe_clinical_notes")
      .select("*, patient:oe_patients(id, first_name, last_name)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (patientId) query = query.eq("patient_id", patientId);
    if (providerId) query = query.eq("provider_id", providerId);
    if (noteType) query = query.eq("note_type", noteType);
    if (status) query = query.eq("status", status);
    if (dateFrom) query = query.gte("created_at", dateFrom);
    if (dateTo) query = query.lte("created_at", dateTo);
    if (search) {
      query = query.or(
        `chief_complaint.ilike.%${search}%,subjective.ilike.%${search}%,objective.ilike.%${search}%,assessment.ilike.%${search}%,plan.ilike.%${search}%,provider_name.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logPhiAccess("clinical_notes.list", "clinical_note", undefined, {
      filters: { patientId, providerId, noteType, status },
      resultCount: data?.length || 0,
    });

    return NextResponse.json({ data, count });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST /api/clinical-notes - Create new note
export async function POST(req: NextRequest) {
  try {
    const supabase = createServiceSupabase();
    const body = await req.json();
    const { userId } = await auth();

    const {
      patient_id,
      appointment_id,
      provider_name,
      note_type = "progress",
      chief_complaint,
      subjective,
      objective,
      assessment,
      plan,
      tooth_numbers,
      procedure_codes,
      medications,
      vitals,
      status = "draft",
      template_id,
    } = body;

    if (!patient_id || !provider_name) {
      return NextResponse.json(
        { error: "patient_id and provider_name are required" },
        { status: 400 }
      );
    }

    // If template_id provided, load template data as defaults
    let templateDefaults: Record<string, unknown> = {};
    if (template_id) {
      const { data: template } = await supabase
        .from("oe_note_templates")
        .select("template_data")
        .eq("id", template_id)
        .single();

      if (template?.template_data) {
        templateDefaults = template.template_data as Record<string, unknown>;
      }
    }

    const noteData = {
      patient_id,
      appointment_id: appointment_id || null,
      provider_name,
      provider_id: userId,
      note_type,
      chief_complaint: chief_complaint || (templateDefaults.chief_complaint as string) || null,
      subjective: subjective || (templateDefaults.subjective as string) || null,
      objective: objective || (templateDefaults.objective as string) || null,
      assessment: assessment || (templateDefaults.assessment as string) || null,
      plan: plan || (templateDefaults.plan as string) || null,
      tooth_numbers: tooth_numbers || [],
      procedure_codes: procedure_codes || [],
      medications: medications || [],
      vitals: vitals || {},
      status,
    };

    const { data, error } = await supabase
      .from("oe_clinical_notes")
      .insert(noteData)
      .select("*, patient:oe_patients(id, first_name, last_name)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logPhiAccess("clinical_notes.create", "clinical_note", data.id, {
      patientId: patient_id,
      noteType: note_type,
      provider: provider_name,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create note" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceSupabase();
  const body = await req.json();

  // Insert acknowledgment record
  const { data: ack, error: ackError } = await supabase
    .from("oe_document_acknowledgments")
    .insert({
      document_id: id,
      employee_id: body.employee_id,
      acknowledgment_type: body.acknowledgment_type,
      step_label: body.step_label || null,
      typed_name: body.typed_name || null,
      ip_address: body.ip_address || null,
    })
    .select()
    .single();

  if (ackError) {
    return NextResponse.json({ error: ackError.message }, { status: 500 });
  }

  // If this is a final signature, update document status
  if (body.acknowledgment_type === "signature") {
    await supabase
      .from("oe_hr_documents")
      .update({ status: "acknowledged" })
      .eq("id", id);
  }

  return NextResponse.json(ack, { status: 201 });
}

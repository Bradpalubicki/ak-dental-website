import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { generateTreatmentProposalPdf } from "@/lib/documents/proposal-pdf";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceSupabase();

  const { data: proposal, error: pErr } = await supabase
    .from("oe_proposals")
    .select(`
      *,
      patient:oe_patients(id, first_name, last_name, email, phone, date_of_birth),
      provider:oe_providers(id, first_name, last_name)
    `)
    .eq("id", id)
    .single();

  if (pErr || !proposal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: items } = await supabase
    .from("oe_proposal_items")
    .select("*")
    .eq("proposal_id", id)
    .order("sort_order", { ascending: true });

  const pdf = await generateTreatmentProposalPdf(proposal, items ?? [], proposal.patient, proposal.provider);

  return new NextResponse(pdf as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="treatment-plan-${id.slice(0, 8)}.pdf"`,
      "Content-Length": String(pdf.length),
    },
  });
}

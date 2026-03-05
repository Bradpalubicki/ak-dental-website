import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";

const ProposalItemSchema = z.object({
  sort_order: z.number().int().default(0),
  cdt_code: z.string().max(20).optional().nullable(),
  procedure_name: z.string().min(1).max(200),
  procedure_description: z.string().max(500).optional().nullable(),
  tooth_number: z.string().max(20).optional().nullable(),
  fee: z.number().min(0).default(0),
  insurance_pays: z.number().min(0).default(0),
  patient_pays: z.number().min(0).default(0),
  tier: z.enum(["good", "better", "best"]).optional().nullable(),
});

const CreateProposalSchema = z.object({
  patient_id: z.string().uuid(),
  provider_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1).max(200),
  notes: z.string().max(2000).optional().nullable(),
  financing_provider: z.string().max(50).optional().nullable(),
  financing_monthly: z.number().min(0).optional().nullable(),
  financing_term_months: z.number().int().min(1).max(120).optional().nullable(),
  tier: z.enum(["good", "better", "best"]).optional().nullable(),
  items: z.array(ProposalItemSchema).default([]),
});

export async function GET(req: NextRequest) {
  const patientId = req.nextUrl.searchParams.get("patient_id");
  if (!patientId) {
    return NextResponse.json({ error: "patient_id required" }, { status: 400 });
  }

  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("oe_proposals")
    .select(`
      id, title, status, total_fee, insurance_estimate, patient_estimate,
      financing_provider, financing_monthly, financing_term_months,
      tier, sign_token, sent_at, viewed_at, signed_at, signature_name,
      expires_at, created_at, updated_at,
      provider:oe_providers(id, first_name, last_name)
    `)
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ proposals: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = CreateProposalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { items, ...proposalData } = parsed.data;

  // Compute totals from items
  const total_fee = items.reduce((s, i) => s + i.fee, 0);
  const insurance_estimate = items.reduce((s, i) => s + i.insurance_pays, 0);
  const patient_estimate = items.reduce((s, i) => s + i.patient_pays, 0);

  const supabase = createServiceSupabase();

  const { data: proposal, error: pErr } = await supabase
    .from("oe_proposals")
    .insert({
      ...proposalData,
      total_fee,
      insurance_estimate,
      patient_estimate,
    })
    .select("id, sign_token")
    .single();

  if (pErr || !proposal) {
    return NextResponse.json({ error: pErr?.message ?? "Failed to create proposal" }, { status: 500 });
  }

  if (items.length > 0) {
    const itemRows = items.map((item, idx) => ({
      ...item,
      proposal_id: proposal.id,
      sort_order: item.sort_order ?? idx,
    }));
    const { error: iErr } = await supabase.from("oe_proposal_items").insert(itemRows);
    if (iErr) {
      return NextResponse.json({ error: iErr.message }, { status: 500 });
    }
  }

  return NextResponse.json({ proposal }, { status: 201 });
}

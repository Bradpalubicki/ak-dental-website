export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { ProposalClient } from "./proposal-client";

export async function generateMetadata() {
  return { title: "Your Treatment Plan | AK Ultimate Dental" };
}

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createServiceSupabase();

  const { data: proposal } = await supabase
    .from("oe_proposals")
    .select(`
      id, title, status, total_fee, insurance_estimate, patient_estimate,
      financing_provider, financing_monthly, financing_term_months, tier,
      sign_token, sent_at, viewed_at, signed_at, signature_name, signed_ip,
      expires_at, created_at, notes,
      patient:oe_patients(id, first_name, last_name, email),
      provider:oe_providers(id, first_name, last_name)
    `)
    .eq("sign_token", token)
    .single();

  if (!proposal) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 mx-auto mb-4">
            <span className="text-2xl">🦷</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Plan Not Found</h1>
          <p className="text-slate-500 text-sm">
            This treatment plan link is invalid or has been removed.
            Please contact AK Ultimate Dental.
          </p>
          <p className="mt-4 text-sm font-medium text-cyan-600">(702) 935-4395</p>
        </div>
      </div>
    );
  }

  // Mark as viewed if status was 'sent'
  if (proposal.status === "sent") {
    await supabase
      .from("oe_proposals")
      .update({ status: "viewed", viewed_at: new Date().toISOString() })
      .eq("sign_token", token);
    proposal.status = "viewed";
  }

  const { data: items } = await supabase
    .from("oe_proposal_items")
    .select("*")
    .eq("proposal_id", proposal.id)
    .order("sort_order", { ascending: true });

  const expired =
    proposal.expires_at && new Date(proposal.expires_at) < new Date();

  // Supabase returns FK relations as arrays; normalize to single objects
  const patientRaw = Array.isArray(proposal.patient) ? proposal.patient[0] : proposal.patient;
  const providerRaw = Array.isArray(proposal.provider) ? proposal.provider[0] : proposal.provider;

  const normalizedProposal = {
    ...proposal,
    patient: patientRaw as { first_name: string; last_name: string; email?: string | null } | null,
    provider: providerRaw as { first_name: string; last_name: string } | null,
  };

  return (
    <ProposalClient
      proposal={normalizedProposal}
      items={items ?? []}
      token={token}
      expired={!!expired}
    />
  );
}

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createServiceSupabase } from "@/lib/supabase/server";
import { ProposalBuilderClient } from "./proposal-builder-client";

export default async function NewProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServiceSupabase();

  const [patientRes, providersRes] = await Promise.all([
    supabase
      .from("oe_patients")
      .select("id, first_name, last_name, email")
      .eq("id", id)
      .single(),
    supabase
      .from("oe_providers")
      .select("id, first_name, last_name")
      .order("last_name"),
  ]);

  if (!patientRes.data) notFound();

  return (
    <ProposalBuilderClient
      patientId={id}
      patient={patientRes.data}
      providers={providersRes.data ?? []}
    />
  );
}

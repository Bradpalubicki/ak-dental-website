export const dynamic = "force-dynamic";

import { createServiceSupabase } from "@/lib/supabase/server";
import { DocumentsClient } from "./documents-client";

export const metadata = {
  title: "Documents | AK Ultimate Dental",
  description: "Legal agreements and compliance documents for AK Ultimate Dental",
};

export type LegalDocument = {
  id: string;
  created_at: string;
  updated_at: string;
  agreement_number: string;
  name: string;
  description: string | null;
  category: string;
  client_entity: string;
  nustack_entity: string;
  status: "pending" | "sent" | "signed" | "expired" | "voided";
  sent_at: string | null;
  signed_at: string | null;
  effective_date: string | null;
  expiration_date: string | null;
  document_url: string | null;
  signed_document_url: string | null;
  baa_included: boolean;
  hipaa_required: boolean;
  notes: string | null;
};

export default async function DocumentsPage() {
  const supabase = createServiceSupabase();

  const { data: documents, error } = await supabase
    .from("de_legal_documents")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  return (
    <DocumentsClient
      documents={(documents as LegalDocument[]) ?? []}
      error={error?.message ?? null}
    />
  );
}

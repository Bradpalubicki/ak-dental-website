"use server";

import { createServiceSupabase } from "@/lib/supabase/server";

export async function markDocumentSent(documentId: string): Promise<{ success: boolean; error?: string }> {
  if (!documentId) return { success: false, error: "Missing document ID" };

  const supabase = createServiceSupabase();

  const { error } = await supabase
    .from("de_legal_documents")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", documentId)
    .is("deleted_at", null);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function markDocumentSigned(documentId: string): Promise<{ success: boolean; error?: string }> {
  if (!documentId) return { success: false, error: "Missing document ID" };

  const supabase = createServiceSupabase();

  const { error } = await supabase
    .from("de_legal_documents")
    .update({ status: "signed", signed_at: new Date().toISOString() })
    .eq("id", documentId)
    .is("deleted_at", null);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

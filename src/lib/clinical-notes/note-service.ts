import { createServiceSupabase } from "@/lib/supabase/server";
import type { ClinicalNote, ClinicalNoteType, ClinicalNoteStatus } from "@/types/database";

interface CreateNoteParams {
  patient_id: string;
  provider_id: string;
  appointment_id?: string;
  note_type: ClinicalNoteType;
  template_id?: string;
  content?: Record<string, string>;
  diagnosis_codes?: string[];
  procedure_codes?: string[];
}

interface UpdateNoteParams {
  content?: Record<string, string>;
  plain_text?: string;
  ai_summary?: string;
  ai_patient_summary?: string;
  diagnosis_codes?: string[];
  procedure_codes?: string[];
}

interface ListNotesParams {
  patient_id?: string;
  provider_id?: string;
  status?: ClinicalNoteStatus;
  note_type?: ClinicalNoteType;
  limit?: number;
  offset?: number;
}

function flattenContent(content: Record<string, string>): string {
  return Object.values(content).filter(Boolean).join("\n\n");
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const noteService = {
  async create(params: CreateNoteParams): Promise<ClinicalNote> {
    const supabase = createServiceSupabase();
    const plainText = params.content ? flattenContent(params.content) : "";
    const wordCount = countWords(plainText);

    const { data, error } = await supabase
      .from("oe_clinical_notes")
      .insert({
        patient_id: params.patient_id,
        provider_id: params.provider_id,
        appointment_id: params.appointment_id || null,
        note_type: params.note_type,
        template_id: params.template_id || null,
        content: params.content || {},
        plain_text: plainText,
        diagnosis_codes: params.diagnosis_codes || [],
        procedure_codes: params.procedure_codes || [],
        word_count: wordCount,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create note: ${error.message}`);
    return data as ClinicalNote;
  },

  async update(id: string, params: UpdateNoteParams): Promise<ClinicalNote> {
    const supabase = createServiceSupabase();
    const updates: Record<string, unknown> = { ...params };

    if (params.content) {
      updates.plain_text = flattenContent(params.content);
      updates.word_count = countWords(updates.plain_text as string);
    }

    const { data, error } = await supabase
      .from("oe_clinical_notes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update note: ${error.message}`);
    return data as ClinicalNote;
  },

  async get(id: string): Promise<ClinicalNote | null> {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_clinical_notes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data as ClinicalNote;
  },

  async list(params: ListNotesParams = {}): Promise<{ notes: ClinicalNote[]; count: number }> {
    const supabase = createServiceSupabase();
    let query = supabase
      .from("oe_clinical_notes")
      .select("*", { count: "exact" });

    if (params.patient_id) query = query.eq("patient_id", params.patient_id);
    if (params.provider_id) query = query.eq("provider_id", params.provider_id);
    if (params.status) query = query.eq("status", params.status);
    if (params.note_type) query = query.eq("note_type", params.note_type);

    query = query
      .order("created_at", { ascending: false })
      .range(params.offset || 0, (params.offset || 0) + (params.limit || 25) - 1);

    const { data, error, count } = await query;
    if (error) throw new Error(`Failed to list notes: ${error.message}`);
    return { notes: (data || []) as ClinicalNote[], count: count || 0 };
  },

  async sign(id: string, providerId: string): Promise<ClinicalNote> {
    const supabase = createServiceSupabase();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("oe_clinical_notes")
      .update({
        status: "signed",
        signed_by: providerId,
        signed_at: now,
      })
      .eq("id", id)
      .in("status", ["draft", "pending_cosign"])
      .select()
      .single();

    if (error) throw new Error(`Failed to sign note: ${error.message}`);
    return data as ClinicalNote;
  },

  async lock(id: string): Promise<ClinicalNote> {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("oe_clinical_notes")
      .update({
        status: "locked",
        locked_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("status", "signed")
      .select()
      .single();

    if (error) throw new Error(`Failed to lock note: ${error.message}`);
    return data as ClinicalNote;
  },

  async amend(originalId: string, providerId: string, reason: string, content: Record<string, string>): Promise<ClinicalNote> {
    const original = await this.get(originalId);
    if (!original) throw new Error("Original note not found");
    if (original.status !== "locked" && original.status !== "signed") {
      throw new Error("Can only amend signed or locked notes");
    }

    // Lock original if not already locked
    if (original.status === "signed") {
      await this.lock(originalId);
    }

    const supabase = createServiceSupabase();
    const plainText = flattenContent(content);

    const { data, error } = await supabase
      .from("oe_clinical_notes")
      .insert({
        patient_id: original.patient_id,
        provider_id: providerId,
        appointment_id: original.appointment_id,
        note_type: original.note_type,
        template_id: original.template_id,
        content,
        plain_text: plainText,
        word_count: countWords(plainText),
        diagnosis_codes: original.diagnosis_codes,
        procedure_codes: original.procedure_codes,
        status: "draft",
        amendment_of: originalId,
        amendment_reason: reason,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create amendment: ${error.message}`);

    // Mark original as amended
    await supabase
      .from("oe_clinical_notes")
      .update({ status: "amended" })
      .eq("id", originalId);

    return data as ClinicalNote;
  },

  async delete(id: string): Promise<void> {
    const supabase = createServiceSupabase();
    const note = await this.get(id);
    if (!note) throw new Error("Note not found");
    if (note.status !== "draft") throw new Error("Can only delete draft notes");

    const { error } = await supabase
      .from("oe_clinical_notes")
      .delete()
      .eq("id", id);

    if (error) throw new Error(`Failed to delete note: ${error.message}`);
  },

  async getUnsignedCount(providerId?: string): Promise<number> {
    const supabase = createServiceSupabase();
    let query = supabase
      .from("oe_clinical_notes")
      .select("id", { count: "exact", head: true })
      .in("status", ["draft", "pending_cosign"]);

    if (providerId) query = query.eq("provider_id", providerId);

    const { count, error } = await query;
    if (error) return 0;
    return count || 0;
  },
};

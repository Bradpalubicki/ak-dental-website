import { createServiceSupabase } from "@/lib/supabase/server";
import { logAudit, logPhiAccess } from "@/lib/audit";
import type { Document, DocumentCategory, DocumentStatus } from "@/types/database";
import Anthropic from "@anthropic-ai/sdk";

const anthropic =
  process.env.ANTHROPIC_API_KEY &&
  process.env.ANTHROPIC_API_KEY !== "PLACEHOLDER_ADD_ANTHROPIC_KEY"
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const DOCUMENT_CATEGORIES: { value: DocumentCategory; label: string }[] = [
  { value: "eob", label: "Explanation of Benefits" },
  { value: "insurance_card", label: "Insurance Card" },
  { value: "referral", label: "Referral" },
  { value: "lab_result", label: "Lab Result" },
  { value: "xray", label: "X-Ray / Imaging" },
  { value: "consent_form", label: "Consent Form" },
  { value: "invoice", label: "Invoice" },
  { value: "receipt", label: "Receipt" },
  { value: "correspondence", label: "Correspondence" },
  { value: "clinical_note", label: "Clinical Note" },
  { value: "prescription", label: "Prescription" },
  { value: "id_document", label: "ID Document" },
  { value: "other", label: "Other" },
  { value: "uncategorized", label: "Uncategorized" },
];

export { ALLOWED_TYPES, MAX_FILE_SIZE, DOCUMENT_CATEGORIES };

export interface DocumentFilters {
  category?: string;
  patient_id?: string;
  status?: string;
  search?: string;
  limit?: number;
}

export interface UploadMetadata {
  entityType?: string;
  entityId?: string;
  patientId?: string;
  category?: DocumentCategory;
  description?: string;
  tags?: string[];
  notes?: string;
}

/**
 * Upload a document to Supabase Storage and create a DB record.
 */
export async function uploadDocument(
  file: File,
  uploadedBy: string,
  uploadedByName: string | null,
  metadata: UploadMetadata = {}
): Promise<{ data: Document | null; error: string | null }> {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      data: null,
      error: `File type not allowed: ${file.type}. Allowed: PDF, JPEG, PNG, WebP, Word, Excel`,
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      data: null,
      error: `File too large. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  const supabase = createServiceSupabase();

  // Generate storage path
  const fileExt = file.name.split(".").pop() || "bin";
  const folder = metadata.category || metadata.entityType || "dropbox";
  const storagePath = `${folder}/${crypto.randomUUID()}.${fileExt}`;

  // Upload to Supabase Storage
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { data: null, error: `Upload failed: ${uploadError.message}` };
  }

  // Create metadata record
  const { data: doc, error: dbError } = await supabase
    .from("oe_documents")
    .insert({
      entity_type: metadata.entityType || "dropbox",
      entity_id: metadata.entityId || null,
      patient_id: metadata.patientId || null,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
      uploaded_by: uploadedBy,
      uploaded_by_name: uploadedByName,
      description: metadata.description || null,
      category: metadata.category || "uncategorized",
      status: "pending",
      tags: metadata.tags || [],
      notes: metadata.notes || null,
    })
    .select()
    .single();

  if (dbError) {
    // Clean up uploaded file if DB insert fails
    await supabase.storage.from("documents").remove([storagePath]);
    return { data: null, error: dbError.message };
  }

  await logAudit({
    userId: uploadedBy,
    userName: uploadedByName,
    action: "document.upload",
    resourceType: "document",
    resourceId: doc.id,
    details: {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      category: metadata.category,
    },
    phiAccessed: !!metadata.patientId,
  });

  return { data: doc as Document, error: null };
}

/**
 * List documents with optional filters.
 */
export async function getDocuments(
  filters: DocumentFilters = {}
): Promise<{ data: Document[]; error: string | null }> {
  const supabase = createServiceSupabase();

  let query = supabase
    .from("oe_documents")
    .select("*")
    .not("status", "eq", "deleted")
    .order("created_at", { ascending: false })
    .limit(filters.limit || 100);

  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  if (filters.patient_id) {
    query = query.eq("patient_id", filters.patient_id);
  }

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.search) {
    query = query.or(
      `file_name.ilike.%${filters.search}%,ai_summary.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (data || []) as Document[], error: null };
}

/**
 * Get a single document by ID with a signed download URL.
 */
export async function getDocument(
  id: string
): Promise<{ data: (Document & { download_url: string }) | null; error: string | null }> {
  const supabase = createServiceSupabase();

  const { data: doc, error } = await supabase
    .from("oe_documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !doc) {
    return { data: null, error: error?.message || "Document not found" };
  }

  // Generate a signed URL for download
  const { data: urlData, error: urlError } = await supabase.storage
    .from("documents")
    .createSignedUrl(doc.storage_path, 3600);

  if (urlError) {
    return { data: null, error: "Failed to generate download URL" };
  }

  const result = { ...doc, download_url: urlData.signedUrl } as Document & {
    download_url: string;
  };

  if (doc.patient_id) {
    await logPhiAccess("document.view", "document", id, {
      patientId: doc.patient_id,
    });
  }

  return { data: result, error: null };
}

/**
 * Update document metadata.
 */
export async function updateDocument(
  id: string,
  updates: {
    category?: DocumentCategory;
    subcategory?: string;
    patient_id?: string | null;
    tags?: string[];
    notes?: string;
    status?: DocumentStatus;
    description?: string;
  }
): Promise<{ data: Document | null; error: string | null }> {
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("oe_documents")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  await logAudit({
    action: "document.update",
    resourceType: "document",
    resourceId: id,
    details: updates as Record<string, unknown>,
    phiAccessed: !!updates.patient_id,
  });

  return { data: data as Document, error: null };
}

/**
 * Soft delete a document by setting status to 'archived'.
 */
export async function archiveDocument(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = createServiceSupabase();

  const { error } = await supabase
    .from("oe_documents")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    action: "document.archive",
    resourceType: "document",
    resourceId: id,
  });

  return { success: true, error: null };
}

/**
 * Process a document with AI to extract data, categorize, and summarize.
 */
export async function processDocument(
  id: string
): Promise<{ data: Document | null; error: string | null }> {
  if (!anthropic) {
    return { data: null, error: "AI service not configured" };
  }

  const supabase = createServiceSupabase();

  // Get the document record
  const { data: doc, error: fetchError } = await supabase
    .from("oe_documents")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !doc) {
    return { data: null, error: "Document not found" };
  }

  // Mark as processing
  await supabase
    .from("oe_documents")
    .update({ status: "processing", updated_at: new Date().toISOString() })
    .eq("id", id);

  try {
    // Download the file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("documents")
      .download(doc.storage_path);

    if (downloadError || !fileData) {
      await supabase
        .from("oe_documents")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", id);
      return { data: null, error: "Failed to download file for processing" };
    }

    // Convert file to base64 for AI processing
    const buffer = Buffer.from(await fileData.arrayBuffer());
    const base64 = buffer.toString("base64");

    // Determine media type for Claude vision
    const isImage = doc.file_type.startsWith("image/");
    const isPdf = doc.file_type === "application/pdf";

    // Build AI message content
    const messageContent: Anthropic.MessageCreateParams["messages"][0]["content"] =
      [];

    if (isImage) {
      messageContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: doc.file_type as
            | "image/jpeg"
            | "image/png"
            | "image/gif"
            | "image/webp",
          data: base64,
        },
      });
    } else if (isPdf) {
      messageContent.push({
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: base64,
        },
      });
    } else {
      // For non-image/non-PDF files, extract text content if possible
      const textContent = buffer.toString("utf-8").substring(0, 10000);
      messageContent.push({
        type: "text",
        text: `File content (${doc.file_name}):\n\n${textContent}`,
      });
    }

    messageContent.push({
      type: "text",
      text: `Analyze this dental practice document and return a JSON response with the following structure:

{
  "category": "<one of: eob, insurance_card, referral, lab_result, xray, consent_form, invoice, receipt, correspondence, clinical_note, prescription, id_document, other>",
  "subcategory": "<more specific classification, e.g., 'panoramic' for xray, 'crown' for lab_result>",
  "summary": "<2-3 sentence summary of the document content>",
  "confidence": <0.0-1.0 confidence score>,
  "extracted_data": {
    "dates": ["<any relevant dates found>"],
    "amounts": ["<any dollar amounts found>"],
    "patient_name": "<patient name if found>",
    "patient_dob": "<patient date of birth if found>",
    "provider_name": "<provider/doctor name if found>",
    "insurance_info": {
      "carrier": "<insurance company if found>",
      "member_id": "<member ID if found>",
      "group_number": "<group number if found>"
    },
    "procedure_codes": ["<any CDT/CPT codes found>"],
    "diagnosis_codes": ["<any ICD codes found>"],
    "key_findings": ["<important findings or data points>"],
    "action_items": ["<suggested follow-up actions>"]
  },
  "suggested_tags": ["<relevant tags for organization>"]
}

Return ONLY valid JSON, no additional text. If a field is not applicable or not found, use null or empty array.
The file name is: ${doc.file_name}`,
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: messageContent,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const aiText = textBlock?.text || "";

    // Parse AI response
    let aiResult;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch {
      await supabase
        .from("oe_documents")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", id);
      return { data: null, error: "Failed to parse AI response" };
    }

    // Update document with AI results
    const { data: updatedDoc, error: updateError } = await supabase
      .from("oe_documents")
      .update({
        category: aiResult.category || doc.category,
        subcategory: aiResult.subcategory || null,
        ai_summary: aiResult.summary || null,
        ai_extracted_data: aiResult.extracted_data || {},
        ai_confidence: aiResult.confidence || null,
        ai_processed_at: new Date().toISOString(),
        status: "processed",
        tags: [
          ...(doc.tags || []),
          ...(aiResult.suggested_tags || []),
        ].filter((v: string, i: number, a: string[]) => a.indexOf(v) === i), // deduplicate
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return { data: null, error: updateError.message };
    }

    await logAudit({
      action: "document.ai_process",
      resourceType: "document",
      resourceId: id,
      details: {
        category: aiResult.category,
        confidence: aiResult.confidence,
        model: response.model,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
      phiAccessed: true,
    });

    return { data: updatedDoc as Document, error: null };
  } catch (err) {
    await supabase
      .from("oe_documents")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("id", id);
    return {
      data: null,
      error: `AI processing failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

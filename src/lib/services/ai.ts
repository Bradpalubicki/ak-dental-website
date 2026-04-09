import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { createSmartRouter, type SmartCallResult, type SmartCallError } from "@/lib/smart-model-router";

const anthropic = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== "PLACEHOLDER_ADD_ANTHROPIC_KEY"
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// Create smart router for haiku-first cost optimization
const smartCall = anthropic ? createSmartRouter(anthropic) : null;

const SYSTEM_PROMPT = `You are an AI assistant for AK Ultimate Dental, a dental practice in Las Vegas, NV.
The practice is located at 7480 West Sahara Avenue, Las Vegas, NV 89117. Phone: (702) 935-4395.
Office hours: Monday-Thursday 8:00 AM - 5:00 PM. Closed Friday-Sunday.

Services offered: Cleanings, Cosmetic Dentistry, Dental Implants, Crowns & Bridges, Root Canal Therapy,
Oral Surgery, Periodontics, Orthodontics, Pediatric Dentistry (ages 6+).

You are professional, warm, and helpful. You prioritize patient care and comfort.
Always encourage patients to schedule appointments. Never provide medical diagnosis.
When unsure, recommend the patient call the office directly.`;

export interface AiResponse {
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  usedFallback?: boolean;
}

// Helper to check if result is an error
function isSmartError(result: SmartCallResult | SmartCallError): result is SmartCallError {
  return 'type' in result;
}

export async function generateLeadResponse(params: {
  patientName: string;
  inquiry: string;
  message: string;
  source: string;
  urgency: string;
}): Promise<AiResponse | null> {
  if (!smartCall) {
    console.warn("[AI] Anthropic not configured");
    return null;
  }

  // Use 'generation' task - Sonnet for warm, personalized responses
  const result = await smartCall({
    task: "generation",
    systemPrompt: SYSTEM_PROMPT,
    maxTokens: 500,
    prompt: `Generate a response to a new patient inquiry.

Patient: ${params.patientName}
Inquiry Type: ${params.inquiry}
Source: ${params.source}
Urgency: ${params.urgency}
Message: ${params.message}

Write a warm, professional response that:
1. Addresses their specific question/concern
2. Provides relevant information about our services
3. Encourages them to schedule an appointment
4. Includes a call-to-action

Keep it concise (under 150 words). Write in a natural, conversational tone.`,
  });

  if (isSmartError(result)) {
    console.error("[AI] Lead response failed:", result.message);
    return null;
  }

  return {
    content: result.data as string,
    model: result.model === 'haiku' ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-6',
    inputTokens: result.usage.inputTokens,
    outputTokens: result.usage.outputTokens,
    usedFallback: result.usedFallback,
  };
}

export async function generateTreatmentSummary(params: {
  patientName: string;
  procedures: Array<{ name: string; code: string; cost: number; description?: string }>;
  totalCost: number;
  insuranceCoverage: number;
}): Promise<AiResponse | null> {
  if (!smartCall) return null;

  const procedureList = params.procedures
    .map((p) => `- ${p.name} (${p.code}): $${p.cost}${p.description ? ` - ${p.description}` : ""}`)
    .join("\n");

  // Use 'generation' task - Sonnet for patient-facing content that needs empathy
  const result = await smartCall({
    task: "generation",
    systemPrompt: SYSTEM_PROMPT,
    maxTokens: 600,
    prompt: `Create a patient-friendly treatment plan summary.

Patient: ${params.patientName}
Procedures:
${procedureList}

Total Cost: $${params.totalCost}
Insurance Estimate: $${params.insuranceCoverage}
Patient Estimated Cost: $${params.totalCost - params.insuranceCoverage}

Write a clear, non-technical explanation of:
1. What each procedure is and why it's recommended
2. What the patient can expect
3. Cost breakdown in plain language
4. Reassurance about comfort and care

Use simple language a non-medical person would understand.`,
  });

  if (isSmartError(result)) {
    console.error("[AI] Treatment summary failed:", result.message);
    return null;
  }

  return {
    content: result.data as string,
    model: result.model === 'haiku' ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-6',
    inputTokens: result.usage.inputTokens,
    outputTokens: result.usage.outputTokens,
    usedFallback: result.usedFallback,
  };
}

export async function generateDailyBriefing(params: {
  date: string;
  appointments: number;
  unconfirmed: number;
  newLeads: number;
  pendingInsurance: number;
  yesterdayProduction: number;
  yesterdayCollections: number;
  noShows: number;
  aiActionsOvernight: number;
}): Promise<AiResponse | null> {
  if (!smartCall) return null;

  // Use 'extraction' task - Haiku can handle briefing generation (structured output)
  const result = await smartCall({
    task: "extraction",
    systemPrompt: SYSTEM_PROMPT,
    maxTokens: 400,
    prompt: `Generate a concise morning briefing for the dental practice.

Date: ${params.date}
Today's Appointments: ${params.appointments} (${params.unconfirmed} unconfirmed)
New Leads Overnight: ${params.newLeads}
Pending Insurance Verifications: ${params.pendingInsurance}
Yesterday's Production: $${params.yesterdayProduction}
Yesterday's Collections: $${params.yesterdayCollections}
Yesterday's No-Shows: ${params.noShows}
AI Actions Taken Overnight: ${params.aiActionsOvernight}

Write a brief, actionable morning briefing that highlights:
1. Key priorities for today
2. Items needing attention
3. Quick wins to pursue
4. Any concerns or flags

Keep it under 200 words. Be direct and actionable.`,
  });

  if (isSmartError(result)) {
    console.error("[AI] Daily briefing failed:", result.message);
    return null;
  }

  return {
    content: result.data as string,
    model: result.model === 'haiku' ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-6',
    inputTokens: result.usage.inputTokens,
    outputTokens: result.usage.outputTokens,
    usedFallback: result.usedFallback,
  };
}

// Schema for call classification
const CallClassificationSchema = z.object({
  intent: z.enum(['appointment_request', 'emergency', 'billing_question', 'insurance_question', 'general_inquiry', 'complaint', 'cancellation', 'other']),
  urgency: z.enum(['low', 'medium', 'high', 'emergency']),
  summary: z.string(),
  action_needed: z.string(),
});

export async function classifyCallIntent(transcription: string): Promise<AiResponse | null> {
  if (!smartCall) return null;

  // Use 'classification' task - Haiku-first, falls back to Sonnet if needed
  const result = await smartCall({
    task: "classification",
    systemPrompt: SYSTEM_PROMPT,
    maxTokens: 200,
    schema: CallClassificationSchema,
    prompt: `Classify this call transcript. Return JSON with:
- intent: one of [appointment_request, emergency, billing_question, insurance_question, general_inquiry, complaint, cancellation, other]
- urgency: one of [low, medium, high, emergency]
- summary: one sentence summary
- action_needed: what should happen next

Transcript:
${transcription}`,
  });

  if (isSmartError(result)) {
    console.error("[AI] Call classification failed:", result.message);
    return null;
  }

  return {
    content: JSON.stringify(result.data),
    model: result.model === 'haiku' ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-6',
    inputTokens: result.usage.inputTokens,
    outputTokens: result.usage.outputTokens,
    usedFallback: result.usedFallback,
  };
}

export function isConfigured(): boolean {
  return anthropic !== null;
}

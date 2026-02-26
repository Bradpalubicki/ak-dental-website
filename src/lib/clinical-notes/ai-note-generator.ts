import Anthropic from "@anthropic-ai/sdk";
import { getVerticalConfig } from "@/config";

const anthropic = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== "PLACEHOLDER_ADD_ANTHROPIC_KEY"
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

interface NoteSummaryParams {
  noteContent: Record<string, string>;
  noteType: string;
  patientName: string;
  providerName: string;
  appointmentDate?: string;
}

export async function generateNoteSummary(params: NoteSummaryParams): Promise<string | null> {
  if (!anthropic) return null;

  const vertical = getVerticalConfig();
  const sections = Object.entries(params.noteContent)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k.toUpperCase()}:\n${v}`)
    .join("\n\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 400,
    system: vertical.aiPrompts.systemPrompt,
    messages: [
      {
        role: "user",
        content: `${vertical.aiPrompts.noteSummaryPrompt}

Note Type: ${params.noteType}
${vertical.terminology.provider}: ${params.providerName}
${vertical.terminology.customer}: ${params.patientName}
Date: ${params.appointmentDate || "Today"}

--- Clinical Note ---
${sections}`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock?.text || null;
}

export async function generatePatientSummary(params: NoteSummaryParams): Promise<string | null> {
  if (!anthropic) return null;

  const vertical = getVerticalConfig();
  const sections = Object.entries(params.noteContent)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k.toUpperCase()}:\n${v}`)
    .join("\n\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    system: vertical.aiPrompts.systemPrompt,
    messages: [
      {
        role: "user",
        content: `${vertical.aiPrompts.patientSummaryPrompt}

Note Type: ${params.noteType}
${vertical.terminology.customer}: ${params.patientName}
Date: ${params.appointmentDate || "Today"}

--- Clinical Note ---
${sections}`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock?.text || null;
}

export async function generateNoteDraft(params: {
  noteType: string;
  patientName: string;
  providerName: string;
  appointmentType: string;
  previousNotes?: string;
  sessionNotes?: string;
}): Promise<Record<string, string> | null> {
  if (!anthropic) return null;

  const vertical = getVerticalConfig();
  const template = vertical.noteTemplates.find((t) => t.type === params.noteType);
  if (!template) return null;

  const sectionKeys = template.sections.map((s) => s.key);
  const sectionPrompt = template.sections
    .map((s) => `- ${s.key} (${s.label}): ${s.placeholder}`)
    .join("\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: `${vertical.aiPrompts.systemPrompt}

You are helping draft a clinical ${template.label} for a ${vertical.terminology.provider}.
Generate professional, clinical documentation. This is a DRAFT that the ${vertical.terminology.provider} will review and edit before signing.
Return ONLY valid JSON with these exact keys: ${JSON.stringify(sectionKeys)}`,
    messages: [
      {
        role: "user",
        content: `Generate a draft ${template.label} for this ${vertical.terminology.visit}:

${vertical.terminology.customer}: ${params.patientName}
${vertical.terminology.provider}: ${params.providerName}
${vertical.terminology.visit} Type: ${params.appointmentType}
${params.previousNotes ? `Previous Notes Summary: ${params.previousNotes}` : ""}
${params.sessionNotes ? `${vertical.terminology.provider} Notes: ${params.sessionNotes}` : ""}

Expected sections:
${sectionPrompt}

Return JSON only, no markdown formatting.`,
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock?.text) return null;

  try {
    return JSON.parse(textBlock.text);
  } catch {
    return null;
  }
}

export function isAiConfigured(): boolean {
  return anthropic !== null;
}

// Vapi.ai - AI Voice Assistant Integration
// Handles AI-powered inbound/outbound calls

const VAPI_BASE_URL = "https://api.vapi.ai";

interface VapiCallConfig {
  phoneNumberId?: string;
  assistantId?: string;
  customer: {
    number: string;
    name?: string;
  };
  assistantOverrides?: {
    firstMessage?: string;
    model?: {
      provider: string;
      model: string;
      systemPrompt: string;
    };
  };
}

interface VapiAssistantConfig {
  name: string;
  firstMessage: string;
  model: {
    provider: "anthropic" | "openai";
    model: string;
    systemPrompt: string;
  };
  voice?: {
    provider: string;
    voiceId: string;
  };
  endCallMessage?: string;
  recordingEnabled?: boolean;
  transcriptionEnabled?: boolean;
}

async function vapiRequest(endpoint: string, method: string = "GET", body?: unknown) {
  const apiKey = process.env.VAPI_API_KEY;
  if (!apiKey || apiKey === "PLACEHOLDER") {
    console.warn("[Vapi] Not configured");
    return null;
  }

  const res = await fetch(`${VAPI_BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Vapi API error: ${res.status} - ${error}`);
  }

  return res.json();
}

export async function createOutboundCall(config: VapiCallConfig) {
  return vapiRequest("/call", "POST", config);
}

export async function getCall(callId: string) {
  return vapiRequest(`/call/${callId}`);
}

export async function listCalls(params?: { limit?: number }) {
  const query = params?.limit ? `?limit=${params.limit}` : "";
  return vapiRequest(`/call${query}`);
}

export async function createAssistant(config: VapiAssistantConfig) {
  return vapiRequest("/assistant", "POST", config);
}

export async function getAssistant(assistantId: string) {
  return vapiRequest(`/assistant/${assistantId}`);
}

// Pre-built dental assistant prompts
export const dentalAssistantPrompts = {
  afterHours: `You are a friendly AI receptionist for AK Ultimate Dental in Las Vegas.
Dr. Alexandru Chireu is the dentist. The office is at 7480 West Sahara Avenue, Las Vegas, NV 89117.
Office hours are Monday-Thursday 8AM-5PM. The office is currently closed.

Your job is to:
1. Greet the caller warmly
2. Determine if this is an emergency (severe pain, swelling, bleeding, trauma)
3. If emergency: Provide the emergency contact number and advise going to nearest ER if severe
4. If not emergency: Capture their name, phone number, and reason for calling
5. Let them know someone will call back first thing in the morning
6. Offer to help them schedule online at akultimatedental.com

Be warm, professional, and reassuring. Keep responses concise.`,

  appointmentReminder: `You are calling on behalf of AK Ultimate Dental to remind a patient about their upcoming appointment.
Be friendly and brief. Confirm the appointment date, time, and type.
Ask if they have any questions or need to reschedule.
If they need to reschedule, let them know you'll have the office call them back.`,

  noShowFollowUp: `You are calling on behalf of AK Ultimate Dental. The patient missed their appointment.
Be empathetic and non-judgmental. Express concern about their wellbeing.
Offer to reschedule at their convenience.
If they had an emergency, be understanding and helpful.`,
};

export function isConfigured(): boolean {
  const key = process.env.VAPI_API_KEY;
  return !!key && key !== "PLACEHOLDER";
}

import twilio from "twilio";

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN !== "PLACEHOLDER_ADD_TWILIO_TOKEN"
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";

export interface SendSmsParams {
  to: string;
  body: string;
  statusCallback?: string;
}

export interface MakeCallParams {
  to: string;
  twiml?: string;
  url?: string;
  statusCallback?: string;
}

export async function sendSms({ to, body, statusCallback }: SendSmsParams) {
  if (!client) {
    console.warn("[Twilio] Not configured - SMS not sent:", { to, body: body.substring(0, 50) });
    return { success: false, error: "Twilio not configured", sid: null };
  }

  try {
    const message = await client.messages.create({
      to,
      from: FROM_NUMBER,
      body,
      statusCallback,
    });
    return { success: true, sid: message.sid, error: null };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[Twilio] SMS error:", msg);
    return { success: false, sid: null, error: msg };
  }
}

export async function makeCall({ to, twiml, url, statusCallback }: MakeCallParams) {
  if (!client) {
    console.warn("[Twilio] Not configured - call not made:", { to });
    return { success: false, error: "Twilio not configured", sid: null };
  }

  try {
    const call = await client.calls.create({
      to,
      from: FROM_NUMBER,
      ...(twiml ? { twiml } : {}),
      ...(url ? { url } : {}),
      ...(statusCallback ? { statusCallback } : {}),
    });
    return { success: true, sid: call.sid, error: null };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[Twilio] Call error:", msg);
    return { success: false, sid: null, error: msg };
  }
}

export async function getCallRecording(callSid: string) {
  if (!client) return null;
  try {
    const recordings = await client.calls(callSid).recordings.list();
    return recordings[0] || null;
  } catch {
    return null;
  }
}

export function isConfigured(): boolean {
  return client !== null;
}

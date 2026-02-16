import twilio from "twilio";
import { isWithinSendingHours, formatComplianceFooter, classifyMessage, validateMessageCompliance } from "@/lib/tcpa";
import { isOptedOut } from "@/lib/consent";
import { logAudit } from "@/lib/audit";

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN !== "PLACEHOLDER_ADD_TWILIO_TOKEN"
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";

export interface SendSmsParams {
  to: string;
  body: string;
  statusCallback?: string;
  patientId?: string;
  skipComplianceCheck?: boolean;
}

export interface MakeCallParams {
  to: string;
  twiml?: string;
  url?: string;
  statusCallback?: string;
  patientId?: string;
}

export interface SendResult {
  success: boolean;
  sid: string | null;
  error: string | null;
  complianceBlocked?: boolean;
}

/**
 * Send an SMS with TCPA compliance checks.
 * Automatically: validates sending hours, checks opt-outs, appends compliance footer.
 */
export async function sendSms({ to, body, statusCallback, patientId, skipComplianceCheck }: SendSmsParams): Promise<SendResult> {
  if (!client) {
    console.warn("[Twilio] Not configured - SMS not sent:", { to, body: body.substring(0, 50) });
    return { success: false, error: "Twilio not configured", sid: null };
  }

  // TCPA compliance checks (can be skipped for system messages)
  if (!skipComplianceCheck) {
    // Check sending hours
    if (!isWithinSendingHours()) {
      await logAudit({
        action: "sms.blocked.hours",
        resourceType: "outreach",
        details: { to, reason: "Outside TCPA sending hours" },
      });
      return { success: false, sid: null, error: "Outside TCPA sending hours (8 AM - 9 PM)", complianceBlocked: true };
    }

    // Check opt-out status
    const optedOut = await isOptedOut(to, "sms");
    if (optedOut) {
      await logAudit({
        action: "sms.blocked.optout",
        resourceType: "outreach",
        details: { to, reason: "Recipient opted out" },
      });
      return { success: false, sid: null, error: "Recipient has opted out of SMS", complianceBlocked: true };
    }

    // Validate message content
    const compliance = validateMessageCompliance(body);
    if (!compliance.valid) {
      console.warn("[Twilio] Compliance warnings:", compliance.reasons);
    }

    // Append compliance footer
    const messageType = classifyMessage(body);
    body = body + formatComplianceFooter(messageType);
  }

  try {
    const message = await client.messages.create({
      to,
      from: FROM_NUMBER,
      body,
      statusCallback,
    });

    await logAudit({
      action: "sms.sent",
      resourceType: "outreach",
      details: { to, sid: message.sid, patientId, bodyLength: body.length },
    });

    return { success: true, sid: message.sid, error: null };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[Twilio] SMS error:", msg);
    return { success: false, sid: null, error: msg };
  }
}

/**
 * Make a phone call with TCPA compliance checks.
 */
export async function makeCall({ to, twiml, url, statusCallback, patientId }: MakeCallParams): Promise<SendResult> {
  if (!client) {
    console.warn("[Twilio] Not configured - call not made:", { to });
    return { success: false, error: "Twilio not configured", sid: null };
  }

  // Check sending hours for automated calls
  if (!isWithinSendingHours()) {
    return { success: false, sid: null, error: "Outside TCPA calling hours (8 AM - 9 PM)", complianceBlocked: true };
  }

  // Check opt-out
  const optedOut = await isOptedOut(to, "voice");
  if (optedOut) {
    return { success: false, sid: null, error: "Recipient has opted out of voice calls", complianceBlocked: true };
  }

  try {
    const call = await client.calls.create({
      to,
      from: FROM_NUMBER,
      ...(twiml ? { twiml } : {}),
      ...(url ? { url } : {}),
      ...(statusCallback ? { statusCallback } : {}),
    });

    await logAudit({
      action: "call.initiated",
      resourceType: "outreach",
      details: { to, sid: call.sid, patientId },
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

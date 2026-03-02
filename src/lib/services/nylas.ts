import { createHmac, timingSafeEqual } from "crypto";

const NYLAS_API_URI = process.env.NYLAS_API_URI || "https://api.us.nylas.com";
const NYLAS_API_KEY = process.env.NYLAS_API_KEY || "";

export function isConfigured(): boolean {
  return !!NYLAS_API_KEY;
}

/**
 * Verify a Nylas webhook signature using HMAC-SHA256.
 * Nylas signs the raw request body with the webhook secret.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expected = createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("hex");
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return false;
    return timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

/**
 * Download an attachment from Nylas and return it as a Buffer.
 */
export async function downloadAttachment(
  grantId: string,
  messageId: string,
  attachmentId: string
): Promise<Buffer | null> {
  try {
    const url = `${NYLAS_API_URI}/v3/grants/${grantId}/attachments/${attachmentId}/download?message_id=${messageId}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${NYLAS_API_KEY}`,
        Accept: "application/octet-stream",
      },
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

/**
 * Fetch full message details from Nylas.
 */
export async function fetchMessage(
  grantId: string,
  messageId: string
): Promise<NylasMessage | null> {
  try {
    const url = `${NYLAS_API_URI}/v3/grants/${grantId}/messages/${messageId}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${NYLAS_API_KEY}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as NylasMessage;
  } catch {
    return null;
  }
}

export interface NylasAttachment {
  attachment_id: string;
  filename: string;
  content_type: string;
  size: number;
}

export interface NylasMessage {
  id: string;
  grant_id: string;
  thread_id: string;
  subject: string | null;
  from: Array<{ name: string; email: string }>;
  to: Array<{ name: string; email: string }>;
  body: string | null;
  snippet: string | null;
  attachments?: NylasAttachment[];
  date: number; // unix timestamp
}

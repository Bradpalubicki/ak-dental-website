import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

/** Verify cron secret from Authorization header with timing-safe comparison */
export function verifyCronSecret(req: NextRequest): { valid: boolean; response?: NextResponse } {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error("[Cron] CRON_SECRET not configured");
    return {
      valid: false,
      response: NextResponse.json({ error: "Cron not configured" }, { status: 503 }),
    };
  }

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  if (!token || token.length !== secret.length) {
    return {
      valid: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  try {
    const isValid = timingSafeEqual(
      Buffer.from(token, "utf-8"),
      Buffer.from(secret, "utf-8")
    );

    if (!isValid) {
      return {
        valid: false,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }
  } catch {
    return {
      valid: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { valid: true };
}

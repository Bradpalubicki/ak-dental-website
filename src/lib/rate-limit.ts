import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60_000);

/**
 * Simple in-memory rate limiter for Vercel serverless.
 * Per-instance (not global), but prevents abuse from a single IP on a single instance.
 * For production-grade global rate limiting, use Upstash Redis.
 */
export function rateLimit(
  req: NextRequest,
  opts: { limit: number; windowMs: number; prefix?: string }
): { allowed: boolean; response?: NextResponse } {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const key = `${opts.prefix || "rl"}:${ip}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { allowed: true };
  }

  if (entry.count >= opts.limit) {
    return {
      allowed: false,
      response: NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)),
          },
        }
      ),
    };
  }

  entry.count++;
  return { allowed: true };
}

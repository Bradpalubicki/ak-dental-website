/**
 * NuStack Secrets Manager
 *
 * Priority: Infisical (encrypted, centralized) → process.env (fallback)
 *
 * Security tiers:
 *   CRITICAL  — bank data, passwords, payment tokens → Infisical only
 *   HIGH      — API keys, OAuth secrets → Infisical preferred
 *   STANDARD  — public config → process.env fine
 *
 * Usage:
 *   import { getSecret, getCriticalSecret } from "@/lib/secrets";
 *   const key = await getSecret("ANTHROPIC_API_KEY");
 *   const token = await getCriticalSecret("SQUARE_ACCESS_TOKEN"); // throws if missing
 */

import { InfisicalSDK } from "@infisical/sdk";

let _client: InfisicalSDK | null = null;
const _cache = new Map<string, string>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const _cacheTimestamps = new Map<string, number>();

async function getClient(): Promise<InfisicalSDK | null> {
  const url = process.env.INFISICAL_URL;
  const clientId = process.env.INFISICAL_CLIENT_ID;
  const clientSecret = process.env.INFISICAL_CLIENT_SECRET;

  if (!url || !clientId || !clientSecret) return null;

  if (_client) return _client;

  try {
    const client = new InfisicalSDK({ siteUrl: url });
    await client.auth().universalAuth.login({ clientId, clientSecret });
    _client = client;
    return client;
  } catch {
    // Infisical unavailable — fall through to env
    return null;
  }
}

/**
 * Fetch a secret from Infisical with env fallback.
 * Returns null if not found in either source.
 */
export async function getSecret(key: string, environment = "production"): Promise<string | null> {
  // Cache check
  const cached = _cache.get(key);
  const ts = _cacheTimestamps.get(key) ?? 0;
  if (cached && Date.now() - ts < CACHE_TTL_MS) return cached;

  // Try Infisical
  const client = await getClient();
  if (client) {
    try {
      const projectId = process.env.INFISICAL_PROJECT_ID!;
      const secret = await client.secrets().getSecret({
        secretName: key,
        projectId,
        environment,
      });
      const value = secret.secretValue;
      if (value) {
        _cache.set(key, value);
        _cacheTimestamps.set(key, Date.now());
        return value;
      }
    } catch {
      // Not in Infisical — fall through
    }
  }

  // Fallback to process.env
  const envVal = process.env[key];
  if (envVal) {
    _cache.set(key, envVal);
    _cacheTimestamps.set(key, Date.now());
    return envVal;
  }

  return null;
}

/**
 * Fetch a CRITICAL secret (bank data, payment tokens, passwords).
 * Throws if not found — critical secrets must never silently fail.
 */
export async function getCriticalSecret(key: string): Promise<string> {
  const value = await getSecret(key);
  if (!value) {
    throw new Error(
      `[secrets] CRITICAL secret "${key}" is missing from both Infisical and environment. ` +
      `This secret is required for secure operation. Add it to Infisical or your environment.`
    );
  }
  return value;
}

/**
 * Prefetch multiple secrets at once (reduces round trips).
 */
export async function prefetchSecrets(keys: string[]): Promise<void> {
  await Promise.allSettled(keys.map((k) => getSecret(k)));
}

/**
 * Clear the in-memory cache (useful after secret rotation).
 */
export function clearSecretsCache(): void {
  _cache.clear();
  _cacheTimestamps.clear();
  _client = null;
}

// ─── Typed helpers for common secrets ────────────────────────────────────────
// Use these instead of raw process.env in route handlers

export const secrets = {
  anthropic: () => getCriticalSecret("ANTHROPIC_API_KEY"),
  square: {
    accessToken: () => getCriticalSecret("SQUARE_ACCESS_TOKEN"),
    locationId: () => getCriticalSecret("SQUARE_LOCATION_ID"),
    appId: () => getSecret("NEXT_PUBLIC_SQUARE_APP_ID"),
    webhookSignatureKey: () => getCriticalSecret("SQUARE_WEBHOOK_SIGNATURE_KEY"),
  },
  google: {
    clientId: () => getSecret("GOOGLE_CLIENT_ID"),
    clientSecret: () => getCriticalSecret("GOOGLE_CLIENT_SECRET"),
    pagespeedKey: () => getSecret("PAGESPEED_API_KEY"),
  },
  resend: () => getCriticalSecret("RESEND_API_KEY"),
  twilio: {
    accountSid: () => getSecret("TWILIO_ACCOUNT_SID"),
    authToken: () => getCriticalSecret("TWILIO_AUTH_TOKEN"),
  },
  clerk: {
    secretKey: () => getCriticalSecret("CLERK_SECRET_KEY"),
  },
  cron: () => getSecret("CRON_SECRET"),
};

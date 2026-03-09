/**
 * NuStack Feature Flags
 * Controls visibility of features that are incomplete, pending setup, or not yet live.
 * All checks are server-side (env vars). No client exposure.
 *
 * To enable a feature: set the env var to "true" in Vercel + .env.local
 * All flags default to OFF (false) unless env var is explicitly "true"
 */

function flag(envVar: string): boolean {
  return process.env[envVar]?.trim() === "true";
}

export const FEATURES = {
  // Benefits enrollment — tables exist but logic is incomplete
  benefits: flag("FEATURE_BENEFITS"),

  // Gusto payroll — blocked on domain/DNS setup
  gusto: flag("FEATURE_GUSTO"),

  // Vapi AI calls — requires client to configure their Vapi number
  // Auto-enabled if VAPI_API_KEY is present and non-empty
  vapi: flag("FEATURE_VAPI") || (!!process.env.VAPI_API_KEY && process.env.VAPI_API_KEY.length > 10),

  // Google for Jobs — scaffold only, not wired
  googleJobs: flag("FEATURE_GOOGLE_JOBS"),

  // Checkr background checks — not started
  checkr: flag("FEATURE_CHECKR"),

  // LinkedIn OAuth — account not verified
  linkedinOauth: flag("FEATURE_LINKEDIN_OAUTH"),

  // Facebook OAuth — account not verified
  facebookOauth: flag("FEATURE_FACEBOOK_OAUTH"),

  // Dentrix eClaims direct connection — requires client to call Dentrix
  dentrixEclaims: flag("FEATURE_DENTRIX_ECLAIMS"),
} as const;

export type FeatureKey = keyof typeof FEATURES;

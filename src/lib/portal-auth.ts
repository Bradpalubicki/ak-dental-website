import { createServerSupabase } from "@/lib/supabase/server";
import { createServiceSupabase } from "@/lib/supabase/server";

/**
 * Get the authenticated patient from Supabase Auth session.
 * Returns the patient record if authenticated, null otherwise.
 */
export async function getPortalPatient() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const service = createServiceSupabase();
  const { data: patient } = await service
    .from("oe_patients")
    .select("*")
    .eq("email", user.email)
    .single();

  return patient || null;
}

/**
 * Require portal authentication. Returns patient or throws redirect.
 */
export async function requirePortalAuth() {
  const patient = await getPortalPatient();
  if (!patient) {
    throw new Error("PORTAL_AUTH_REQUIRED");
  }
  return patient;
}

/**
 * Verify portal auth from API route context.
 * Returns { patient, error } - check error for auth failure.
 */
export async function verifyPortalApiAuth() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return { patient: null, error: "Not authenticated" };
  }

  const service = createServiceSupabase();
  const { data: patient, error } = await service
    .from("oe_patients")
    .select("*")
    .eq("email", user.email)
    .single();

  if (error || !patient) {
    return { patient: null, error: "Patient record not found" };
  }

  return { patient, error: null };
}

// Shared helper — checks if all 3 Alex onboarding docs are signed,
// and if so, sends Clerk org invite. Idempotent.

import { createServiceSupabase } from "@/lib/supabase/server";

const ALEX_EMAIL = "info@akultimatedental.com";
const CLERK_ORG_ID = "org_3AKehZTvqP9Np80O4JYStB3LWUC";
const REQUIRED_DOCS = [
  "master_platform_agreement",
  "technology_services_authorization",
  "state_addendum",
];

export interface InviteResult {
  allSigned: boolean;
  invited: boolean;
  missing?: string[];
  note?: string;
}

export async function sendClerkInviteIfAllSigned(): Promise<InviteResult> {
  const supabase = createServiceSupabase();

  const { data: signedDocs } = await supabase
    .from("oe_offer_letters")
    .select("document_type")
    .eq("candidate_email", ALEX_EMAIL)
    .in("document_type", REQUIRED_DOCS)
    .eq("status", "signed");

  const signedTypes = new Set((signedDocs ?? []).map((d: { document_type: string }) => d.document_type));
  const allSigned = REQUIRED_DOCS.every((dt) => signedTypes.has(dt));

  if (!allSigned) {
    const missing = REQUIRED_DOCS.filter((dt) => !signedTypes.has(dt));
    return { allSigned: false, invited: false, missing };
  }

  const clerkRes = await fetch(
    `https://api.clerk.com/v1/organizations/${CLERK_ORG_ID}/invitations`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: ALEX_EMAIL, role: "org:member" }),
    }
  );

  if (!clerkRes.ok) {
    const err = await clerkRes.json().catch(() => ({})) as { errors?: Array<{ code?: string }> };
    const alreadyExists = (err.errors ?? []).some(
      (e) => e.code === "duplicate_record" || e.code === "already_a_member"
    );
    if (alreadyExists) {
      return { allSigned: true, invited: true, note: "Already invited or member" };
    }
    throw new Error(`Clerk invitation failed: ${JSON.stringify(err)}`);
  }

  return { allSigned: true, invited: true };
}

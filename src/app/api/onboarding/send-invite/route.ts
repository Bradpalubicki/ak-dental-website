// POST /api/onboarding/send-invite
// Checks whether all 3 Alex onboarding documents are signed.
// If yes, sends a Clerk org invitation to info@akultimatedental.com.
// Idempotent — returns 200 with existing status if already sent.

// GET /api/onboarding/send-invite
// Returns current signing status without triggering invite.

import { NextResponse } from "next/server";
import { tryAuth } from "@/lib/auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { sendClerkInviteIfAllSigned } from "@/lib/onboarding/send-clerk-invite";

const ALEX_EMAIL = "info@akultimatedental.com";
const REQUIRED_DOCS = [
  "master_platform_agreement",
  "technology_services_authorization",
  "state_addendum",
];

export async function POST() {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const result = await sendClerkInviteIfAllSigned();
  return NextResponse.json(result);
}

export async function GET() {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const supabase = createServiceSupabase();

  const { data: docs } = await supabase
    .from("oe_offer_letters")
    .select("document_type, status, signed_at")
    .eq("candidate_email", ALEX_EMAIL)
    .in("document_type", REQUIRED_DOCS);

  const status: Record<string, { status: string; signed_at: string | null }> = {};
  for (const doc of docs ?? []) {
    status[doc.document_type] = { status: doc.status, signed_at: doc.signed_at };
  }

  const allSigned = REQUIRED_DOCS.every((dt) => status[dt]?.status === "signed");

  return NextResponse.json({ allSigned, documents: status });
}

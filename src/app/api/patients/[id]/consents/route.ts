import { NextRequest, NextResponse } from "next/server";
import { tryAuth } from "@/lib/auth";
import { getConsentStatus, recordConsent, type ConsentType, type ConsentStatus, type ConsentMethod } from "@/lib/consent";
import { logPhiAccess } from "@/lib/audit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;

  await logPhiAccess("consent.view", "patient", id);
  const consents = await getConsentStatus(id);

  return NextResponse.json(consents);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const body = await req.json();

  const { consent_type, status, method, document_url, notes } = body as {
    consent_type: ConsentType;
    status: ConsentStatus;
    method?: ConsentMethod;
    document_url?: string;
    notes?: string;
  };

  if (!consent_type || !status) {
    return NextResponse.json(
      { error: "consent_type and status are required" },
      { status: 400 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;

  await logPhiAccess("consent.update", "patient", id, { consent_type, status });

  const success = await recordConsent({
    patient_id: id,
    consent_type,
    status,
    method,
    document_url,
    ip_address: ip,
    notes,
  });

  if (!success) {
    return NextResponse.json({ error: "Failed to record consent" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

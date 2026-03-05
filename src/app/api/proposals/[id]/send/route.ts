import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/services/resend";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceSupabase();

  // Fetch proposal with patient
  const { data: proposal, error: pErr } = await supabase
    .from("oe_proposals")
    .select(`
      *,
      patient:oe_patients(id, first_name, last_name, email),
      provider:oe_providers(id, first_name, last_name)
    `)
    .eq("id", id)
    .single();

  if (pErr || !proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  if (proposal.status !== "draft" && proposal.status !== "sent") {
    return NextResponse.json({ error: "Proposal cannot be sent in its current state" }, { status: 409 });
  }

  const patient = proposal.patient as { first_name: string; last_name: string; email: string } | null;
  const provider = proposal.provider as { first_name: string; last_name: string } | null;

  if (!patient?.email) {
    return NextResponse.json({ error: "Patient has no email address on file" }, { status: 422 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://akultimatedental.com";
  const proposalUrl = `${appUrl}/proposal/${proposal.sign_token}`;
  const providerName = provider
    ? `Dr. ${provider.first_name} ${provider.last_name}`
    : "Your dental provider";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px;">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0891b2 0%,#0e7490 100%);border-radius:12px 12px 0 0;padding:32px 32px 28px;">
    <h1 style="margin:0;color:white;font-size:22px;font-weight:700;letter-spacing:-0.3px;">AK Ultimate Dental</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Your Personalized Treatment Plan</p>
  </div>

  <!-- Body -->
  <div style="background:white;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:32px;">
    <p style="margin:0 0 16px;color:#0f172a;font-size:16px;">Hi ${patient.first_name},</p>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
      ${providerName} has prepared a personalized treatment plan for you. Please review the procedures, pricing, and financing options at your convenience.
    </p>

    <!-- Summary box -->
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:20px;margin-bottom:28px;">
      <p style="margin:0 0 8px;color:#0369a1;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">${proposal.title}</p>
      <div style="display:flex;gap:24px;flex-wrap:wrap;">
        <div>
          <p style="margin:0;color:#64748b;font-size:11px;">Practice Fee</p>
          <p style="margin:2px 0 0;color:#0f172a;font-size:18px;font-weight:700;">${fmt(proposal.total_fee)}</p>
        </div>
        <div>
          <p style="margin:0;color:#64748b;font-size:11px;">Insurance Estimate</p>
          <p style="margin:2px 0 0;color:#059669;font-size:18px;font-weight:700;">−${fmt(proposal.insurance_estimate)}</p>
        </div>
        <div>
          <p style="margin:0;color:#64748b;font-size:11px;">Your Estimated Cost</p>
          <p style="margin:2px 0 0;color:#0891b2;font-size:22px;font-weight:800;">${fmt(proposal.patient_estimate)}</p>
        </div>
      </div>
    </div>

    ${proposal.financing_provider && proposal.financing_monthly ? `
    <!-- Financing hint -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:28px;">
      <p style="margin:0;color:#166534;font-size:14px;font-weight:600;">
        💳 Financing available — as low as ${fmt(proposal.financing_monthly)}/mo with ${proposal.financing_provider === "cherry" ? "Cherry" : proposal.financing_provider === "sunbit" ? "Sunbit" : "CareCredit"}
      </p>
      <p style="margin:4px 0 0;color:#16a34a;font-size:13px;">See all financing options in your treatment plan</p>
    </div>
    ` : ""}

    <!-- CTA Button -->
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${proposalUrl}"
        style="display:inline-block;background:linear-gradient(135deg,#0891b2 0%,#0e7490 100%);color:white;text-decoration:none;font-size:16px;font-weight:700;padding:16px 40px;border-radius:10px;letter-spacing:0.02em;">
        Review &amp; Accept My Treatment Plan →
      </a>
    </div>

    <p style="margin:0 0 12px;color:#94a3b8;font-size:12px;text-align:center;">
      This link is unique to you and expires on ${new Date(proposal.expires_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
    </p>
    <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
      Questions? Call us at (702) 935-4395 or reply to this email.
    </p>
  </div>

  <p style="text-align:center;color:#94a3b8;font-size:11px;margin-top:16px;">
    AK Ultimate Dental · 7480 W Sahara Ave, Las Vegas, NV 89117 · (702) 935-4395
  </p>
</div>
</body>
</html>
  `.trim();

  const emailResult = await sendEmail({
    to: patient.email,
    subject: `Your Treatment Plan from AK Ultimate Dental — ${fmt(proposal.patient_estimate)} estimated cost`,
    html,
    replyTo: "dr.alex@akultimatedental.com",
  });

  // Update status regardless of email success (link still valid)
  const { error: updateErr } = await supabase
    .from("oe_proposals")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    email_sent: emailResult.success,
    proposal_url: proposalUrl,
  });
}

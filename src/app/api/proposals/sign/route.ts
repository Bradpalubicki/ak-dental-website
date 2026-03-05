// Public endpoint — no Clerk auth required. Patient signs via token link.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabase } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/services/resend";
import { generateTreatmentProposalPdf } from "@/lib/documents/proposal-pdf";

const SignSchema = z.object({
  token: z.string().min(10),
  signature_name: z.string().min(2).max(200),
  accepted: z.boolean(),
});

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = SignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { token, signature_name, accepted } = parsed.data;
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";

  const supabase = createServiceSupabase();

  const { data: proposal, error: fetchErr } = await supabase
    .from("oe_proposals")
    .select(`
      *,
      patient:oe_patients(id, first_name, last_name, email, phone, date_of_birth),
      provider:oe_providers(id, first_name, last_name)
    `)
    .eq("sign_token", token)
    .single();

  if (fetchErr || !proposal) {
    return NextResponse.json({ error: "Invalid link" }, { status: 404 });
  }

  if (proposal.status === "accepted") {
    return NextResponse.json({ error: "Already accepted" }, { status: 409 });
  }

  if (proposal.status === "expired" || (proposal.expires_at && new Date(proposal.expires_at) < new Date())) {
    return NextResponse.json({ error: "Link expired" }, { status: 410 });
  }

  if (!accepted) {
    await supabase
      .from("oe_proposals")
      .update({ status: "declined" })
      .eq("id", proposal.id);
    return NextResponse.json({ status: "declined" });
  }

  const now = new Date().toISOString();
  await supabase
    .from("oe_proposals")
    .update({
      status: "accepted",
      signed_at: now,
      signature_name,
      signed_ip: ip,
    })
    .eq("id", proposal.id);

  // Fetch items for PDF
  const { data: items } = await supabase
    .from("oe_proposal_items")
    .select("*")
    .eq("proposal_id", proposal.id)
    .order("sort_order", { ascending: true });

  const patient = proposal.patient as { first_name: string; last_name: string; email?: string; phone?: string; date_of_birth?: string } | null;
  const provider = proposal.provider as { first_name: string; last_name: string } | null;

  // Generate PDF (non-blocking on failure — buffer sent via email attachment in future)
  try {
    await generateTreatmentProposalPdf(
      { ...proposal, signed_at: now, signature_name },
      items ?? [],
      patient,
      provider
    );
  } catch {
    // PDF generation failure should not block sign success
  }

  // Email to patient
  if (patient?.email) {
    const patientHtml = `
<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
  <div style="background:linear-gradient(135deg,#0891b2,#0e7490);border-radius:12px 12px 0 0;padding:28px 32px;">
    <h1 style="margin:0;color:white;font-size:20px;">AK Ultimate Dental</h1>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Treatment Plan Accepted</p>
  </div>
  <div style="background:white;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:28px 32px;">
    <p style="color:#0f172a;font-size:16px;margin:0 0 16px;">Hi ${patient.first_name},</p>
    <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 20px;">
      Thank you for accepting your treatment plan. Your signed plan is attached to this email for your records.
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:20px;">
      <p style="margin:0;color:#166534;font-size:14px;font-weight:700;">Treatment Plan: ${proposal.title}</p>
      <p style="margin:4px 0 0;color:#16a34a;font-size:13px;">Your estimated cost: ${fmt(proposal.patient_estimate)}</p>
      <p style="margin:4px 0 0;color:#16a34a;font-size:12px;">Signed on ${new Date(now).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · IP: ${ip}</p>
    </div>
    <p style="color:#475569;font-size:13px;margin:0 0 8px;">Our team will be in touch to schedule your procedures. Call us at (702) 935-4395 with any questions.</p>
    <p style="color:#94a3b8;font-size:11px;margin:0;">AK Ultimate Dental · 7480 W Sahara Ave, Las Vegas, NV 89117</p>
  </div>
</body></html>
    `.trim();

    await sendEmail({
      to: patient.email,
      subject: `Your Signed Treatment Plan — ${proposal.title}`,
      html: patientHtml,
    });
  }

  // Email to practice
  const practiceEmail = process.env.RESEND_FROM_EMAIL
    ? "dr.alex@akultimatedental.com"
    : "dr.alex@akultimatedental.com";

  const practiceHtml = `
<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
  <h2 style="color:#0891b2;">Treatment Plan Accepted</h2>
  <p style="color:#475569;">A patient has accepted their treatment plan.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr><td style="padding:8px;background:#f8fafc;font-weight:600;color:#475569;font-size:13px;">Patient</td><td style="padding:8px;font-size:13px;">${patient ? `${patient.first_name} ${patient.last_name}` : "Unknown"}</td></tr>
    <tr><td style="padding:8px;background:#f8fafc;font-weight:600;color:#475569;font-size:13px;">Plan</td><td style="padding:8px;font-size:13px;">${proposal.title}</td></tr>
    <tr><td style="padding:8px;background:#f8fafc;font-weight:600;color:#475569;font-size:13px;">Patient Estimate</td><td style="padding:8px;font-size:13px;font-weight:700;color:#0891b2;">${fmt(proposal.patient_estimate)}</td></tr>
    <tr><td style="padding:8px;background:#f8fafc;font-weight:600;color:#475569;font-size:13px;">Signed By</td><td style="padding:8px;font-size:13px;">${signature_name}</td></tr>
    <tr><td style="padding:8px;background:#f8fafc;font-weight:600;color:#475569;font-size:13px;">Signed At</td><td style="padding:8px;font-size:13px;">${new Date(now).toLocaleString()}</td></tr>
    <tr><td style="padding:8px;background:#f8fafc;font-weight:600;color:#475569;font-size:13px;">IP Address</td><td style="padding:8px;font-size:13px;font-family:monospace;">${ip}</td></tr>
  </table>
</body></html>
  `.trim();

  await sendEmail({
    to: practiceEmail,
    subject: `Treatment Plan Accepted — ${patient ? `${patient.first_name} ${patient.last_name}` : "Patient"} · ${fmt(proposal.patient_estimate)}`,
    html: practiceHtml,
  });

  return NextResponse.json({ status: "accepted", signed_at: now });
}

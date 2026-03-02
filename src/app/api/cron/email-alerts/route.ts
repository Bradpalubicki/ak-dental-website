import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { verifyCronSecret } from "@/lib/cron-auth";
import { sendEmail } from "@/lib/services/resend";

const ALERT_EMAIL = "dr.alex@akultimatedental.com";

// GET /api/cron/email-alerts
// Checks for: overdue bills, cold threads >72h unread, unread messages
// Sends a digest email if there's anything worth surfacing
export async function GET(req: NextRequest) {
  const auth = verifyCronSecret(req);
  if (!auth.valid) return auth.response!;

  const supabase = createServiceSupabase();
  const now = new Date();
  const cutoff72h = new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString();

  const [overdueBillsRes, coldThreadsRes, pendingDraftsRes] = await Promise.all([
    supabase
      .from("oe_accounts_payable")
      .select("vendor, amount, due_date, invoice_number")
      .eq("status", "overdue")
      .order("due_date", { ascending: true })
      .limit(10),

    supabase
      .from("oe_email_messages")
      .select("from_name, from_email, subject, created_at")
      .eq("classification", "inquiry")
      .eq("processed", true)
      .lte("created_at", cutoff72h)
      .not("id", "in",
        `(SELECT source_message_id FROM oe_email_drafts WHERE status IN ('approved','sent') AND source_message_id IS NOT NULL)`
      )
      .order("created_at", { ascending: true })
      .limit(10),

    supabase
      .from("oe_email_drafts")
      .select("to_email, subject, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(5),
  ]);

  const overdueBills = overdueBillsRes.data || [];
  const coldThreads = coldThreadsRes.data || [];
  const pendingDrafts = pendingDraftsRes.data || [];

  // Nothing to report
  if (overdueBills.length === 0 && coldThreads.length === 0 && pendingDrafts.length === 0) {
    return NextResponse.json({ skipped: true, reason: "Nothing to alert" });
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const overdueSect = overdueBills.length > 0
    ? `
    <h3 style="color:#dc2626;margin:0 0 8px">🔴 Overdue Bills (${overdueBills.length})</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px">
      <tr style="background:#fef2f2">
        <th style="text-align:left;padding:6px 8px;border:1px solid #fecaca">Vendor</th>
        <th style="text-align:right;padding:6px 8px;border:1px solid #fecaca">Amount</th>
        <th style="text-align:left;padding:6px 8px;border:1px solid #fecaca">Due Date</th>
      </tr>
      ${overdueBills.map(b => `
        <tr>
          <td style="padding:6px 8px;border:1px solid #fecaca">${b.vendor}</td>
          <td style="padding:6px 8px;border:1px solid #fecaca;text-align:right">$${Number(b.amount).toFixed(2)}</td>
          <td style="padding:6px 8px;border:1px solid #fecaca">${b.due_date ? formatDate(b.due_date) : "—"}</td>
        </tr>`).join("")}
    </table>`
    : "";

  const coldSect = coldThreads.length > 0
    ? `
    <h3 style="color:#d97706;margin:0 0 8px">🟡 Cold Threads — No Reply in 72h+ (${coldThreads.length})</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px">
      <tr style="background:#fffbeb">
        <th style="text-align:left;padding:6px 8px;border:1px solid #fed7aa">From</th>
        <th style="text-align:left;padding:6px 8px;border:1px solid #fed7aa">Subject</th>
        <th style="text-align:left;padding:6px 8px;border:1px solid #fed7aa">Received</th>
      </tr>
      ${coldThreads.map(t => `
        <tr>
          <td style="padding:6px 8px;border:1px solid #fed7aa">${t.from_name || t.from_email}</td>
          <td style="padding:6px 8px;border:1px solid #fed7aa">${t.subject || "(no subject)"}</td>
          <td style="padding:6px 8px;border:1px solid #fed7aa">${formatDate(t.created_at)}</td>
        </tr>`).join("")}
    </table>`
    : "";

  const draftsSect = pendingDrafts.length > 0
    ? `
    <h3 style="color:#0891b2;margin:0 0 8px">📝 Drafts Awaiting Approval (${pendingDrafts.length})</h3>
    <p style="font-size:13px;margin:0 0 16px">
      ${pendingDrafts.map(d => `Reply to ${d.to_email}: "${d.subject}"`).join("<br>")}
    </p>`
    : "";

  const totalAlerts = overdueBills.length + coldThreads.length + pendingDrafts.length;

  await sendEmail({
    to: ALERT_EMAIL,
    subject: `⚠️ AK Dental Email Alerts — ${totalAlerts} item${totalAlerts !== 1 ? "s" : ""} need attention`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0891b2;color:white;padding:20px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:18px">AK Ultimate Dental — Action Required</h1>
          <p style="margin:4px 0 0;opacity:.9;font-size:13px">
            ${now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px">
          ${overdueSect}
          ${coldSect}
          ${draftsSect}
          <p style="margin:20px 0 0">
            <a href="https://ak-dental-website.vercel.app/dashboard/email"
               style="background:#0891b2;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600">
              Open Email Hub →
            </a>
          </p>
          <p style="font-size:11px;color:#94a3b8;margin-top:20px">
            Sent by One Engine AI · AK Ultimate Dental
          </p>
        </div>
      </div>
    `,
    replyTo: "dr.alex@akultimatedental.com",
  });

  return NextResponse.json({
    success: true,
    alertsSent: totalAlerts,
    overdue: overdueBills.length,
    coldThreads: coldThreads.length,
    pendingDrafts: pendingDrafts.length,
  });
}

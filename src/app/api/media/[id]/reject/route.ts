import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { requireApiAuth } from "@/lib/api-auth";
import { createServiceSupabase } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/config";

type RouteContext = { params: Promise<{ id: string }> };

const BodySchema = z.object({
  reason: z.string().min(1, "Rejection reason required"),
});

// POST /api/media/[id]/reject — NuStack admin rejects a pending asset
export async function POST(req: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth();
  if (!auth.allowed) return auth.response!;

  const { id } = await context.params;
  const body = BodySchema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json({ error: "Rejection reason is required" }, { status: 400 });
  }

  const supabase = createServiceSupabase();

  const { data: asset, error: fetchError } = await supabase
    .from("media_assets")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  const { error: updateError } = await supabase
    .from("media_assets")
    .update({
      status: "rejected",
      rejection_reason: body.data.reason,
      reviewed_by: auth.userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Send rejection email via Resend
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: `${siteConfig.name} <noreply@akultimatedental.com>`,
      to: [siteConfig.email],
      subject: `Photo upload could not be published — action needed`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Photo Upload Update</h2>
          <p>Hi,</p>
          <p>We reviewed a recently uploaded photo and were unable to publish it at this time.</p>
          <p><strong>Reason:</strong> ${body.data.reason}</p>
          <p>Please log in to your dashboard to review the photo and re-upload with the correction if needed.</p>
          <p>
            <a href="${siteConfig.url}/dashboard/media"
               style="display:inline-block;background:#1e40af;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">
              View My Media
            </a>
          </p>
          <p style="color:#666;font-size:12px;">
            Questions? Reply to this email or call ${siteConfig.phone}.
          </p>
        </div>
      `,
    });
  } catch {
    // Email failure is non-fatal
  }

  return NextResponse.json({ success: true });
}

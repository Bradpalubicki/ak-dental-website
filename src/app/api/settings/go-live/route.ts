import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/services/resend";

export async function POST() {
  const { userId, sessionClaims } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const level = (sessionClaims?.publicMetadata as Record<string, string>)?.authorityLevel;
  if (!["admin", "global_admin"].includes(level)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const supabase = createServiceSupabase();
  const now = new Date().toISOString();

  await Promise.all([
    supabase.from("oe_settings").upsert({ key: "go_live_at", value: now, updated_at: now, updated_by: userId }, { onConflict: "key" }),
    supabase.from("oe_settings").upsert({ key: "test_mode", value: "false", updated_at: now, updated_by: userId }, { onConflict: "key" }),
  ]);

  // Notify NuStack and practice
  await Promise.allSettled([
    sendEmail({
      to: "brad@nustack.digital",
      subject: "🎉 AK Ultimate Dental is LIVE",
      html: `<p>AK Ultimate Dental has gone live on ${new Date(now).toLocaleDateString()}. All automated communications are now active and reaching patients.</p>`,
    }),
    sendEmail({
      to: "info@akultimatedental.com",
      subject: "Your AK Dental platform is live!",
      html: `<p>Congratulations — your AK Ultimate Dental operations platform is now live! All patient communications, reminders, and automations are active. Log in at your dashboard to monitor activity.</p><p>Questions? Contact NuStack Digital Ventures at brad@nustack.digital.</p>`,
    }),
  ]);

  return NextResponse.json({ success: true, goLiveAt: now });
}

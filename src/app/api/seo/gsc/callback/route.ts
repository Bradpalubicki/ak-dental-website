import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/config";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/seo?gsc=error`
    );
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/seo/gsc/callback`;

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();
  if (!tokens.access_token) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/seo?gsc=error`
    );
  }

  const supabase = await createServerSupabase();
  const siteUrl = siteConfig.url;
  const expiresAt = new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000);

  // Upsert token (one row per site)
  await supabase.from("seo_gsc_tokens").upsert(
    {
      site_url: siteUrl,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "site_url" }
  );

  // Trigger initial data pull + keyword seed in background
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/seo/gsc/sync`, {
    method: "POST",
    headers: { "x-internal": process.env.CRON_SECRET ?? "" },
  }).catch(() => {});

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/seo?gsc=connected`
  );
}

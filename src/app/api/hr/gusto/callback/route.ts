import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceSupabase } from "@/lib/supabase/server";

/**
 * GET /api/hr/gusto/callback
 * Handles the OAuth callback from Gusto. Exchanges the code for tokens
 * and stores the connection in oe_gusto_connection.
 */
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/hr?tab=payroll`;

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${dashboardUrl}&gusto_error=${encodeURIComponent(error || "no_code")}`);
  }

  if (!userId) {
    return NextResponse.redirect(`${dashboardUrl}&gusto_error=unauthorized`);
  }

  const clientId = process.env.GUSTO_CLIENT_ID;
  const clientSecret = process.env.GUSTO_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/hr/gusto/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${dashboardUrl}&gusto_error=not_configured`);
  }

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://api.gusto.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code,
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error("[Gusto callback] Token exchange failed:", errBody);
      return NextResponse.redirect(`${dashboardUrl}&gusto_error=token_exchange_failed`);
    }

    const tokens = await tokenRes.json() as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      token_type: string;
    };

    // Fetch the company info from Gusto
    const meRes = await fetch("https://api.gusto.com/v1/me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const meData = meRes.ok ? await meRes.json() : null;
    const company = meData?.roles?.payroll_admin?.companies?.[0];

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    // Upsert connection record
    const supabase = createServiceSupabase();
    await supabase
      .from("oe_gusto_connection")
      .update({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: expiresAt,
        gusto_company_id: company?.uuid ?? null,
        gusto_company_name: company?.name ?? null,
        status: "connected",
        error_message: null,
        connected_by: userId,
        last_synced_at: new Date().toISOString(),
      })
      .eq("practice_id", "ak-dental");

    return NextResponse.redirect(`${dashboardUrl}&gusto_connected=1`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[Gusto callback] Error:", msg);

    const supabase = createServiceSupabase();
    await supabase
      .from("oe_gusto_connection")
      .update({ status: "error", error_message: msg })
      .eq("practice_id", "ak-dental");

    return NextResponse.redirect(`${dashboardUrl}&gusto_error=${encodeURIComponent(msg)}`);
  }
}

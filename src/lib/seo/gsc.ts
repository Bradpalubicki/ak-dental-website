import { createServerSupabase } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/config";

interface GSCToken {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  site_url: string;
}

interface GSCRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export async function getValidAccessToken(): Promise<string | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("seo_gsc_tokens")
    .select("*")
    .eq("site_url", siteConfig.url)
    .single<GSCToken>();

  if (!data) return null;

  // Refresh if expiring within 5 minutes
  if (new Date(data.expires_at) < new Date(Date.now() + 5 * 60 * 1000)) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: data.refresh_token,
        grant_type: "refresh_token",
      }),
    });
    const refreshed = await res.json();
    if (!refreshed.access_token) return null;

    const expiresAt = new Date(Date.now() + (refreshed.expires_in ?? 3600) * 1000);
    await supabase
      .from("seo_gsc_tokens")
      .update({
        access_token: refreshed.access_token,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("site_url", siteConfig.url);

    return refreshed.access_token;
  }

  return data.access_token;
}

export async function isGSCConnected(): Promise<boolean> {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("seo_gsc_tokens")
    .select("id")
    .eq("site_url", siteConfig.url)
    .single();
  return !!data;
}

export async function fetchGSCSearchAnalytics(
  accessToken: string,
  days = 28
): Promise<GSCRow[]> {
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const siteUrl = encodeURIComponent(siteConfig.url);
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 100,
        orderBy: [{ fieldName: "clicks", sortOrder: "DESCENDING" }],
      }),
    }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.rows ?? [];
}

export async function fetchGSCSummary(accessToken: string, days = 28) {
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const siteUrl = encodeURIComponent(siteConfig.url);
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: [],
        rowLimit: 1,
      }),
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  const row = data.rows?.[0];
  if (!row) return null;
  return {
    clicks: row.clicks as number,
    impressions: row.impressions as number,
    ctr: row.ctr as number,
    position: row.position as number,
  };
}

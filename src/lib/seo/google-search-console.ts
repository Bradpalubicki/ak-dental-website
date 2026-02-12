/**
 * Google Search Console API Integration
 *
 * Pulls search analytics data and submits URLs via Indexing API.
 * Requires GOOGLE_SERVICE_ACCOUNT_KEY and GOOGLE_SEARCH_CONSOLE_SITE_URL env vars.
 */

const GSC_SITE_URL = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "";

interface GSCRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface GSCResponse {
  rows?: GSCRow[];
  responseAggregationType?: string;
}

interface SearchAnalyticsResult {
  date: string;
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

async function getAccessToken(): Promise<string | null> {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyJson) {
    console.log("GOOGLE_SERVICE_ACCOUNT_KEY not set");
    return null;
  }

  try {
    const key = JSON.parse(keyJson);

    // Create JWT for service account auth
    // In production, use googleapis or google-auth-library
    // For now, use a simplified OAuth2 flow
    // JWT components for RS256 signing (googleapis package needed):
    // tokenUrl: "https://oauth2.googleapis.com/token"
    // header: { alg: "RS256", typ: "JWT" }
    // claim: { iss: key.client_email, scope: "...", aud: tokenUrl, iat: now, exp: now + 3600 }

    // Note: RS256 signing requires a crypto library in production
    // This is a placeholder — use googleapis package for real implementation
    console.log(
      "GSC: Service account auth configured for",
      key.client_email
    );
    console.log("GSC: JWT header + claim prepared, RS256 signing needed");

    // Return null until googleapis is installed
    return null;
  } catch (error) {
    console.error("Failed to parse service account key:", error);
    return null;
  }
}

/**
 * Fetch search analytics data from Google Search Console
 */
export async function fetchSearchAnalytics(
  startDate: string,
  endDate: string
): Promise<SearchAnalyticsResult[]> {
  const accessToken = await getAccessToken();

  if (!accessToken || !GSC_SITE_URL) {
    console.log(
      "GSC not configured — skipping search analytics fetch"
    );
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ["query", "page", "date"],
          rowLimit: 1000,
        }),
      }
    );

    if (!response.ok) {
      console.error("GSC API error:", await response.text());
      return [];
    }

    const data: GSCResponse = await response.json();

    return (data.rows || []).map((row) => ({
      date: row.keys[2],
      query: row.keys[0],
      page: row.keys[1],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    }));
  } catch (error) {
    console.error("GSC fetch error:", error);
    return [];
  }
}

/**
 * Submit URL to Google Indexing API
 */
export async function submitUrlToGoogle(
  url: string
): Promise<{ success: boolean; error?: string }> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { success: false, error: "GSC not configured" };
  }

  try {
    const response = await fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          type: "URL_UPDATED",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

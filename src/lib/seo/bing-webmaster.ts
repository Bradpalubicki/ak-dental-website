/**
 * Bing Webmaster API Integration
 *
 * URL submission and sitemap management via Bing Webmaster Tools API.
 * Requires BING_WEBMASTER_API_KEY env var.
 */

import { siteConfig } from "@/lib/config";

const API_KEY = process.env.BING_WEBMASTER_API_KEY || "";
const SITE_URL = siteConfig.url;

/**
 * Submit a URL to Bing for indexing
 */
export async function submitUrlToBing(
  url: string
): Promise<{ success: boolean; error?: string }> {
  if (!API_KEY) {
    return { success: false, error: "BING_WEBMASTER_API_KEY not configured" };
  }

  try {
    const response = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl?apikey=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteUrl: SITE_URL,
          url,
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

/**
 * Submit sitemap to Bing
 */
export async function submitSitemapToBing(): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!API_KEY) {
    return { success: false, error: "BING_WEBMASTER_API_KEY not configured" };
  }

  const sitemapUrl = `${SITE_URL}/sitemap.xml`;

  try {
    const response = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/SubmitSitemap?apikey=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteUrl: SITE_URL,
          feedUrl: sitemapUrl,
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

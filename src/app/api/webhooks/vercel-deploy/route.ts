/**
 * Vercel Deploy Webhook (Engine Template)
 *
 * Called on production deploy via Vercel Deploy Hook.
 * Submits all URLs to IndexNow + Google + Bing for indexing.
 */

import { NextResponse } from "next/server";
import { siteConfig, services } from "@/lib/config";
import { submitUrlsToIndexNow } from "@/lib/seo/indexnow";
import { submitUrlToGoogle } from "@/lib/seo/google-search-console";
import { submitUrlToBing, submitSitemapToBing } from "@/lib/seo/bing-webmaster";

export async function POST(request: Request) {
  // Verify webhook secret
  const authHeader = request.headers.get("authorization");
  if (
    process.env.DEPLOY_WEBHOOK_SECRET &&
    authHeader !== `Bearer ${process.env.DEPLOY_WEBHOOK_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const baseUrl = siteConfig.url;

    // Build list of all indexable URLs
    const urls = [
      baseUrl,
      `${baseUrl}/about`,
      `${baseUrl}/contact`,
      `${baseUrl}/reviews`,
      `${baseUrl}/services`,
      `${baseUrl}/appointment`,
      ...services.map((s) => `${baseUrl}/services/${s.slug}`),
    ];

    const results = {
      indexnow: { submitted: 0, success: false },
      google: { submitted: 0, succeeded: 0 },
      bing: { submitted: 0, succeeded: 0, sitemapSubmitted: false },
    };

    // Submit all URLs to IndexNow
    const indexNowResult = await submitUrlsToIndexNow(urls);
    results.indexnow = {
      submitted: indexNowResult.submitted,
      success: indexNowResult.successful,
    };

    // Submit homepage to Google Indexing API
    const googleResult = await submitUrlToGoogle(baseUrl);
    results.google.submitted = 1;
    if (googleResult.success) results.google.succeeded = 1;

    // Submit homepage to Bing + submit sitemap
    const bingResult = await submitUrlToBing(baseUrl);
    results.bing.submitted = 1;
    if (bingResult.success) results.bing.succeeded = 1;

    const sitemapResult = await submitSitemapToBing();
    results.bing.sitemapSubmitted = sitemapResult.success;

    console.log("Deploy webhook: URL submission complete", results);

    return NextResponse.json({
      success: true,
      urlCount: urls.length,
      results,
    });
  } catch (error) {
    console.error("Deploy webhook failed:", error);
    return NextResponse.json(
      {
        error: "Deploy webhook failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

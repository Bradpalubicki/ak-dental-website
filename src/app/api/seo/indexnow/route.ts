import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  submitUrlToIndexNow,
  submitUrlsToIndexNow,
  getIndexNowConfig,
} from "@/lib/seo/indexnow";

/**
 * IndexNow API Route
 *
 * POST /api/seo/indexnow — Submit URLs to IndexNow (auth required)
 * Body: { url: string } or { urls: string[] }
 *
 * GET /api/seo/indexnow — Return config/usage docs
 */

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (body.url && typeof body.url === "string") {
      const result = await submitUrlToIndexNow(body.url);
      return NextResponse.json(result);
    }

    if (body.urls && Array.isArray(body.urls)) {
      const result = await submitUrlsToIndexNow(body.urls);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        error:
          'Invalid request. Provide either "url" (string) or "urls" (array)',
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ...getIndexNowConfig(),
    documentation: "https://www.indexnow.org/",
    usage: {
      singleUrl: 'POST /api/seo/indexnow with { "url": "https://..." }',
      batchUrls:
        'POST /api/seo/indexnow with { "urls": ["url1", "url2", ...] }',
    },
  });
}

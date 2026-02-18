import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// PUBLIC_REVIEW_MODE=true skips auth for /dashboard/* (NOT /admin/*).
// Useful for sharing preview deployments without Clerk credentials.
const isReviewMode = process.env.PUBLIC_REVIEW_MODE === "true";

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Review mode: skip auth for dashboard (admin stays protected)
  if (isReviewMode && !req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // All routes that reach this middleware need Clerk protection
  await auth.protect({
    unauthenticatedUrl: new URL("/sign-in", req.url).toString(),
  });
});

// Only run Clerk middleware on routes that actually need auth.
// Marketing pages, portal routes, static assets, and public APIs
// never hit this middleware — no Clerk handshake, no redirects.
export const config = {
  matcher: [
    // Dashboard pages
    "/dashboard/:path*",
    // Sign-in / sign-up (Clerk needs to handle these)
    "/sign-in/:path*",
    "/sign-up/:path*",
    // Protected API routes
    "/api/approvals/:path*",
    "/api/settings/:path*",
    "/api/outreach/:path*",
    "/api/ai/:path*",
    "/api/hr/:path*",
    "/api/treatments/:path*",
    "/api/dashboard/:path*",
    "/api/leads/:id/respond/:path*",
    "/api/appointments/:path*",
    "/api/patients/:path*",
    "/api/insurance/:path*",
    "/api/documents/:path*",
    "/api/upload/:path*",
    "/api/rbac/:path*",
    "/api/seo/keywords/:path*",
    "/api/seo/indexnow/:path*",
    "/api/audit/:path*",
    "/api/dropbox/:path*",
    "/api/onboarding/:path*",
    "/api/integrations/:path*",
    "/api/clinical-notes/:path*",
    "/api/providers/:path*",
    "/api/waitlist/:path*",
    "/api/benefits/:path*",
    "/api/referrals/:path*",
  ],
};

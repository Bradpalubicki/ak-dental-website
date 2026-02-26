import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// PUBLIC_REVIEW_MODE=true bypasses Clerk entirely for /dashboard/* (NOT /admin/*).
// Clerk dev-mode does a dev-browser check before our code runs, so we must
// bypass the entire clerkMiddleware wrapper to avoid the redirect loop.
const isReviewMode = process.env.PUBLIC_REVIEW_MODE === "true";

const clerkProtectedMiddleware = clerkMiddleware(async (auth, req: NextRequest) => {
  await auth.protect({
    unauthenticatedUrl: new URL("/sign-in", req.url).toString(),
  });
});

export default function middleware(req: NextRequest) {
  if (isReviewMode && !req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  return clerkProtectedMiddleware(req, {} as never);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sign-in/:path*",
    "/sign-up/:path*",
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

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

const CAPTURE_TOKEN = process.env.SCREENSHOT_CAPTURE_TOKEN;
function isCaptureRequest(req: NextRequest): boolean {
  if (!CAPTURE_TOKEN) return false;
  return req.nextUrl.searchParams.get("capture_token") === CAPTURE_TOKEN;
}

export default clerkMiddleware(async (auth, req) => {
  if (isCaptureRequest(req)) return NextResponse.next();
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

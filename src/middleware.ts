import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Temporarily bypass all auth for dashboard access.
// Clerk is in dev mode (pk_test_) which requires a dev browser cookie.
// TODO: Switch to Clerk production keys (pk_live_) to re-enable auth.
export default function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};

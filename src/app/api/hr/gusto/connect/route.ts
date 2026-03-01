import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/hr/gusto/connect
 * Redirects the admin to Gusto's OAuth authorization page.
 * After the user authorizes, Gusto redirects to /api/hr/gusto/callback.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = process.env.GUSTO_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Gusto client ID not configured" }, { status: 500 });
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/hr/gusto/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "public company_data payrolls:read employees:read",
  });

  const authUrl = `https://api.gusto.com/oauth/authorize?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}

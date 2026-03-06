import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "openid",
  "email",
].join(" ");

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/seo/gsc/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
    state: userId,
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );
}

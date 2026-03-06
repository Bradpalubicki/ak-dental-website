import { NextResponse } from "next/server";
import { getSecret } from "@/lib/secrets";

export async function GET() {
  // Check if Infisical is reachable (vs env fallback)
  const infisicalUrl = process.env.INFISICAL_URL;
  const infisicalClientId = process.env.INFISICAL_CLIENT_ID;
  let infisical = false;

  if (infisicalUrl && infisicalClientId) {
    try {
      const testSecret = await getSecret("GOOGLE_CLIENT_ID");
      // If we got a value AND Infisical env vars are set, assume Infisical connected
      infisical = testSecret != null;
    } catch {
      infisical = false;
    }
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    infisical,
  });
}

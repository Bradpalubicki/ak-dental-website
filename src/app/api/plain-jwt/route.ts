import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const apiKey = process.env.PLAIN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Plain not configured" }, { status: 500 });
  }

  const primaryEmail = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress ?? "";

  const customerJwt = jwt.sign(
    {
      sub: userId,
      email: primaryEmail,
      email_verified: true,
      "https://chat.plain.com/app_id": process.env.NEXT_PUBLIC_PLAIN_APP_ID,
      "https://chat.plain.com/customer_details": {
        fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || primaryEmail,
        shortName: user.firstName ?? primaryEmail,
        externalId: userId,
        attributes: {
          engine: "AK Dental",
        },
      },
    },
    apiKey,
    { expiresIn: "1h", algorithm: "HS256" }
  );

  return NextResponse.json({ customerJwt });
}

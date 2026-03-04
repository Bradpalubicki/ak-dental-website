import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...((user.publicMetadata as Record<string, unknown>) || {}),
      onboarding_complete: true,
      onboarding_completed_at: new Date().toISOString(),
    },
  });

  return NextResponse.json({ success: true });
}

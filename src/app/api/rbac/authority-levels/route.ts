import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getAuthorityLevel } from "@/lib/rbac";

// GET: Returns a map of clerk_user_id → authorityLevel for all org users
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clerkClient();
    const { data: users } = await client.users.getUserList({ limit: 100 });

    const levels: Record<string, string> = {};
    for (const user of users) {
      levels[user.id] = getAuthorityLevel(
        user.publicMetadata as Record<string, unknown>
      );
    }

    return NextResponse.json(levels);
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
}

import { NextResponse } from "next/server";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import {
  getAuthorityLevel,
  getUserPermissions,
  getAllPermissions,
  updateUserPermission,
} from "@/lib/rbac";

// GET: Returns the current user's effective permissions
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const authorityLevel = getAuthorityLevel(
    user?.publicMetadata as Record<string, unknown> | undefined
  );

  const permissionSet = await getUserPermissions(userId, authorityLevel);

  return NextResponse.json({
    authorityLevel: permissionSet.authorityLevel,
    permissions: permissionSet.permissions,
  });
}

// PUT: Update permissions for a target user (admin/global_admin only)
export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check that the requesting user is admin or global_admin
  const requestingUser = await currentUser();
  const requestingLevel = getAuthorityLevel(
    requestingUser?.publicMetadata as Record<string, unknown> | undefined
  );

  if (requestingLevel !== "global_admin" && requestingLevel !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { targetUserId, permissionKey, enabled, authorityLevel } = body;

  if (!targetUserId) {
    return NextResponse.json({ error: "targetUserId required" }, { status: 400 });
  }

  // Update authority level in Clerk metadata if provided
  if (authorityLevel) {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(targetUserId, {
        publicMetadata: { authorityLevel },
      });
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to update Clerk metadata", details: String(e) },
        { status: 500 }
      );
    }
  }

  // Update specific permission if provided
  if (permissionKey !== undefined && enabled !== undefined) {
    const { error } = await updateUserPermission(
      targetUserId,
      permissionKey,
      enabled,
      userId
    );
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}

// GET /api/rbac/permissions?all=true returns all available permissions (for admin UI)
export async function OPTIONS() {
  const permissions = await getAllPermissions();
  return NextResponse.json({ permissions });
}

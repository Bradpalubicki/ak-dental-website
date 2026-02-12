import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAuthorityLevel, getUserPermissions, hasPermission } from "@/lib/rbac";
import type { AuthorityLevel, UserPermissionSet } from "@/lib/rbac";

interface PermissionResult {
  allowed: boolean;
  response?: NextResponse;
  userId?: string;
  userName?: string | null;
  authorityLevel?: AuthorityLevel;
  permissions?: UserPermissionSet;
}

/** Require Clerk authentication only (no RBAC check) */
export async function requireApiAuth(): Promise<PermissionResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      allowed: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  let userName: string | null = null;
  try {
    const user = await currentUser();
    if (user) {
      userName =
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.emailAddresses?.[0]?.emailAddress ||
        null;
    }
  } catch {
    // Name lookup is best-effort
  }

  return { allowed: true, userId, userName };
}

/** Require Clerk auth + RBAC permission check */
export async function requirePermission(
  permissionKey: string
): Promise<PermissionResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      allowed: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  let userName: string | null = null;
  let authorityLevel: AuthorityLevel = "staff";
  try {
    const user = await currentUser();
    if (user) {
      userName =
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.emailAddresses?.[0]?.emailAddress ||
        null;
      authorityLevel = getAuthorityLevel(
        user.publicMetadata as Record<string, unknown> | undefined
      );
    }
  } catch {
    // Fallback to staff level
  }

  const permissionSet = await getUserPermissions(userId, authorityLevel);

  if (!hasPermission(permissionSet, permissionKey)) {
    return {
      allowed: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    allowed: true,
    userId,
    userName,
    authorityLevel,
    permissions: permissionSet,
  };
}

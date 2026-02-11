import { createServiceSupabase } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────

export type AuthorityLevel = "global_admin" | "admin" | "manager" | "staff";

export interface UserPermissionSet {
  authorityLevel: AuthorityLevel;
  permissions: Record<string, boolean>;
}

export const AUTHORITY_LEVELS: { value: AuthorityLevel; label: string; description: string }[] = [
  { value: "global_admin", label: "Global Admin", description: "Full system access (NuStack team)" },
  { value: "admin", label: "Admin", description: "Full practice access" },
  { value: "manager", label: "Manager", description: "Department-level access" },
  { value: "staff", label: "Staff", description: "Limited access" },
];

// ─── Authority Level ──────────────────────────────────────────────

export function getAuthorityLevel(publicMetadata: Record<string, unknown> | undefined): AuthorityLevel {
  const level = publicMetadata?.authorityLevel as string | undefined;
  if (level && ["global_admin", "admin", "manager", "staff"].includes(level)) {
    return level as AuthorityLevel;
  }
  return "staff"; // Default to most restrictive
}

// ─── Permission Resolution ────────────────────────────────────────

/**
 * Get the effective permissions for a user.
 * Resolution order:
 * 1. global_admin → always true for everything
 * 2. Role defaults for the user's authority level
 * 3. Per-user overrides (if any)
 */
export async function getUserPermissions(
  clerkUserId: string,
  authorityLevel: AuthorityLevel
): Promise<UserPermissionSet> {
  // Global admin bypasses all checks
  if (authorityLevel === "global_admin") {
    return {
      authorityLevel,
      permissions: {}, // Empty = all allowed (checked in hasPermission)
    };
  }

  const supabase = createServiceSupabase();

  // Fetch role defaults and user overrides in parallel
  const [roleDefaultsRes, userOverridesRes] = await Promise.all([
    supabase
      .from("oe_role_defaults")
      .select("permission_key, enabled")
      .eq("authority_level", authorityLevel),
    supabase
      .from("oe_user_permissions")
      .select("permission_key, enabled")
      .eq("clerk_user_id", clerkUserId),
  ]);

  const permissions: Record<string, boolean> = {};

  // Apply role defaults
  if (roleDefaultsRes.data) {
    for (const row of roleDefaultsRes.data) {
      permissions[row.permission_key] = row.enabled;
    }
  }

  // Apply per-user overrides (these take precedence)
  if (userOverridesRes.data) {
    for (const row of userOverridesRes.data) {
      permissions[row.permission_key] = row.enabled;
    }
  }

  return { authorityLevel, permissions };
}

/**
 * Check if a user has a specific permission.
 */
export function hasPermission(
  permissionSet: UserPermissionSet,
  permissionKey: string
): boolean {
  // Global admin always has access
  if (permissionSet.authorityLevel === "global_admin") return true;

  // Check explicit permission
  return permissionSet.permissions[permissionKey] === true;
}

// ─── Permission List ──────────────────────────────────────────────

export async function getAllPermissions() {
  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from("oe_permissions")
    .select("*")
    .order("sort_order");
  return data || [];
}

// ─── Update User Permissions ──────────────────────────────────────

export async function updateUserPermission(
  clerkUserId: string,
  permissionKey: string,
  enabled: boolean,
  grantedBy: string
) {
  const supabase = createServiceSupabase();
  const { error } = await supabase
    .from("oe_user_permissions")
    .upsert(
      {
        clerk_user_id: clerkUserId,
        permission_key: permissionKey,
        enabled,
        granted_by: grantedBy,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clerk_user_id,permission_key" }
    );
  return { error };
}

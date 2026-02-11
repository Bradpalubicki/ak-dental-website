/**
 * Role-based access control definitions for One Engine dashboard.
 *
 * Roles are stored in Clerk publicMetadata.role and optionally in
 * the staff_users table. Custom per-user overrides live in
 * staff_users.custom_permissions (JSONB).
 */

// ── Role hierarchy (highest → lowest) ──────────────────────────
export const ROLES = [
  "global_admin",
  "owner",
  "admin",
  "manager",
  "staff",
  "billing",
] as const;

export type Role = (typeof ROLES)[number];

// ── Permission sections (match sidebar groups + sub-pages) ─────
export const SECTIONS = [
  // Command Center
  "dashboard.overview",
  "dashboard.advisor",
  "dashboard.approvals",
  // Operations
  "operations.leads",
  "operations.patients",
  "operations.appointments",
  "operations.treatments",
  "operations.insurance",
  // Business Hub
  "business_hub.financials",
  "business_hub.billing",
  "business_hub.hr",
  "business_hub.licensing",
  // Intelligence
  "intelligence.inbox",
  "intelligence.analytics",
  "intelligence.calls",
  "intelligence.outreach",
  // System
  "settings",
  "settings.users",
] as const;

export type Section = (typeof SECTIONS)[number];

// ── Default permissions per role ───────────────────────────────
const ALL_SECTIONS: readonly Section[] = SECTIONS;

export const DEFAULT_PERMISSIONS: Record<Role, readonly Section[]> = {
  global_admin: ALL_SECTIONS,

  owner: ALL_SECTIONS,

  admin: SECTIONS.filter((s) => s !== "settings.users"),

  manager: SECTIONS.filter(
    (s) =>
      s.startsWith("dashboard.") ||
      s.startsWith("operations.") ||
      s === "intelligence.inbox"
  ),

  staff: [
    "dashboard.overview",
    "dashboard.advisor",
    "operations.patients",
    "operations.appointments",
    "operations.treatments",
    "intelligence.inbox",
  ],

  billing: [
    "dashboard.overview",
    "dashboard.advisor",
    "business_hub.financials",
    "business_hub.billing",
    "business_hub.hr",
    "intelligence.inbox",
  ],
};

// ── Helpers ────────────────────────────────────────────────────

/** Check if a role can access a given section. */
export function hasAccess(
  role: Role | string | undefined,
  section: Section,
  customPermissions?: Section[] | null
): boolean {
  // Custom overrides take priority when present
  if (customPermissions && customPermissions.length > 0) {
    return customPermissions.includes(section);
  }

  const r = (role || "staff") as Role;
  const perms = DEFAULT_PERMISSIONS[r];
  if (!perms) return false;
  return perms.includes(section);
}

/** Get all accessible sections for a role (with optional overrides). */
export function getAccessibleSections(
  role: Role | string | undefined,
  customPermissions?: Section[] | null
): readonly Section[] {
  if (customPermissions && customPermissions.length > 0) {
    return customPermissions;
  }
  const r = (role || "staff") as Role;
  return DEFAULT_PERMISSIONS[r] || DEFAULT_PERMISSIONS.staff;
}

/** Check if the role is at least the given level in the hierarchy. */
export function isAtLeast(
  userRole: Role | string | undefined,
  requiredRole: Role
): boolean {
  const userIdx = ROLES.indexOf((userRole || "staff") as Role);
  const reqIdx = ROLES.indexOf(requiredRole);
  if (userIdx === -1 || reqIdx === -1) return false;
  return userIdx <= reqIdx; // lower index = higher privilege
}

/** Human-readable label for a role. */
export function roleLabel(role: Role | string): string {
  const labels: Record<string, string> = {
    global_admin: "Global Admin",
    owner: "Practice Owner",
    admin: "Administrator",
    manager: "Manager",
    staff: "Staff",
    billing: "Billing",
  };
  return labels[role] || role;
}

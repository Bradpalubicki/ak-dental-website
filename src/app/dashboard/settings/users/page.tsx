"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Users,
  Shield,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuthorityLevel } from "@/lib/rbac";

interface Permission {
  key: string;
  label: string;
  category: string;
  description: string | null;
  sort_order: number;
}

interface StaffUser {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  authority_level: AuthorityLevel;
  permissions: Record<string, boolean>;
}

const AUTHORITY_LABELS: Record<AuthorityLevel, { label: string; color: string; description: string }> = {
  global_admin: { label: "Global Admin", color: "bg-purple-100 text-purple-700", description: "Full system access" },
  admin: { label: "Admin", color: "bg-cyan-100 text-cyan-700", description: "Full practice access" },
  manager: { label: "Manager", color: "bg-amber-100 text-amber-700", description: "Department-level access" },
  staff: { label: "Staff", color: "bg-slate-100 text-slate-600", description: "Limited access" },
};

const CATEGORY_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  operations: "Operations",
  business: "Business Hub",
  intelligence: "Intelligence",
  admin: "Administration",
  documents: "Documents",
};

export default function UsersSettingsPage() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  // Check if current user is admin
  const currentLevel = (currentUser?.publicMetadata?.authorityLevel as AuthorityLevel) || "staff";
  const isAdmin = currentLevel === "global_admin" || currentLevel === "admin";

  useEffect(() => {
    async function load() {
      try {
        // Fetch all permissions
        const permsRes = await fetch("/api/rbac/permissions", { method: "OPTIONS" });
        const permsData = await permsRes.json();
        setPermissions(permsData.permissions || []);

        // Fetch staff users with their permissions
        const usersRes = await fetch("/api/hr/employees?status=active");
        const usersData = await usersRes.json();

        // For each user, fetch their permissions
        const staffUsers: StaffUser[] = (usersData || []).map((emp: Record<string, string>) => ({
          id: emp.id,
          clerk_user_id: emp.clerk_user_id || "",
          email: emp.email || "",
          first_name: emp.first_name || "",
          last_name: emp.last_name || "",
          role: emp.role || "staff",
          authority_level: "staff" as AuthorityLevel,
          permissions: {},
        }));

        setUsers(staffUsers);
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updateAuthorityLevel = async (userId: string, clerkUserId: string, level: AuthorityLevel) => {
    if (!clerkUserId) return;
    setSaving(userId);
    try {
      await fetch("/api/rbac/permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: clerkUserId, authorityLevel: level }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, authority_level: level } : u))
      );
    } catch {
      // Silent fail
    } finally {
      setSaving(null);
    }
  };

  const togglePermission = async (userId: string, clerkUserId: string, key: string, enabled: boolean) => {
    if (!clerkUserId) return;
    setSaving(`${userId}-${key}`);
    try {
      await fetch("/api/rbac/permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: clerkUserId, permissionKey: key, enabled }),
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, permissions: { ...u.permissions, [key]: enabled } }
            : u
        )
      );
    } catch {
      // Silent fail
    } finally {
      setSaving(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h2 className="text-lg font-bold text-slate-900">Access Denied</h2>
          <p className="text-sm text-slate-500 mt-1">You need admin permissions to manage users.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
      </div>
    );
  }

  const permissionsByCategory = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-slate-900">Users & Permissions</h1>
        <p className="text-xs text-slate-400">Manage team access levels and feature permissions</p>
      </div>

      {/* Authority Level Legend */}
      <div className="flex gap-3 flex-wrap">
        {(Object.entries(AUTHORITY_LABELS) as [AuthorityLevel, typeof AUTHORITY_LABELS[AuthorityLevel]][]).map(
          ([level, config]) => (
            <div key={level} className="flex items-center gap-2">
              <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold", config.color)}>
                {config.label}
              </span>
              <span className="text-[10px] text-slate-400">{config.description}</span>
            </div>
          )
        )}
      </div>

      {/* Users List */}
      <div className="space-y-2">
        {users.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <Users className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-600">No staff users found</p>
            <p className="text-xs text-slate-400 mt-1">Add employees in HR & Payroll first</p>
          </div>
        ) : (
          users.map((staffUser) => {
            const isExpanded = expandedUser === staffUser.id;

            return (
              <div key={staffUser.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                {/* User Row */}
                <button
                  onClick={() => setExpandedUser(isExpanded ? null : staffUser.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-xs font-bold text-cyan-700">
                    {staffUser.first_name?.[0]}{staffUser.last_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {staffUser.first_name} {staffUser.last_name}
                    </p>
                    <p className="text-[11px] text-slate-400">{staffUser.email || staffUser.role}</p>
                  </div>

                  {/* Authority Level Selector */}
                  <select
                    value={staffUser.authority_level}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateAuthorityLevel(staffUser.id, staffUser.clerk_user_id, e.target.value as AuthorityLevel);
                    }}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-[11px] font-bold border-0 cursor-pointer",
                      AUTHORITY_LABELS[staffUser.authority_level]?.color || "bg-slate-100 text-slate-600"
                    )}
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>

                  {saving === staffUser.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-500 shrink-0" />
                  ) : isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {/* Expanded Permissions */}
                {isExpanded && (
                  <div className="border-t border-slate-100 px-5 py-4 space-y-4">
                    {Object.entries(permissionsByCategory).map(([category, perms]) => (
                      <div key={category}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                          {CATEGORY_LABELS[category] || category}
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                          {perms.map((perm) => {
                            const isEnabled = staffUser.permissions[perm.key] !== false;
                            const isSaving = saving === `${staffUser.id}-${perm.key}`;

                            return (
                              <button
                                key={perm.key}
                                onClick={() =>
                                  togglePermission(staffUser.id, staffUser.clerk_user_id, perm.key, !isEnabled)
                                }
                                className={cn(
                                  "flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors",
                                  isEnabled ? "bg-cyan-50/50 hover:bg-cyan-50" : "hover:bg-slate-50"
                                )}
                              >
                                <div
                                  className={cn(
                                    "flex h-5 w-5 shrink-0 items-center justify-center rounded",
                                    isEnabled
                                      ? "bg-cyan-500 text-white"
                                      : "border-2 border-slate-200"
                                  )}
                                >
                                  {isSaving ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : isEnabled ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <X className="h-3 w-3 text-slate-300" />
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    "text-xs font-medium",
                                    isEnabled ? "text-slate-900" : "text-slate-400"
                                  )}
                                >
                                  {perm.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Users,
  Shield,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Loader2,
  UserPlus,
  Mail,
  Clock,
  Trash2,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { AuthorityLevel } from "@/lib/rbac";

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface PendingInvite {
  id: string;
  clerk_invitation_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  authority_level: string;
  status: string;
  created_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AUTHORITY_LABELS: Record<AuthorityLevel, { label: string; color: string; description: string }> = {
  global_admin: { label: "Global Admin",  color: "bg-purple-100 text-purple-700", description: "Full system access" },
  admin:        { label: "Admin",          color: "bg-cyan-100 text-cyan-700",     description: "Full practice access" },
  manager:      { label: "Manager",        color: "bg-amber-100 text-amber-700",   description: "Department-level access" },
  staff:        { label: "Staff",          color: "bg-slate-100 text-slate-600",   description: "Limited access" },
};

const ROLE_OPTIONS = [
  { value: "owner-dentist",  label: "Owner / Dentist",    description: "Full clinical and admin access" },
  { value: "office-manager", label: "Office Manager",     description: "Operations, billing, HR" },
  { value: "front-desk",     label: "Front Desk",         description: "Scheduling, patients, insurance" },
  { value: "hygienist",      label: "Hygienist",          description: "Clinical notes, treatments" },
  { value: "associate",      label: "Associate Dentist",  description: "Clinical and patient access" },
  { value: "billing",        label: "Billing Specialist", description: "Billing, insurance, collections" },
];

const LEVEL_FOR_ROLE: Record<string, AuthorityLevel> = {
  "owner-dentist":  "admin",
  "office-manager": "manager",
  "front-desk":     "staff",
  "hygienist":      "staff",
  "associate":      "staff",
  "billing":        "staff",
};

const CATEGORY_LABELS: Record<string, string> = {
  dashboard:    "Dashboard",
  operations:   "Operations",
  business:     "Business Hub",
  intelligence: "Intelligence",
  admin:        "Administration",
  documents:    "Documents",
};

// ─── Invite Form ─────────────────────────────────────────────────────────────

interface InviteFormProps {
  onSent: () => void;
}

function InviteForm({ onSent }: InviteFormProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("front-desk");
  const [authorityLevel, setAuthorityLevel] = useState<AuthorityLevel>("staff");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Auto-set authority level when role changes
  function handleRoleChange(newRole: string) {
    setRole(newRole);
    setAuthorityLevel(LEVEL_FOR_ROLE[newRole] || "staff");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/users/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), firstName, lastName, role, authorityLevel }),
      });
      const data = await res.json();

      if (res.ok) {
        setResult({ type: "success", message: `Invitation sent to ${email}` });
        setEmail("");
        setFirstName("");
        setLastName("");
        setRole("front-desk");
        setAuthorityLevel("staff");
        onSent();
      } else {
        setResult({ type: "error", message: data.error || "Failed to send invitation" });
      }
    } catch {
      setResult({ type: "error", message: "Network error — please try again" });
    } finally {
      setSending(false);
    }
  }

  const selectedRole = ROLE_OPTIONS.find((r) => r.value === role);

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Alex"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Chireu"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">
          Email Address <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@akultimatedental.com"
            className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Role */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">
          Role <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleRoleChange(opt.value)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-left transition-all",
                role === opt.value
                  ? "border-cyan-400 bg-cyan-50 ring-1 ring-cyan-400"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <p className="text-xs font-semibold text-slate-800">{opt.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Access Level (auto-set, but adjustable) */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <p className="text-xs font-medium text-slate-700">Access Level</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {selectedRole?.description} · Auto-set based on role
          </p>
        </div>
        <select
          value={authorityLevel}
          onChange={(e) => setAuthorityLevel(e.target.value as AuthorityLevel)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-bold border-0 cursor-pointer",
            AUTHORITY_LABELS[authorityLevel]?.color
          )}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      {/* Result feedback */}
      {result && (
        <div
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-3 text-sm",
            result.type === "success"
              ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
              : "bg-red-50 border border-red-100 text-red-700"
          )}
        >
          {result.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {result.message}
        </div>
      )}

      <Button
        type="submit"
        disabled={sending || !email.trim()}
        className="w-full gap-2 bg-cyan-500 hover:bg-cyan-600"
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {sending ? "Sending…" : "Send Invitation"}
      </Button>

      <p className="text-[11px] text-slate-400 text-center">
        They&apos;ll receive an email with a sign-up link. Their role and access level are pre-set.
      </p>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UsersSettingsPage() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const currentLevel = (currentUser?.publicMetadata?.authorityLevel as AuthorityLevel) || "staff";
  const isAdmin = currentLevel === "global_admin" || currentLevel === "admin";

  const loadInvites = useCallback(async () => {
    try {
      const res = await fetch("/api/users/invite");
      if (res.ok) setInvites(await res.json());
    } catch {
      // noop
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const [permsRes, usersRes, levelsRes] = await Promise.all([
          fetch("/api/rbac/permissions", { method: "OPTIONS" }),
          fetch("/api/hr/employees?status=active"),
          fetch("/api/rbac/authority-levels"),
        ]);
        const permsData = await permsRes.json();
        setPermissions(permsData.permissions || []);

        const usersData = await usersRes.json();
        const levelsData: Record<string, string> = levelsRes.ok ? await levelsRes.json() : {};

        setUsers(
          (usersData || []).map((emp: Record<string, string>) => ({
            id: emp.id,
            clerk_user_id: emp.clerk_user_id || "",
            email: emp.email || "",
            first_name: emp.first_name || "",
            last_name: emp.last_name || "",
            role: emp.role || "staff",
            authority_level: (emp.clerk_user_id && levelsData[emp.clerk_user_id]
              ? levelsData[emp.clerk_user_id]
              : "staff") as AuthorityLevel,
            permissions: {},
          }))
        );

        await loadInvites();
      } catch {
        // noop
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [loadInvites]);

  const updateAuthorityLevel = async (userId: string, clerkUserId: string, level: AuthorityLevel) => {
    if (!clerkUserId) return;
    setSaving(userId);
    try {
      await fetch("/api/rbac/permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: clerkUserId, authorityLevel: level }),
      });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, authority_level: level } : u)));
    } catch {
      // noop
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
          u.id === userId ? { ...u, permissions: { ...u.permissions, [key]: enabled } } : u
        )
      );
    } catch {
      // noop
    } finally {
      setSaving(null);
    }
  };

  const revokeInvite = async (invite: PendingInvite) => {
    setRevokingId(invite.id);
    try {
      await fetch("/api/users/invite", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId: invite.clerk_invitation_id }),
      });
      setInvites((prev) => prev.filter((i) => i.id !== invite.id));
    } catch {
      // noop
    } finally {
      setRevokingId(null);
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

  const pendingInvites = invites.filter((i) => i.status === "pending");

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Users & Access</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Invite team members and manage their access levels
          </p>
        </div>
        <Button
          onClick={() => setShowInviteForm((v) => !v)}
          size="sm"
          className={cn(
            "gap-2 transition-all",
            showInviteForm
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
              : "bg-cyan-500 hover:bg-cyan-600 text-white"
          )}
        >
          {showInviteForm ? (
            <><X className="h-4 w-4" />Cancel</>
          ) : (
            <><UserPlus className="h-4 w-4" />Invite User</>
          )}
        </Button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-cyan-500 flex items-center justify-center shrink-0">
              <UserPlus className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Invite a Team Member</p>
              <p className="text-xs text-slate-500">They&apos;ll get an email with a sign-up link</p>
            </div>
          </div>
          <InviteForm
            onSent={() => {
              loadInvites();
              setShowInviteForm(false);
            }}
          />
        </div>
      )}

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pending Invitations ({pendingInvites.length})
          </p>
          {pendingInvites.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center gap-4 rounded-xl border border-amber-100 bg-amber-50/50 px-5 py-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {invite.first_name || invite.last_name
                    ? `${invite.first_name ?? ""} ${invite.last_name ?? ""}`.trim()
                    : invite.email}
                </p>
                <p className="text-[11px] text-slate-400">
                  {invite.email} · {ROLE_OPTIONS.find((r) => r.value === invite.role)?.label ?? invite.role}
                </p>
              </div>
              <span className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                AUTHORITY_LABELS[invite.authority_level as AuthorityLevel]?.color || "bg-slate-100 text-slate-600"
              )}>
                {AUTHORITY_LABELS[invite.authority_level as AuthorityLevel]?.label || invite.authority_level}
              </span>
              <button
                onClick={() => revokeInvite(invite)}
                disabled={revokingId === invite.id}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Revoke invitation"
              >
                {revokingId === invite.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Access Level Legend */}
      <div className="flex gap-3 flex-wrap">
        {(Object.entries(AUTHORITY_LABELS) as [AuthorityLevel, typeof AUTHORITY_LABELS[AuthorityLevel]][])
          .filter(([level]) => level !== "global_admin")
          .map(([level, config]) => (
            <div key={level} className="flex items-center gap-2">
              <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold", config.color)}>
                {config.label}
              </span>
              <span className="text-[10px] text-slate-400">{config.description}</span>
            </div>
          ))}
      </div>

      {/* Active Users */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Active Users ({users.length})
        </p>

        {users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <Users className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-600">No active users yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Invite your first team member using the button above
            </p>
          </div>
        ) : (
          users.map((staffUser) => {
            const isExpanded = expandedUser === staffUser.id;

            return (
              <div key={staffUser.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
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
                    <p className="text-[11px] text-slate-400">
                      {staffUser.email || staffUser.role}
                    </p>
                  </div>

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
                                <div className={cn(
                                  "flex h-5 w-5 shrink-0 items-center justify-center rounded",
                                  isEnabled ? "bg-cyan-500 text-white" : "border-2 border-slate-200"
                                )}>
                                  {isSaving ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : isEnabled ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <X className="h-3 w-3 text-slate-300" />
                                  )}
                                </div>
                                <span className={cn(
                                  "text-xs font-medium",
                                  isEnabled ? "text-slate-900" : "text-slate-400"
                                )}>
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

      {/* Help note */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 flex gap-3">
        <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-slate-700">How it works</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Invited users receive an email with a secure sign-up link. Their role and access level
            are pre-configured — they just set a password and they&apos;re in. You can adjust
            their permissions at any time from this page.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from "react";
import type { AuthorityLevel } from "@/lib/rbac";

interface PermissionsState {
  authorityLevel: AuthorityLevel;
  permissions: Record<string, boolean>;
  isLoading: boolean;
}

export function usePermissions() {
  const { user, isLoaded } = useUser();
  const [state, setState] = useState<PermissionsState>({
    authorityLevel: "staff",
    permissions: {},
    isLoading: true,
  });

  const authorityLevel = (user?.publicMetadata?.authorityLevel as AuthorityLevel) || "staff";

  useEffect(() => {
    if (!isLoaded || !user) return;

    let cancelled = false;

    async function loadPermissions() {
      // Global admin has all permissions — no need to fetch
      if (authorityLevel === "global_admin") {
        if (!cancelled) {
          setState({ authorityLevel: "global_admin", permissions: {}, isLoading: false });
        }
        return;
      }

      try {
        const res = await fetch("/api/rbac/permissions");
        const data = await res.json();
        if (!cancelled) {
          setState({
            authorityLevel: data.authorityLevel || authorityLevel,
            permissions: data.permissions || {},
            isLoading: false,
          });
        }
      } catch {
        if (!cancelled) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    }

    loadPermissions();
    return () => { cancelled = true; };
  }, [isLoaded, user, authorityLevel]);

  const can = useCallback(
    (permissionKey: string): boolean => {
      if (state.authorityLevel === "global_admin") return true;
      if (state.authorityLevel === "admin") return true;
      return state.permissions[permissionKey] === true;
    },
    [state.authorityLevel, state.permissions]
  );

  return {
    can,
    authorityLevel: state.authorityLevel,
    isLoading: state.isLoading,
    permissions: state.permissions,
  };
}

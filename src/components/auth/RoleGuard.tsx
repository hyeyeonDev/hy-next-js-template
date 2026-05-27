"use client";

import type { UserRole } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { hasAnyRole } from "@/lib/roles";

interface RoleGuardProps {
  roles: UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGuard({ roles, fallback = null, children }: RoleGuardProps) {
  const { user } = useAuth();

  const allowed = !!user && hasAnyRole(user.role, roles);

  if (!allowed) {
    return fallback;
  }

  return children;
}

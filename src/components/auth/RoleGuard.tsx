"use client";

import type { UserRole } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { isAdminRole } from "@/lib/roles";

interface RoleGuardProps {
  roles: UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGuard({ roles, fallback = null, children }: RoleGuardProps) {
  const { user } = useAuth();

  const allowed = !!user && (roles.includes(user.role as UserRole) || (roles.includes("ADMIN") && isAdminRole(user.role)));

  if (!allowed) {
    return fallback;
  }

  return children;
}

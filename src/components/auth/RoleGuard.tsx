"use client";

import type { UserRole } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface RoleGuardProps {
  roles: UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGuard({ roles, fallback = null, children }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role as UserRole)) {
    return fallback;
  }

  return children;
}

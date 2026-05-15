"use client";
import { useMeQuery } from "@/hooks/queries";
import { isAdminRole, isManagerRole } from "@/lib/roles";

export function useAuth() {
  const { data: user, isLoading, error } = useMeQuery();

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    isAdmin: isAdminRole(user?.role),
    isManager: isManagerRole(user?.role),
  };
}

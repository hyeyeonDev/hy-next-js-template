"use client";
import { useMeQuery } from "@/hooks/queries";

export function useAuth() {
  const { data: user, isLoading, error } = useMeQuery();

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    isAdmin: user?.role === "admin",
    isManager: user?.role === "manager",
  };
}

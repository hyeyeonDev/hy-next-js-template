"use client";

import { useCallback } from "react";

import { useLoginMutation, useLogoutMutation, useMeQuery, useSignupMutation } from "@/hooks/queries";
import { useAuthStore } from "@/store";
import { getSafeReturnPath } from "@/lib/auth-redirect";

export function useAuthSession() {
  const meQuery = useMeQuery();
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();
  const logoutMutation = useLogoutMutation();
  const returnTo = useAuthStore((state) => state.returnTo);
  const setReturnTo = useAuthStore((state) => state.setReturnTo);
  const markLoggedIn = useAuthStore((state) => state.markLoggedIn);
  const resetAuthClientState = useAuthStore((state) => state.resetAuthClientState);

  const getReturnPath = useCallback(
    (fallback?: string | null) => getSafeReturnPath(returnTo ?? fallback),
    [returnTo],
  );

  return {
    user: meQuery.data,
    isLoading: meQuery.isLoading,
    isAuthenticated: !!meQuery.data && !meQuery.error,
    isAdmin: meQuery.data?.role === "admin",
    isManager: meQuery.data?.role === "manager",
    returnTo,
    setReturnTo,
    markLoggedIn,
    resetAuthClientState,
    getReturnPath,
    meQuery,
    loginMutation,
    signupMutation,
    logoutMutation,
  };
}

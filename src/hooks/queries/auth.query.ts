"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authService } from "@/api/auth.api";
import { QUERY_KEYS } from "@/constants/queryKeys";

export function useMeQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.me(),
    queryFn: authService.me,
    retry: false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH.me(), data.user);
    },
  });
}

export function useSignupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH.me(), data.user);
    },
  });
}

export function useFindIdMutation() {
  return useMutation({
    mutationFn: authService.findId,
  });
}

export function useFindPasswordMutation() {
  return useMutation({
    mutationFn: authService.findPassword,
  });
}

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateMe,
    onSuccess: (user) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH.me(), user);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.detail(user.id) });
    },
  });
}

export function useWithdrawMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.withdrawMe,
    onSuccess: () => {
      document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
      queryClient.clear();
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
      queryClient.clear();
    },
  });
}

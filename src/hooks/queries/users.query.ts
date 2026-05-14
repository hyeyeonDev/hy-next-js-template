"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userService } from "@/api/user.api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { UserListParams } from "@/types";

export function useUsersQuery(params: UserListParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.list(params),
    queryFn: () => userService.getList(params),
  });
}

export function useUserQuery(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.lists() });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.update,
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.lists() });
      queryClient.setQueryData(QUERY_KEYS.USERS.detail(updatedUser.id), updatedUser);
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.lists() });
    },
  });
}

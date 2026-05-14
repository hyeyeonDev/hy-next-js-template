"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { organizationService } from "@/api/organization.api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { OrganizationListParams } from "@/types";

export function useOrganizationsQuery(params: OrganizationListParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.ORGANIZATIONS.list(params),
    queryFn: () => organizationService.getList(params),
  });
}

export function useCreateOrganizationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: organizationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORGANIZATIONS.lists() });
    },
  });
}

export function useUpdateOrganizationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: organizationService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORGANIZATIONS.lists() });
    },
  });
}

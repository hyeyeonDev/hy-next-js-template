"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dataCodeService } from "@/api/data-code.api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { DataCodeListParams } from "@/types";

export function useDataCodesQuery(params: DataCodeListParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.DATA_CODES.list(params),
    queryFn: () => dataCodeService.getList(params),
  });
}

export function useDataCodeDuplicateQuery(code: string, enabled = false, excludeId?: number) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DATA_CODES.check(code), excludeId] as const,
    queryFn: () => dataCodeService.checkDuplicate(code, excludeId),
    enabled: enabled && code.trim().length > 0,
    retry: false,
  });
}

export function useCreateDataCodeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dataCodeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DATA_CODES.lists() });
    },
  });
}

export function useUpdateDataCodeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dataCodeService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DATA_CODES.lists() });
    },
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";

import { loginHistoryService } from "@/api/login-history.api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { LoginHistoryListParams } from "@/types";

export function useLoginHistoryQuery(params: LoginHistoryListParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.LOGIN_HISTORY.list(params),
    queryFn: () => loginHistoryService.getList(params),
  });
}

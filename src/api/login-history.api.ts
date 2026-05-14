import { apiClient } from "@/lib/axios";
import type { LoginHistory, LoginHistoryListParams, PagedResponse } from "@/types";

export const loginHistoryService = {
  getList: async (params: LoginHistoryListParams = {}) => {
    const { data } = await apiClient.get<PagedResponse<LoginHistory>>("/login-history", { params });
    return data;
  },
};

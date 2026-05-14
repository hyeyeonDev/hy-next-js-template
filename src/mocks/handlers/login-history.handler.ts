import type { LoginHistoryListParams } from "@/types";

import { page, type MockRequest } from "../mock-utils";
import { mockStore } from "../mock-store";

function listLoginHistory(params: LoginHistoryListParams = {}) {
  const search = params.search?.trim().toLowerCase();
  const filtered = mockStore.loginHistory.filter((item) => {
    const matchesSearch =
      !search ||
      item.userName.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.ipAddress.includes(search);
    const matchesStatus = !params.status || item.status === params.status;

    return matchesSearch && matchesStatus;
  });

  return page(filtered, params);
}

export function handleLoginHistoryMock({ method, path, params }: MockRequest) {
  if (method === "GET" && path === "/login-history") {
    return listLoginHistory(params as LoginHistoryListParams);
  }

  return undefined;
}

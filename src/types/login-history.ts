export interface LoginHistory {
  id: number;
  userId: number;
  userName: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failure";
  reason?: string;
  createdAt: string;
}

export interface LoginHistoryListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: LoginHistory["status"];
}

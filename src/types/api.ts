import type { Pagination } from "./common";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PagedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

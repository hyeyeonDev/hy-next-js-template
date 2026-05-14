import type { ApiResponse, PagedResponse } from "@/types/api";

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export interface MockRequest {
  method: HttpMethod;
  path: string;
  params?: object;
  body?: unknown;
}

interface PageParams {
  page?: number;
  pageSize?: number;
}

export function wait(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function ok<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message };
}

export function page<T>(data: T[], params: PageParams = {}): PagedResponse<T> {
  const pageNumber = Number(params.page ?? 1);
  const pageSize = Number(params.pageSize ?? 10);
  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (pageNumber - 1) * pageSize;

  return {
    success: true,
    data: data.slice(start, start + pageSize),
    pagination: {
      page: pageNumber,
      pageSize,
      total,
      totalPages,
    },
  };
}

export function fail(status: number, message: string): never {
  throw { status, message };
}

export function parsePath(url: string) {
  return url.split("?")[0].replace(/^\/api/, "");
}

export function getId(path: string, prefix: string) {
  const id = Number(path.replace(prefix, "").split("/")[0]);
  return Number.isFinite(id) ? id : null;
}

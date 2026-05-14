import { apiClient } from "./axios";
import type { ApiResponse, PagedResponse } from "@/types";

/** GET 단건 */
export async function fetchOne<T>(url: string): Promise<T> {
  const { data } = await apiClient.get<ApiResponse<T>>(url);
  return data.data;
}

/** GET 목록 (페이지네이션 포함) */
export async function fetchList<T>(url: string, params?: object): Promise<PagedResponse<T>> {
  const { data } = await apiClient.get<PagedResponse<T>>(url, { params });
  return data;
}

/** POST */
export async function postOne<T, D = unknown>(url: string, body: D): Promise<T> {
  const { data } = await apiClient.post<ApiResponse<T>>(url, body);
  return data.data;
}

/** PATCH */
export async function patchOne<T, D = unknown>(url: string, body: D): Promise<T> {
  const { data } = await apiClient.patch<ApiResponse<T>>(url, body);
  return data.data;
}

/** DELETE */
export async function deleteOne(url: string): Promise<void> {
  await apiClient.delete(url);
}

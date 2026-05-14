import { apiClient } from "@/lib/axios";
import type { ApiResponse, CreateUserDto, PagedResponse, UpdateUserDto, User, UserListParams } from "@/types";

export const userService = {
  getList: async (params: UserListParams) => {
    const { data } = await apiClient.get<PagedResponse<User>>("/users", { params });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return data.data;
  },

  create: async (dto: CreateUserDto) => {
    const { data } = await apiClient.post<ApiResponse<User>>("/users", dto);
    return data.data;
  },

  update: async ({ id, dto }: { id: number; dto: UpdateUserDto }) => {
    const { data } = await apiClient.patch<ApiResponse<User>>(`/users/${id}`, dto);
    return data.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/users/${id}`);
  },
};

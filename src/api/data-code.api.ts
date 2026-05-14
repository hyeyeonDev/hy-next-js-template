import { apiClient } from "@/lib/axios";
import type {
  ApiResponse,
  CheckDataCodeResponse,
  CreateDataCodeDto,
  DataCode,
  DataCodeListParams,
  PagedResponse,
  UpdateDataCodeDto,
} from "@/types";

export const dataCodeService = {
  getList: async (params: DataCodeListParams = {}) => {
    const { data } = await apiClient.get<PagedResponse<DataCode>>("/data-codes", { params });
    return data;
  },

  create: async (dto: CreateDataCodeDto) => {
    const { data } = await apiClient.post<ApiResponse<DataCode>>("/data-codes", dto);
    return data.data;
  },

  update: async ({ id, dto }: { id: number; dto: UpdateDataCodeDto }) => {
    const { data } = await apiClient.patch<ApiResponse<DataCode>>(`/data-codes/${id}`, dto);
    return data.data;
  },

  checkDuplicate: async (code: string, excludeId?: number) => {
    const { data } = await apiClient.get<ApiResponse<CheckDataCodeResponse>>("/data-codes/check", {
      params: { code, excludeId },
    });
    return data.data;
  },
};

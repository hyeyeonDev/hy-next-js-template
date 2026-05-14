import { apiClient } from "@/lib/axios";
import type { ApiResponse, CreateOrganizationDto, Organization, OrganizationListParams, PagedResponse, UpdateOrganizationDto } from "@/types";

export const organizationService = {
  getList: async (params: OrganizationListParams = {}) => {
    const { data } = await apiClient.get<PagedResponse<Organization>>("/organizations", { params });
    return data;
  },

  create: async (dto: CreateOrganizationDto) => {
    const { data } = await apiClient.post<ApiResponse<Organization>>("/organizations", dto);
    return data.data;
  },

  update: async ({ id, dto }: { id: number; dto: UpdateOrganizationDto }) => {
    const { data } = await apiClient.patch<ApiResponse<Organization>>(`/organizations/${id}`, dto);
    return data.data;
  },
};

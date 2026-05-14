import { apiClient } from "@/lib/axios";
import type {
  ApiResponse,
  ContentItem,
  ContentKind,
  ContentListParams,
  CreateContentDto,
  PagedResponse,
  UpdateContentDto,
} from "@/types";

const contentPath = {
  notice: "/notices",
  inquiry: "/inquiries",
  qna: "/qnas",
} satisfies Record<ContentKind, string>;

export const contentService = {
  getList: async (kind: ContentKind, params: ContentListParams) => {
    const { data } = await apiClient.get<PagedResponse<ContentItem>>(contentPath[kind], { params });
    return data;
  },

  getById: async (kind: ContentKind, id: number) => {
    const { data } = await apiClient.get<ApiResponse<ContentItem>>(`${contentPath[kind]}/${id}`);
    return data.data;
  },

  create: async (kind: ContentKind, dto: CreateContentDto) => {
    const { data } = await apiClient.post<ApiResponse<ContentItem>>(contentPath[kind], dto);
    return data.data;
  },

  update: async (kind: ContentKind, id: number, dto: UpdateContentDto) => {
    const { data } = await apiClient.patch<ApiResponse<ContentItem>>(`${contentPath[kind]}/${id}`, dto);
    return data.data;
  },

  delete: async (kind: ContentKind, id: number) => {
    await apiClient.delete(`${contentPath[kind]}/${id}`);
  },
};

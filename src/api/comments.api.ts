import { apiClient } from "@/lib/axios";
import type { ApiResponse, ContentComment, ContentKind, CreateCommentDto, UpdateCommentDto } from "@/types";

const contentPath = {
  notice: "/notices",
  inquiry: "/inquiries",
  qna: "/qnas",
} satisfies Record<ContentKind, string>;

function commentsPath(kind: ContentKind, contentId: number) {
  return `${contentPath[kind]}/${contentId}/comments`;
}

function commentPath(kind: ContentKind, contentId: number, commentId: number) {
  return `${commentsPath(kind, contentId)}/${commentId}`;
}

export const commentService = {
  getList: async (kind: ContentKind, contentId: number) => {
    const { data } = await apiClient.get<ApiResponse<ContentComment[]>>(commentsPath(kind, contentId));
    return data.data;
  },

  create: async (kind: ContentKind, contentId: number, dto: CreateCommentDto) => {
    const { data } = await apiClient.post<ApiResponse<ContentComment>>(commentsPath(kind, contentId), dto);
    return data.data;
  },

  createReply: async (kind: ContentKind, contentId: number, commentId: number, dto: CreateCommentDto) => {
    const { data } = await apiClient.post<ApiResponse<ContentComment>>(
      `${commentPath(kind, contentId, commentId)}/replies`,
      dto,
    );
    return data.data;
  },

  update: async (kind: ContentKind, contentId: number, commentId: number, dto: UpdateCommentDto) => {
    const { data } = await apiClient.patch<ApiResponse<ContentComment>>(commentPath(kind, contentId, commentId), dto);
    return data.data;
  },

  delete: async (kind: ContentKind, contentId: number, commentId: number) => {
    await apiClient.delete(commentPath(kind, contentId, commentId));
  },
};

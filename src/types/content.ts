export type ContentKind = "notice" | "inquiry" | "qna";
export type ContentStatus = "draft" | "published" | "answered" | "closed";

export interface ContentItem {
  id: number;
  kind: ContentKind;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  status: ContentStatus;
  category?: string;
  isPinned?: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ContentStatus;
  category?: string;
  authorId?: number;
}

export interface CreateContentDto {
  title: string;
  content: string;
  category?: string;
  status?: ContentStatus;
  isPinned?: boolean;
}

export type UpdateContentDto = Partial<CreateContentDto>;

export interface ContentComment {
  id: number;
  contentId: number;
  parentId?: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  replies?: ContentComment[];
}

export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

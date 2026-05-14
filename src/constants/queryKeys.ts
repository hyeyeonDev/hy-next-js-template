import type { ContentKind, ContentListParams, UserListParams } from "@/types";

/** React Query 키: 캐시 무효화 기준을 한 곳에서 관리합니다. */
export const QUERY_KEYS = {
  AUTH: {
    me: () => ["auth", "me"] as const,
  },
  USERS: {
    all: () => ["users"] as const,
    lists: () => ["users", "list"] as const,
    list: (params: UserListParams) => ["users", "list", params] as const,
    detail: (id: number) => ["users", "detail", id] as const,
  },
  CONTENTS: {
    all: (kind: ContentKind) => [kind] as const,
    lists: (kind: ContentKind) => [kind, "list"] as const,
    list: (kind: ContentKind, params: ContentListParams) => [kind, "list", params] as const,
    detail: (kind: ContentKind, id: number) => [kind, "detail", id] as const,
    comments: (kind: ContentKind, contentId: number) => [kind, "detail", contentId, "comments"] as const,
  },
} as const;

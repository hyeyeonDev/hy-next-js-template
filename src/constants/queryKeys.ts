import type {
  ContentKind,
  ContentListParams,
  DataCodeListParams,
  LoginHistoryListParams,
  OrganizationListParams,
  UserListParams,
} from "@/types";

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
  LOGIN_HISTORY: {
    lists: () => ["login-history", "list"] as const,
    list: (params: LoginHistoryListParams) => ["login-history", "list", params] as const,
  },
  ORGANIZATIONS: {
    lists: () => ["organizations", "list"] as const,
    list: (params: OrganizationListParams) => ["organizations", "list", params] as const,
  },
  DATA_CODES: {
    lists: () => ["data-codes", "list"] as const,
    list: (params: DataCodeListParams) => ["data-codes", "list", params] as const,
    check: (code: string) => ["data-codes", "check", code] as const,
  },
  DIGITAL_MAP: {
    locations: () => ["digital-map", "locations"] as const,
  },
  CONTENTS: {
    all: (kind: ContentKind) => [kind] as const,
    lists: (kind: ContentKind) => [kind, "list"] as const,
    list: (kind: ContentKind, params: ContentListParams) => [kind, "list", params] as const,
    detail: (kind: ContentKind, id: number) => [kind, "detail", id] as const,
    comments: (kind: ContentKind, contentId: number) => [kind, "detail", contentId, "comments"] as const,
  },
} as const;

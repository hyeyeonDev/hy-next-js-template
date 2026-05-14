import type { UserRole, UserStatus } from "@/types";

export const userRoleLabel = {
  admin: "관리자",
  manager: "매니저",
  user: "사용자",
} satisfies Record<UserRole, string>;

export const userStatusLabel = {
  active: "활성",
  inactive: "비활성",
  pending: "대기",
} satisfies Record<UserStatus, string>;

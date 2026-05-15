import type { UserRole, UserStatus } from "@/types";

export const userRoleLabel = {
  SUPER_ADMIN: "최고관리자",
  ADMIN: "관리자",
  MANAGER: "매니저",
  USER: "사용자",
} satisfies Record<UserRole, string>;

export const userStatusLabel = {
  active: "활성",
  inactive: "비활성",
  pending: "대기",
  withdrawn: "탈퇴",
} satisfies Record<UserStatus, string>;

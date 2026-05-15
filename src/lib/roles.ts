import type { UserRole } from "@/types";

export const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"] as const satisfies readonly UserRole[];
export const MANAGER_ROLES = ["MANAGER"] as const satisfies readonly UserRole[];
export const STAFF_ROLES = ["ADMIN", "SUPER_ADMIN", "MANAGER"] as const satisfies readonly UserRole[];

export function isAdminRole(role?: UserRole | null) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isManagerRole(role?: UserRole | null) {
  return role === "MANAGER";
}

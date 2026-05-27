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

export function hasRole(role: UserRole | undefined | null, requiredRole: UserRole) {
  if (!role) return false;

  if (requiredRole === "ADMIN") {
    return isAdminRole(role);
  }

  return role === requiredRole;
}

export function hasAnyRole(role: UserRole | undefined | null, requiredRoles: readonly UserRole[]) {
  return requiredRoles.some((requiredRole) => hasRole(role, requiredRole));
}

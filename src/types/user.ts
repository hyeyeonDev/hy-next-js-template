export type UserRole   = "admin" | "manager" | "user";
export type UserStatus = "active" | "inactive" | "pending";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto { name: string; email: string; role: UserRole; password: string }
export interface UpdateUserDto { name?: string; role?: UserRole; status?: UserStatus }
export interface UserListParams { page?: number; pageSize?: number; search?: string; status?: UserStatus }

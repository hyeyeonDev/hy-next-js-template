import type { User } from "./user";

export type AuthUser = Pick<User, "id" | "name" | "email" | "role" | "avatarUrl">;
export interface LoginDto    { email: string; password: string }
export interface SignupDto   { name: string; email: string; password: string }
export interface FindIdDto   { name: string; phone: string }
export interface FindPasswordDto { email: string; name: string }
export interface LoginResponse { accessToken: string; user: AuthUser }
export interface RefreshTokenResponse { accessToken: string }
export interface FindIdResponse { maskedEmail: string }
export interface FindPasswordResponse { requested: boolean; message: string }

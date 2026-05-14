import { apiClient } from "@/lib/axios";
import type {
  ApiResponse,
  AuthUser,
  FindIdDto,
  FindIdResponse,
  FindPasswordDto,
  FindPasswordResponse,
  LoginDto,
  LoginResponse,
  RefreshTokenResponse,
  SignupDto,
  UpdateProfileDto,
} from "@/types";

export const authService = {
  login: async (dto: LoginDto) => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>("/auth/login", dto);
    return data.data;
  },

  signup: async (dto: SignupDto) => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>("/auth/signup", dto);
    return data.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },

  findId: async (dto: FindIdDto) => {
    const { data } = await apiClient.post<ApiResponse<FindIdResponse>>("/auth/find-id", dto);
    return data.data;
  },

  findPassword: async (dto: FindPasswordDto) => {
    const { data } = await apiClient.post<ApiResponse<FindPasswordResponse>>("/auth/find-password", dto);
    return data.data;
  },

  me: async () => {
    const { data } = await apiClient.get<ApiResponse<AuthUser>>("/auth/me");
    return data.data;
  },

  updateMe: async (dto: UpdateProfileDto) => {
    const { data } = await apiClient.patch<ApiResponse<AuthUser>>("/auth/me", dto);
    return data.data;
  },

  withdrawMe: async () => {
    await apiClient.post("/auth/withdraw");
  },

  refresh: async () => {
    const { data } = await apiClient.post<ApiResponse<RefreshTokenResponse>>("/auth/refresh");
    return data.data;
  },
};

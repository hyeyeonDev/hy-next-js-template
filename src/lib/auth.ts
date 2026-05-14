/** 클라이언트 사이드 토큰 관리 유틸 */
const TOKEN_KEY = "access_token";

export const tokenStorage = {
  get: () =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

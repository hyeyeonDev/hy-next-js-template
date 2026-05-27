/** JWT 인증 토큰 이름은 proxy, API client, auth mutation에서 공유합니다. */
export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24;

function isBrowser() {
  return typeof window !== "undefined";
}

function setCookie(name: string, value: string, maxAge = ACCESS_TOKEN_MAX_AGE) {
  if (!isBrowser()) return;

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (!isBrowser()) return;

  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export const tokenStorage = {
  get: () =>
    isBrowser() ? localStorage.getItem(ACCESS_TOKEN_KEY) : null,
  set: (token: string) => {
    if (!isBrowser()) return;

    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    setCookie(ACCESS_TOKEN_KEY, token);
  },
  remove: () => {
    if (!isBrowser()) return;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    deleteCookie(ACCESS_TOKEN_KEY);
  },
};

export function persistAuthToken(accessToken?: string | null) {
  if (!accessToken) return;

  tokenStorage.set(accessToken);
}

export function clearAuthTokens() {
  tokenStorage.remove();
  deleteCookie(REFRESH_TOKEN_KEY);
}

export function getAuthorizationHeader() {
  const token = tokenStorage.get();
  return token ? `Bearer ${token}` : undefined;
}

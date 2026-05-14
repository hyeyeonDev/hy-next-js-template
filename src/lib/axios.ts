import { env } from "./env";
import { handleMockRequest } from "@/mocks/mock-api";
import { AppError, createApiError, createNetworkError } from "./errors";

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestConfig {
  params?: object;
  headers?: Record<string, string>;
}

interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  useMock?: boolean;
}

interface ClientResponse<T> {
  data: T;
  status: number;
}

function buildUrl(baseURL: string, url: string, params?: object) {
  const isAbsolute = /^https?:\/\//.test(url);
  const requestUrl = new URL(isAbsolute ? url : `${baseURL}${url}`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      requestUrl.searchParams.set(key, String(value));
    }
  });

  return requestUrl.toString();
}

function normalizeError(error: unknown): AppError {
  if (
    typeof error === "object" &&
    error &&
    "status" in error &&
    "message" in error
  ) {
    return error as AppError;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return createNetworkError("요청 시간이 초과되었습니다.");
  }

  if (error instanceof TypeError) {
    return createNetworkError(error.message);
  }

  if (error instanceof Error) {
    return Object.assign(error, { status: 0 });
  }

  return Object.assign(new Error("알 수 없는 오류가 발생했습니다."), {
    status: 0,
  });
}

function createApiClient(config: ApiClientConfig) {
  async function request<T, D = unknown>(
    method: HttpMethod,
    url: string,
    body?: D,
    requestConfig?: RequestConfig,
  ): Promise<ClientResponse<T>> {
    try {
      if (config.useMock) {
        const data = await handleMockRequest<T>({
          method,
          url,
          params: requestConfig?.params,
          body,
        });

        return { data, status: 200 };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        config.timeout ?? 15_000,
      );

      const response = await fetch(
        buildUrl(config.baseURL, url, requestConfig?.params),
        {
          method,
          headers: {
            "Content-Type": "application/json",
            ...config.headers,
            ...requestConfig?.headers,
          },
          credentials: config.withCredentials ? "include" : "same-origin",
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      const data = (await response.json().catch(() => null)) as T & {
        message?: string;
        errors?: Record<string, string[]>;
      };

      if (!response.ok) {
        throw createApiError({
          status: response.status,
          message: data?.message ?? "요청 처리 중 오류가 발생했습니다.",
          errors: data?.errors,
        });
      }

      if (env.isDev) {
        console.log(`[API] ${method} ${url}`, data);
      }

      return { data: data as T, status: response.status };
    } catch (error) {
      throw normalizeError(error);
    }
  }

  return {
    get: <T>(url: string, requestConfig?: RequestConfig) =>
      request<T>("GET", url, undefined, requestConfig),
    post: <T, D = unknown>(
      url: string,
      body?: D,
      requestConfig?: RequestConfig,
    ) => request<T, D>("POST", url, body, requestConfig),
    patch: <T, D = unknown>(
      url: string,
      body?: D,
      requestConfig?: RequestConfig,
    ) => request<T, D>("PATCH", url, body, requestConfig),
    delete: <T = void>(url: string, requestConfig?: RequestConfig) =>
      request<T>("DELETE", url, undefined, requestConfig),
  };
}

export const apiClient = createApiClient({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15_000,
  withCredentials: true,
  useMock: env.USE_MOCK_API,
});

export const kakaoClient = createApiClient({
  baseURL: "https://dapi.kakao.com/v2",
  timeout: 10_000,
  headers: {
    Authorization: `KakaoAK ${env.KAKAO_MAP_KEY}`,
  },
});

export const publicDataClient = createApiClient({
  baseURL: "https://api.data.go.kr",
  timeout: 10_000,
});

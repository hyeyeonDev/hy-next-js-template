export type AppErrorType = "api" | "network" | "render";

export type AppError = Error & {
  type?: AppErrorType;
  status?: number;
  digest?: string;
  errors?: Record<string, string[]>;
};

export function createApiError({
  message,
  status,
  errors,
}: {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}): AppError {
  return Object.assign(new Error(message), {
    name: "ApiError",
    type: "api" as const,
    status,
    errors,
  });
}

export function createNetworkError(message = "네트워크 연결에 실패했습니다."): AppError {
  return Object.assign(new Error(message), {
    name: "NetworkError",
    type: "network" as const,
    status: 0,
  });
}

export function createRenderError(message = "화면 렌더링 중 오류가 발생했습니다."): AppError {
  return Object.assign(new Error(message), {
    name: "RenderError",
    type: "render" as const,
  });
}

export function classifyError(error: AppError): AppErrorType {
  const message = error.message.toLowerCase();

  if (error.type) {
    return error.type;
  }

  if (typeof error.status === "number" && error.status > 0) {
    return "api";
  }

  if (
    error.name === "TypeError" ||
    error.name === "AbortError" ||
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("failed to fetch") ||
    message.includes("load failed")
  ) {
    return "network";
  }

  return "render";
}

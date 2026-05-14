"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { createApiError, createNetworkError, createRenderError } from "@/lib/errors";

type PreviewErrorType = "api" | "network" | "render";

function createPreviewError(type: PreviewErrorType) {
  if (type === "api") {
    return createApiError({
      message: "사용자 목록 API 요청이 실패했습니다.",
      status: 500,
    });
  }

  if (type === "network") {
    return createNetworkError("Failed to fetch");
  }

  return createRenderError("컴포넌트 렌더링 중 예기치 않은 오류가 발생했습니다.");
}

export function ErrorPreviewClient() {
  const [errorType, setErrorType] = useState<PreviewErrorType | null>(null);

  if (errorType) {
    throw createPreviewError(errorType);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-text">에러 페이지 미리보기</h1>
        <p className="mt-2 text-sm text-text-muted">
          버튼을 누르면 오류 유형별 전역 에러 페이지를 확인합니다.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button variant="outline" onClick={() => setErrorType("api")}>
            API 오류
          </Button>
          <Button variant="outline" onClick={() => setErrorType("network")}>
            네트워크 오류
          </Button>
          <Button variant="danger" onClick={() => setErrorType("render")}>
            화면 오류
          </Button>
        </div>
      </div>
    </main>
  );
}

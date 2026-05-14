"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { env } from "@/lib/env";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // QueryClient를 useState로 만들어야 요청별 인스턴스가 격리됩니다
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 윈도우 포커스 시 자동 재조회 (사내 시스템이면 false 권장)
            refetchOnWindowFocus: false,
            // 실패 시 재시도 횟수
            retry: 1,
            // 캐시 유효 시간 (5분)
            staleTime: 5 * 60 * 1000,
          },
          mutations: {
            // mutation 실패 시 재시도 안 함 (기본값)
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 devtools 표시 */}
      {env.isDev && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

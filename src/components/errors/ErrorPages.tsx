"use client";

import { Bug, ServerCrash, WifiOff } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { AppError, classifyError } from "@/lib/errors";

interface ErrorPageProps {
  error: AppError;
  reset?: () => void;
}

function ErrorShell({
  badge,
  title,
  description,
  error,
  reset,
  icon,
}: ErrorPageProps & {
  badge: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 py-20">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger-50 text-danger-500">
          {icon}
        </div>
        <span className="mt-4 inline-flex rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-text-muted">
          {badge}
        </span>
        <h1 className="mt-3 text-base font-semibold text-text">{title}</h1>
        <p className="mt-2 text-sm text-text-muted">{description}</p>
        <div className="mt-4 rounded-md bg-surface-2 px-3 py-2 text-left text-xs text-text-muted">
          <p>메시지: {error.message || "알 수 없는 오류"}</p>
          {error.status && <p>상태 코드: {error.status}</p>}
          {error.digest && <p>오류 ID: {error.digest}</p>}
        </div>
        {reset && (
          <div className="mt-5 flex justify-center">
            <Button onClick={reset}>다시 시도</Button>
          </div>
        )}
      </div>
    </main>
  );
}

export function ApiErrorPage({ error, reset }: ErrorPageProps) {
  const description =
    error.status === 401
      ? "로그인이 만료되었거나 인증 정보가 올바르지 않습니다."
      : error.status === 403
        ? "요청한 작업을 수행할 권한이 없습니다."
        : error.status === 404
          ? "요청한 데이터를 찾을 수 없습니다."
          : "API 응답 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";

  return (
    <ErrorShell
      badge="API 오류"
      title="서버 요청을 처리하지 못했습니다"
      description={description}
      error={error}
      reset={reset}
      icon={<ServerCrash className="h-6 w-6" aria-hidden="true" />}
    />
  );
}

export function NetworkErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <ErrorShell
      badge="네트워크 오류"
      title="네트워크 연결을 확인해 주세요"
      description="인터넷 연결이 불안정하거나 서버에 연결할 수 없습니다. 연결 상태를 확인한 뒤 다시 시도해 주세요."
      error={error}
      reset={reset}
      icon={<WifiOff className="h-6 w-6" aria-hidden="true" />}
    />
  );
}

export function RenderErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <ErrorShell
      badge="화면 오류"
      title="화면을 표시하는 중 문제가 발생했습니다"
      description="일시적인 화면 오류일 수 있습니다. 다시 시도해도 반복되면 개발자에게 오류 정보를 전달해 주세요."
      error={error}
      reset={reset}
      icon={<Bug className="h-6 w-6" aria-hidden="true" />}
    />
  );
}

export function AppErrorPage({ error, reset }: ErrorPageProps) {
  const type = classifyError(error);

  if (type === "api") {
    return <ApiErrorPage error={error} reset={reset} />;
  }

  if (type === "network") {
    return <NetworkErrorPage error={error} reset={reset} />;
  }

  return <RenderErrorPage error={error} reset={reset} />;
}

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { LoadingState } from "@/components/data-display";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { createLoginPath } from "@/lib/auth-redirect";

interface AuthGuardProps {
  children: React.ReactNode;
  mode?: "redirect" | "modal";
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, mode = "redirect", fallback }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const currentPath = `${pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`;
  const loginPath = createLoginPath(currentPath);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && mode === "redirect") {
      router.replace(loginPath);
    }
  }, [isAuthenticated, isLoading, loginPath, mode, router]);

  if (isLoading) {
    return <LoadingState message="인증 상태를 확인하는 중..." />;
  }

  if (!isAuthenticated && mode === "modal") {
    return (
      <>
        {fallback ?? <LoadingState message="로그인이 필요합니다." />}
        <Modal
          open
          closeOnBackdrop={false}
          title="로그인이 필요합니다"
          description="로그인 후 기존 페이지로 돌아갑니다."
          onClose={() => router.replace(loginPath)}
        >
          <LoginForm redirectTo={currentPath} />
        </Modal>
      </>
    );
  }

  if (!isAuthenticated) {
    return <LoadingState message="로그인 페이지로 이동하는 중..." />;
  }

  return children;
}

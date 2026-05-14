import Link from "next/link";

import { LoginForm } from "@/components/features/auth/LoginForm";
import { ROUTES } from "@/constants/routes";
import { getSafeReturnPath } from "@/lib/auth-redirect";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  const redirectTo = getSafeReturnPath(next);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-text">로그인</h1>
        <p className="mt-1 text-sm text-text-muted">mock 계정으로 바로 테스트할 수 있습니다.</p>
        <div className="mt-5">
          <LoginForm redirectTo={redirectTo} />
        </div>
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <Link className="font-medium text-text-muted hover:text-primary-600 hover:underline" href={ROUTES.AUTH.FIND_ID}>
            아이디 찾기
          </Link>
          <span className="h-3 w-px bg-border" aria-hidden="true" />
          <Link
            className="font-medium text-text-muted hover:text-primary-600 hover:underline"
            href={ROUTES.AUTH.FIND_PASSWORD}
          >
            비밀번호 찾기
          </Link>
        </div>
        <p className="mt-3 text-center text-sm text-text-muted">
          계정이 없나요?{" "}
          <Link className="font-medium text-primary-600 hover:underline" href={ROUTES.AUTH.SIGNUP}>
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}

import Link from "next/link";

import { SignupForm } from "@/components/features/auth/SignupForm";
import { ROUTES } from "@/constants/routes";
import { getSafeReturnPath } from "@/lib/auth-redirect";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  const redirectTo = getSafeReturnPath(next);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-text">회원가입</h1>
        <p className="mt-1 text-sm text-text-muted">아이디와 비밀번호로 사용할 계정을 만듭니다.</p>
        <div className="mt-5">
          <SignupForm redirectTo={redirectTo} />
        </div>
        <p className="mt-4 text-center text-sm text-text-muted">
          이미 계정이 있나요?{" "}
          <Link className="font-medium text-primary-600 hover:underline" href={ROUTES.AUTH.LOGIN}>
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}

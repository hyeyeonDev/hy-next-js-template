import Link from "next/link";

import { FindPasswordForm } from "@/components/features/auth/FindPasswordForm";
import { ROUTES } from "@/constants/routes";

export default function FindPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-text">비밀번호 찾기</h1>
            <p className="mt-1 text-sm text-text-muted">가입 이메일로 재설정 안내를 받습니다.</p>
          </div>
          <Link className="text-xs font-medium text-primary-600 hover:underline" href={ROUTES.AUTH.SIGNUP}>
            회원가입
          </Link>
        </div>
        <div className="mt-5">
          <FindPasswordForm />
        </div>
      </div>
    </main>
  );
}

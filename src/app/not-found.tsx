import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Home, SearchX } from "lucide-react";

import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 py-20">
      <section className="w-full max-w-md rounded-lg border border-border bg-surface p-6 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
          <SearchX className="h-6 w-6" aria-hidden="true" />
        </div>
        <span className="mt-4 inline-flex rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-text-muted">
          404
        </span>
        <h1 className="mt-3 text-base font-semibold text-text">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm text-text-muted">
          주소가 변경되었거나, 아직 공개되지 않은 페이지일 수 있습니다.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href={ROUTES.DASHBOARD}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-primary-600 px-3 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            대시보드
          </Link>
          <Link
            href={ROUTES.ROOT}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm font-medium text-text transition-colors hover:bg-surface-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            홈으로
          </Link>
        </div>
      </section>
    </main>
  );
}

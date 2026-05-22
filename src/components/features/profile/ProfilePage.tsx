"use client";

import Link from "next/link";
import { FileText, MessageSquareText, UserRound } from "lucide-react";

import { LoadingState } from "@/components/data-display";
import { PageWrapper } from "@/components/layout";
import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { useContentsQuery, useMeQuery } from "@/hooks/queries";
import { useI18n } from "@/i18n";
import { formatDate, formatNumber } from "@/lib/format";
import type { ContentItem, ContentKind, User } from "@/types";

import { getContentMeta, getContentStatusLabel } from "../content/content-meta";
import { userRoleLabel, userStatusLabel } from "../users/user-meta";

const contentKinds: ContentKind[] = ["notice", "inquiry", "qna"];

function statusVariant(status: User["status"]) {
  if (status === "active") return "success";
  if (status === "pending") return "warning";
  if (status === "withdrawn") return "danger";
  return "secondary";
}

export function ProfilePage() {
  const { t, locale } = useI18n();
  const meQuery = useMeQuery();
  const authorId = meQuery.data?.id ?? -1;
  const noticeQuery = useContentsQuery("notice", { page: 1, pageSize: 5, authorId });
  const inquiryQuery = useContentsQuery("inquiry", { page: 1, pageSize: 5, authorId });
  const qnaQuery = useContentsQuery("qna", { page: 1, pageSize: 5, authorId });
  const contentQueries = { notice: noticeQuery, inquiry: inquiryQuery, qna: qnaQuery };

  const recentContents = contentKinds
    .flatMap((kind) => contentQueries[kind].data?.data ?? [])
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <PageWrapper title={t("profile.title")} description="내 계정 요약과 활동 내역을 확인합니다.">
      {meQuery.isLoading && <LoadingState message={t("profile.loading")} />}

      {meQuery.isError && (
        <Card>
          <p className="text-sm text-danger-600">{meQuery.error.message}</p>
        </Card>
      )}

      {meQuery.data && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <Card className="h-fit">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">
                {meQuery.data.name.slice(0, 1) || <UserRound className="h-5 w-5" aria-hidden="true" />}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-semibold text-text">{meQuery.data.name}님</h2>
                <p className="truncate text-sm text-text-muted">{meQuery.data.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="primary">{userRoleLabel[meQuery.data.role]}</Badge>
                  <Badge variant={statusVariant(meQuery.data.status)} dot>
                    {userStatusLabel[meQuery.data.status]}
                  </Badge>
                </div>
              </div>
            </div>

            <dl className="mt-5 space-y-3 border-t border-border pt-5">
              <div>
                <dt className="text-xs text-text-muted">이메일</dt>
                <dd className="mt-1 text-sm font-medium text-text">{meQuery.data.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-text-muted">전화번호</dt>
                <dd className="mt-1 text-sm font-medium text-text">{meQuery.data.phone || "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-text-muted">주소</dt>
                <dd className="mt-1 text-sm font-medium text-text">
                  {[meQuery.data.address, meQuery.data.addressDetail].filter(Boolean).join(" ") || "-"}
                </dd>
              </div>
            </dl>

            <Link
              href={ROUTES.MY_PROFILE}
              className="mt-6 inline-flex h-9 w-full items-center justify-center rounded-md bg-primary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              내정보 보기
            </Link>
          </Card>

          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {contentKinds.map((kind) => {
                const meta = getContentMeta(kind, t);
                const total = contentQueries[kind].data?.pagination.total ?? 0;
                return (
                  <Card key={kind} padding="sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-text-muted">{meta.title}</p>
                        <p className="mt-1 text-2xl font-bold text-text">{formatNumber(total, locale)}</p>
                      </div>
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-2 text-primary-600">
                        <MessageSquareText className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Card padding="none">
              <CardHeader className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>내가 쓴 글</CardTitle>
                    <CardDescription>최근 작성한 게시글을 한 곳에서 확인합니다.</CardDescription>
                  </div>
                  <FileText className="h-5 w-5 text-text-muted" aria-hidden="true" />
                </div>
              </CardHeader>
              <div className="divide-y divide-border">
                {recentContents.length > 0 ? (
                  recentContents.map((item) => <MyContentItem key={`${item.kind}-${item.id}`} item={item} locale={locale} t={t} />)
                ) : (
                  <p className="px-5 py-10 text-center text-sm text-text-muted">아직 작성한 글이 없습니다.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

function MyContentItem({
  item,
  locale,
  t,
}: {
  item: ContentItem;
  locale: string;
  t: ReturnType<typeof useI18n>["t"];
}) {
  const meta = getContentMeta(item.kind, t);
  const dateLocale = locale === "EN" ? "en-US" : "ko-KR";

  return (
    <Link href={`${meta.path}/${item.id}`} className="block px-5 py-4 transition-colors hover:bg-surface-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{meta.title}</Badge>
            <Badge variant={item.status === "draft" ? "secondary" : item.status === "closed" ? "outline" : "success"}>
              {getContentStatusLabel(item.status, t)}
            </Badge>
          </div>
          <p className="truncate text-sm font-semibold text-text">{item.title}</p>
          <p className="mt-1 truncate text-xs text-text-muted">{item.category || item.content}</p>
        </div>
        <span className="shrink-0 text-xs text-text-muted">{formatDate(item.createdAt, dateLocale)}</span>
      </div>
    </Link>
  );
}

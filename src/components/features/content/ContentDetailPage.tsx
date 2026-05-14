"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";

import { useContentQuery, useDeleteContentMutation } from "@/hooks/queries";
import { AuthGuard } from "@/components/auth";
import { LoadingState } from "@/components/data-display";
import { useToast } from "@/components/ui/toast";
import { Badge, Button, Card } from "@/components/ui";
import type { ContentKind } from "@/types";

import { CommentThread } from "./CommentThread";
import { contentMeta, statusLabel } from "./content-meta";

interface ContentDetailPageProps {
  kind: ContentKind;
  id: number;
}

export function ContentDetailPage({ kind, id }: ContentDetailPageProps) {
  const meta = contentMeta[kind];
  const router = useRouter();
  const { toast } = useToast();
  const detailQuery = useContentQuery(kind, id);
  const deleteContent = useDeleteContentMutation(kind);

  return (
    <AuthGuard>
      <main className="min-h-screen bg-bg p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link className="text-sm font-medium text-primary-600 hover:underline" href={meta.path}>
                {meta.title}
              </Link>
              <h1 className="mt-2 text-2xl font-bold text-text">상세보기</h1>
              <p className="mt-1 text-sm text-text-muted">게시물 내용을 확인합니다.</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`${meta.path}/${id}/edit`}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                <Edit className="h-4 w-4" aria-hidden="true" />
                수정
              </Link>
              <Button
                variant="danger"
                leftIcon={<Trash2 aria-hidden="true" />}
                loading={deleteContent.isPending}
                onClick={() => {
                  deleteContent.mutate(id, {
                    onSuccess: () => {
                      toast("삭제되었습니다.", "danger");
                      router.replace(meta.path);
                    },
                  });
                }}
              >
                삭제
              </Button>
            </div>
          </div>

          {detailQuery.isLoading && <LoadingState message="게시물을 불러오는 중..." />}

          {detailQuery.isError && (
            <Card>
              <p className="text-sm text-danger-600">{detailQuery.error.message}</p>
            </Card>
          )}

          {detailQuery.data && (
            <div className="space-y-6">
              <Card>
                <div className="border-b border-border pb-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {detailQuery.data.category && <Badge variant="outline">{detailQuery.data.category}</Badge>}
                    <Badge
                      variant={
                        detailQuery.data.status === "draft"
                          ? "secondary"
                          : detailQuery.data.status === "closed"
                            ? "outline"
                            : "success"
                      }
                    >
                      {statusLabel[detailQuery.data.status]}
                    </Badge>
                    {detailQuery.data.isPinned && <Badge variant="primary">상단 고정</Badge>}
                  </div>
                  <h2 className="text-xl font-semibold text-text">{detailQuery.data.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                    <span>작성자 {detailQuery.data.authorName}</span>
                    <span>조회 {detailQuery.data.viewCount.toLocaleString()}</span>
                    <span>작성일 {new Date(detailQuery.data.createdAt).toLocaleDateString("ko-KR")}</span>
                  </div>
                </div>
                <div className="whitespace-pre-wrap py-6 text-sm leading-7 text-text">{detailQuery.data.content}</div>
              </Card>
              <CommentThread kind={kind} contentId={id} allowReplies={meta.allowReplies} />
            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Paperclip, Trash2 } from "lucide-react";

import { useContentQuery, useDeleteContentMutation } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { LoadingState, RichTextContent } from "@/components/data-display";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { useDialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { Badge, Button, Card } from "@/components/ui";
import { useI18n } from "@/i18n";
import { formatDate, formatFileSize, formatNumber } from "@/lib/format";
import { isAdminRole } from "@/lib/roles";
import type { ContentKind } from "@/types";

import { CommentThread } from "./CommentThread";
import { getContentMeta, getContentStatusLabel } from "./content-meta";

interface ContentDetailPageProps {
  kind: ContentKind;
  id: number;
}

export function ContentDetailPage({ kind, id }: ContentDetailPageProps) {
  const { t, locale } = useI18n();
  const meta = getContentMeta(kind, t);
  const router = useRouter();
  const { toast } = useToast();
  const { confirm } = useDialog();
  const { user } = useAuth();
  const detailQuery = useContentQuery(kind, id);
  const deleteContent = useDeleteContentMutation(kind);
  const canManage = !!detailQuery.data && (detailQuery.data.authorId === user?.id || isAdminRole(user?.role));

  return (
    <AdminLayout title={meta.title}>
      <PageWrapper
        title={t("common.detail")}
        description={t("content.detailDescription")}
        breadcrumb={
          <Link className="text-sm font-medium text-primary-600 hover:underline" href={meta.path}>
            {meta.title}
          </Link>
        }
        actions={canManage ? (
          <>
            <Link
              href={`${meta.path}/${id}/edit`}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Edit className="h-4 w-4" aria-hidden="true" />
              {t("common.edit")}
            </Link>
            <Button
              variant="danger"
              leftIcon={<Trash2 aria-hidden="true" />}
              loading={deleteContent.isPending}
              onClick={async () => {
                const ok = await confirm("게시글을 삭제할까요?", {
                  message: "삭제된 게시글은 목록에서 제거됩니다.",
                  variant: "danger",
                  confirmLabel: "삭제",
                });
                if (!ok) return;

                deleteContent.mutate(id, {
                  onSuccess: () => {
                    toast("삭제되었습니다.", "danger");
                    router.replace(meta.path);
                  },
                });
              }}
            >
              {t("common.delete")}
            </Button>
          </>
        ) : null}
      >

          {detailQuery.isLoading && <LoadingState message={t("common.loadingContent")} />}

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
                      {getContentStatusLabel(detailQuery.data.status, t)}
                    </Badge>
                    {detailQuery.data.isPinned && <Badge variant="primary">{t("content.pinned")}</Badge>}
                    {detailQuery.data.isPopup && <Badge variant="warning">팝업</Badge>}
                  </div>
                  <h2 className="text-xl font-semibold text-text">{detailQuery.data.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                    <span>{t("content.writer")} {detailQuery.data.authorName}</span>
                    <span>{t("table.views")} {formatNumber(detailQuery.data.viewCount, locale)}</span>
                    <span>{t("content.createdAt")} {formatDate(detailQuery.data.createdAt, locale)}</span>
                  </div>
                </div>
                <RichTextContent content={detailQuery.data.content} />
                {!!detailQuery.data.attachments?.length && (
                  <div className="border-t border-border py-4">
                    <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-text">
                      <Paperclip className="h-4 w-4 text-text-subtle" aria-hidden="true" />
                      첨부파일
                    </div>
                    <ul className="flex flex-col gap-2">
                      {detailQuery.data.attachments.map((file) => (
                        <li
                          key={`${file.name}-${file.size}`}
                          className="flex items-center justify-between gap-3 rounded-md bg-surface-2 px-3 py-2 text-sm"
                        >
                          {file.url ? (
                            <Link className="min-w-0 truncate text-primary-600 hover:underline" href={file.url}>
                              {file.name}
                            </Link>
                          ) : (
                            <span className="min-w-0 truncate text-text-muted">{file.name}</span>
                          )}
                          <span className="shrink-0 text-xs text-text-subtle">{formatFileSize(file.size)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
              {meta.allowComments && (
                <CommentThread kind={kind} contentId={id} allowReplies={meta.allowReplies} />
              )}
            </div>
          )}
      </PageWrapper>
    </AdminLayout>
  );
}

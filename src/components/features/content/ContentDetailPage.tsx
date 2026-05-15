"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";

import { useContentQuery, useDeleteContentMutation } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { LoadingState } from "@/components/data-display";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { useToast } from "@/components/ui/toast";
import { Badge, Button, Card } from "@/components/ui";
import { useI18n } from "@/i18n";
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
              onClick={() => {
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
                  </div>
                  <h2 className="text-xl font-semibold text-text">{detailQuery.data.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                    <span>{t("content.writer")} {detailQuery.data.authorName}</span>
                    <span>{t("table.views")} {detailQuery.data.viewCount.toLocaleString()}</span>
                    <span>{t("content.createdAt")} {new Date(detailQuery.data.createdAt).toLocaleDateString(locale === "en" ? "en-US" : "ko-KR")}</span>
                  </div>
                </div>
                <div className="whitespace-pre-wrap py-6 text-sm leading-7 text-text">{detailQuery.data.content}</div>
              </Card>
              <CommentThread kind={kind} contentId={id} allowReplies={meta.allowReplies} />
            </div>
          )}
      </PageWrapper>
    </AdminLayout>
  );
}

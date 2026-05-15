"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useContentQuery, useUpdateContentMutation } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { LoadingState } from "@/components/data-display";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { useToast } from "@/components/ui/toast";
import { Card } from "@/components/ui";
import { useI18n } from "@/i18n";
import { isAdminRole } from "@/lib/roles";
import type { ContentKind } from "@/types";

import { ContentForm } from "./ContentForm";
import { getContentMeta } from "./content-meta";

interface ContentEditPageProps {
  kind: ContentKind;
  id: number;
}

export function ContentEditPage({ kind, id }: ContentEditPageProps) {
  const { t } = useI18n();
  const meta = getContentMeta(kind, t);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const detailQuery = useContentQuery(kind, id);
  const updateContent = useUpdateContentMutation(kind);
  const canManage = !!detailQuery.data && (detailQuery.data.authorId === user?.id || isAdminRole(user?.role));

  return (
    <AdminLayout title={meta.title}>
      <PageWrapper
        title={t("common.edit")}
        description={t("content.editDescription")}
        breadcrumb={
          <Link className="text-sm font-medium text-primary-600 hover:underline" href={`${meta.path}/${id}`}>
            {t("common.detail")}
          </Link>
        }
      >
        {detailQuery.isLoading && <LoadingState message={t("common.loadingContent")} />}

          {detailQuery.isError && (
            <Card>
              <p className="text-sm text-danger-600">{detailQuery.error.message}</p>
            </Card>
          )}

          {detailQuery.data && !canManage && (
            <Card>
              <p className="text-sm text-danger-600">게시물 수정 권한이 없습니다.</p>
            </Card>
          )}

          {detailQuery.data && canManage && (
            <Card>
              <ContentForm
                initialValue={detailQuery.data}
                submitLabel={t("common.edit")}
                loading={updateContent.isPending}
                onSubmit={(value) => {
                  updateContent.mutate(
                    { id, dto: value },
                    {
                      onSuccess: () => {
                        toast("수정되었습니다.", "success");
                        router.replace(`${meta.path}/${id}`);
                      },
                    },
                  );
                }}
              />
            </Card>
          )}
      </PageWrapper>
    </AdminLayout>
  );
}

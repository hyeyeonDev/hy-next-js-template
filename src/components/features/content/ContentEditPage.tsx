"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useContentQuery, useUpdateContentMutation } from "@/hooks/queries";
import { LoadingState } from "@/components/data-display";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { useToast } from "@/components/ui/toast";
import { Card } from "@/components/ui";
import type { ContentKind } from "@/types";

import { ContentForm } from "./ContentForm";
import { contentMeta } from "./content-meta";

interface ContentEditPageProps {
  kind: ContentKind;
  id: number;
}

export function ContentEditPage({ kind, id }: ContentEditPageProps) {
  const meta = contentMeta[kind];
  const router = useRouter();
  const { toast } = useToast();
  const detailQuery = useContentQuery(kind, id);
  const updateContent = useUpdateContentMutation(kind);

  return (
    <AdminLayout title={meta.title}>
      <PageWrapper
        title="수정"
        description="게시물 정보를 수정합니다."
        breadcrumb={
          <Link className="text-sm font-medium text-primary-600 hover:underline" href={`${meta.path}/${id}`}>
            상세보기
          </Link>
        }
      >
        {detailQuery.isLoading && <LoadingState message="게시물을 불러오는 중..." />}

          {detailQuery.isError && (
            <Card>
              <p className="text-sm text-danger-600">{detailQuery.error.message}</p>
            </Card>
          )}

          {detailQuery.data && (
            <Card>
              <ContentForm
                initialValue={detailQuery.data}
                submitLabel="수정"
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

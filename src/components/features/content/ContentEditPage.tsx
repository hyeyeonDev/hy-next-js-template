"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useContentQuery, useUpdateContentMutation } from "@/hooks/queries";
import { AuthGuard } from "@/components/auth";
import { LoadingState } from "@/components/data-display";
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
    <AuthGuard>
      <main className="min-h-screen bg-bg p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Link className="text-sm font-medium text-primary-600 hover:underline" href={`${meta.path}/${id}`}>
              상세보기
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-text">수정</h1>
            <p className="mt-1 text-sm text-text-muted">게시물 정보를 수정합니다.</p>
          </div>

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
        </div>
      </main>
    </AuthGuard>
  );
}

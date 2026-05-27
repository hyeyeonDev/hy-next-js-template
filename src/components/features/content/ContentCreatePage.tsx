"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCreateContentMutation } from "@/hooks/queries";
import { Card } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { useI18n } from "@/i18n";
import type { ContentKind } from "@/types";

import { ContentForm } from "./ContentForm";
import { getContentMeta } from "./content-meta";

interface ContentCreatePageProps {
  kind: ContentKind;
}

export function ContentCreatePage({ kind }: ContentCreatePageProps) {
  const { t } = useI18n();
  const meta = getContentMeta(kind, t);
  const router = useRouter();
  const { toast } = useToast();
  const createContent = useCreateContentMutation(kind);

  return (
    <AdminLayout title={meta.title}>
      <PageWrapper
        title={meta.createLabel}
        description={meta.description}
        breadcrumb={
          <Link className="text-sm font-medium text-primary-600 hover:underline" href={meta.path}>
            {meta.title}
          </Link>
        }
      >
        <Card>
          <ContentForm
            loading={createContent.isPending}
            onSubmit={(value) => {
              createContent.mutate(value, {
                onSuccess: (item) => {
                  toast("저장되었습니다.", "success");
                  router.replace(`${meta.path}/${item.id}`);
                },
              });
            }}
          />
        </Card>
      </PageWrapper>
    </AdminLayout>
  );
}

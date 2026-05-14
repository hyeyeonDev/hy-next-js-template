"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Edit, Eye, Pin, Plus } from "lucide-react";

import { useContentsQuery, useCreateContentMutation } from "@/hooks/queries";
import { AuthGuard } from "@/components/auth";
import { Badge, Button, Card, Modal } from "@/components/ui";
import { DataTable } from "@/components/data-display";
import { useToast } from "@/components/ui/toast";
import { FormField, SearchInput } from "@/components/forms";
import type { ContentItem, ContentKind, TableColumn } from "@/types";

import { ContentForm } from "./ContentForm";
import { contentMeta, statusLabel } from "./content-meta";

interface ContentListPageProps {
  kind: ContentKind;
}

const actionLinkClass =
  "inline-flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-xs font-medium text-text transition-colors hover:bg-surface-2";

export function ContentListPage({ kind }: ContentListPageProps) {
  const meta = contentMeta[kind];
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const listQuery = useContentsQuery(kind, { page, pageSize: 10, search });
  const createContent = useCreateContentMutation(kind);

  const columns = useMemo<TableColumn<ContentItem>[]>(
    () => [
      {
        key: "title",
        label: "제목",
        render: (_, row) => (
          <span className="inline-flex items-center gap-1.5 font-medium">
            {row.isPinned && <Pin className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />}
            {row.title}
          </span>
        ),
      },
      { key: "category", label: "카테고리", width: "110px" },
      {
        key: "status",
        label: "상태",
        width: "110px",
        render: (value) => (
          <Badge variant={value === "draft" ? "secondary" : value === "closed" ? "outline" : "success"}>
            {statusLabel[value as keyof typeof statusLabel]}
          </Badge>
        ),
      },
      { key: "authorName", label: "작성자", width: "100px" },
      { key: "viewCount", label: "조회", width: "80px", align: "right" },
      {
        key: "id",
        label: "관리",
        width: "150px",
        align: "right",
        render: (_, row) => (
          <div className="flex justify-end gap-1">
            <Link className={actionLinkClass} href={`${meta.path}/${row.id}`}>
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              보기
            </Link>
            <Link className={actionLinkClass} href={`${meta.path}/${row.id}/edit`}>
              <Edit className="h-3.5 w-3.5" aria-hidden="true" />
              수정
            </Link>
          </div>
        ),
      },
    ],
    [meta.path],
  );

  return (
    <AuthGuard>
      <main className="min-h-screen bg-bg p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link className="text-sm font-medium text-primary-600 hover:underline" href="/dashboard">
                대시보드
              </Link>
              <h1 className="mt-2 text-2xl font-bold text-text">{meta.title}</h1>
              <p className="mt-1 text-sm text-text-muted">{meta.description}</p>
            </div>
            <Button leftIcon={<Plus aria-hidden="true" />} onClick={() => setCreateOpen(true)}>
              {meta.createLabel}
            </Button>
          </div>

          <Card className="mb-4">
            <FormField label="검색">
              <SearchInput
                placeholder="제목, 내용, 작성자 검색"
                onSearch={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
              />
            </FormField>
          </Card>

          <DataTable
            columns={columns}
            data={(listQuery.data?.data ?? []) as ContentItem[]}
            loading={listQuery.isLoading}
            emptyMessage="등록된 데이터가 없습니다."
            pagination={
              listQuery.data?.pagination
                ? {
                    page: listQuery.data.pagination.page,
                    pageSize: listQuery.data.pagination.pageSize,
                    total: listQuery.data.pagination.total,
                    totalPages: listQuery.data.pagination.totalPages,
                    onChange: setPage,
                  }
                : undefined
            }
          />

          {listQuery.isError && <p className="mt-3 text-sm text-danger-600">{listQuery.error.message}</p>}
        </div>

        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={meta.createLabel} size="lg">
          <ContentForm
            loading={createContent.isPending}
            onSubmit={(value) => {
              createContent.mutate(value, {
                onSuccess: () => {
                  setCreateOpen(false);
                  toast("저장되었습니다.", "success");
                },
              });
            }}
          />
        </Modal>
      </main>
    </AuthGuard>
  );
}

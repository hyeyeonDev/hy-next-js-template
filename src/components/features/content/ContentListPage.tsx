"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Edit, Pin, Plus } from "lucide-react";

import { useContentsQuery } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { Badge, Card } from "@/components/ui";
import { DataTable } from "@/components/data-display";
import { FormField, SearchInput } from "@/components/forms";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { useI18n } from "@/i18n";
import { isAdminRole } from "@/lib/roles";
import type { ContentItem, ContentKind, TableColumn } from "@/types";

import { getContentMeta, getContentStatusLabel } from "./content-meta";

interface ContentListPageProps {
  kind: ContentKind;
}

const actionLinkClass =
  "inline-flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-xs font-medium text-text transition-colors hover:bg-surface-2";

export function ContentListPage({ kind }: ContentListPageProps) {
  const { t } = useI18n();
  const meta = getContentMeta(kind, t);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  const listQuery = useContentsQuery(kind, { page, pageSize: 10, search });

  const columns = useMemo<TableColumn<ContentItem>[]>(() => {
    const baseColumns: TableColumn<ContentItem>[] = [
      {
        key: "title",
        label: t("table.title"),
        render: (_, row) => (
          <Link
            href={`${meta.path}/${row.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-text transition-colors hover:text-primary-600 hover:underline"
          >
            {row.isPinned && <Pin className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />}
            {row.title}
          </Link>
        ),
      },
      { key: "category", label: t("table.category"), width: "110px" },
      {
        key: "status",
        label: t("table.status"),
        width: "110px",
        render: (value) => (
          <Badge variant={value === "draft" ? "secondary" : value === "closed" ? "outline" : "success"}>
            {getContentStatusLabel(value as ContentItem["status"], t)}
          </Badge>
        ),
      },
      { key: "authorName", label: t("table.author"), width: "100px" },
      { key: "viewCount", label: t("table.views"), width: "80px", align: "right" },
    ];

    return [
      ...baseColumns,
      {
        key: "id",
        label: t("table.manage"),
        width: "90px",
        align: "right",
        render: (_, row) => (
          <div className="flex justify-end gap-1">
            {(row.authorId === user?.id || isAdminRole(user?.role)) && (
              <Link className={actionLinkClass} href={`${meta.path}/${row.id}/edit`}>
                <Edit className="h-3.5 w-3.5" aria-hidden="true" />
                {t("common.edit")}
              </Link>
            )}
          </div>
        ),
      },
    ];
  }, [meta.path, t, user?.id, user?.role]);

  return (
    <AdminLayout title={meta.title}>
      <PageWrapper
        title={meta.title}
        description={meta.description}
        actions={
          <Link
            href={`${meta.path}/new`}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {meta.createLabel}
          </Link>
        }
      >
        <Card className="mb-4">
          <FormField label="검색">
            <SearchInput
              placeholder={t("content.searchPlaceholder")}
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
          emptyMessage={t("common.noData")}
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
      </PageWrapper>
    </AdminLayout>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Shield } from "lucide-react";

import { RoleGuard } from "@/components/auth";
import { DataTable } from "@/components/data-display";
import { FormField, SearchInput } from "@/components/forms";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { Badge, Card, Select } from "@/components/ui";
import { useLoginHistoryQuery } from "@/hooks/queries";
import type { LoginHistory, TableColumn } from "@/types";

export function LoginHistoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | LoginHistory["status"]>("");
  const loginHistoryQuery = useLoginHistoryQuery({ page, pageSize: 10, search, status: status || undefined });

  const columns = useMemo<TableColumn<LoginHistory>[]>(
    () => [
      {
        key: "userName",
        label: "사용자",
        render: (_, row) => (
          <div>
            <p className="font-medium text-text">{row.userName}</p>
            <p className="text-xs text-text-muted">{row.email}</p>
          </div>
        ),
      },
      { key: "ipAddress", label: "IP", width: "130px" },
      { key: "userAgent", label: "환경", width: "150px" },
      {
        key: "status",
        label: "상태",
        width: "100px",
        render: (value) => (
          <Badge variant={value === "success" ? "success" : "danger"} dot>
            {value === "success" ? "성공" : "실패"}
          </Badge>
        ),
      },
      { key: "reason", label: "사유", width: "140px", render: (value) => String(value || "-") },
      {
        key: "createdAt",
        label: "로그인 시각",
        width: "170px",
        render: (value) => new Date(String(value)).toLocaleString("ko-KR"),
      },
    ],
    [],
  );

  return (
    <AdminLayout title="로그인 이력">
      <RoleGuard
        roles={["admin"]}
        fallback={
          <Card className="mx-auto max-w-xl text-center">
            <Shield className="mx-auto h-8 w-8 text-danger-500" aria-hidden="true" />
            <h1 className="mt-3 text-lg font-semibold text-text">접근 권한이 없습니다</h1>
            <p className="mt-1 text-sm text-text-muted">로그인 이력은 관리자만 확인할 수 있습니다.</p>
          </Card>
        }
      >
        <PageWrapper title="로그인 이력관리" description="사용자 로그인 성공/실패 기록과 접속 환경을 확인합니다.">
          <Card className="mb-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_12rem]">
              <FormField label="검색">
                <SearchInput
                  placeholder="이름, 이메일, IP 검색"
                  onSearch={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}
                />
              </FormField>
              <FormField label="상태">
                <Select
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value as "" | LoginHistory["status"]);
                    setPage(1);
                  }}
                  options={[
                    { label: "전체", value: "" },
                    { label: "성공", value: "success" },
                    { label: "실패", value: "failure" },
                  ]}
                />
              </FormField>
            </div>
          </Card>

          <DataTable
            columns={columns}
            data={(loginHistoryQuery.data?.data ?? []) as LoginHistory[]}
            loading={loginHistoryQuery.isLoading}
            emptyMessage="로그인 이력이 없습니다."
            pagination={
              loginHistoryQuery.data?.pagination
                ? {
                    page: loginHistoryQuery.data.pagination.page,
                    pageSize: loginHistoryQuery.data.pagination.pageSize,
                    total: loginHistoryQuery.data.pagination.total,
                    totalPages: loginHistoryQuery.data.pagination.totalPages,
                    onChange: setPage,
                  }
                : undefined
            }
          />

          {loginHistoryQuery.isError && <p className="mt-3 text-sm text-danger-600">{loginHistoryQuery.error.message}</p>}
        </PageWrapper>
      </RoleGuard>
    </AdminLayout>
  );
}

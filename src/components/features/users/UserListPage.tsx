"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Edit, Eye, Shield, Users } from "lucide-react";

import { AuthGuard, RoleGuard } from "@/components/auth";
import { DataTable } from "@/components/data-display";
import { FormField, SearchInput } from "@/components/forms";
import { Badge, Card } from "@/components/ui";
import { useUsersQuery } from "@/hooks/queries";
import { ROUTES } from "@/constants/routes";
import type { TableColumn, User } from "@/types";

import { userRoleLabel, userStatusLabel } from "./user-meta";

const actionLinkClass =
  "inline-flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-xs font-medium text-text transition-colors hover:bg-surface-2";

function roleVariant(role: User["role"]) {
  if (role === "admin") return "danger";
  if (role === "manager") return "warning";
  return "secondary";
}

function statusVariant(status: User["status"]) {
  if (status === "active") return "success";
  if (status === "pending") return "warning";
  return "secondary";
}

export function UserListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const usersQuery = useUsersQuery({ page, pageSize: 10, search });

  const columns = useMemo<TableColumn<User>[]>(
    () => [
      {
        key: "name",
        label: "사용자",
        render: (_, row) => (
          <div>
            <p className="font-medium text-text">{row.name}</p>
            <p className="text-xs text-text-muted">{row.email}</p>
          </div>
        ),
      },
      {
        key: "role",
        label: "권한",
        width: "120px",
        render: (value) => (
          <Badge variant={roleVariant(value as User["role"])}>{userRoleLabel[value as User["role"]]}</Badge>
        ),
      },
      {
        key: "status",
        label: "상태",
        width: "110px",
        render: (value) => (
          <Badge variant={statusVariant(value as User["status"])} dot>
            {userStatusLabel[value as User["status"]]}
          </Badge>
        ),
      },
      {
        key: "createdAt",
        label: "가입일",
        width: "120px",
        render: (value) => new Date(String(value)).toLocaleDateString("ko-KR"),
      },
      {
        key: "id",
        label: "관리",
        width: "150px",
        align: "right",
        render: (_, row) => (
          <div className="flex justify-end gap-1">
            <Link className={actionLinkClass} href={ROUTES.USERS.DETAIL(row.id)}>
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              보기
            </Link>
            <RoleGuard roles={["admin"]}>
              <Link className={actionLinkClass} href={ROUTES.USERS.EDIT(row.id)}>
                <Edit className="h-3.5 w-3.5" aria-hidden="true" />
                수정
              </Link>
            </RoleGuard>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <AuthGuard>
      <RoleGuard
        roles={["admin", "manager"]}
        fallback={
          <main className="min-h-screen bg-bg p-6">
            <Card className="mx-auto max-w-xl text-center">
              <Shield className="mx-auto h-8 w-8 text-danger-500" aria-hidden="true" />
              <h1 className="mt-3 text-lg font-semibold text-text">접근 권한이 없습니다</h1>
              <p className="mt-1 text-sm text-text-muted">사용자 관리는 관리자 또는 매니저만 접근할 수 있습니다.</p>
            </Card>
          </main>
        }
      >
        <main className="min-h-screen bg-bg p-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Link className="text-sm font-medium text-primary-600 hover:underline" href={ROUTES.DASHBOARD}>
                  대시보드
                </Link>
                <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold text-text">
                  <Users className="h-6 w-6" aria-hidden="true" />
                  사용자 관리
                </h1>
                <p className="mt-1 text-sm text-text-muted">가입된 사용자 정보와 권한, 상태를 확인합니다.</p>
              </div>
            </div>

            <Card className="mb-4">
              <FormField label="사용자 검색">
                <SearchInput
                  placeholder="이름 또는 이메일 검색"
                  onSearch={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}
                />
              </FormField>
            </Card>

            <DataTable
              columns={columns}
              data={(usersQuery.data?.data ?? []) as User[]}
              loading={usersQuery.isLoading}
              emptyMessage="가입된 사용자가 없습니다."
              pagination={
                usersQuery.data?.pagination
                  ? {
                      page: usersQuery.data.pagination.page,
                      pageSize: usersQuery.data.pagination.pageSize,
                      total: usersQuery.data.pagination.total,
                      totalPages: usersQuery.data.pagination.totalPages,
                      onChange: setPage,
                    }
                  : undefined
              }
            />

            {usersQuery.isError && <p className="mt-3 text-sm text-danger-600">{usersQuery.error.message}</p>}
          </div>
        </main>
      </RoleGuard>
    </AuthGuard>
  );
}

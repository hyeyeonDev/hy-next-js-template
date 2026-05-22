"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Edit, Eye, Shield, UserMinus, Users } from "lucide-react";

import { RoleGuard } from "@/components/auth";
import { DataTable } from "@/components/data-display";
import { FormField, SearchInput } from "@/components/forms";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { useDialog } from "@/components/ui/dialog";
import { Badge, Button, Card } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { useUsersQuery, useWithdrawUserMutation } from "@/hooks/queries";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format";
import { isAdminRole } from "@/lib/roles";
import type { TableColumn, User } from "@/types";

import { userRoleLabel, userStatusLabel } from "./user-meta";

const actionLinkClass =
  "inline-flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-xs font-medium text-text transition-colors hover:bg-surface-2";

function roleVariant(role: User["role"]) {
  if (isAdminRole(role)) return "danger";
  if (role === "MANAGER") return "warning";
  return "secondary";
}

function statusVariant(status: User["status"]) {
  if (status === "active") return "success";
  if (status === "pending") return "warning";
  if (status === "withdrawn") return "danger";
  return "secondary";
}

export function UserListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const { confirm } = useDialog();
  const usersQuery = useUsersQuery({ page, pageSize: 10, search });
  const withdrawUser = useWithdrawUserMutation();

  const columns = useMemo<TableColumn<User>[]>(
    () => [
      {
        key: "name",
        label: "사용자",
        render: (_, row) => (
          <div>
            <p className="font-medium text-text">{row.name}</p>
            <p className="text-xs text-text-muted">{row.email}</p>
            {row.phone && <p className="text-xs text-text-subtle">{row.phone}</p>}
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
        render: (value) => formatDate(String(value)),
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
            <RoleGuard roles={["ADMIN"]}>
              <Link className={actionLinkClass} href={ROUTES.USERS.EDIT(row.id)}>
                <Edit className="h-3.5 w-3.5" aria-hidden="true" />
                수정
              </Link>
              {row.status !== "withdrawn" && (
                <Button
                  size="xs"
                  variant="ghost"
                  className="text-danger-600 hover:bg-danger-50 hover:text-danger-700"
                  leftIcon={<UserMinus className="h-3.5 w-3.5" aria-hidden="true" />}
                  loading={withdrawUser.isPending}
                  onClick={async () => {
                    const ok = await confirm(`${row.name} 사용자를 탈퇴 처리할까요?`, {
                      message: "탈퇴 처리 후 해당 사용자는 일반 로그인과 서비스 이용이 제한됩니다.",
                      variant: "danger",
                      confirmLabel: "탈퇴 처리",
                    });
                    if (!ok) return;

                    withdrawUser.mutate(row.id, {
                      onSuccess: () => {
                        toast("사용자가 탈퇴 처리되었습니다.", "danger");
                      },
                    });
                  }}
                >
                  탈퇴
                </Button>
              )}
            </RoleGuard>
          </div>
        ),
      },
    ],
    [confirm, toast, withdrawUser],
  );

  return (
    <AdminLayout title="사용자권한 정보">
      <RoleGuard
        roles={["ADMIN", "MANAGER"]}
        fallback={
          <Card className="mx-auto max-w-xl text-center">
            <Shield className="mx-auto h-8 w-8 text-danger-500" aria-hidden="true" />
            <h1 className="mt-3 text-lg font-semibold text-text">접근 권한이 없습니다</h1>
            <p className="mt-1 text-sm text-text-muted">사용자 관리는 관리자 또는 매니저만 접근할 수 있습니다.</p>
          </Card>
        }
      >
        <PageWrapper
          title={
            <span className="inline-flex items-center gap-2">
              <Users className="h-6 w-6" aria-hidden="true" />
              사용자권한 정보
            </span>
          }
          description="가입된 사용자 정보와 권한, 상태를 확인합니다."
        >
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
        </PageWrapper>
      </RoleGuard>
    </AdminLayout>
  );
}

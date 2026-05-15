"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, UserMinus } from "lucide-react";

import { useDeleteUserMutation, useUserQuery, useWithdrawUserMutation } from "@/hooks/queries";
import { RoleGuard } from "@/components/auth";
import { LoadingState } from "@/components/data-display";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { useToast } from "@/components/ui/toast";
import { Badge, Button, Card } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { isAdminRole } from "@/lib/roles";

import { userRoleLabel, userStatusLabel } from "./user-meta";

interface UserDetailPageProps {
  id: number;
}

export function UserDetailPage({ id }: UserDetailPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const userQuery = useUserQuery(id);
  const deleteUser = useDeleteUserMutation();
  const withdrawUser = useWithdrawUserMutation();

  return (
    <AdminLayout title="사용자권한 정보">
      <RoleGuard roles={["ADMIN", "MANAGER"]}>
        <PageWrapper
          title="사용자 상세"
          description="가입된 사용자 정보를 확인합니다."
          breadcrumb={
            <Link className="text-sm font-medium text-primary-600 hover:underline" href={ROUTES.USERS.ROOT}>
              사용자권한 정보
            </Link>
          }
          actions={
            <RoleGuard roles={["ADMIN"]}>
              <div className="flex gap-2">
                <Link
                  href={ROUTES.USERS.EDIT(id)}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                  <Edit className="h-4 w-4" aria-hidden="true" />
                  수정
                </Link>
                {userQuery.data?.status !== "withdrawn" && (
                  <Button
                    variant="warning"
                    leftIcon={<UserMinus aria-hidden="true" />}
                    loading={withdrawUser.isPending}
                    onClick={() => {
                      const ok = window.confirm("이 사용자를 탈퇴 처리할까요?");
                      if (!ok) return;

                      withdrawUser.mutate(id, {
                        onSuccess: () => {
                          toast("사용자가 탈퇴 처리되었습니다.", "danger");
                        },
                      });
                    }}
                  >
                    탈퇴 처리
                  </Button>
                )}
                <Button
                  variant="danger"
                  leftIcon={<Trash2 aria-hidden="true" />}
                  loading={deleteUser.isPending}
                  onClick={() => {
                    deleteUser.mutate(id, {
                      onSuccess: () => {
                        toast("사용자가 삭제되었습니다.", "danger");
                        router.replace(ROUTES.USERS.ROOT);
                      },
                    });
                  }}
                >
                  삭제
                </Button>
              </div>
            </RoleGuard>
          }
        >

            {userQuery.isLoading && <LoadingState message="사용자 정보를 불러오는 중..." />}

            {userQuery.isError && (
              <Card>
                <p className="text-sm text-danger-600">{userQuery.error.message}</p>
              </Card>
            )}

            {userQuery.data && (
              <Card>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">
                    {userQuery.data.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold text-text">{userQuery.data.name}</h2>
                      <Badge variant={isAdminRole(userQuery.data.role) ? "danger" : userQuery.data.role === "MANAGER" ? "warning" : "secondary"}>
                        {userRoleLabel[userQuery.data.role]}
                      </Badge>
                      <Badge
                        variant={
                          userQuery.data.status === "active"
                            ? "success"
                            : userQuery.data.status === "pending"
                              ? "warning"
                              : userQuery.data.status === "withdrawn"
                                ? "danger"
                                : "secondary"
                        }
                        dot
                      >
                        {userStatusLabel[userQuery.data.status]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-text-muted">{userQuery.data.email}</p>
                    <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-border bg-surface-2 p-4">
                        <dt className="text-xs text-text-muted">생년월일</dt>
                        <dd className="mt-1 text-sm font-medium text-text">{userQuery.data.birthDate || "-"}</dd>
                      </div>
                      <div className="rounded-lg border border-border bg-surface-2 p-4">
                        <dt className="text-xs text-text-muted">전화번호</dt>
                        <dd className="mt-1 text-sm font-medium text-text">{userQuery.data.phone || "-"}</dd>
                      </div>
                      <div className="rounded-lg border border-border bg-surface-2 p-4 sm:col-span-2">
                        <dt className="text-xs text-text-muted">주소</dt>
                        <dd className="mt-1 text-sm font-medium text-text">{userQuery.data.address || "-"}</dd>
                      </div>
                      <div className="rounded-lg border border-border bg-surface-2 p-4">
                        <dt className="text-xs text-text-muted">가입일</dt>
                        <dd className="mt-1 text-sm font-medium text-text">
                          {new Date(userQuery.data.createdAt).toLocaleString("ko-KR")}
                        </dd>
                      </div>
                      <div className="rounded-lg border border-border bg-surface-2 p-4">
                        <dt className="text-xs text-text-muted">최근 수정일</dt>
                        <dd className="mt-1 text-sm font-medium text-text">
                          {new Date(userQuery.data.updatedAt).toLocaleString("ko-KR")}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </Card>
            )}
        </PageWrapper>
      </RoleGuard>
    </AdminLayout>
  );
}

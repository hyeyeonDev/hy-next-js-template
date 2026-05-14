"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";

import { useDeleteUserMutation, useUserQuery } from "@/hooks/queries";
import { AuthGuard, RoleGuard } from "@/components/auth";
import { LoadingState } from "@/components/data-display";
import { useToast } from "@/components/ui/toast";
import { Badge, Button, Card } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

import { userRoleLabel, userStatusLabel } from "./user-meta";

interface UserDetailPageProps {
  id: number;
}

export function UserDetailPage({ id }: UserDetailPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const userQuery = useUserQuery(id);
  const deleteUser = useDeleteUserMutation();

  return (
    <AuthGuard>
      <RoleGuard roles={["admin", "manager"]}>
        <main className="min-h-screen bg-bg p-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Link className="text-sm font-medium text-primary-600 hover:underline" href={ROUTES.USERS.ROOT}>
                  사용자 관리
                </Link>
                <h1 className="mt-2 text-2xl font-bold text-text">사용자 상세</h1>
                <p className="mt-1 text-sm text-text-muted">가입된 사용자 정보를 확인합니다.</p>
              </div>
              <RoleGuard roles={["admin"]}>
                <div className="flex gap-2">
                  <Link
                    href={ROUTES.USERS.EDIT(id)}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    <Edit className="h-4 w-4" aria-hidden="true" />
                    수정
                  </Link>
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
            </div>

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
                      <Badge variant={userQuery.data.role === "admin" ? "danger" : userQuery.data.role === "manager" ? "warning" : "secondary"}>
                        {userRoleLabel[userQuery.data.role]}
                      </Badge>
                      <Badge variant={userQuery.data.status === "active" ? "success" : userQuery.data.status === "pending" ? "warning" : "secondary"} dot>
                        {userStatusLabel[userQuery.data.status]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-text-muted">{userQuery.data.email}</p>
                    <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          </div>
        </main>
      </RoleGuard>
    </AuthGuard>
  );
}

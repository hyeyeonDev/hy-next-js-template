"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, UserMinus } from "lucide-react";

import { useDeleteUserMutation, useUserQuery, useWithdrawUserMutation } from "@/hooks/queries";
import { RoleGuard } from "@/components/auth";
import { LoadingState } from "@/components/data-display";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { useToast } from "@/components/ui/toast";
import { Button, Card } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

import { UserProfileCard } from "./UserProfileCard";
import { USER_DETAIL_CONTAINER_CLASS } from "./user-layout.constants";

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
              <Link
                href={ROUTES.USERS.EDIT(id)}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                <Edit className="h-4 w-4" aria-hidden="true" />
                수정
              </Link>
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
              <div className={USER_DETAIL_CONTAINER_CLASS}>
                <UserProfileCard user={userQuery.data} readOnly canEditRole />

                <RoleGuard roles={["ADMIN"]}>
                  <div className="rounded-xl border border-danger-200 bg-danger-50 p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-danger-700">위험 작업</h3>
                        <p className="mt-1 text-sm text-danger-600">
                          탈퇴 처리는 계정 상태를 탈퇴로 변경합니다. 삭제는 사용자 데이터를 목록에서 제거합니다.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        {userQuery.data.status !== "withdrawn" && (
                          <Button
                            size="lg"
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
                          size="lg"
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
                          사용자 삭제
                        </Button>
                      </div>
                    </div>
                  </div>
                </RoleGuard>
              </div>
            )}
        </PageWrapper>
      </RoleGuard>
    </AdminLayout>
  );
}

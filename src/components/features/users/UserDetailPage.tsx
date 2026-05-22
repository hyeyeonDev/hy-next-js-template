"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, UserMinus } from "lucide-react";

import { useDeleteUserMutation, useUserQuery, useWithdrawUserMutation } from "@/hooks/queries";
import { RoleGuard } from "@/components/auth";
import { LoadingState } from "@/components/data-display";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { useDialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { Button, Card } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { isAdminRole } from "@/lib/roles";

import { UserDetailSection } from "./UserDetailSection";

interface UserDetailPageProps {
  id: number;
}

export function UserDetailPage({ id }: UserDetailPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { confirm } = useDialog();
  const { user: currentUser } = useAuth();
  const userQuery = useUserQuery(id);
  const deleteUser = useDeleteUserMutation();
  const withdrawUser = useWithdrawUserMutation();
  const canManageDanger = isAdminRole(currentUser?.role);

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
              <UserDetailSection
                user={userQuery.data}
                readOnly
                canEditRole
                dangerTitle={canManageDanger ? "위험 작업" : undefined}
                dangerDescription={canManageDanger ? "탈퇴 처리는 계정 상태를 탈퇴로 변경합니다. 삭제는 사용자 데이터를 목록에서 제거합니다." : undefined}
                dangerActions={
                  canManageDanger ? (
                    <>
                      {userQuery.data.status !== "withdrawn" && (
                        <Button
                          size="lg"
                          variant="warning"
                          leftIcon={<UserMinus aria-hidden="true" />}
                          loading={withdrawUser.isPending}
                          onClick={async () => {
                            const ok = await confirm("이 사용자를 탈퇴 처리할까요?", {
                              message: "탈퇴 처리 후 해당 사용자는 일반 로그인과 서비스 이용이 제한됩니다.",
                              variant: "danger",
                              confirmLabel: "탈퇴 처리",
                            });
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
                        onClick={async () => {
                          const ok = await confirm("사용자를 삭제할까요?", {
                            message: "삭제된 사용자 데이터는 목록에서 제거됩니다. 이 작업은 되돌릴 수 없습니다.",
                            variant: "danger",
                            confirmLabel: "삭제",
                          });
                          if (!ok) return;

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
                    </>
                  ) : undefined
                }
              />
            )}
        </PageWrapper>
      </RoleGuard>
    </AdminLayout>
  );
}

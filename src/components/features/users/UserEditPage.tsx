"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useUpdateUserMutation, useUserQuery } from "@/hooks/queries";
import { RoleGuard } from "@/components/auth";
import { LoadingState } from "@/components/data-display";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { useToast } from "@/components/ui/toast";
import { Card } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

import { UserForm } from "./UserForm";
import { USER_DETAIL_CONTAINER_CLASS } from "./user-layout.constants";

interface UserEditPageProps {
  id: number;
}

export function UserEditPage({ id }: UserEditPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const userQuery = useUserQuery(id);
  const updateUser = useUpdateUserMutation();

  return (
    <AdminLayout title="사용자권한 정보">
      <RoleGuard
        roles={["ADMIN"]}
        fallback={
          <Card className="mx-auto max-w-xl text-center">
            <h1 className="text-lg font-semibold text-text">수정 권한이 없습니다</h1>
            <p className="mt-1 text-sm text-text-muted">사용자 정보 수정은 관리자만 가능합니다.</p>
          </Card>
        }
      >
        <PageWrapper
          title="사용자 수정"
          description="사용자 이름, 권한, 상태를 수정합니다."
          breadcrumb={
            <Link className="text-sm font-medium text-primary-600 hover:underline" href={ROUTES.USERS.DETAIL(id)}>
              사용자 상세
            </Link>
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
                <Card className="overflow-hidden" padding="none">
                  <div className="border-b border-border bg-surface-2 px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-base font-semibold text-primary-700">
                        {userQuery.data.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-text">기본 정보 수정</h2>
                        <p className="truncate text-sm text-text-muted">{userQuery.data.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <UserForm
                      user={userQuery.data}
                      canEditRole
                      loading={updateUser.isPending}
                      onSubmit={(value) => {
                        updateUser.mutate(
                          { id, dto: value },
                          {
                            onSuccess: () => {
                              toast("사용자 정보가 수정되었습니다.", "success");
                              router.replace(ROUTES.USERS.DETAIL(id));
                            },
                          },
                        );
                      }}
                    />
                  </div>
                </Card>
              </div>
            )}
        </PageWrapper>
      </RoleGuard>
    </AdminLayout>
  );
}

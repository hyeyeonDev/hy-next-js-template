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
        roles={["admin"]}
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
          className="max-w-3xl"
        >
          {userQuery.isLoading && <LoadingState message="사용자 정보를 불러오는 중..." />}

            {userQuery.isError && (
              <Card>
                <p className="text-sm text-danger-600">{userQuery.error.message}</p>
              </Card>
            )}

            {userQuery.data && (
              <Card>
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
              </Card>
            )}
        </PageWrapper>
      </RoleGuard>
    </AdminLayout>
  );
}

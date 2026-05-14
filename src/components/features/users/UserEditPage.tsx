"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useUpdateUserMutation, useUserQuery } from "@/hooks/queries";
import { AuthGuard, RoleGuard } from "@/components/auth";
import { LoadingState } from "@/components/data-display";
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
    <AuthGuard>
      <RoleGuard
        roles={["admin"]}
        fallback={
          <main className="min-h-screen bg-bg p-6">
            <Card className="mx-auto max-w-xl text-center">
              <h1 className="text-lg font-semibold text-text">수정 권한이 없습니다</h1>
              <p className="mt-1 text-sm text-text-muted">사용자 정보 수정은 관리자만 가능합니다.</p>
            </Card>
          </main>
        }
      >
        <main className="min-h-screen bg-bg p-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6">
              <Link className="text-sm font-medium text-primary-600 hover:underline" href={ROUTES.USERS.DETAIL(id)}>
                사용자 상세
              </Link>
              <h1 className="mt-2 text-2xl font-bold text-text">사용자 수정</h1>
              <p className="mt-1 text-sm text-text-muted">사용자 이름, 권한, 상태를 수정합니다.</p>
            </div>

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
          </div>
        </main>
      </RoleGuard>
    </AuthGuard>
  );
}

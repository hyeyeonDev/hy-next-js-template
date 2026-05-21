"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit, Eye, ShieldAlert } from "lucide-react";

import { LoadingState } from "@/components/data-display";
import { UserProfileCard } from "@/components/features/users/UserProfileCard";
import { PageWrapper } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { ROUTES } from "@/constants/routes";
import { useMeQuery, useUpdateMeMutation, useWithdrawMeMutation } from "@/hooks/queries";
import { useI18n } from "@/i18n";
import type { AuthUser, User } from "@/types";

import { USER_DETAIL_CONTAINER_CLASS } from "../users/user-layout.constants";

export function ProfilePage() {
  const { t } = useI18n();
  const meQuery = useMeQuery();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <PageWrapper
      title={t("profile.title")}
      description={t("profile.description")}
      actions={
        meQuery.data ? (
          <Button
            variant={isEditing ? "outline" : "primary"}
            leftIcon={
              isEditing ? (
                <Eye className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Edit className="h-4 w-4" aria-hidden="true" />
              )
            }
            onClick={() => setIsEditing((value) => !value)}
          >
            {isEditing ? "보기" : "수정"}
          </Button>
        ) : null
      }
    >
      {meQuery.isLoading && <LoadingState message={t("profile.loading")} />}

      {meQuery.isError && (
        <Card>
          <p className="text-sm text-danger-600">{meQuery.error.message}</p>
        </Card>
      )}

      {meQuery.data && (
        <div className={USER_DETAIL_CONTAINER_CLASS}>
          <ProfileDetail user={meQuery.data} isEditing={isEditing} onEdited={() => setIsEditing(false)} />
        </div>
      )}
    </PageWrapper>
  );
}

function ProfileDetail({
  user,
  isEditing,
  onEdited,
}: {
  user: AuthUser;
  isEditing: boolean;
  onEdited: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const updateMe = useUpdateMeMutation();
  const withdrawMe = useWithdrawMeMutation();

  const formUser: User = {
    ...user,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return (
    <>
      <UserProfileCard
        user={formUser}
        readOnly={!isEditing}
        loading={updateMe.isPending}
        canEditRole={false}
        canEditStatus={false}
        showAccountFields
        onSubmit={({ name, birthDate, phone, address, addressDetail }) => {
          updateMe.mutate(
            {
              name: name ?? user.name,
              birthDate,
              phone,
              address,
              addressDetail,
            },
            {
              onSuccess: () => {
                toast("내 정보가 수정되었습니다.", "success");
                onEdited();
              },
            },
          );
        }}
      />
      {updateMe.isError && <p className="mt-3 text-xs text-danger-600">{updateMe.error.message}</p>}

      <div className="rounded-xl border border-danger-200 bg-danger-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger-100 text-danger-600">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-semibold text-danger-700">회원 탈퇴</h4>
              <p className="mt-1 text-sm leading-6 text-danger-600">
                탈퇴하면 계정 상태가 탈퇴로 변경되고 현재 세션이 종료됩니다.
              </p>
            </div>
          </div>
          <Button
            variant="danger"
            size="lg"
            className="w-full lg:w-auto"
            loading={withdrawMe.isPending}
            onClick={() => {
              const ok = window.confirm("정말 회원 탈퇴를 진행할까요?");
              if (!ok) return;

              withdrawMe.mutate(undefined, {
                onSuccess: () => {
                  toast("회원 탈퇴가 처리되었습니다.", "danger");
                  router.replace(ROUTES.AUTH.LOGIN);
                  router.refresh();
                },
              });
            }}
          >
            탈퇴하기
          </Button>
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit, Eye, UserMinus } from "lucide-react";

import { LoadingState } from "@/components/data-display";
import { UserDetailSection } from "@/components/features/users/UserDetailSection";
import { PageWrapper } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { useDialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { ROUTES } from "@/constants/routes";
import { useMeQuery, useUpdateMeMutation, useWithdrawMeMutation } from "@/hooks/queries";
import { useI18n } from "@/i18n";
import type { AuthUser, User } from "@/types";

export function ProfileDetailPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { toast } = useToast();
  const { confirm } = useDialog();
  const meQuery = useMeQuery();
  const updateMe = useUpdateMeMutation();
  const withdrawMe = useWithdrawMeMutation();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <PageWrapper
      title="내정보 보기"
      description="내 계정의 상세 정보를 확인하고 수정합니다."
      breadcrumb={
        <Link className="text-sm font-medium text-primary-600 hover:underline" href={ROUTES.MY_PAGE}>
          {t("profile.title")}
        </Link>
      }
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
        <UserDetailSection
          user={toUser(meQuery.data)}
          readOnly={!isEditing}
          loading={updateMe.isPending}
          canEditRole={false}
          canEditStatus={false}
          showAccountFields
          errorMessage={updateMe.isError ? updateMe.error.message : undefined}
          dangerTitle="회원 탈퇴"
          dangerDescription="탈퇴하면 계정 상태가 탈퇴로 변경되고 현재 세션이 종료됩니다."
          onSubmit={({ name, birthDate, phone, address, addressDetail }) => {
            updateMe.mutate(
              {
                name: name ?? meQuery.data.name,
                birthDate,
                phone,
                address,
                addressDetail,
              },
              {
                onSuccess: () => {
                  toast("내 정보가 수정되었습니다.", "success");
                  setIsEditing(false);
                },
              },
            );
          }}
          dangerActions={
            <Button
              variant="danger"
              size="lg"
              className="w-full lg:w-auto"
              leftIcon={<UserMinus aria-hidden="true" />}
              loading={withdrawMe.isPending}
              onClick={async () => {
                const ok = await confirm("회원 탈퇴를 진행할까요?", {
                  message: "탈퇴하면 계정 상태가 탈퇴로 변경되고 현재 세션이 종료됩니다.",
                  variant: "danger",
                  confirmLabel: "탈퇴하기",
                });
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
          }
        />
      )}
    </PageWrapper>
  );
}

function toUser(user: AuthUser): User {
  return {
    ...user,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

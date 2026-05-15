"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Palette, Settings } from "lucide-react";

import { AuthGuard } from "@/components/auth";
import { LoadingState } from "@/components/data-display";
import { FormField, PhoneField } from "@/components/forms";
import { Footer, Header, MainLayout, PageWrapper, UserAccountMenu } from "@/components/layout";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { getAdminSidebarItems, isStorybookMenuEnabled } from "@/components/layout/admin-navigation";
import { Badge, Button, Card, Input } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { ROUTES } from "@/constants/routes";
import { useMeQuery, useUpdateMeMutation, useWithdrawMeMutation } from "@/hooks/queries";
import { useI18n } from "@/i18n";
import { isAdminRole } from "@/lib/roles";
import type { AuthUser } from "@/types";
import { userRoleLabel } from "@/components/features/users/user-meta";

function statusVariant(status: AuthUser["status"]) {
  if (status === "active") return "success";
  if (status === "pending") return "warning";
  if (status === "withdrawn") return "danger";
  return "secondary";
}

function roleVariant(role: AuthUser["role"]) {
  if (isAdminRole(role)) return "danger";
  if (role === "MANAGER") return "warning";
  return "secondary";
}

export function ProfilePage() {
  const { t } = useI18n();
  const meQuery = useMeQuery();
  const sidebarItems = getAdminSidebarItems(t);

  return (
    <AuthGuard>
      <MainLayout
        sidebar={{
          logo: (
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-text">
              <Settings className="h-4 w-4" aria-hidden="true" />
              Admin
            </span>
          ),
          items: sidebarItems,
          footer: isStorybookMenuEnabled() ? (
            <Link
              href={ROUTES.STORYBOOK}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-primary-600 transition-colors hover:bg-primary-50"
            >
              <Palette className="h-4 w-4" aria-hidden="true" />
              {t("nav.components")}
            </Link>
          ) : null,
        }}
        topbar={
          <Header
            title={t("profile.title")}
            actions={
              <>
                <LanguageSwitcher />
                <UserAccountMenu />
              </>
            }
          />
        }
        footer={<Footer />}
      >
        <PageWrapper title={t("profile.title")} description={t("profile.description")}>
          {meQuery.isLoading && <LoadingState message={t("profile.loading")} />}

          {meQuery.isError && (
            <Card>
              <p className="text-sm text-danger-600">{meQuery.error.message}</p>
            </Card>
          )}

          {meQuery.data && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <Card>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xl font-semibold text-primary-700">
                    {meQuery.data.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold text-text">{meQuery.data.name}</h2>
                      <Badge variant={roleVariant(meQuery.data.role)}>{userRoleLabel[meQuery.data.role]}</Badge>
                      <Badge variant={statusVariant(meQuery.data.status)} dot>
                        {meQuery.data.status === "active"
                          ? "활성"
                          : meQuery.data.status === "pending"
                            ? "대기"
                            : meQuery.data.status === "withdrawn"
                              ? "탈퇴"
                              : "비활성"}
                      </Badge>
                    </div>
                    <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-md border border-border bg-surface-2 p-4">
                        <dt className="text-xs text-text-muted">이메일</dt>
                        <dd className="mt-1 break-all text-sm font-medium text-text">{meQuery.data.email}</dd>
                      </div>
                      <div className="rounded-md border border-border bg-surface-2 p-4">
                        <dt className="text-xs text-text-muted">사용자 ID</dt>
                        <dd className="mt-1 text-sm font-medium text-text">#{meQuery.data.id}</dd>
                      </div>
                      <div className="rounded-md border border-border bg-surface-2 p-4">
                        <dt className="text-xs text-text-muted">생년월일</dt>
                        <dd className="mt-1 text-sm font-medium text-text">{meQuery.data.birthDate || "-"}</dd>
                      </div>
                      <div className="rounded-md border border-border bg-surface-2 p-4">
                        <dt className="text-xs text-text-muted">전화번호</dt>
                        <dd className="mt-1 text-sm font-medium text-text">{meQuery.data.phone || "-"}</dd>
                      </div>
                      <div className="rounded-md border border-border bg-surface-2 p-4 sm:col-span-2">
                        <dt className="text-xs text-text-muted">주소</dt>
                        <dd className="mt-1 text-sm font-medium text-text">{meQuery.data.address || "-"}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </Card>

              <Card>
                <ProfileEditForm user={meQuery.data} />
              </Card>
            </div>
          )}
        </PageWrapper>
      </MainLayout>
    </AuthGuard>
  );
}

function ProfileEditForm({ user }: { user: AuthUser }) {
  const router = useRouter();
  const { toast } = useToast();
  const updateMe = useUpdateMeMutation();
  const withdrawMe = useWithdrawMeMutation();
  const [name, setName] = useState(user.name);
  const [birthDate, setBirthDate] = useState(user.birthDate ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [address, setAddress] = useState(user.address ?? "");

  return (
    <>
      <h3 className="text-base font-semibold text-text">기본 정보 수정</h3>
      <form
        className="mt-4 flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          updateMe.mutate(
            { name, birthDate, phone, address },
            {
              onSuccess: () => {
                toast("내 정보가 수정되었습니다.", "success");
              },
            },
          );
        }}
      >
        <FormField label="이름" required>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </FormField>
        <FormField label="이메일">
          <Input value={user.email} readOnly />
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="생년월일">
            <Input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
          </FormField>
          <FormField label="전화번호">
            <PhoneField value={phone} onChange={(event) => setPhone(event.target.value)} />
          </FormField>
        </div>
        <FormField label="주소">
          <Input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="주소를 입력하세요" />
        </FormField>
        {updateMe.isError && <p className="text-xs text-danger-600">{updateMe.error.message}</p>}
        <Button type="submit" loading={updateMe.isPending} disabled={!name.trim()}>
          저장
        </Button>
      </form>

      <div className="mt-6 rounded-md border border-danger-200 bg-danger-50 p-4">
        <h4 className="text-sm font-semibold text-danger-700">회원 탈퇴</h4>
        <p className="mt-1 text-xs text-danger-600">탈퇴하면 계정 상태가 탈퇴로 변경되고 현재 세션이 종료됩니다.</p>
        <Button
          className="mt-3"
          variant="danger"
          size="sm"
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
    </>
  );
}

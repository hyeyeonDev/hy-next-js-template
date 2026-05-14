"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Building2,
  Database,
  HelpCircle,
  History,
  LogOut,
  MessageSquareText,
  Palette,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

import { AuthGuard } from "@/components/auth";
import { LoadingState } from "@/components/data-display";
import { FormField, PhoneField } from "@/components/forms";
import { Footer, Header, MainLayout, PageWrapper } from "@/components/layout";
import { Badge, Button, Card, Input } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { ROUTES } from "@/constants/routes";
import { useMeQuery, useUpdateMeMutation, useWithdrawMeMutation } from "@/hooks/queries";
import type { AuthUser } from "@/types";

const roleLabel = {
  admin: "관리자",
  manager: "매니저",
  user: "사용자",
};

function statusVariant(status: AuthUser["status"]) {
  if (status === "active") return "success";
  if (status === "pending") return "warning";
  if (status === "withdrawn") return "danger";
  return "secondary";
}

export function ProfilePage() {
  const meQuery = useMeQuery();

  const sidebarItems = [
    { label: "대시보드", href: ROUTES.DASHBOARD, icon: Settings, exact: true },
    { label: "마이페이지", href: ROUTES.MY_PAGE, icon: UserRound, exact: true },
    {
      label: "사용자 관리",
      icon: Users,
      children: [
        { label: "사용자권한 정보", href: ROUTES.USERS.ROOT, icon: Users, exact: true },
        { label: "로그인 이력", href: ROUTES.USERS.LOGIN_HISTORY, icon: History },
        { label: "조직관리", href: ROUTES.ORGANIZATIONS, icon: Building2 },
      ],
    },
    {
      label: "데이터 관리",
      icon: Database,
      children: [{ label: "코드관리", href: ROUTES.DATA_CODES, icon: Database }],
    },
    {
      label: "게시판",
      icon: MessageSquareText,
      children: [
        { label: "게시판", href: ROUTES.BOARDS, icon: MessageSquareText, exact: true },
        { label: "공지사항", href: ROUTES.NOTICES, icon: Bell },
        { label: "질의", href: ROUTES.INQUIRIES, icon: HelpCircle },
        { label: "Q&A", href: ROUTES.QNA, icon: MessageSquareText },
      ],
    },
  ];

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
          footer: (
            <Link
              href={ROUTES.STORYBOOK}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-primary-600 transition-colors hover:bg-primary-50"
            >
              <Palette className="h-4 w-4" aria-hidden="true" />
              컴포넌트 보기
            </Link>
          ),
        }}
        topbar={
          <Header
            title="마이페이지"
            actions={
              <Link
                href={ROUTES.AUTH.LOGOUT}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm font-medium text-text transition-colors hover:bg-surface-2"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                로그아웃
              </Link>
            }
          />
        }
        footer={<Footer />}
      >
        <PageWrapper title="마이페이지" description="내 계정 정보를 확인하고 기본 프로필을 수정합니다.">
          {meQuery.isLoading && <LoadingState message="내 정보를 불러오는 중..." />}

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
                      <Badge variant={meQuery.data.role === "admin" ? "danger" : meQuery.data.role === "manager" ? "warning" : "secondary"}>
                        {roleLabel[meQuery.data.role]}
                      </Badge>
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

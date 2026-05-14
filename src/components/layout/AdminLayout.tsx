"use client";

import Link from "next/link";
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
import { ROUTES } from "@/constants/routes";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { MainLayout } from "./MainLayout";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function AdminLayout({ title, children, actions }: AdminLayoutProps) {
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
      children: [
        { label: "코드관리", href: ROUTES.DATA_CODES, icon: Database },
      ],
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
            title={title}
            actions={
              <>
                {actions}
                <Link
                  href={ROUTES.AUTH.LOGOUT}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm font-medium text-text transition-colors hover:bg-surface-2"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  로그아웃
                </Link>
              </>
            }
          />
        }
        footer={<Footer />}
      >
        {children}
      </MainLayout>
    </AuthGuard>
  );
}

"use client";

import Link from "next/link";
import { LogOut, Palette, Settings } from "lucide-react";

import { AuthGuard } from "@/components/auth";
import { ROUTES } from "@/constants/routes";

import { getAdminSidebarItems, isStorybookMenuEnabled } from "./admin-navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MainLayout } from "./MainLayout";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function AdminLayout({ title, children, actions }: AdminLayoutProps) {
  const sidebarItems = getAdminSidebarItems();

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
              컴포넌트 보기
            </Link>
          ) : null,
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

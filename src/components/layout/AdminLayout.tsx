"use client";

import Link from "next/link";
import { Palette, Settings } from "lucide-react";

import { AuthGuard } from "@/components/auth";
import { ROUTES } from "@/constants/routes";
import { useI18n } from "@/i18n";

import { getAdminSidebarItems, isStorybookMenuEnabled } from "./admin-navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MainLayout } from "./MainLayout";
import { UserAccountMenu } from "./UserAccountMenu";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function AdminLayout({ title, children, actions }: AdminLayoutProps) {
  const { t } = useI18n();
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
            title={title}
            actions={
              <>
                <LanguageSwitcher />
                {actions}
                <UserAccountMenu />
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, Settings, UserRound } from "lucide-react";

import {
  getAdminHeaderTitle,
  getAdminSidebarItems,
  getDigitalMapSidebarItems,
  isStorybookMenuEnabled,
} from "@/constants/menu";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Sidebar, type SidebarItem } from "./Sidebar";
import { UserAccountMenu } from "./UserAccountMenu";

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar?: {
    logo?: React.ReactNode;
    items: SidebarItem[];
    footer?: React.ReactNode;
  };
  topbar?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  contentClassName?: string;
}

export function MainLayout({
  children,
  sidebar,
  topbar,
  footer,
  className,
  bodyClassName,
  contentClassName,
}: MainLayoutProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const { user } = useAuth();
  const navigationMode = useUiStore((state) => state.navigationMode);

  const isDigitalMapMode = navigationMode === "digitalMap";
  const defaultSidebarItems = isDigitalMapMode
    ? getDigitalMapSidebarItems()
    : getAdminSidebarItems(t);
  const userName = user?.name || "";
  const profileInitial = userName.trim().slice(0, 1).toUpperCase();
  const resolvedSidebar = sidebar ?? {
    logo: (
      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-text">
        <Settings className="h-4 w-4" aria-hidden="true" />
        Admin
      </span>
    ),
    items: defaultSidebarItems,
    footer: (
      <div className="space-y-1">
        <Link
          href={ROUTES.MY_PAGE}
          aria-label="프로필"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 ring-1 ring-primary-200">
            {profileInitial || (
              <UserRound className="h-4 w-4" aria-hidden="true" />
            )}
          </span>
          <span data-footer-label>{userName}</span>
        </Link>
        {isStorybookMenuEnabled() && (
          <Link
            href={ROUTES.STORYBOOK}
            aria-label={t("nav.components")}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-primary-600 transition-colors hover:bg-primary-50"
          >
            <Palette className="h-4 w-4" aria-hidden="true" />
            <span data-footer-label>{t("nav.components")}</span>
          </Link>
        )}
      </div>
    ),
  };
  const resolvedTopbar = topbar ?? (
    <Header
      title={getAdminHeaderTitle(pathname, t)}
      actions={
        <>
          <LanguageSwitcher />
          <UserAccountMenu />
        </>
      }
    />
  );

  const resolvedFooter = footer ?? <Footer />;

  return (
    <div className={cn("fixed inset-0 flex overflow-hidden bg-bg", className)}>
      <Sidebar
        logo={resolvedSidebar.logo}
        items={resolvedSidebar.items}
        footer={resolvedSidebar.footer}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="shrink-0">{resolvedTopbar}</div>
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-y-auto",
            bodyClassName,
          )}
        >
          <main className={cn("flex-1 p-6", contentClassName)}>{children}</main>
          <div className="shrink-0">{resolvedFooter}</div>
        </div>
      </div>
    </div>
  );
}

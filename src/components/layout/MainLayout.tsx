"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, Settings } from "lucide-react";

import { getAdminHeaderTitle, getAdminSidebarItems, isStorybookMenuEnabled } from "@/constants/menu";
import { ROUTES } from "@/constants/routes";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

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
  contentClassName?: string;
}

export function MainLayout({ children, sidebar, topbar, footer, className, contentClassName }: MainLayoutProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const defaultSidebarItems = getAdminSidebarItems(t);
  const resolvedSidebar = sidebar ?? {
    logo: (
      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-text">
        <Settings className="h-4 w-4" aria-hidden="true" />
        Admin
      </span>
    ),
    items: defaultSidebarItems,
    footer: isStorybookMenuEnabled() ? (
      <Link
        href={ROUTES.STORYBOOK}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-primary-600 transition-colors hover:bg-primary-50"
      >
        <Palette className="h-4 w-4" aria-hidden="true" />
        {t("nav.components")}
      </Link>
    ) : null,
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
    <div className={cn("flex h-screen overflow-hidden bg-bg", className)}>
      <Sidebar logo={resolvedSidebar.logo} items={resolvedSidebar.items} footer={resolvedSidebar.footer} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="shrink-0">{resolvedTopbar}</div>
        <main className={cn("min-h-0 flex-1 overflow-y-auto p-6", contentClassName)}>{children}</main>
        <div className="shrink-0">{resolvedFooter}</div>
      </div>
    </div>
  );
}

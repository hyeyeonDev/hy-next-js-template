"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUiStore } from "@/store";

export interface SidebarItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  exact?: boolean;
  activePaths?: string[];
  inactivePaths?: string[];
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  popup?: {
    width: number;
    height: number;
  };
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  navClassName?: string;
}

export function Sidebar({
  items,
  logo,
  footer,
  className,
  navClassName,
}: SidebarProps) {
  const pathname = usePathname();
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  // 토글 기능을 화면에서 숨기고 싶다면 이 값을 false로 바꾸세요.
  // 기능 자체는 store에 남아 있으므로, 헤더 버튼이나 설정 메뉴 등 다른 위치에서 toggleSidebar()를 호출해도 됩니다.
  const showSidebarToggle = true;

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200",
        collapsed ? "w-16" : "w-60",
        className,
      )}
    >
      {(logo || showSidebarToggle) && (
        <div
          className={cn(
            "flex h-14 items-center border-b border-border px-3",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed && logo}
          {showSidebarToggle && (
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
              onClick={toggleSidebar}
              aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
              title={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
              ) : (
                <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      )}
      <nav
        className={cn(
          "flex-1 overflow-y-auto p-2",
          collapsed && "px-2",
          navClassName,
        )}
      >
        {items.map((item, index) => (
          <SidebarLink
            key={item.href ?? `${item.label}-${index}`}
            item={item}
            pathname={pathname}
            collapsed={collapsed}
          />
        ))}
      </nav>
      {footer && !collapsed && (
        <div className="border-t border-border p-3">{footer}</div>
      )}
    </aside>
  );
}

function SidebarLink({
  item,
  pathname,
  collapsed,
}: {
  item: SidebarItem;
  pathname: string;
  collapsed: boolean;
}) {
  const hasChildren = !!item.children?.length;
  const ownActive = isSidebarItemActive(item, pathname);
  const childActive = item.children?.some((child) =>
    isSidebarItemActive(child, pathname),
  );
  const isActive = ownActive || childActive;
  const Icon = item.icon;

  if (hasChildren) {
    return (
      <div className="mb-1">
        <div
          title={collapsed ? item.label : undefined}
          className={cn(
            "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm",
            collapsed && "justify-center px-2",
            isActive ? "font-semibold text-text" : "text-text-muted",
            isActive && collapsed && "bg-primary-50",
          )}
        >
          {Icon && (
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                isActive ? "text-primary-600" : "text-text-subtle",
              )}
            />
          )}
          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
          {!collapsed && (
            <ChevronDown
              className="h-3.5 w-3.5 text-text-subtle"
              aria-hidden="true"
            />
          )}
        </div>
        {!collapsed && (
          <div className="ml-4 border-l border-border pl-2">
            {item.children?.map((child) => (
              <SidebarLink
                key={child.href ?? child.label}
                item={child}
                pathname={pathname}
                collapsed={collapsed}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!item.href) {
    if (collapsed) return null;

    return (
      <div className="px-3 py-2 text-xs font-semibold uppercase text-text-subtle">
        {item.label}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      target={item.target}
      rel={item.rel}
      title={collapsed ? item.label : undefined}
      onClick={(event) => {
        if (!item.popup) return;

        event.preventDefault();
        const width = item.popup.width;
        const height = item.popup.height;
        const left = Math.max(
          0,
          window.screenX + (window.outerWidth - width) / 2,
        );
        const top = Math.max(
          0,
          window.screenY + (window.outerHeight - height) / 2,
        );

        window.open(
          item.href,
          "digital-map",
          `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no`,
        );
      }}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
        collapsed && "justify-center px-2",
        isActive
          ? "bg-primary-50 font-medium text-primary-700"
          : "text-text-muted hover:bg-surface-2 hover:text-text",
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            isActive ? "text-primary-600" : "text-text-subtle",
          )}
        />
      )}
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {!collapsed && item.badge !== undefined && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
            isActive
              ? "bg-primary-100 text-primary-700"
              : "bg-surface-2 text-text-muted",
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function matchesPath(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

function isSidebarItemActive(item: SidebarItem, pathname: string) {
  if (item.inactivePaths?.some((path) => matchesPath(pathname, path))) {
    return false;
  }

  if (item.activePaths?.some((path) => matchesPath(pathname, path))) {
    return true;
  }

  if (!item.href) return false;
  return item.exact ? pathname === item.href : matchesPath(pathname, item.href);
}

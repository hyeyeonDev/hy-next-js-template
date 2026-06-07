import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import type { SidebarItem } from "./Sidebar.types";
import { isSidebarItemActive, openPopupLink } from "./Sidebar.utils";

interface SidebarLinkProps {
  item: SidebarItem;
  pathname: string;
  collapsed: boolean;
}

export function SidebarLink({ item, pathname, collapsed }: SidebarLinkProps) {
  const hasChildren = !!item.children?.length;
  const ownActive = isSidebarItemActive(item, pathname);
  const childActive = Boolean(
    item.children?.some((child) => isSidebarItemActive(child, pathname)),
  );
  const isActive = ownActive || childActive;
  const Icon = item.icon;

  if (hasChildren) {
    return (
      <div className="group relative mb-1">
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
        {collapsed && (
          <SidebarFlyout
            label={item.label}
            items={item.children ?? []}
            pathname={pathname}
          />
        )}
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
    <SidebarLinkBody
      item={item}
      isActive={isActive}
      collapsed={collapsed}
      title={collapsed ? item.label : undefined}
    />
  );
}

function SidebarFlyout({
  label,
  items,
  pathname,
}: {
  label: string;
  items: SidebarItem[];
  pathname: string;
}) {
  return (
    <div className="invisible absolute left-full top-0 z-50 pl-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
      <div className="w-52 rounded-md border border-border bg-surface p-2 shadow-lg">
        <div className="mb-1 px-2 py-1 text-xs font-semibold text-text-muted">
          {label}
        </div>
        <div className="flex flex-col gap-1">
          {items.map((child) => (
            <SidebarFlyoutLink
              key={child.href ?? child.label}
              item={child}
              pathname={pathname}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SidebarFlyoutLink({
  item,
  pathname,
}: {
  item: SidebarItem;
  pathname: string;
}) {
  const isActive = isSidebarItemActive(item, pathname);

  if (!item.href) {
    return (
      <div className="px-2 py-1.5 text-xs font-semibold uppercase text-text-subtle">
        {item.label}
      </div>
    );
  }

  return <SidebarLinkBody item={item} isActive={isActive} />;
}

function SidebarLinkBody({
  item,
  isActive,
  collapsed = false,
  title,
}: {
  item: SidebarItem;
  isActive: boolean;
  collapsed?: boolean;
  title?: string;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href ?? "#"}
      target={item.target}
      rel={item.rel}
      title={title}
      onClick={(event) => openPopupLink(event, item)}
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
        <SidebarBadge badge={item.badge} isActive={isActive} />
      )}
    </Link>
  );
}

function SidebarBadge({
  badge,
  isActive,
}: {
  badge: string | number;
  isActive: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
        isActive
          ? "bg-primary-100 text-primary-700"
          : "bg-surface-2 text-text-muted",
      )}
    >
      {badge}
    </span>
  );
}

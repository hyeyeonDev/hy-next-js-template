"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  exact?: boolean;
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

export function Sidebar({ items, logo, footer, className, navClassName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface", className)}>
      {logo && <div className="flex h-14 items-center border-b border-border px-4">{logo}</div>}
      <nav className={cn("flex-1 overflow-y-auto p-2", navClassName)}>
        {items.map((item, index) => (
          <SidebarLink key={item.href ?? `${item.label}-${index}`} item={item} pathname={pathname} />
        ))}
      </nav>
      {footer && <div className="border-t border-border p-3">{footer}</div>}
    </aside>
  );
}

function SidebarLink({ item, pathname }: { item: SidebarItem; pathname: string }) {
  const hasChildren = !!item.children?.length;
  const ownActive = item.href
    ? item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
    : false;
  const childActive = item.children?.some((child) =>
    child.href ? (child.exact ? pathname === child.href : pathname === child.href || pathname.startsWith(`${child.href}/`)) : false,
  );
  const isActive = ownActive || childActive;
  const Icon = item.icon;

  if (hasChildren) {
    return (
      <div className="mb-1">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm",
            isActive ? "font-semibold text-text" : "text-text-muted",
          )}
        >
          {Icon && <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-600" : "text-text-subtle")} />}
          <span className="flex-1 truncate">{item.label}</span>
          <ChevronDown className="h-3.5 w-3.5 text-text-subtle" aria-hidden="true" />
        </div>
        <div className="ml-4 border-l border-border pl-2">
          {item.children?.map((child) => (
            <SidebarLink key={child.href ?? child.label} item={child} pathname={pathname} />
          ))}
        </div>
      </div>
    );
  }

  if (!item.href) {
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
      onClick={(event) => {
        if (!item.popup) return;

        event.preventDefault();
        const width = item.popup.width;
        const height = item.popup.height;
        const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
        const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);

        window.open(
          item.href,
          "digital-map",
          `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no`,
        );
      }}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
        isActive ? "bg-primary-50 font-medium text-primary-700" : "text-text-muted hover:bg-surface-2 hover:text-text",
      )}
    >
      {Icon && <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-600" : "text-text-subtle")} />}
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
            isActive ? "bg-primary-100 text-primary-700" : "bg-surface-2 text-text-muted",
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

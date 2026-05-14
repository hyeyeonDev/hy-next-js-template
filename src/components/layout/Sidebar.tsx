"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  exact?: boolean;
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
        {items.map((item) => (
          <SidebarLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
      {footer && <div className="border-t border-border p-3">{footer}</div>}
    </aside>
  );
}

function SidebarLink({ item, pathname }: { item: SidebarItem; pathname: string }) {
  const isActive = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
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

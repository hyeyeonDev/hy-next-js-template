"use client";

import { usePathname, useRouter } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store";

import { SidebarHeader } from "./SidebarHeader";
import { SidebarLink } from "./SidebarLink";
import { SidebarModeSwitch } from "./SidebarModeSwitch";
import type { SidebarItem } from "./Sidebar.types";

export type { SidebarItem } from "./Sidebar.types";

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
  const router = useRouter();
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const navigationMode = useUiStore((state) => state.navigationMode);
  const setNavigationMode = useUiStore((state) => state.setNavigationMode);
  const isDigitalMapMode = navigationMode === "digitalMap";

  function enterDigitalMap() {
    setNavigationMode("digitalMap");
    router.push(ROUTES.DIGITAL_MAP_FULL);
  }

  function returnToAdmin() {
    setNavigationMode("admin");
    router.push(ROUTES.DASHBOARD);
  }

  return (
    <aside
      className={cn(
        "sticky top-0 z-50 flex h-screen shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200",
        collapsed ? "w-16" : "w-60",
        className,
      )}
    >
      <SidebarHeader
        collapsed={collapsed}
        logo={logo}
        onToggle={toggleSidebar}
      />
      <SidebarModeSwitch
        collapsed={collapsed}
        isDigitalMapMode={isDigitalMapMode}
        onEnterDigitalMap={enterDigitalMap}
        onReturnToAdmin={returnToAdmin}
      />
      <nav
        className={cn(
          "flex-1 overflow-y-auto p-2",
          collapsed && "overflow-visible px-2",
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
      {footer && (
        <div
          className={cn(
            "border-t border-border",
            collapsed
              ? "p-2 [&_a]:h-9 [&_a]:justify-center [&_a]:px-0 **:data-footer-label:hidden"
              : "p-3",
          )}
        >
          {footer}
        </div>
      )}
    </aside>
  );
}

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
  logo?: React.ReactNode;
  onToggle: () => void;
}

export function SidebarHeader({
  collapsed,
  logo,
  onToggle,
}: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-14 items-center border-b border-border px-3",
        collapsed ? "justify-center" : "justify-between",
      )}
    >
      {!collapsed && logo}
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
        onClick={onToggle}
        aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
        title={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
        ) : (
          <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}


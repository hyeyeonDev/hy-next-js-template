import { ArrowLeft, Map } from "lucide-react";

import { cn } from "@/lib/utils";

interface SidebarModeSwitchProps {
  collapsed: boolean;
  isDigitalMapMode: boolean;
  onEnterDigitalMap: () => void;
  onReturnToAdmin: () => void;
}

export function SidebarModeSwitch({
  collapsed,
  isDigitalMapMode,
  onEnterDigitalMap,
  onReturnToAdmin,
}: SidebarModeSwitchProps) {
  const toggleMode = isDigitalMapMode ? onReturnToAdmin : onEnterDigitalMap;

  return (
    <div className={cn("border-b border-border p-2", collapsed && "px-2")}>
      {collapsed ? (
        <button
          type="button"
          className={cn(
            "inline-flex h-9 w-full items-center justify-center rounded-md transition-colors",
            isDigitalMapMode
              ? "text-text-muted hover:bg-surface-2 hover:text-text"
              : "bg-primary-600 text-white shadow-sm hover:bg-primary-700",
          )}
          onClick={toggleMode}
          aria-label={
            isDigitalMapMode ? "대시보드로 돌아가기" : "Digital Map 열기"
          }
          title={isDigitalMapMode ? "돌아가기" : "Digital Map"}
        >
          {isDigitalMapMode ? (
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Map className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      ) : isDigitalMapMode ? (
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface hover:text-text"
          onClick={onReturnToAdmin}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="min-w-0 flex-1 text-left">돌아가기</span>
        </button>
      ) : (
        <button
          type="button"
          className="w-full rounded-md bg-primary-600 px-3 py-2 text-left text-white shadow-sm transition-colors hover:bg-primary-700"
          onClick={onEnterDigitalMap}
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Map className="h-4 w-4" aria-hidden="true" />
            Digital Map
          </span>
          <span className="mt-1 block text-xs leading-4 text-primary-100">
            지도 기반 분석 메뉴 열기
          </span>
        </button>
      )}
    </div>
  );
}


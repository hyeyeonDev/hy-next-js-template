"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AuthGuard } from "@/components/auth";
import { MainLayout } from "@/components/layout";
import { ROUTES } from "@/constants/routes";
import { useUiStore } from "@/store";

export default function MainRouteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const setSidebarCollapsed = useUiStore((state) => state.setSidebarCollapsed);
  const isDigitalMapFull = pathname.startsWith(ROUTES.DIGITAL_MAP_FULL);

  useEffect(() => {
    if (isDigitalMapFull) {
      setSidebarCollapsed(true);
    }
  }, [isDigitalMapFull, setSidebarCollapsed]);

  if (pathname === ROUTES.DIGITAL_MAP) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  return (
    <AuthGuard>
      <MainLayout
        bodyClassName={isDigitalMapFull ? "overflow-hidden" : undefined}
        contentClassName={isDigitalMapFull ? "flex overflow-hidden p-0" : undefined}
        footer={isDigitalMapFull ? null : undefined}
      >
        {children}
      </MainLayout>
    </AuthGuard>
  );
}

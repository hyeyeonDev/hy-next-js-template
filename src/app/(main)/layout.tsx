"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AuthGuard } from "@/components/auth";
import { MainLayout } from "@/components/layout";
import { ROUTES } from "@/constants/routes";

export default function MainRouteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith(ROUTES.DIGITAL_MAP)) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}

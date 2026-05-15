"use client";

import Link from "next/link";
import { ChevronDown, LogIn, LogOut, UserRound } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { userRoleLabel } from "@/components/features/users/user-meta";

import { Popover } from "@/components/ui";

export function UserAccountMenu() {
  const { t } = useI18n();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-8 items-center gap-2 rounded-md border border-border bg-surface px-2.5">
        <span className="h-5 w-5 animate-pulse rounded-full bg-surface-3" />
        <span className="hidden h-3 w-16 animate-pulse rounded bg-surface-3 sm:block" />
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href={ROUTES.AUTH.LOGIN}
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm font-medium text-text transition-colors hover:bg-surface-2"
      >
        <LogIn className="h-4 w-4" aria-hidden="true" />
        {t("common.login")}
      </Link>
    );
  }

  const initial = user.name.trim().slice(0, 1).toUpperCase();

  return (
    <Popover
      align="right"
      className="w-64"
      trigger={
        <span
          className={cn(
            "inline-flex h-8 max-w-52 items-center gap-2 rounded-md border border-border bg-surface px-2.5 text-sm transition-colors hover:bg-surface-2",
            "text-text",
          )}
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
            {initial || <UserRound className="h-3.5 w-3.5" aria-hidden="true" />}
          </span>
          <span className="hidden min-w-0 flex-col items-start leading-none sm:flex">
            <span className="max-w-28 truncate font-semibold">{user.name}님</span>
            <span className="mt-0.5 text-[11px] text-text-muted">{userRoleLabel[user.role]}</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden="true" />
        </span>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="rounded-md bg-surface-2 p-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
              {initial || <UserRound className="h-4 w-4" aria-hidden="true" />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{user.name}님</p>
              <p className="truncate text-xs text-text-muted">{user.email}</p>
            </div>
          </div>
          <p className="mt-2 text-xs font-medium text-primary-600">{userRoleLabel[user.role]}</p>
        </div>

        <Link
          href={ROUTES.MY_PAGE}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-text transition-colors hover:bg-surface-2"
        >
          <UserRound className="h-4 w-4" aria-hidden="true" />
          {t("profile.title")}
        </Link>
        <Link
          href={ROUTES.AUTH.LOGOUT}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-danger-600 transition-colors hover:bg-danger-50"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {t("common.logout")}
        </Link>
      </div>
    </Popover>
  );
}

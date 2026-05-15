"use client";

import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  showDefaultBreadcrumb?: boolean;
  className?: string;
  headerClassName?: string;
}

export function PageWrapper({
  children,
  title,
  description,
  actions,
  breadcrumb,
  showDefaultBreadcrumb = true,
  className,
  headerClassName,
}: PageWrapperProps) {
  const { t } = useI18n();
  const currentTitle = typeof title === "string" && title !== t("nav.dashboard") ? title : null;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {showDefaultBreadcrumb && (
        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm">
            <li>
              <Link
                href={ROUTES.DASHBOARD}
                className="font-medium text-text-muted transition-colors hover:text-primary-600"
              >
                {t("nav.dashboard")}
              </Link>
            </li>
            {breadcrumb && (
              <li className="flex min-w-0 items-center gap-1.5">
                <span className="text-text-subtle">/</span>
                <span className="min-w-0 truncate text-text">{breadcrumb}</span>
              </li>
            )}
            {currentTitle && (
              <li className="flex min-w-0 items-center gap-1.5">
                <span className="text-text-subtle">/</span>
                <span className="min-w-0 truncate font-medium text-text">{currentTitle}</span>
              </li>
            )}
          </ol>
        </nav>
      )}
      {!showDefaultBreadcrumb && breadcrumb}
      {(title || description || actions) && (
        <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", headerClassName)}>
          <div className="min-w-0">
            {title && (typeof title === "string" ? <h1 className="text-2xl font-bold text-text">{title}</h1> : title)}
            {description && (
              <p className="mt-1 text-sm text-text-muted">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

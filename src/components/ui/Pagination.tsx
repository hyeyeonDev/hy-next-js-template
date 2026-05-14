import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Fragment } from "react";

import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onChange,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2,
  );

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="flex h-8 w-8 items-center justify-center rounded border border-border text-sm text-text-muted hover:bg-surface-2 disabled:opacity-40"
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      {visiblePages.map((p, i) => {
        const prev = visiblePages[i - 1];
        return (
          <Fragment key={p}>
            {prev && p - prev > 1 && (
              <span className="px-1 text-text-subtle">
                <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
              </span>
            )}
            <button
              onClick={() => onChange(p)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded text-sm transition-colors",
                p === page
                  ? "bg-primary-600 font-semibold text-white"
                  : "border border-border text-text-muted hover:bg-surface-2",
              )}
            >
              {p}
            </button>
          </Fragment>
        );
      })}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="flex h-8 w-8 items-center justify-center rounded border border-border text-sm text-text-muted hover:bg-surface-2 disabled:opacity-40"
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

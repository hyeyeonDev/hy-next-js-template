import { cn } from "@/lib/utils";

import type { TableColumn } from "@/types";
import { EmptyState } from "./EmptyState";
import { Pagination } from "@/components/ui/Pagination";

interface DataTablePagination {
  page: number;
  totalPages: number;
  total?: number;
  pageSize?: number;
  onChange: (page: number) => void;
}

export function DataTable<T extends object>({
  columns,
  data,
  loading,
  emptyMessage,
  onRowClick,
  pagination,
  className,
  scrollClassName,
}: {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  pagination?: DataTablePagination;
  className?: string;
  scrollClassName?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-surface", className)}>
      <div className={cn("overflow-x-auto", scrollClassName)}>
        <table className="min-w-full divide-y divide-border">
          <thead className="sticky top-0 z-10 bg-surface-2">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                    !col.align && "text-left",
                  )}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-surface-2" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyMessage ?? "데이터가 없습니다."} />
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "transition-colors",
                    onRowClick && "cursor-pointer hover:bg-surface-2",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={cn(
                        "px-4 py-3 text-sm text-text",
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                      )}
                    >
                      {col.render
                        ? col.render(row[col.key as keyof T], row)
                        : String(row[col.key as keyof T] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-muted">
            {pagination.total !== undefined && pagination.pageSize !== undefined
              ? `총 ${pagination.total.toLocaleString()}개 중 ${
                  pagination.total === 0
                    ? 0
                    : (pagination.page - 1) * pagination.pageSize + 1
                }-${Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.total,
                ).toLocaleString()}개`
              : `${pagination.page} / ${pagination.totalPages} 페이지`}
          </p>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onChange={pagination.onChange}
          />
        </div>
      )}
    </div>
  );
}

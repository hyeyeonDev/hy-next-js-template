import { cn } from "@/lib/utils";

import type { TableColumn } from "@/types";
import { Table } from "@/components/ui/Table";

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
  const agGridPagination =
    pagination?.total !== undefined && pagination.pageSize !== undefined
      ? {
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: pagination.total,
          totalPages: pagination.totalPages,
          onChange: pagination.onChange,
        }
      : undefined;

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-surface", className)}>
      <Table
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage={emptyMessage}
        onRowClick={onRowClick}
        pagination={agGridPagination}
        className={cn("rounded-none border-0", scrollClassName)}
      />
    </div>
  );
}

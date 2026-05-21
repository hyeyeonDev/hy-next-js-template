"use client";

import { useEffect, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
  type GridApi,
  type GridReadyEvent,
  type ICellRendererParams,
  type PaginationChangedEvent,
  type RowClickedEvent,
} from "ag-grid-community";

import type { TableColumn } from "@/types";
import { cn } from "@/lib/utils";

ModuleRegistry.registerModules([AllCommunityModule]);

interface TableProps<T extends object> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
  rowKey?: keyof T;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    onChange: (page: number) => void;
  };
}

export function Table<T extends object>({
  columns,
  data,
  loading = false,
  emptyMessage = "데이터가 없습니다.",
  onRowClick,
  className,
  rowKey,
  pagination,
}: TableProps<T>) {
  const gridApiRef = useRef<GridApi<T> | null>(null);
  const rowData = useMemo(
    () => (pagination ? createPaginatedRows(data, pagination) : data),
    [data, pagination],
  );
  const columnDefs = useMemo<ColDef<T>[]>(
    () =>
      columns.map((col) => ({
        colId: String(col.key),
        headerName: col.label,
        valueGetter: (params) => params.data?.[col.key as keyof T],
        width: parseColumnWidth(col.width),
        flex: col.width ? undefined : 1,
        minWidth: col.width ? undefined : 120,
        sortable: pagination ? false : col.sortable ?? true,
        cellClass: getAlignClass(col.align),
        headerClass: getAlignClass(col.align),
        cellRenderer: (params: ICellRendererParams<T>) => {
          const row = params.data;
          if (!row) return "";
          return col.render
            ? col.render(params.value, row)
            : String(params.value ?? "");
        },
      })),
    [columns, pagination],
  );

  useEffect(() => {
    const api = gridApiRef.current;
    if (!api || !pagination) return;
    const currentPage = api.paginationGetCurrentPage() + 1;
    if (currentPage !== pagination.page) {
      api.paginationGoToPage(pagination.page - 1);
    }
  }, [pagination]);

  return (
    <div
      className={cn(
        "dgis-ag-grid ag-theme-quartz overflow-hidden rounded-lg border border-border bg-surface",
        onRowClick && "dgis-ag-grid-clickable",
        className,
      )}
    >
      <AgGridReact<T>
        theme="legacy"
        columnDefs={columnDefs}
        rowData={loading ? [] : rowData}
        defaultColDef={{
          resizable: true,
          filter: false,
          suppressMovable: true,
        }}
        domLayout="autoHeight"
        headerHeight={44}
        rowHeight={56}
        pagination={Boolean(pagination)}
        paginationPageSize={pagination?.pageSize}
        paginationPageSizeSelector={false}
        loading={loading}
        overlayLoadingTemplate='<span class="ag-overlay-loading-center">데이터를 불러오는 중...</span>'
        overlayNoRowsTemplate={`<span class="ag-overlay-no-rows-center">${emptyMessage}</span>`}
        suppressCellFocus
        suppressDragLeaveHidesColumns
        getRowId={
          rowKey
            ? (params) =>
                isPlaceholderRow(params.data)
                  ? `placeholder-${params.data.__placeholderIndex}`
                  : String(params.data[rowKey])
            : undefined
        }
        onGridReady={(event: GridReadyEvent<T>) => {
          gridApiRef.current = event.api;
          if (pagination) {
            event.api.paginationGoToPage(pagination.page - 1);
          }
        }}
        onPaginationChanged={(event: PaginationChangedEvent<T>) => {
          if (!pagination || !event.newPage) return;
          pagination.onChange(event.api.paginationGetCurrentPage() + 1);
        }}
        onRowClicked={(event: RowClickedEvent<T>) => {
          if (!event.data || isPlaceholderRow(event.data)) return;
          onRowClick?.(event.data);
        }}
      />
    </div>
  );
}

function createPaginatedRows<T extends object>(
  data: T[],
  pagination: NonNullable<TableProps<T>["pagination"]>,
) {
  const start = (pagination.page - 1) * pagination.pageSize;
  return Array.from({ length: pagination.total }, (_, index) => {
    const dataIndex = index - start;
    return dataIndex >= 0 && dataIndex < data.length
      ? data[dataIndex]
      : ({ __placeholder: true, __placeholderIndex: index } as T);
  });
}

function isPlaceholderRow(row: object): row is { __placeholder: true; __placeholderIndex: number } {
  return "__placeholder" in row;
}

function parseColumnWidth(width?: string) {
  if (!width) return undefined;
  const parsed = Number.parseInt(width, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getAlignClass(align?: "left" | "center" | "right") {
  if (align === "center") return "dgis-ag-cell-center";
  if (align === "right") return "dgis-ag-cell-right";
  return undefined;
}

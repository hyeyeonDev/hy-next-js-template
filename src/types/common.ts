export type Size = "xs" | "sm" | "md" | "lg" | "xl";
export type Variant = "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "ghost" | "outline";
export type ColorScheme = "light" | "dark";

export interface SelectOption { label: string; value: string | number; disabled?: boolean }
export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}
export interface Pagination { page: number; pageSize: number; total: number; totalPages: number }

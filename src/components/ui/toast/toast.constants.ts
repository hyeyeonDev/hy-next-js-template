import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Variant } from "@/types";

export const icons: Partial<Record<Variant, LucideIcon>> = {
  primary: Info,
  success: CircleCheck,
  danger: CircleX,
  warning: TriangleAlert,
  info: Info,
};

export const variantStyles: Partial<Record<Variant, string>> = {
  primary: "border-primary-200 bg-primary-50 text-primary-900",

  success: "border-success-100 bg-success-50 text-success-700",

  danger: "border-danger-100 bg-danger-50 text-danger-700",

  warning: "border-warning-100 bg-warning-50 text-warning-700",

  secondary: "border-border bg-surface text-text",
};

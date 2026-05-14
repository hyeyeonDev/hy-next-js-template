import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { DialogVariant } from "./dialog.types";

export const variantIcon: Record<
  DialogVariant,
  { Icon: LucideIcon; bg: string; text: string }
> = {
  default: { Icon: Info, bg: "bg-info-100", text: "text-info-600" },
  danger: { Icon: CircleX, bg: "bg-danger-100", text: "text-danger-600" },
  warning: { Icon: TriangleAlert, bg: "bg-warning-100", text: "text-warning-600" },
  success: { Icon: CircleCheck, bg: "bg-success-100", text: "text-success-600" },
};

export const confirmButtonVariant: Record<
  DialogVariant,
  "primary" | "danger" | "warning" | "success"
> = {
  default: "primary",
  danger: "danger",
  warning: "warning",
  success: "success",
} as const;

import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Variant } from "@/types";

interface AlertProps {
  variant?: Extract<Variant, "primary"|"success"|"warning"|"danger"|"info">;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const styles: Record<string, string> = {
  primary: "border-primary-200 bg-primary-50 text-primary-900 dark:border-primary-700 dark:bg-primary-50/10 dark:text-primary-300",
  success: "border-success-100 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-50/10 dark:text-success-400",
  warning: "border-warning-100 bg-warning-50 text-warning-700 dark:border-warning-700 dark:bg-warning-50/10 dark:text-warning-400",
  danger:  "border-danger-100 bg-danger-50 text-danger-700 dark:border-danger-700 dark:bg-danger-50/10 dark:text-danger-400",
  info:    "border-info-100 bg-info-50 text-info-600 dark:border-info-700 dark:bg-info-50/10 dark:text-info-400",
};
const icons: Record<string, LucideIcon> = {
  primary: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleX,
  info: Info,
};

export function Alert({ variant = "primary", title, children, onClose, className }: AlertProps) {
  const Icon = icons[variant];

  return (
    <div className={cn("flex gap-3 rounded-lg border p-4", styles[variant], className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="flex-1 text-sm">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-50 hover:opacity-80" aria-label="닫기">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

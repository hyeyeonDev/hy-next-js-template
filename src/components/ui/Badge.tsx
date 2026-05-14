import { cn } from "@/lib/utils";
import type { Variant, Size } from "@/types";

interface BadgeProps {
  variant?: Variant;
  size?: Size;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  primary:   "bg-primary-100 text-primary-700",
  secondary: "bg-surface-2 text-text-muted",
  danger:    "bg-danger-100 text-danger-700",
  warning:   "bg-warning-100 text-warning-700",
  success:   "bg-success-100 text-success-700",
  info:      "bg-info-100 text-info-600",
  outline:   "border border-border text-text-muted bg-transparent",
  ghost:     "text-text-muted bg-transparent",
};

const dotStyles: Record<Variant, string> = {
  primary:   "bg-primary-500",
  secondary: "bg-gray-400",
  danger:    "bg-danger-500",
  warning:   "bg-warning-500",
  success:   "bg-success-500",
  info:      "bg-info-500",
  outline:   "bg-gray-400",
  ghost:     "bg-gray-400",
};

const sizeStyles: Record<Size, string> = {
  xs: "px-1.5 py-0.5 text-[10px]",
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1 text-sm",
  xl: "px-3.5 py-1.5 text-sm",
};

export function Badge({
  variant = "secondary",
  size = "sm",
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", dotStyles[variant])}
        />
      )}
      {children}
    </span>
  );
}

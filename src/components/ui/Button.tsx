import { forwardRef, ButtonHTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Size, Variant } from "@/types";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-primary-500",
  secondary:
    "bg-surface-2 text-text hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-border-strong",
  danger:
    "bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-700 focus-visible:ring-danger-500",
  warning:
    "bg-warning-600 text-white hover:bg-warning-700 active:bg-warning-700 focus-visible:ring-warning-500",
  success:
    "bg-success-600 text-white hover:bg-success-700 active:bg-success-700 focus-visible:ring-success-500",
  info:
    "bg-info-600 text-white hover:bg-info-500 active:bg-info-600 focus-visible:ring-info-500",
  outline:
    "border border-border bg-surface text-text hover:bg-surface-2 active:bg-gray-100 focus-visible:ring-border-strong",
  ghost:
    "bg-transparent text-text hover:bg-surface-2 active:bg-gray-200 focus-visible:ring-border-strong",
};

const sizeStyles: Record<Size, string> = {
  xs: "h-7 px-2.5 text-xs gap-1",
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-10 px-5 text-base gap-2",
  xl: "h-12 px-6 text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

import { forwardRef, InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Variant = "default" | "filled" | "unstyled";
type InputSize = "xs" | "sm" | "md" | "lg" | "xl";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
  inputSize?: InputSize;
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const baseStyles =
  "w-full rounded-md text-text placeholder:text-text-subtle transition-colors outline-none";

const variantStyles: Record<Variant, string> = {
  default: "border border-border bg-surface focus:border-primary-500",

  filled: "border border-transparent bg-surface-2 focus:border-primary-500",

  unstyled: "border-none bg-transparent",
};

export const inputSizeStyles: Record<InputSize, string> = {
  xs: "h-7 px-2 text-xs",
  sm: "h-8 px-3 text-sm",
  md: "h-9 px-3 text-sm",
  lg: "h-10 px-4 text-base",
  xl: "h-12 px-4 text-base",
};

const stateStyles = {
  error: "border-danger-500 focus:border-danger-500 focus:ring-danger-500",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      inputSize = "md",
      error = false,
      leftIcon,
      rightIcon,
      className,
      ...props
    },
    ref,
  ) => {
    if (leftIcon || rightIcon) {
      return (
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 z-10 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-text-subtle [&_svg]:h-4 [&_svg]:w-4">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              baseStyles,
              variantStyles[variant],
              inputSizeStyles[inputSize],
              leftIcon && "pl-9",
              rightIcon && "pr-10",
              error && stateStyles.error,
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 z-10 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-text-subtle [&_svg]:h-4 [&_svg]:w-4">
              {rightIcon}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          inputSizeStyles[inputSize],
          error && stateStyles.error,
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

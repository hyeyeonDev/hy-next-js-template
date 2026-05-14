import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, ...props }, ref) => {
    return (
      <label className="inline-flex cursor-pointer items-start gap-2">
        <span className="flex h-5 shrink-0 items-center">
          <input
            ref={ref}
            type="checkbox"
            className={cn(
              "h-4 w-4 shrink-0 rounded border-border text-primary-600",
              "focus:ring-primary-500",
              className,
            )}
            {...props}
          />
        </span>
        {(label || description) && (
          <span className="min-w-0">
            {label && (
              <span className="block text-sm font-medium leading-5 text-text">
                {label}
              </span>
            )}
            {description && (
              <span className="block text-xs leading-4 text-text-subtle">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

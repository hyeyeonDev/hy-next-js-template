import { forwardRef, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Size, SelectOption } from "@/types";
import { inputSizeStyles } from "./Input";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  selectSize?: Size;
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { options, placeholder, selectSize = "md", error, className, ...props },
    ref,
  ) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-md border bg-surface pr-8 text-text transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-text-subtle",
            error ? "border-danger-500 focus:ring-danger-500" : "border-border",
            inputSizeStyles[selectSize],
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle">
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
    );
  },
);

Select.displayName = "Select";

"use client";

import { ChangeEvent, forwardRef, InputHTMLAttributes, useRef } from "react";

import { cn } from "@/lib/utils";

interface OTPFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  length?: number;

  value?: string[];

  onChange?: (value: string[]) => void;
}

export const OTPField = forwardRef<HTMLDivElement, OTPFieldProps>(
  ({ length = 6, value = [], onChange, className, disabled }, ref) => {
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (
      index: number,
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const inputValue = event.target.value.slice(-1);

      const next = [...value];

      next[index] = inputValue;

      onChange?.(next);

      if (inputValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (
      index: number,
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === "Backspace" && !value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    return (
      <div ref={ref} className={cn("flex gap-2", className)}>
        {Array.from({
          length,
        }).map((_, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={disabled}
            value={value[index] ?? ""}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-center text-sm font-medium text-text",
              "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500",
              "disabled:bg-surface-2 disabled:text-text-subtle",
            )}
          />
        ))}
      </div>
    );
  },
);

OTPField.displayName = "OTPField";

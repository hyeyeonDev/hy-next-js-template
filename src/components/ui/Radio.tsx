"use client";

import { InputHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className, ...props }, ref) => {
    return (
      <label className="inline-flex cursor-pointer items-start gap-2">
        <span className="flex h-5 shrink-0 items-center">
          <input
            ref={ref}
            type="radio"
            className={cn(
              "h-4 w-4 shrink-0 border-border text-primary-600 focus:ring-primary-500",
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

Radio.displayName = "Radio";

export interface RadioGroupOption {
  label: React.ReactNode;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioGroupOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  direction?: "horizontal" | "vertical";
  className?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  defaultValue,
  onChange,
  direction = "vertical",
  className,
}: RadioGroupProps) {
  return (
    <div
      className={cn(
        direction === "horizontal" ? "flex flex-wrap gap-4" : "flex flex-col gap-2",
        className,
      )}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          description={option.description}
          disabled={option.disabled}
          checked={value === undefined ? undefined : value === option.value}
          defaultChecked={defaultValue === option.value}
          onChange={(event) => {
            if (event.target.checked) {
              onChange?.(option.value);
            }
          }}
        />
      ))}
    </div>
  );
}

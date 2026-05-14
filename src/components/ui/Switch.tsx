"use client";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function Switch({ checked, onChange, label, description, disabled, size = "md" }: SwitchProps) {
  const sizes = {
    sm: { track: "h-4 w-7", thumb: "h-3 w-3", translate: "translate-x-3" },
    md: { track: "h-5 w-9", thumb: "h-4 w-4", translate: "translate-x-4" },
  };
  const s = sizes[size];

  return (
    <label
      className={cn(
        "inline-flex items-start gap-3",
        disabled && "cursor-not-allowed opacity-50",
        !disabled && "cursor-pointer",
      )}
    >
      <span className="flex h-5 shrink-0 items-center">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={cn(
            "relative inline-flex shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
            s.track,
            checked ? "bg-primary-500" : "bg-border-strong",
          )}
        >
          <span
            className={cn(
              "inline-block rounded-full bg-surface shadow transition-transform",
              s.thumb,
              checked ? s.translate : "translate-x-0.5",
            )}
          />
        </button>
      </span>
      {(label || description) && (
        <span className="min-w-0">
          {label && (
            <span className="block text-sm font-medium leading-5 text-text">
              {label}
            </span>
          )}
          {description && (
            <span className="block text-xs leading-4 text-text-muted">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
}

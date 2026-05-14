"use client";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

export function Chip({ children, onRemove, className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full bg-surface-2 px-2.5 text-xs font-medium text-text",
        className,
      )}
    >
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} className="text-text-subtle hover:text-text" aria-label="삭제">
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      )}
    </span>
  );
}

export const Tag = Chip;

"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

export function Rating({ value, max = 5, onChange, readOnly }: RatingProps) {
  return (
    <div className="inline-flex gap-1">
      {Array.from({ length: max }, (_, index) => {
        const score = index + 1;
        const active = score <= value;
        return (
          <button
            key={score}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(score)}
            className="disabled:cursor-default"
            aria-label={`${score}점`}
          >
            <Star
              className={cn(
                "h-5 w-5",
                active ? "fill-warning-500 text-warning-500" : "text-text-subtle",
              )}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

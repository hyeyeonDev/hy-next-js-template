import { cn } from "@/lib/utils";
import type { Size } from "@/types";

interface SpinnerProps { size?: Size; className?: string }

const sizes: Record<Size, string> = {
  xs: "h-3 w-3 border",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
  xl: "h-12 w-12 border-4",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="로딩 중"
      className={cn(
        "animate-spin rounded-full border-primary-200 border-t-primary-500",
        sizes[size],
        className
      )}
    />
  );
}

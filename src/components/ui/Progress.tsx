import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export function Progress({ value, max = 100, label, className }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      {(label || value !== undefined) && (
        <div className="mb-1 flex justify-between text-xs text-text-muted">
          <span>{label}</span>
          <span>{Math.round(percent)}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div className={cn("h-full rounded-full bg-primary-600")} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

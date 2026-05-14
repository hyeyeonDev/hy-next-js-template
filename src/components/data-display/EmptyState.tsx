import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "데이터가 없습니다",
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className,
      )}
    >
      {icon ?? (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-text-subtle text-2xl">
          ○
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-text">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

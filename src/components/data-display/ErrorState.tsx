import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "오류가 발생했습니다",
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-50 text-danger-500 text-xl">
        !
      </div>
      <div>
        <p className="text-sm font-medium text-text">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-text-muted">{description}</p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-primary-600 hover:underline dark:text-primary-400"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}

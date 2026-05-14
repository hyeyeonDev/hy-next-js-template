import { cn } from "@/lib/utils";

import { Spinner } from "@/components/ui/Spinner";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "불러오는 중...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center">
        <Spinner size="lg" />
      </div>
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}

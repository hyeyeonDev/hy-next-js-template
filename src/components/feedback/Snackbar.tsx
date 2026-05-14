import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface SnackbarProps {
  open: boolean;
  message: string;
  action?: { label: string; onClick: () => void };
  onClose?: () => void;
}

export function Snackbar({ open, message, action, onClose }: SnackbarProps) {
  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-100 -translate-x-1/2">
      <div
        className={cn(
          "flex items-center gap-4 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-xl",
          "dark:bg-gray-100 dark:text-gray-900",
        )}
      >
        <span>{message}</span>
        {action && (
          <button
            onClick={action.onClick}
            className="font-semibold text-primary-400 hover:text-primary-300 dark:text-primary-600"
          >
            {action.label}
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="opacity-60 hover:opacity-100"
            aria-label="닫기"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

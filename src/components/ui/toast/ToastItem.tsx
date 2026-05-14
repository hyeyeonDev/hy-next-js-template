"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import { icons, variantStyles } from "./toast.constants";

import { Toast, ToastAction } from "./toast.types";

interface ToastItemProps {
  toast: Toast;

  dispatch: React.Dispatch<ToastAction>;
}

export function ToastItem({ toast, dispatch }: ToastItemProps) {
  const Icon = icons[toast.variant];

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({
        type: "REMOVE",
        id: toast.id,
      });
    }, toast.duration ?? 3500);

    return () => {
      clearTimeout(timer);
    };
  }, [toast, dispatch]);

  return (
    <div
      className={cn(
        "flex min-w-70 max-w-sm items-start gap-3 rounded-lg border p-3 shadow-lg",
        "animate-in slide-in-from-right-5 fade-in duration-300",
        variantStyles[toast.variant] ?? variantStyles.secondary,
      )}
    >
      {Icon && (
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-current/10">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      )}

      <p className="flex-1 text-sm">{toast.message}</p>

      <button
        onClick={() =>
          dispatch({
            type: "REMOVE",
            id: toast.id,
          })
        }
        className="shrink-0 text-current/40 hover:text-current/70"
        aria-label="닫기"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

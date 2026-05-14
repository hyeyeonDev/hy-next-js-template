"use client";

import { ToastItem } from "./ToastItem";

import { Toast, ToastAction } from "./toast.types";

interface ToastContainerProps {
  toasts: Toast[];

  dispatch: React.Dispatch<ToastAction>;
}

export function ToastContainer({ toasts, dispatch }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} dispatch={dispatch} />
      ))}
    </div>
  );
}

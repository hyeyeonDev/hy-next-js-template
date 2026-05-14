"use client";
/**
 * feedback/ConfirmDialog.tsx — 간단한 확인 다이얼로그 (useDialog와 다르게 props 기반)
 * feedback/Snackbar.tsx — 하단 중앙 스낵바
 */
import { Button } from "@/components/ui/Button";

/* ─── ConfirmDialog ─── */
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-surface shadow-xl border border-border">
        <div className="p-5">
          <h3 className="text-sm font-semibold text-text">{title}</h3>
          {message && (
            <p className="mt-1.5 text-sm text-text-muted">{message}</p>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={variant} size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

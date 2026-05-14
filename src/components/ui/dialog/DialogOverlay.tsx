"use client";

import { RefObject } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

import { confirmButtonVariant, variantIcon } from "./dialog.constants";

import { DialogState } from "./dialog.types";

interface DialogOverlayProps {
  state: DialogState;
  inputRef: RefObject<HTMLInputElement | null>;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DialogOverlay({
  state,
  inputRef,
  onConfirm,
  onCancel,
}: DialogOverlayProps) {
  if (!state.open) {
    return null;
  }

  const { Icon, bg, text } = variantIcon[state.variant];

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={state.type === "alert" ? onConfirm : onCancel}
      />

      {/* panel */}
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-surface text-text shadow-2xl">
        <div className="p-6">
          {/* header */}
          <div className="flex gap-4">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                bg,
                text,
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="flex-1 pt-1">
              <h3 className="text-sm font-semibold text-text">
                {state.title}
              </h3>

              {state.message && (
                <p className="mt-1 text-sm text-text-muted">{state.message}</p>
              )}
            </div>
          </div>

          {/* prompt input */}
          {state.type === "prompt" && (
            <div className="mt-4">
              <Input
                ref={inputRef}
                autoFocus
                defaultValue={state.defaultValue}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onConfirm();
                  }

                  if (e.key === "Escape") {
                    onCancel();
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* footer */}
        <div
          className={cn(
            "flex gap-2 rounded-b-xl border-t border-border bg-surface-2 px-6 py-4",
            state.type === "alert" ? "justify-center" : "justify-end",
          )}
        >
          {state.type !== "alert" && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              {state.cancelLabel}
            </Button>
          )}

          <Button
            variant={confirmButtonVariant[state.variant]}
            size="sm"
            onClick={onConfirm}
          >
            {state.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

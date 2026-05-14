"use client";

import { createContext, useCallback, useReducer, useRef } from "react";

import { DialogOverlay } from "./DialogOverlay";

import {
  AlertOptions,
  ConfirmOptions,
  DialogAction,
  DialogContextValue,
  DialogState,
  PromptOptions,
} from "./dialog.types";

const initialState: DialogState = {
  open: false,
  type: "alert",
  variant: "default",
  title: "",
  message: "",
  confirmLabel: "확인",
  cancelLabel: "취소",
  defaultValue: "",
};

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case "OPEN":
      return {
        ...action.payload,
        open: true,
      };

    case "CLOSE":
      return {
        ...state,
        open: false,
      };

    default:
      return state;
  }
}

export const DialogContext = createContext<DialogContextValue | null>(null);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dialogReducer, initialState);

  const resolverRef = useRef<((value: string | boolean | null) => void) | null>(
    null,
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  const openDialog = useCallback(
    (payload: Omit<DialogState, "open">) =>
      new Promise<string | boolean | null>((resolve) => {
        resolverRef.current = resolve;

        dispatch({ type: "OPEN", payload });
      }),
    [],
  );

  const handleConfirm = useCallback(() => {
    if (state.type === "prompt") {
      resolverRef.current?.(inputRef.current?.value ?? "");
    } else if (state.type === "confirm") {
      resolverRef.current?.(true);
    } else {
      resolverRef.current?.(null);
    }

    dispatch({
      type: "CLOSE",
    });
  }, [state.type]);

  const handleCancel = useCallback(() => {
    if (state.type === "confirm") {
      resolverRef.current?.(false);
    } else if (state.type === "prompt") {
      resolverRef.current?.(null);
    } else {
      resolverRef.current?.(null);
    }

    dispatch({ type: "CLOSE" });
  }, [state.type]);

  const alert = useCallback(
    (title: string, options: AlertOptions = {}) =>
      openDialog({
        type: "alert",
        title,
        variant: options.variant ?? "default",
        message: options.message,
        confirmLabel: options.confirmLabel ?? "확인",
        cancelLabel: "취소",
      }).then(() => undefined),
    [openDialog],
  );

  const confirm = useCallback(
    (title: string, options: ConfirmOptions = {}) =>
      openDialog({
        type: "confirm",
        title,
        variant: options.variant ?? "default",
        message: options.message,
        confirmLabel: options.confirmLabel ?? "확인",
        cancelLabel: options.cancelLabel ?? "취소",
      }).then((v) => v as boolean),
    [openDialog],
  );

  const prompt = useCallback(
    (title: string, options: PromptOptions = {}) =>
      openDialog({
        type: "prompt",
        title,
        variant: options.variant ?? "default",
        message: options.message,
        confirmLabel: options.confirmLabel ?? "확인",
        cancelLabel: options.cancelLabel ?? "취소",
        defaultValue: options.defaultValue,
      }).then((v) => v as string | null),
    [openDialog],
  );

  return (
    <DialogContext.Provider
      value={{
        alert,
        confirm,
        prompt,
      }}
    >
      {children}

      <DialogOverlay
        state={state}
        inputRef={inputRef}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </DialogContext.Provider>
  );
}

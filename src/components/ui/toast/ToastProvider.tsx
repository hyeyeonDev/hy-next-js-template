"use client";

import { createContext, useCallback, useReducer } from "react";

import { ToastContainer } from "./ToastContainer";

import { toastReducer } from "./toast.reducer";

import { ToastContextValue } from "./toast.types";
import { Variant } from "@/types";

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const toast = useCallback(
    (message: string, variant: Variant = "primary", duration = 3500) => {
      const id = Math.random().toString(36).slice(2);
      dispatch({ type: "ADD", toast: { id, message, variant, duration } });
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <ToastContainer toasts={toasts} dispatch={dispatch} />
    </ToastContext.Provider>
  );
}

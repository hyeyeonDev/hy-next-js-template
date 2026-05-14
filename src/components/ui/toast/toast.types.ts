import type { Variant } from "@/types";

export interface Toast {
  id: string;
  message: string;
  variant: Variant;
  duration?: number;
}

export type ToastAction =
  | {
      type: "ADD";
      toast: Toast;
    }
  | {
      type: "REMOVE";
      id: string;
    };

export interface ToastContextValue {
  toast: (message: string, variant?: Variant, duration?: number) => void;
}

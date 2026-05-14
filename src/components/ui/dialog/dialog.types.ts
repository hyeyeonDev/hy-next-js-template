export type DialogType = "alert" | "confirm" | "prompt";

export type DialogVariant = "default" | "danger" | "warning" | "success";

export interface DialogState {
  open: boolean;
  type: DialogType;
  variant: DialogVariant;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel: string;
  defaultValue?: string;
}

export type DialogAction =
  | { type: "OPEN"; payload: Omit<DialogState, "open"> }
  | { type: "CLOSE" };

export interface AlertOptions {
  message?: string;
  variant?: DialogVariant;
  confirmLabel?: string;
}

export interface ConfirmOptions extends AlertOptions {
  cancelLabel?: string;
}

export interface PromptOptions extends ConfirmOptions {
  defaultValue?: string;
}

export interface DialogContextValue {
  alert: (title: string, options?: AlertOptions) => Promise<void>;

  confirm: (title: string, options?: ConfirmOptions) => Promise<boolean>;

  prompt: (title: string, options?: PromptOptions) => Promise<string | null>;
}

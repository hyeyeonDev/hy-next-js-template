import { Toast, ToastAction } from "./toast.types";

export function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case "ADD":
      return [...state, action.toast];

    case "REMOVE":
      return state.filter((toast) => toast.id !== action.id);

    default:
      return state;
  }
}

import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type State = {
  toasts: ToasterToast[];
};

export const toastState: State = {
  toasts: [],
};

export function toast({ ...props }: Omit<ToasterToast, "id">) {
  const id = genId();
  const toast: ToasterToast = {
    ...props,
    id,
  };

  toastState.toasts = [...toastState.toasts, toast];
  return toast;
}

export function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => {
      toastState.toasts = toastState.toasts.filter(
        (toast) => toast.id !== toastId
      );
    },
  };
}
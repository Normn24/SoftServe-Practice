import { createContext, useContext } from "react";
import { ToastType } from "../../hooks/useToast";

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToastContext = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToastContext must be used inside <ToastProvider>");
  }
  return ctx;
};

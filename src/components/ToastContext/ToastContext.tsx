import React from "react";
import { useToast, ToastType } from "../../hooks/useToast";
import { ToastContext } from "./context";
import { FaCheck, FaExclamationCircle, FaInfo, FaTimes } from "react-icons/fa";

const TOAST_STYLES: Record<ToastType, string> = {
  success: "bg-green-600 border-green-500",
  error:   "bg-red-700   border-red-500",
  info:    "bg-gray-700  border-gray-500",
};

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  success: <FaCheck />,
  error:   <FaExclamationCircle />,
  info:    <FaInfo />,
};

interface ToastItemProps {
  id: number;
  message: string;
  type: ToastType;
  onRemove: (id: number) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ id, message, type, onRemove }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-white text-sm shadow-lg min-w-[260px] max-w-[360px] animate-fade-in ${TOAST_STYLES[type]}`}
    role="alert"
  >
    <span className="text-base font-bold mt-0.5 shrink-0">
      {TOAST_ICONS[type]}
    </span>
    <p className="flex-1 leading-snug">{message}</p>
    <button
      onClick={() => onRemove(id)}
      className="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-base leading-none"
      aria-label="Close notification"
    >
      <FaTimes />
    </button>
  </div>
);

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts, showToast, removeToast } = useToast();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        className="fixed top-6 right-6 z-[9999] flex flex-col gap-2 items-end"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
type ToastVariant = "success" | "error" | "info" | "warning";

const DURATION_MS = 3500;

const createToast = (message: string, variant: ToastVariant): void => {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast toast-top toast-end z-[9999]";
    document.body.appendChild(container);
  }

  const variantClass: Record<ToastVariant, string> = {
    success: "alert-success",
    error: "alert-error",
    info: "alert-info",
    warning: "alert-warning",
  };

  const el = document.createElement("div");
  el.className = `alert ${variantClass[variant]} text-white shadow-lg transition-opacity duration-300`;
  el.textContent = message;

  container.appendChild(el);

  const remove = () => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  };

  const timeout = setTimeout(remove, DURATION_MS);

  el.addEventListener("click", () => {
    clearTimeout(timeout);
    remove();
  });
};

export const toast = {
  success: (msg: string) => createToast(msg, "success"),
  error: (msg: string) => createToast(msg, "error"),
  info: (msg: string) => createToast(msg, "info"),
  warning: (msg: string) => createToast(msg, "warning"),
};
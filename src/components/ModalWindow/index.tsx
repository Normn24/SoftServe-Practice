import React, { useEffect } from "react";

interface ModalWindowProps {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

function ModalWindow({ open, children, onClose }: ModalWindowProps) {
  useEffect(() => {
    if (open) {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-10"
      onClick={onClose}
      role="presentation"
    >
      <div onClick={handleContentClick} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}

export default ModalWindow;

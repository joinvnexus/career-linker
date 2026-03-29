"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps): React.ReactPortal | null => {
  const [mounted, setMounted] = React.useState(false);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div aria-modal="true" role="dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            aria-label="Close modal overlay"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-md"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? {} : { opacity: 1 }}
            exit={reduceMotion ? {} : { opacity: 0 }}
            onClick={onClose}
            type="button"
          />
          <motion.div
            className={cn(
              "surface-elevated relative z-10 w-full max-w-xl rounded-[2rem] border border-white/75 p-6",
              className
            )}
            initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? {} : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="space-y-1">
                {title ? <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2> : null}
                {description ? <p className="text-sm leading-7 text-slate-600">{description}</p> : null}
              </div>
              <button
                aria-label="Close modal"
                className="rounded-full border border-slate-200 bg-white/80 p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                onClick={onClose}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div>{children}</div>
            {footer ? <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
};

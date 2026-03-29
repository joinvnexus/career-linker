"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type DropdownProps = {
  label: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
  menuClassName?: string;
};

type DropdownItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  inset?: boolean;
};

export const Dropdown = ({
  label,
  children,
  align = "right",
  className,
  menuClassName,
}: DropdownProps) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className={cn("relative inline-flex", className)} ref={containerRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-[1.1rem] border border-slate-200 bg-white/88 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_26px_-20px_rgba(15,23,42,0.32)] transition-colors hover:bg-white"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>
      {open ? (
        <div
          className={cn(
            "absolute top-full z-40 mt-2 min-w-52 rounded-[1.35rem] border border-white/75 bg-white/96 p-2 shadow-[var(--shadow-panel)] backdrop-blur-xl",
            align === "right" ? "right-0" : "left-0",
            menuClassName
          )}
          role="menu"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

export const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, inset = false, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex w-full items-center rounded-[1rem] px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900",
        inset ? "pl-8" : "",
        className
      )}
      type="button"
      {...props}
    />
  )
);

DropdownItem.displayName = "DropdownItem";

export const DropdownSeparator = ({
  className,
}: {
  className?: string;
}) => <div className={cn("my-2 h-px bg-slate-200", className)} />;

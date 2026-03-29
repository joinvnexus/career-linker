"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs components must be used within <Tabs />.");
  }

  return context;
};

type TabsProps = {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
};

export const Tabs = ({ defaultValue, className, children }: TabsProps) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn("space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className, children }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "inline-flex rounded-[1.4rem] border border-white/75 bg-white/82 p-1.5 shadow-[var(--shadow-soft)] backdrop-blur",
      className
    )}
    role="tablist"
  >
    {children}
  </div>
);

type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export const TabsTrigger = ({ className, value, children, ...props }: TabsTriggerProps) => {
  const context = useTabsContext();
  const active = context.value === value;
  const reduceMotion = useReducedMotion();

  return (
    <button
      aria-selected={active}
      className={cn(
        "relative overflow-hidden rounded-[1rem] px-4 py-2.5 text-sm font-medium transition-colors",
        active ? "text-slate-950" : "text-slate-600 hover:text-slate-900",
        className
      )}
      onClick={() => context.setValue(value)}
      role="tab"
      type="button"
      {...props}
    >
      {active ? (
        <motion.span
          className="absolute inset-0 -z-10 rounded-[1rem] bg-white shadow-[0_12px_30px_-20px_rgba(15,23,42,0.35)]"
          layoutId={reduceMotion ? undefined : "tab-highlight"}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        />
      ) : null}
      {children}
    </button>
  );
};

type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export const TabsContent = ({ className, value, children, ...props }: TabsContentProps) => {
  const context = useTabsContext();

  if (context.value !== value) {
    return null;
  }

  return (
    <div className={cn("rounded-[1.8rem]", className)} role="tabpanel" {...props}>
      {children}
    </div>
  );
};

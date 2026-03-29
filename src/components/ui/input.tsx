import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-[1.15rem] border border-white/80 bg-white/88 px-4 py-2 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] ring-offset-background transition-all duration-200 placeholder:text-muted-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };

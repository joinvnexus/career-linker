import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full rounded-[1.15rem] border border-white/80 bg-white/88 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] ring-offset-background transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 resize-vertical",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };


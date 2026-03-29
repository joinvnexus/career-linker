import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-sky-200 bg-sky-50 text-sky-800",
        secondary: "border-slate-200 bg-slate-100 text-slate-700",
        destructive: "border-rose-200 bg-rose-50 text-rose-700",
        outline: "border-white/20 bg-white/10 text-white",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
        warning: "border-amber-200 bg-amber-50 text-amber-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant, ...props }, ref) => (
  <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
));

Badge.displayName = "Badge";

export { Badge, badgeVariants };

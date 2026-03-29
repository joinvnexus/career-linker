import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[1.15rem] text-sm font-semibold ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/70 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-[linear-gradient(135deg,#0284c7_0%,#0f766e_100%)] text-white shadow-[0_16px_40px_-22px_rgba(2,132,199,0.55)] hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-20px_rgba(15,118,110,0.45)]",
        danger:
          "bg-[linear-gradient(135deg,#e11d48_0%,#be123c_100%)] text-white shadow-[0_16px_40px_-22px_rgba(225,29,72,0.45)] hover:-translate-y-0.5",
        default:
          "bg-[linear-gradient(135deg,#0284c7_0%,#0f766e_100%)] text-white shadow-[0_16px_40px_-22px_rgba(2,132,199,0.55)] hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-20px_rgba(15,118,110,0.45)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_14px_34px_-18px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 hover:bg-destructive/90",
        outline:
          "border border-slate-200/90 bg-white/88 text-slate-900 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.28)] backdrop-blur hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white",
        secondary:
          "bg-slate-950 text-white shadow-[0_16px_40px_-22px_rgba(15,23,42,0.45)] hover:-translate-y-0.5 hover:bg-slate-800",
        ghost:
          "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
        link: "text-primary underline-offset-4 hover:underline",
        soft:
          "border border-sky-200/80 bg-sky-50 text-sky-800 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-100",
        inverse:
          "bg-white text-slate-950 shadow-[0_16px_40px_-22px_rgba(255,255,255,0.35)] hover:-translate-y-0.5 hover:bg-slate-100",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3.5 text-[13px]",
        lg: "h-14 px-6 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
